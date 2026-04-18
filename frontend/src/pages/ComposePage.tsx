import { useState } from "react";
import styles from "./ComposePage.module.css";
import { Editor } from "../components/editor/Editor";
import { mailApi } from "../api";

export const ComposePage = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [showHtml, setShowHtml] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSend() {
    if (!to || !subject || !html) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const result = await mailApi.send({ from, to, subject, html });

      setStatus(result.success ? "sent" : "error");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.response?.data?.error ?? err.message);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Compose</h1>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showHtml}
            onChange={(e) => setShowHtml(e.target.checked)}
          />
          Show HTML
        </label>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>From</label>
          <input
            className={styles.input}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="from@example.com"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>To</label>
          <input
            className={styles.input}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="to@example.com"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Subject</label>
          <input
            className={styles.input}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Your subject line"
          />
        </div>
      </div>

      <Editor
        onChange={setHtml}
        showHtmlPanel={showHtml}
        placeholder="Write your email here..."
      />

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      {status === "sent" && (
        <p className={styles.success}>Email sent successfully</p>
      )}

      <div className={styles.actions}>
        <button
          className={styles.btnPrimary}
          onClick={handleSend}
          disabled={status === "sending" || !to || !subject}
        >
          {status === "sending" ? "Sending..." : "Send email"}
        </button>
      </div>
    </div>
  );
};


export default ComposePage;