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
    }, [data, field, handleChange, uploadUrl]);

    return (
        <div ref={editorContainerRef} className="prose prose-sm max-w-none border rounded-md p-4 bg-white dark:bg-gray-800 dark:text-white"></div>
    );
};

export default TextEditor;
