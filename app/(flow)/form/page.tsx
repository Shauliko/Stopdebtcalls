"use client";

import { useState } from "react";
import { US_STATES } from "@/lib/usStates";
import ui from "../../styles/ui.module.css";
import styles from "./form.module.css";

type FormData = {
  language: "en" | "es";

  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;

  email: string;
  phoneNumber: string;

  collectorName: string;
  collectorAddress: string;
  accountReference: string;
};

const initialData: FormData = {
  language: "en",

  fullName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zip: "",

  email: "",
  phoneNumber: "",

  collectorName: "",
  collectorAddress: "",
  accountReference: "",
};

export default function FormPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function verifyAddress() {
    setLoading(true);
    try {
      const res = await fetch("/api/address/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        alert(json.error || "Address verification failed.");
        return false;
      }

      return true;
    } catch {
      alert("Could not verify address.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={`${ui.card} ${styles.formCard}`}>
          <div className={ui.cardHeader}>
            <div className={ui.eyebrow}>Step {step} of 3</div>
            <div className={ui.cardTitle}>
              Generate Cease Communication Letter
            </div>
            <div className={ui.cardSubtitle}>
              Required information only. Takes ~3 minutes.
            </div>
          </div>

          {/* STEPPER */}
          <div className={styles.stepper}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`${styles.step} ${
                  step === n ? styles.stepActive : ""
                }`}
              >
                {n}
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Your Information</h3>

              <div>
                <label className={styles.label}>Language</label>
                <div className={ui.buttonRow}>
                  {(["en", "es"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      className={
                        data.language === lang
                          ? ui.primaryButton
                          : ui.secondaryButton
                      }
                      style={{ width: "100%" }}
                      onClick={() => update("language", lang)}
                    >
                      {lang === "en" ? "English" : "Español"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={styles.label}>Full Legal Name</label>
                <input
                  className={styles.input}
                  value={data.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />
              </div>

              <div>
                <label className={styles.label}>Street Address</label>
                <input
                  className={styles.input}
                  value={data.addressLine1}
                  onChange={(e) => update("addressLine1", e.target.value)}
                />
              </div>

              <div>
                <label className={styles.label}>
                  Apartment / Unit (optional)
                </label>
                <input
                  className={styles.input}
                  value={data.addressLine2}
                  onChange={(e) => update("addressLine2", e.target.value)}
                />
              </div>

              <div className={styles.grid3}>
                <input
                  className={styles.input}
                  placeholder="City"
                  value={data.city}
                  onChange={(e) => update("city", e.target.value)}
                />

                <select
                  className={styles.select}
                  value={data.state}
                  onChange={(e) => update("state", e.target.value)}
                >
                  <option value="">State</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <input
                  className={styles.input}
                  placeholder="ZIP"
                  value={data.zip}
                  onChange={(e) => update("zip", e.target.value)}
                />
              </div>

              <div className={ui.buttonRow}>
                <button
                  className={ui.primaryButton}
                  style={{ width: "100%" }}
                  onClick={() => setStep(2)}
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Collector Details</h3>

              <div>
                <label className={styles.label}>Email Address</label>
                <input
                  className={styles.input}
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>

              <div>
                <label className={styles.label}>
                  Phone Number Being Called
                </label>
                <input
                  className={styles.input}
                  value={data.phoneNumber}
                  onChange={(e) => update("phoneNumber", e.target.value)}
                />
              </div>

              <div>
                <label className={styles.label}>
                  Collection Agency Name
                </label>
                <input
                  className={styles.input}
                  value={data.collectorName}
                  onChange={(e) => update("collectorName", e.target.value)}
                />
              </div>

              <div>
                <label className={styles.label}>
                  Collection Agency Address (optional)
                </label>
                <textarea
                  className={styles.textarea}
                  value={data.collectorAddress}
                  onChange={(e) => update("collectorAddress", e.target.value)}
                />
              </div>

              <div>
                <label className={styles.label}>
                  Account / Reference Number (optional)
                </label>
                <input
                  className={styles.input}
                  value={data.accountReference}
                  onChange={(e) =>
                    update("accountReference", e.target.value)
                  }
                />
              </div>

              <div className={ui.buttonRow}>
                <button
                  className={ui.secondaryButton}
                  style={{ width: "100%" }}
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  className={ui.primaryButton}
                  style={{ width: "100%" }}
                  onClick={() => setStep(3)}
                >
                  Continue
                </button>
              </div>
            </section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Review & Continue</h3>

              <p className={ui.muted}>
                You are requesting a formal cease communication letter
                asserting your consumer rights under federal law. This is
                not legal advice.
              </p>

              <div className={ui.buttonRow}>
                <button
                  className={ui.secondaryButton}
                  style={{ width: "100%" }}
                  onClick={() => setStep(2)}
                >
                  Back
                </button>

                <button
                  disabled={loading}
                  className={ui.primaryButton}
                  style={{ width: "100%" }}
                  onClick={async () => {
                    const valid = await verifyAddress();
                    if (!valid) return;

                    const res = await fetch("/api/letters/generate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(data),
                    });

                    const json = await res.json();
                    if (!res.ok || !json.ok) {
                      alert("Could not generate letter.");
                      return;
                    }

                    sessionStorage.setItem(
                      "letterFormData",
                      JSON.stringify(json.form)
                    );
                    sessionStorage.setItem(
                      "letterText",
                      json.letterText
                    );

                    window.location.href = "/preview";
                  }}
                >
                  {loading
                    ? "Verifying address…"
                    : "Preview Letter"}
                </button>
              </div>
            </section>
          )}
        </div>

        <div className={styles.footer}>
          Uses FDCPA §1692c(c) statutory language. Not legal advice.
        </div>
      </div>
    </div>
  );
}
