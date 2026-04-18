import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from "./Editor.module.css";
import { EditorToolbar } from "./EditorToolbar";

interface EditorProps {
  content?: string;
  onChange: (html: string) => void;
  showHtmlPanel?: boolean;
  placeholder?: string;
}

export const Editor = ({
  content,
  onChange,
  showHtmlPanel =  false,
  placeholder = "Write your email",
}: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className={styles.wrapper}>
      <EditorToolbar editor={editor} />
      <div className={showHtmlPanel ? styles.splitView : ""}>
        <div className={styles.editorPane}>
          <EditorContent editor={editor} className={styles.content} />
        </div>
        {showHtmlPanel && (
          <div className={styles.htmlPane}>
            <p className={styles.htmlLabel}>Generated HTML</p>
            <pre className={styles.htmlCode}>{editor.getHTML()}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
