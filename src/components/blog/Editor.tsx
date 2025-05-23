import React from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  const handleEditorChange = ({ text }: { text: string }) => {
    onChange(text);
  };

  return (
    <MdEditor
      canView={{
        menu: true,
        md: true, // Allow editor view
        html: true, // Allow preview view
        both: false, // Disable split view
        fullScreen: true,
        hideMenu: false,
      }}
      // Start with editor view by default
      view={{ menu: true, md: true, html: false }}
      value={value}
      style={{ height: "400px" }}
      renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
      onChange={handleEditorChange}
    />
  );
};

export default MarkdownEditor;
