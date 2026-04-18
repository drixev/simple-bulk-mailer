import { Editor } from "@tiptap/react";
import styles from "./Editor.module.css";

interface ToolbarProps {
  editor: Editor;
}

interface ToolbarButton {
  label: string;
  action: () => void;
  isActive?: boolean;
  title: string;
}

export const EditorToolbar = ({ editor }: ToolbarProps) => {
  const buttons: ToolbarButton[] = [
    {
      title: "Bold",
      label: "B",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      title: "Italic",
      label: "I",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      title: "Underline",
      label: "U",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      title: "Strikethrough",
      label: "S",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
    },
  ];

  const listButtons: ToolbarButton[] = [
    {
      title: "Bullet list",
      label: "• List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      title: "Ordered list",
      label: "1. List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
  ];

  const headingButtons = [1, 2, 3].map((level) => ({
    title: `Heading ${level}`,
    label: `H${level}`,
    action: () =>
      editor
        .chain()
        .focus()
        .toggleHeading({ level: level as 1 | 2 | 3 })
        .run(),
    isActive: editor.isActive("heading", { level }),
  }));

  function handleLink() {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Enter URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

  function handleUndo() {
    editor.chain().focus().undo().run();
  }

  function handleRedo() {
    editor.chain().focus().redo().run();
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarGroup}>
        {headingButtons.map((btn) => (
          <button
            key={btn.title}
            title={btn.title}
            className={
              btn.isActive
                ? `${styles.toolBtn} ${styles.toolBtnActive}`
                : styles.toolBtn
            }
            onClick={btn.action}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.toolbarGroup}>
        {buttons.map((btn) => (
          <button
            key={btn.title}
            title={btn.title}
            className={
              btn.isActive
                ? `${styles.toolBtn} ${styles.toolBtnActive}`
                : styles.toolBtn
            }
            onClick={btn.action}
            style={{
              fontWeight: btn.title === "Bold" ? 700 : 400,
              fontStyle: btn.title === "Italic" ? "italic" : "normal",
              textDecoration:
                btn.title === "Underline"
                  ? "underline"
                  : btn.title === "Strikethrough"
                    ? "line-through"
                    : "none",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.toolbarGroup}>
        {listButtons.map((btn) => (
          <button
            key={btn.title}
            title={btn.title}
            className={
              btn.isActive
                ? `${styles.toolBtn} ${styles.toolBtnActive}`
                : styles.toolBtn
            }
            onClick={btn.action}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.toolbarGroup}>
        <button
          title="Insert link"
          className={
            editor.isActive("link")
              ? `${styles.toolBtn} ${styles.toolBtnActive}`
              : styles.toolBtn
          }
          onClick={handleLink}
        >
          Link
        </button>
        <button
          title="Blockquote"
          className={
            editor.isActive("blockquote")
              ? `${styles.toolBtn} ${styles.toolBtnActive}`
              : styles.toolBtn
          }
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>
        <button
          title="Code block"
          className={
            editor.isActive("codeBlock")
              ? `${styles.toolBtn} ${styles.toolBtnActive}`
              : styles.toolBtn
          }
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code
        </button>
      </div>

       <div className={styles.divider} />

      <div className={styles.toolbarGroup}>
        <button
          title="Undo"
          className={styles.toolBtn}
          onClick={handleUndo}
          disabled={!editor.can().undo()}
        >
          ↩
        </button>
        <button
          title="Redo"
          className={styles.toolBtn}
          onClick={handleRedo}
          disabled={!editor.can().redo()}
        >
          ↪
        </button>
      </div>
      
    </div>
  );
};
