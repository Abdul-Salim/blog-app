import React from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
}) => {
  const handleEditorChange = ({ text }: { text: string }) => {
    onChange(text);
  };

  return (
    <MdEditor
      canView={{
        menu: true,
        md: true,
        html: true,
        both: false,
        fullScreen: true,
        hideMenu: false,
      }}
      view={{
        menu: true,
        md: true,
        html: false,
      }}
      value={value}
      style={{ height: "400px" }}
      renderHTML={(text) => (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {text}
        </ReactMarkdown>
      )}
      onChange={handleEditorChange}
    />
  );
};

export default MarkdownEditor;
