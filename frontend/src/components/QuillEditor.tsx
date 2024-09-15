import React, { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["link"],
  ["clean"],
];

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill>(null);
  const contentRef = useRef<string>(value); // Store content in ref
  const modules = {
    toolbar: TOOLBAR_OPTIONS,
  };

  const handleChange = (content: string) => {
    contentRef.current = content;
  };

  const handleBlur = () => {
    onChange(contentRef.current);
  };

  return (
    <div className="quill-editor-container mt-2 w-full">
      <ReactQuill
        ref={quillRef}
        value={contentRef.current}
        onChange={handleChange}
        onBlur={handleBlur}
        modules={modules}
        theme="snow"
        formats={[
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "link",
          "clean",
          "size",
          "list",
          "bullet",
          "script",
          "blockquote",
          "code-block",
          "indent",
          "color",
          "background",
          "font",
          "align",
        ]}
        placeholder="Write something amazing..."
      />
    </div>
  );
};

export default QuillEditor;
