// resources/js/components/universal-crud/TextEditor.jsx
"use client";

import React, { useRef } from "react";
import API from "@/utils/api";
import { CKEditor } from "@ckeditor/ckeditor5-react";

// Зөв импорт (2024+ онд ингэж импорт хийнэ)
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Link from "@ckeditor/ckeditor5-link/src/link";
import List from "@ckeditor/ckeditor5-list/src/list";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
// ImageInsertUI нь зураг оруулах UI-г хариуцдаг.
import { ImageInsert, ImageInsertUI } from '@ckeditor/ckeditor5-image';

class MyUploadAdapter {
    constructor(loader, url) {
        this.loader = loader;
        this.url = url;
    }

    upload() {
        return this.loader.file.then(file => new Promise((resolve, reject) => {
            const data = new FormData();
            data.append("upload", file); // CKEditor-ын стандарт нэршил "upload"

            // CSRF token-г meta tag-аас авч header-т нэмэх
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            API.post(this.url, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'X-CSRF-TOKEN': csrfToken // <-- CSRF Token нэмэгдсэн
                }
            })
                .then(response => {
                    // CKEditor нь "url" гэсэн key-г хүлээж авдаг
                    if (response.data.url) {
                        resolve({ default: response.data.url });
                    } else {
                        reject(response.data.error?.message || "Зураг хуулах үед тодорхойгүй алдаа гарлаа.");
                    }
                })
                .catch(err => reject(err.response?.data?.message || "Серверийн алдаа: Зураг хуулж чадсангүй."));
        }));
    }

    abort() {
        // Abort хийх шаардлагатай бол энд логик оруулна
    }
}

function CustomUploadAdapterPlugin(editor) {
    const uploadUrl = editor.config.get('customUploadUrl');
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader, uploadUrl);
    };
}

const TextEditor = ({ handleChange, data = "", field, uploadUrl = "/qwerty/upload-image" }) => {
    const editorRef = useRef(null);

    const editorConfig = {
        plugins: [
            Essentials, Bold, Italic, Paragraph, Link, List,
            Image, ImageCaption, ImageStyle, ImageToolbar, ImageInsert, ImageInsertUI, // ImageInsert болон ImageInsertUI-г нэмэх
        ],
        toolbar: [
            "heading", "|",
            "bold", "italic", "link", "bulletedList", "numberedList", "blockQuote", "|",
            "imageInsert", "undo", "redo" // "imageUpload"-г "imageInsert" болгож солих
        ],
        image: {
            toolbar: ["imageStyle:inline", "imageStyle:block", "imageStyle:side", "|", "toggleImageCaption", "imageTextAlternative"]
        },
        // Custom upload adapter нэмж байна
        extraPlugins: [CustomUploadAdapterPlugin],
        customUploadUrl: uploadUrl, // Adapter-т зориулж URL-г дамжуулах
        // SimpleUploadAdapter ашиглах бол доорх тохиргоог идэвхжүүлнэ (аль нэгийг нь л ашиглана)
        // simpleUpload: {
        //     uploadUrl: "/api/qwerty/upload-image",
        //     headers: {
        //         "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
        //     }
        // }
    };

    return (
        <div className="prose prose-sm max-w-none">
            <CKEditor
                editor={ClassicEditor}
                data={data}
                config={editorConfig}
                onReady={(editor) => {
                    editorRef.current = editor;
                    // Toolbar-ийг editor-ийн дээр гаргах (заавал биш, гоё харагдуулна)
                    const toolbar = editor.ui.view.toolbar.element;
                    editor.ui.view.element.insertBefore(toolbar, editor.ui.view.editable.element);
                }}
                onChange={(event, editor) => {
                    const content = editor.getData();
                    handleChange(field, content);
                }}
            />
        </div>
    );
};

export default TextEditor;