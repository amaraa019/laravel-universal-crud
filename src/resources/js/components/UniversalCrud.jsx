"use client";

import React, {useState, useEffect, useRef, useCallback} from "react";
import API from "@/utils/api";
import Dropzone from "react-dropzone";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { moneyFormat } from "@/utils/helper.js";
import { Lightbox } from "yet-another-react-lightbox";
import TextEditor from "./TextEditor";
import "yet-another-react-lightbox/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

// shadcn/ui компонентууд
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Filter, Mail, Pencil, Trash2, Circle, Calendar, Save, AlertTriangle, Image, ArrowUpDown, FileSpreadsheet } from "lucide-react";
import { t, setLang, getLang } from '@/lang';
import {toast} from "sonner";
// FilterField компонентийг тусдаа state-тэй болгосон
const FilterField = ({ item, onFilterChange }) => {
    const [localValue, setLocalValue] = useState(item.value || ""); // Бие даасан local state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalValue(value);
        onFilterChange({ [name]: value }); // Parent-д утгыг дамжуулах
    };

    const handleSelectChange = (value) => {
        setLocalValue(value);
        onFilterChange({ [item.field]: value }); // Parent-д утгыг дамжуулах
    };
    return(<div className={"w-[220px]"}>
        {item.type==="text" &&
            <Input
                type="text"
                name={item.field}
                placeholder={item.label}
                value={localValue}
                onChange={handleChange}
                className="w-[220px]"
            />
        }
        {item.type==="number" &&
            <Input
                type="number"
                name={item.field}
                placeholder={item.label}
                value={localValue}
                onChange={handleChange}
                className="w-[220px]"
            />
        }
        {item.type === "boolean" &&
            <Select
                name={item.field}
                value={localValue}
                onValueChange={handleSelectChange}
                className="w-[220px]"
            >
                <SelectTrigger>
                    <SelectValue placeholder={item?.label || t("select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">{t("active")}</SelectItem>
                    <SelectItem value="0">{t("inactive")}</SelectItem>
                </SelectContent>
            </Select>
        }
        {item.type==="enum" &&
            <Select
                name={item.field}
                value={localValue}
                onValueChange={handleSelectChange}
            >
                <SelectTrigger>
                    <SelectValue placeholder={item?.label || t("select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                    {item.values.map((i, k) => (
                        <SelectItem key={k} value={i.value}>
                            {i.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        }
    </div>)
    return null;
};
const UniversalCrud = ({
                           api_link,
                           auth,
                           dt,
                           methods = {"update":"put", "delete":"delete", "create":"post"},
                           attributes,
                           form_attr,
                           subject,
                           modes,
                           filters,
                           lmt,
                           dev,
                           formSize = "w-[1080px]",
                           fontSize = "text-sm",
                           actions: Actions,
                           lang = 'mn',
                           buttons: Buttons,
                           previewClass,
                           showLangSwitcher = false,
                       }) => {
    const initialized = useRef(false);
    setLang(lang);

    const limits = [10, 25, 50, 100, 250];
    const [data, setData] = useState(dt.data || []);
    const [meta, setMeta] = useState({
        ...dt,
        data:undefined
    });
    const [limit, setLimit] = useState(lmt || 10);
    const [filterValues, setFilterValues] = useState({});
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("");
    const [init, setInit] = useState(false);
    const [selected, setSelected] = useState({});
    const [open, setOpen] = useState(false);
    const [imgPreviewSize, setImgPreviewSize] = useState(false);
    const [imgUrl, setImgUrl] = useState("");
    const [onlyImg, setOnlyImg] = useState([]);
    const [errorCode, setErrorCode] = useState(200);
    const [errorMsg, setErrorMsg] = useState("");
    const [errorMeta, setErrorMeta] = useState(null);
    const [showError, setShowError] = useState(false);
    const [exporting, setExporting] = useState(false);
    // const { user } = auth;

    const toggleError = () => setShowError(!showError);
    const toggle = () => setShow(!show);

    const load = useCallback((url) => {
        setLoading(true);
        let params = "";
        for (let k in filterValues) {
            if (filterValues[k]) {
                params += "&" + k + "=" + filterValues[k];
            }
        }
        let link = url ? url + params : api_link + "?limit=" + limit + params;
        API.get(link).then((res) => {
            setLoading(false);
            if (res.data) {
                setData(res.data.data);
                setMeta({ ...res.data, data: undefined });
            }
        }).catch((error) => {
            handleError(error);
        });
    }, [api_link, limit, filterValues]);
    const handleFilterChange = (newFilter) => {
        setFilterValues((prev) => ({ ...prev, ...newFilter }));
    };
    // Excel экспортын функц
    const exportToExcel = useCallback(async() => {
        setExporting(true);
        // Хүснэгтийн толгойг attributes-аас авна (hidden биш талбарууд)
        const headers = attributes
            .filter(item => !item.hidden)
            .map(item => item.label);

        // Хүснэгтийн өгөгдлийг бэлдэнэ
        const exportData = data.map(row =>
            attributes
                .filter(item => !item.hidden)
                .map(attr => {
                    const value = display(row, attr);
                    if (attr.type === "boolean") return value === 1 ? t("yes") : t("no");
                    if (attr.type === "money") return moneyFormat(value);
                    if (attr.type === "image") return value || ""; // Зургийн зам эсвэл хоосон
                    return value;
                })
        );

        // Excel-д зориулж толгой ба өгөгдлийг нэгтгэнэ
        const worksheetData = [headers, ...exportData];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Excel файлыг үүсгэж татна
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `${subject}_${new Date().toISOString().split("T")[0]}.xlsx`);
        setExporting(false);
    }, [data, attributes, subject]);
    const edit = (item) => {
        setMode("edit");
        setSelected(item);
        setShow(true);
    };

    const removeItem = (item) => {
        return new Promise((resolve) => {
            API.delete(api_link + "/" + item.id).then((res) => {
                load();
                resolve({ success: true, message: res.data.message });
                if(res.data.message){
                    toast.success(res.data.message,{position:"top-right"});
                }
            }).catch((error) => {
                if (error.data) {
                    handleError(error);
                }
                resolve({ success: false, message: error.data?.message || t("error_occurred") });
            });
        });
    }
    const handleError = (error) => {
        if (error.status === 422) {
            setErrorMsg(t("form_fill_error"));
        } else if (error.status === 500) {
            setErrorMsg(t("server_error"));
        } else {
            setErrorMsg(error.data?.message || t("unknown_error"));
        }
        setErrorCode(error.status || 500);
        setErrorMeta(error.data);
        setShowError(true);
    }
    const multipleInArray = (valuesToCheck, targetArray) => {
        return valuesToCheck.some((value) => targetArray.includes(value));
    }

    const onSearch = (e) => {
        e.preventDefault();
        load();
    };

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true;
            let nf = {};
            filters.map((item) => (nf[item.field] = item.value));
            // setFilterInputs(nf);
            setInit(true);
        }
    }, []);

    useEffect(() => {
        if (!initialized.current) load();
    }, [limit]);

    useEffect(() => {
        data?.forEach((item) => {
            if (item?.image) {
                attributes?.forEach((att) => {
                    if (typeof display(item, att) === "string" && att.type === "image") {
                        setOnlyImg((prev) => [
                            ...prev,
                            {
                                alt: "/images/" + display(item, att),
                                src: "/images/" + display(item, att),
                                imageFit: "contain",
                            },
                        ]);
                    }
                });
            }
        });
    }, [open]);

    const display = (item, i) => {
        let str = "";
        if (i.display.length > 1) {
            if (i.relation === null) {
                i.display.forEach((k, l) => {
                    str += l === 0 ? item[k] : " " + item[k];
                });
            } else {
                i.display.forEach((k, l) => {
                    str += l === 0 ? (item?.[i.relation]?.[k] || "") : "\n " + (item?.[i.relation]?.[k] || "");
                });
            }
            return str;
        } else if (i.display.length === 1) {
            if (i.relation) {
                if (i.relation.includes(".")) {
                    let keys = i.relation.split(".");
                    let result = item;
                    for (const key of keys) result = result?.[key];
                    return result?.[i.display[0]];
                }
                return item?.[i.relation]?.[i.display[0]];
            }
            return item[i.display[0]];
        }
    };

    const handleImgPreview = (e, size) => {
        setImgUrl(e);
        setOpen(!open);
        setImgPreviewSize(size);
    };

    const ImgField = ({ item, i }) => {
        const [err, setErr] = useState(false);
        return (
            <img
                className={err ? "h-10 w-10" : "h-10 w-10 rounded-full"}
                src={display(item, i)}
                alt={display(item, i)}
                onError={(e) => {
                    setErr(true);
                    e.currentTarget.src = i.imageFallback || "/uploads/no-image.png";
                }}
                onClick={() => i.preview ? handleImgPreview(display(item, i), 1240) : console.log("preview тодорхойгүй...")}
            />
        );
    };

    // ColumnDef тодорхойлолт
    const columns = [
        ...attributes
            .filter((item) => !item.hidden)
            .map((item, index) => ({
                // id-г өвөрмөц болгохын тулд index эсвэл бусад өвөрмөц утгыг ашиглана
                id: `${item.display.join('-')}_${index}`, // ID-г display-аас үүсгэх
                accessorKey: item.display[0], // accessorKey-г display-ийн эхний утгаар тохируулах
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {item.label}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const itemData = row.original;
                    if (item.type === "id") return `#${display(itemData, item)}`;
                    if (item.type === "text") return display(itemData, item);
                    if (item.type === "money")
                        return item.display.length === 1
                            ? moneyFormat(display(itemData, item))
                            : display(itemData, item);
                    if (item.type === "email")
                        return (
                            <div className="flex gap-1 items-center">
                                <Mail size={16} /> {display(itemData, item)}
                            </div>
                        );
                    if (item.type === "image")
                        return display(itemData, item) && <ImgField item={itemData} i={item} />;
                    if (item.type === "boolean")
                        return item?.toggle ? (
                            <Switch checked={display(itemData, item) === 1} disabled />
                        ) : display(itemData, item) === 1 ? (
                            <div className="flex items-center gap-2">
                                <Circle className="text-green-500" size={16} fill="currentColor" /> Тийм
                            </div> // Энийг орчуулах шаардлагагүй байж магадгүй, t("yes") гэж орлуулж болно.
                        ) : (
                            <div className="flex items-center gap-2">
                                <Circle className="text-red-500" size={16} fill="currentColor" /> Үгүй
                            </div> // Энийг орчуулах шаардлагагүй байж магадгүй, t("no") гэж орлуулж болно.
                        ); // Дээрх 2 мөрийг t("yes"), t("no") болгож болно.
                    if (item.type === "enum") return item.values?.[display(itemData, item)];
                    if (item.type === "status")
                        return (
                            <div className={`py-1 px-2 rounded text-white text-xs text-center ${display(itemData, item)?.color}`}>
                                {display(itemData, item)?.text}
                            </div>
                        );
                    return display(itemData, item);
                },
            })),
        ...(multipleInArray(["edit", "delete"], modes) || Actions
            ? [
                {
                    id: "actions",
                    header: t("actions"),
                    cell: ({ row }) => {
                        const item = row.original;
                        return (
                            <div className="flex gap-2">
                                {modes.map((i, k) => (
                                    i === "edit" ? (
                                        <Button
                                            key={`edit_${row.id}_${k}`} // key-г өвөрмөц болгох
                                            className="bg-orange-500"
                                            size="sm"
                                            onClick={() => edit(item)}
                                        >
                                            <Pencil size={16} />
                                        </Button>
                                    ) : i === "delete" ? (
                                        <AlertDialog key={`delete_${row.id}_${k}`}>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t("warning")}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t("delete_confirmation", { subject: subject })}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => removeItem(item)}>
                                                        {t("yes")}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    ) : null
                                ))}
                                {Actions && (
                                    <Actions
                                        item={item}
                                        data={data}
                                        setData={setData}
                                        index={row.index}
                                        load={load}
                                    />
                                )}
                            </div>
                        );
                    },
                },
            ]
            : []),
    ];
    // const table = useReactTable({
    //     data,
    //     columns,
    //     getCoreRowModel: getCoreRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     state: {
    //         pagination: {
    //             pageSize: limit,
    //         },
    //     },
    //     initialState: {
    //         pagination: {
    //             pageSize: limit,
    //         },
    //     },
    // });
    const table = useReactTable({
        data, // Data-г шууд дамжуулна
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination: {
                pageIndex: 0, // Эхний хуудсаас эхэлнэ
                pageSize: limit, // Динамик limit-г ашиглана
            },
        },
        onPaginationChange: (updater) => {
            // Pagination төлөв өөрчлөгдөхөд шинэчлэх
            const newPagination = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
            table.setPageIndex(newPagination.pageIndex);
            table.setPageSize(newPagination.pageSize);
        },
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: limit, // Анхны утга
            },
        },
    });
    if (!init) return null;

    return (
        <div>
            <Lightbox
                open={open}
                render={{
                    slide: ({ slide }) => (
                        <img
                            width={imgPreviewSize || 360}
                            height={imgPreviewSize || 360}
                            alt={slide.alt}
                            src={slide.src}
                            className={previewClass}
                            style={{ objectFit: slide.imageFit || "" }}
                        />
                    ),
                }}
                close={() => {
                    setOpen(false);
                    setOnlyImg([]);
                }}
                slides={[{ alt: imgUrl, src: imgUrl, imageFit: "contain" }, ...onlyImg]}
            />
            <ErrorWindow show={showError} toggle={toggleError} code={errorCode} meta={errorMeta} msg={errorMsg} />
            <div className={"grid grid-cols-12 gap-4 "+fontSize}>
                <div className="col-span-12">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <span>{subject} {t("total")}: {meta.total}</span>
                            <div className="flex gap-2">
                                {Buttons && <Buttons data={data} setData={setData} load={load} />}
                                {modes.includes("add") && (
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggle();
                                            setMode("add");
                                        }}
                                    >
                                        <Plus className="mr-2" size={16} /> {t("add_subject", { subject: subject })}
                                    </Button>
                                )}
                                {modes.includes("export") && (
                                    <Button
                                        variant="outline"
                                        onClick={exportToExcel}
                                        title={t("export_to_excel")}
                                        disabled={exporting}
                                    >
                                        <FileSpreadsheet className="mr-2" size={16} /> {t("export")}
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between my-2">
                                <div className="flex gap-2 flex-1">
                                    {filters.length ? (
                                        <form onSubmit={onSearch} className="flex gap-2 flex-1">
                                            {filters.map((item, key) => (<FilterField
                                                key={key}
                                                item={item}
                                                onFilterChange={handleFilterChange}
                                            />))}
                                            <Button type="submit">
                                                <Filter className="mr-1" size={16} /> {t("filter")}
                                            </Button>
                                        </form>
                                    ) : null}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={"w-[120px]"}>{t("show_count")}:</div>
                                    <Select value={limit} onValueChange={(value) => {
                                        const newLimit = Number(value);
                                        setLimit(newLimit); // Шинэ limit-г тогтоох
                                        load(`${api_link}?limit=${newLimit}`); // API-г шинэ limit-тэй дуудах
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {limits.map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup,key) => (
                                            <TableRow key={key}>
                                                {headerGroup.headers.map((header,index) => (
                                                    <TableHead key={index}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-12 w-full" />
                                                        <Skeleton className="h-12 w-full" />
                                                        <Skeleton className="h-12 w-full" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id}>
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                                    {t("no_data")}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            {!loading && meta.links && (
                                <div className="flex items-center justify-end space-x-2 py-4">
                                    {meta.links.map((link, index) => {
                                        // Хэрэв filterValues-д утга байвал link дээр залгах
                                        let modifiedUrl = link.url+`&limit=${limit}`;
                                        if (filterValues && Object.keys(filterValues).length > 0) {
                                            const url = new URL(link.url || window.location.href);
                                            Object.entries(filterValues).forEach(([key, value]) => {
                                                if (value) { // Зөвхөн утгатай талбаруудыг нэмнэ
                                                    url.searchParams.set(key, value);
                                                }
                                            });
                                            modifiedUrl = url.toString();
                                        }

                                        return (<Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url} // URL байхгүй бол идэвхгүй болгох
                                            dangerouslySetInnerHTML={{ __html: link.label }} // HTML тэмдэглэгээг зөв харуулах
                                            onClick={()=>load(modifiedUrl+`&limit=${limit}`)}
                                        />);
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={show} onOpenChange={setShow}>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className={`sm:max-w-[${formSize}] z-[1000]`}>
                    <DialogHeader>
                        <DialogTitle>
                            {subject} {mode === "add" ? t("add") : t("edit")}
                        </DialogTitle>
                    </DialogHeader>
                    <Form methods={methods} subject={subject} api_link={api_link} form_attr={form_attr} mode={mode} selected={selected} load={load} dev={dev} setShow={setShow} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

const ErrorWindow = ({ show, code, msg, toggle, meta }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-center text-red-500">{meta?.exception}: {code}</h3>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-center">
                        <p className="">{t("message")}: {msg}</p>
                        <p className="text-red-500">{t("file")}: {meta?.file} {t("line")}: {meta?.line}</p>
                    </div>
                    <Button className="w-full mt-6" onClick={toggle}>{t("ok")}</Button>
                </CardContent>
            </Card>
        </div>
    );
};

const Form = React.memo(({ methods, subject, api_link, form_attr, mode, selected, load, dev, setShow }) => {
    const [form, setForm] = useState({});
    const [emptyForm, setEmptyForm] = useState({});
    const [images, setImages] = useState({});
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const convertDateString = (dateString) => {
        if (typeof dateString === "string" && dateString !== "") {
            const [datePart, timePart] = dateString.split(" ");
            const [year, month, day] = datePart.split("-");
            const [hours, minutes, seconds] = timePart.split(":");
            return new Date(year, month - 1, day, hours, minutes, seconds);
        }
        return null;
    };

    const convertDatetoString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const isNumber = (value) => typeof value === "string" && !isNaN(value);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeRichText = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: convertDatetoString(value), [name + "-date"]: value }));
    };

    const onSubmit = () => {
        const handleSuccess = (res) => {
            load();
            setForm(emptyForm);
            setShow(false);
            if (res.data.message) {
                toast.success(res.data.message, { position: "top-right" });
            }
        };

        const handleError = (e) => {
            if (e.status === 422) {
                setErrors(e.data.errors);
                setTimeout(() => setErrors({}), 10000);
            }
        };

        const submitAction = () => {
            let fdata = new FormData();
            for (const key in form) {
                const attr = form_attr.find((item) => item.field === key);
                if (attr) {
                    if (["image", "file"].includes(attr.type)) {
                        if (typeof form[key] !== "object" || !form[key]) {
                            continue;
                        }
                        fdata.append(key, form[key]);
                    } else {
                        fdata.append(key, form[key]);
                    }
                }
            }

            if (mode === "add") {
                API.post(api_link, fdata, { headers: { "Content-Type": "multipart/form-data" } })
                    .then(handleSuccess).catch(handleError);
            } else {
                if (methods.update === "post") {
                    API.post(`${api_link}/${form.id}`, fdata, { headers: { "Content-Type": "multipart/form-data" } })
                        .then(handleSuccess).catch(handleError);
                } else { // Default to PUT
                    API.put(`${api_link}/${form.id}`, form)
                        .then(handleSuccess).catch(handleError);
                }
            }
        };

        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button type="button" className="w-32">
                        <Save className="mr-2" size={16} /> {t("save")}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="z-[1010]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("warning")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t(mode === "add" ? "add_confirmation" : "edit_confirmation", { subject: subject })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={submitAction}>За</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };

    const handleUpload = (file, field) => {
        let fileData = new FileReader();
        fileData.onloadend = (e) => {
            setForm((prev) => ({ ...prev, [field]: file }));
            setImages((prev) => ({ ...prev, [field]: e.target.result }));
        };
        fileData.readAsDataURL(file);
    };

    const Uploader = ({ item }) => {
        let img = null;
        if(mode === "add"){
            img = images[item.field];
        }else{
            if(typeof form[item.field] === "string"){
                img = form[item.field]
            }else{
                img = images[item.field];
            }
        }
        return (
            <Dropzone
                onDropAccepted={(im) => handleUpload(im[0], item.field)}
                multiple={false}
            >
                {({getRootProps, getInputProps}) => (
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed rounded-md p-4 text-center hover:border-blue-500 cursor-pointer"
                    >
                        <input {...getInputProps()} />
                        {form[item.field] ? (
                            <div>
                                <img className="w-auto h-44 rounded mx-auto"
                                     src={img} alt=""/>
                                <p className="mt-2">{t("change_image", { label: item.label })}</p>
                            </div>
                        ) : (
                            <div className="py-6">
                                <Image className="mx-auto" size={24}/>
                                <p>{t("upload_image_placeholder")}</p>
                            </div>
                        )}
                    </div>
                )}
            </Dropzone>
        );
    }
    useEffect(() => {
        let new_form = {};
        form_attr.map((item) => {
            new_form[item.field] = item.value;
            if (item.type === "datetime") new_form[item.field + "-date"] = convertDateString(item.value);
        });
        setForm(new_form);
        setEmptyForm(new_form);
    }, []);

    useEffect(() => {
        if (mode === "add") {
            setForm(emptyForm);
            setImages({});
        }
        if (mode === "edit") {
            for (let i in selected) {
                if (i.type==="image") {
                    setImages((prev) => ({ ...prev, [i]: selected[i] }));
                }
            }
            setForm(selected);
        }
    }, [mode, selected, emptyForm]);
    const getValueFromForm = (field, type) => {
        type = type || "string";
        if (type === "string" || type === "enum") return form[field] || "";
        if (type === "datetime") return convertDateString(form[field]);
        return form[field];
    };

    return (
        <div className={"dark:text-white"}>
            {dev && <div className={"h-[350px] overflow-y-auto"}><pre>{JSON.stringify(form, null, 2)}</pre></div>}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-12 gap-4">
                    {form_attr.map((item, key) => !item.hidden && (
                        <div key={key} className={item?.column || "col-span-6"}>
                            <Label>{item.label}</Label>
                            {item.type === "image" && <Uploader item={item} />}
                            {item.type === "text" && (
                                <Input
                                    name={item.field}
                                    value={getValueFromForm(item.field)}
                                    onChange={handleChange}
                                    required={item.required}
                                />
                            )}
                            {item.type === "richtext" && (
                                <TextEditor
                                    field={item.field}
                                    // Editor.js нь JSON объект хүлээж авдаг тул string-г parse хийнэ
                                    data={(() => {
                                        try {
                                            return JSON.parse(getValueFromForm(item.field));
                                        } catch (e) { return {}; }
                                    })()}
                                    handleChange={handleChangeRichText}
                                    uploadUrl={item.uploadUrl} // uploadUrl-г prop-оор дамжуулах
                                    toggleUpload={() => setUploading(!uploading)}
                                />
                            )}
                            {item.type === "number" && (
                                <Input
                                    type="number"
                                    name={item.field}
                                    value={getValueFromForm(item.field)}
                                    onChange={handleChange}
                                    required={item.required}
                                />
                            )}
                            {item.type === "textarea" && (
                                <Textarea
                                    name={item.field}
                                    value={getValueFromForm(item.field)}
                                    onChange={handleChange}
                                    required={item.required}
                                    rows={10}
                                />
                            )}
                            {item.type === "email" && (
                                <Input
                                    type="email"
                                    name={item.field}
                                    value={getValueFromForm(item.field)}
                                    onChange={handleChange}
                                    required={item.required}
                                />
                            )}
                            {item.type === "password" && (
                                <Input
                                    type="password"
                                    name={item.field}
                                    value={getValueFromForm(item.field)}
                                    onChange={handleChange}
                                    required={item.required}
                                />
                            )}

                            {item.type === "select" && (
                                <Select
                                    name={item.field}
                                    value={getValueFromForm(item.field) ?? item.value}
                                    onValueChange={(value) => {
                                        setForm(prev => ({ ...prev, [item.field]: parseInt(value) }));
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Сонгох" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="z-[1002]">
                                        {item.options.map((i,k)=><SelectItem key={k} value={i.id}>{i.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                            {item.type === "boolean" && (
                                <Select
                                    name={item.field}
                                    value={getValueFromForm(item.field) ?? parseInt(item.value)}
                                    onValueChange={(value) => setForm(prev => ({ ...prev, [item.field]: parseInt(value) }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="z-[1002]">
                                        <SelectItem value="1">{t("active")}</SelectItem>
                                        <SelectItem value="0">{t("inactive")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            {item.type === "enum" && (
                                <Select
                                    name={item.field}
                                    value={getValueFromForm(item.field)}
                                    onValueChange={(value) => setForm(prev => ({ ...prev, [item.field]: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={item.placeholder ? item.placeholder: t("select_placeholder")}/>
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="z-[1002]">
                                        {item.values.map((i, k) => (
                                            <SelectItem key={k} value={i.value}>{i.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {item.type === "datetime" && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="text-2xl" size={24} />
                                    <DatePicker
                                        className="bg-transparent rounded-md border-gray-600"
                                        selected={getValueFromForm(item.field, item.type)}
                                        showTimeSelect
                                        onChange={(value) => handleDateChange(item.field, value)}
                                        timeFormat="HH:mm"
                                        dateFormat="yyyy-MM-dd hh:mm:ss"
                                    />
                                </div>
                            )}
                            {errors[item.field] && (
                                <p className="text-red-500 flex items-center gap-1">
                                    <AlertTriangle size={16} /> {errors[item.field][0]}
                                </p>
                            )}
                        </div>
                    ))}
                    <div className="col-span-12">{onSubmit()}</div>
                </div>
            </form>
        </div>
    );
});

export default UniversalCrud;
