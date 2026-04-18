import { useEffect, useState } from "react";
import { SMTP_PRESETS, type SmtpPreset } from "../../types";
import { settingsApi } from "../../api";
import styles from "./SettingsForm.module.css";
import { AxiosError } from "axios";

interface FormState {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
}

const EMPTY_FORM: FormState = {
  host: "",
  port: 587,
  secure: false,
  user: "",
  password: "",
};

export const SettingsForm = () => {
  const [preset, setPreset] = useState<SmtpPreset>();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<
    "idle" | "saving" | "testing" | "saved" | "error"
  >("idle");
  const [testResult, setTestResult] = useState<"idle" | "ok" | "fail">("idle");
  const [configured, setConfigured] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const getSettings = async () => {
      const res = await settingsApi.get();
      if (res.configured) {
        setConfigured(true);
        setForm((prev) => ({
          ...prev,
          ...res.smtp,
        }));
      }
    };

    getSettings();
  }, []);

  const applyPresent = (value: SmtpPreset) => {
    setPreset(value);
    if (value !== "custom") {
      const p = SMTP_PRESETS[value];
      setForm((prev) => ({
        ...prev,
        ...p,
      }));
    }
  };

  const handleChange = (
    field: keyof FormState,
    value: string | number | boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setStatus("saving");
    setErrorMsg("");

    try {
      const res = await settingsApi.save(form);
      if (res.success) {
        setStatus("saved");
        setConfigured(true);
        setTimeout(() => {
          setStatus("idle");
        }, 2000);
      } else {
        setErrorMsg("Unexpected error ocurred");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const handleTest = async () => {
    setStatus("testing");
    setTestResult("idle");
    setErrorMsg("");

    try {
      const res = await settingsApi.test();
      console.log(res);
      setTestResult(res.connected ? "ok" : "fail");
      if (!res.connected && res.error) setErrorMsg(res.error);
    } catch (err: any) {
      setTestResult("fail");
      setStatus("error");

      if (err instanceof AxiosError) {
        setErrorMsg(err.response?.data.message);
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>SMTP settings</h1>
        {configured && <span className={styles.badge}>Configured</span>}
      </div>

      <section className={styles.section}>
        <label className={styles.label}>Provider preset</label>
        <div className={styles.presets}>
          {(Object.keys(SMTP_PRESETS) as SmtpPreset[]).map((key) => (
            <button
              key={key}
              className={
                preset === key
                  ? `${styles.preset} ${styles.presetActive}`
                  : styles.preset
              }
              onClick={() => applyPresent(key)}
            >
              {SMTP_PRESETS[key].label}
            </button>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <label htmlFor="" className={styles.label}>
          Host
        </label>
        <input
          type="text"
          className={styles.input}
          value={form.host}
          onChange={(e) => handleChange("host", e.target.value)}
        />
      </section>

      <div className={styles.row}>
        <section className={styles.section}>
          <label htmlFor="" className={styles.label}>
            Port
          </label>
          <input
            type="number"
            className={styles.input}
            value={form.port}
            onChange={(e) => handleChange("port", e.target.value)}
          />
        </section>
        <section className={styles.section}>
          <label className={styles.label}>SSL / TLS</label>
          <div className={styles.toggle}>
            <input
              type="checkbox"
              id="secure"
              checked={form.secure}
              onChange={(e) => handleChange("secure", e.target.checked)}
            />
            <label htmlFor="secure">
              {form.secure ? "Enabled (port 465)" : "Disabled — use STARTTLS"}
            </label>
          </div>
        </section>
      </div>

      <section className={styles.section}>
        <label className={styles.label}>Username / Email</label>
        <input
          type="text"
          className={styles.input}
          value={form.user}
          onChange={(e) => handleChange("user", e.target.value)}
          placeholder="you@example.com"
          autoComplete="username"
        />
      </section>

      <section className={styles.section}>
        <label className={styles.label}>Password</label>
        <input
          type="password"
          className={styles.input}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder={
            configured
              ? "••••••••  (leave blank to keep current)"
              : "Bridge password or SMTP token"
          }
          autoComplete="current-password"
        />
        <p className={styles.hint}>
          Stored locally on the backend — never sent back to the browser.
        </p>
      </section>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      {testResult === "ok" && (
        <p className={styles.success}>Connectiopn successful</p>
      )}
      {testResult === "fail" && (
        <p className={styles.error}>
          Connectiopn failed - check you credentials and make sure Bridge is
          running
        </p>
      )}

      <div className={styles.actions}>
        <button
          className={styles.btnSecondary}
          onClick={() => handleTest()}
          disabled={status === "testing" || status === "saving"}
        >
          {status === "testing" ? "Testing..." : "Test connection"}
        </button>
        <button
          className={styles.btnPrimary}
          onClick={() => handleSave()}
          disabled={status === "testing" || status === "saving"}
        >
          {status === "saving"
            ? "Saving..."
            : status === "saved"
              ? "Saved!"
              : "Save settings"}
        </button>
      </div>
    </div>
  );
};
