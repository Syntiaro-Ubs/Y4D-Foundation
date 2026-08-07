import React, { useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./RichTextEditor.css";

const MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "color",
  "background",
  "list",
  "blockquote",
  "link",
];

/**
 * WYSIWYG rich text editor. Value/onChange carry sanitized-friendly HTML
 * (p, h2/h3, strong, em, u, ul/ol/li, blockquote, a, span[style]) matching
 * SanitizedHTML's allowed tag/attribute list.
 */
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const modules = useMemo(() => MODULES, []);

  return (
    <ReactQuill
      theme="snow"
      value={value || ""}
      onChange={onChange}
      modules={modules}
      formats={FORMATS}
      placeholder={placeholder}
      className="rich-text-editor"
    />
  );
};

export default RichTextEditor;
