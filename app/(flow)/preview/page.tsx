"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ui from "../../styles/ui.module.css";

type LetterData = {
  language: "en" | "es";

  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;

  email: string;
  phoneNumber: string;

  collectorName: string;
  collectorAddress?: string;
  accountReference?: string;
};

export default function PreviewPage() {
  const [data, setData] = useState<LetterData | null>(null);
  const [letterText, setLetterText] = useState<string>("");

  useEffect(() => {
    const storedForm = sessionStorage.getItem("letterFormData");
    const storedLetter = sessionStorage.getItem("letterText");

    if (storedForm && storedLetter) {
      try {
        setData(JSON.parse(storedForm));
        setLetterText(storedLetter);
      } catch {
        setData(null);
      }
    }
  }, []);

  if (!data) {
    return (
      <div className={ui.page}>
        <div className={ui.container}>
          <div className={ui.card}>
            <div className={ui.cardTitle}>Preview unavailable</div>
            <p className={ui.muted}>
              We couldn’t load your letter. Please return to the form.
            </p>
            <div className={ui.buttonRow}>
              <Link
                href="/form"
                className={ui.secondaryButton}
                style={{ width: "100%" }}
              >
                Back to form
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const date = new Date().toLocaleDateString(
    data.language === "es" ? "es-US" : "en-US"
  );

  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.eyebrow}>Step 2 of 3</div>

        <h1 style={{ marginBottom: 16 }}>
          {data.language === "es"
            ? "Vista previa de la carta"
            : "Letter Preview"}
        </h1>

        {/* LETTER PREVIEW */}
        <div
          className={ui.card}
          style={{
            lineHeight: 1.65,
            wordBreak: "break-word",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <div>{data.fullName}</div>
            <div>{data.addressLine1}</div>
            {data.addressLine2 && <div>{data.addressLine2}</div>}
            <div>
              {data.city}, {data.state} {data.zip}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>{date}</div>

          <div style={{ marginBottom: 20 }}>
            <div>{data.collectorName}</div>
            {data.collectorAddress && (
              <div style={{ whiteSpace: "pre-line" }}>
                {data.collectorAddress}
              </div>
            )}
          </div>

          <p style={{ fontWeight: 500, marginBottom: 14 }}>
            {data.language === "es"
              ? "Asunto: Solicitud de cese de comunicación"
              : "Re: Cease Communication Request"}
          </p>

          <p style={{ marginBottom: 14 }}>
            {data.language === "es"
              ? "A quien corresponda:"
              : "To whom it may concern,"}
          </p>

          <p style={{ marginBottom: 14 }}>
            {data.language === "es"
              ? "Por medio de la presente solicito formalmente que cesen todas las comunicaciones conmigo en relación con cualquier deuda o asunto relacionado. Esta solicitud se realiza conforme a mis derechos bajo la Ley de Prácticas Justas de Cobro de Deudas (15 U.S.C. § 1692c(c))."
              : "I am writing to formally request that you cease all communication with me regarding any alleged debt or related matter. This request is made pursuant to my rights under the Fair Debt Collection Practices Act (15 U.S.C. § 1692c(c))."}
          </p>

          <p style={{ marginBottom: 14 }}>
            {data.language === "es"
              ? "Se le instruye que deje de contactarme en el siguiente número telefónico: "
              : "You are hereby instructed to stop contacting me at the following phone number: "}
            <strong>{data.phoneNumber}</strong>.
          </p>

          <p style={{ marginBottom: 14 }}>
            {data.language === "es"
              ? "Cualquier comunicación futura solo deberá realizarse según lo permitido por la ley. Esta carta constituye notificación escrita de mi solicitud."
              : "Any further communication should only be made as permitted by law. This letter serves as written notice of my request."}
          </p>

          {data.accountReference && (
            <p style={{ marginBottom: 14 }}>
              {data.language === "es"
                ? "Número de referencia: "
                : "Reference number: "}
              <strong>{data.accountReference}</strong>
            </p>
          )}

          <p style={{ marginBottom: 20 }}>
            {data.language === "es" ? "Atentamente," : "Sincerely,"}
          </p>

          <div>{data.fullName}</div>
        </div>

        {/* ACTIONS */}
        <div
          className={ui.buttonRow}
          style={{ marginTop: 24 }}
        >
          <Link
            href="/form"
            className={ui.secondaryButton}
            style={{ width: "100%" }}
          >
            {data.language === "es" ? "Atrás" : "Back"}
          </Link>

          <Link
            href="/checkout"
            className={ui.primaryButton}
            style={{ width: "100%" }}
          >
            {data.language === "es"
              ? "Continuar al pago"
              : "Continue to checkout"}
          </Link>
        </div>
      </div>
    </div>
  );
}
