"use client";

import React, { useEffect, useRef } from "react";
import API from "@/utils/api";

// Editor.js
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import Quote from "@editorjs/quote";
import LinkTool from "@editorjs/link";

const TextEditor = ({ handleChange, data, field, uploadUrl = "/qwerty/upload-image" }) => {
    const editorInstance = useRef(null);
    const editorContainerRef = useRef(null);

    useEffect(() => {
        if (!editorInstance.current && editorContainerRef.current) {
            const editor = new EditorJS({
                holder: editorContainerRef.current,
                placeholder: "Энд бичнэ үү...",
                tools: {
                    header: Header,
                    list: List,
                    quote: Quote,
                    linkTool: LinkTool,
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file) {
                                    const formData = new FormData();
                                    formData.append("upload", file);

                                    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                                    try {
                                        const response = await API.post(uploadUrl, formData, {
                                            headers: {
                                                "Content-Type": "multipart/form-data",
                                                'X-CSRF-TOKEN': csrfToken
                                            }
                                        });

                                        if (response.data.success && response.data.url) {
                                            return {
                                                success: 1,
                                                file: {
                                                    url: response.data.url,
                                                }
                                            };
                                        } else {
                                            return {
                                                success: 0,
                                                message: response.data.error?.message || "Зураг хуулах үед алдаа гарлаа."
                                            };
                                        }
                                    } catch (err) {
                                        return {
                                            success: 0,
                                            message: err.response?.data?.message || "Серверийн алдаа."
                                        };
                                    }
                                }
                            }
                        }
                    }
                },
                data: data || {}, // Анхны өгөгдлийг дамжуулах
                async onChange(api, event) {
                    const savedData = await api.saver.save();
                    // Өгөгдлийг JSON string болгож parent-д дамжуулах
                    handleChange(field, JSON.stringify(savedData));
                },
            });
            editorInstance.current = editor;
        }

        return () => {
            if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, []); // Empty dependency array to ensuring editor only initializes once

    return (
        <div ref={editorContainerRef} className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm max-w-none dark:prose-invert"></div>
    );
};

export default TextEditor;
