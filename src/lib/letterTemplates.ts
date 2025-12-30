import type { LetterFormData } from "./validate";

/**
 * Renders a formal cease communication letter under FDCPA §805(c)
 * This function contains NO business logic, NO validation, NO side effects.
 * It is deterministic and safe to send to Claude or Lob later.
 */
export function renderCeaseCommunicationLetter(
  data: LetterFormData
): string {
  const date = new Date().toLocaleDateString(
    data.language === "es" ? "es-US" : "en-US"
  );

  if (data.language === "es") {
    return `
${data.fullName}
${data.addressLine1}
${data.addressLine2 ? data.addressLine2 + "\n" : ""}${data.city}, ${data.state} ${data.zip}

${date}

${data.collectorName}
${data.collectorAddress ? data.collectorAddress + "\n" : ""}
Asunto: Solicitud de cese de comunicación

A quien corresponda:

Por medio de la presente solicito formalmente que cesen todas las comunicaciones conmigo en relación con cualquier deuda o asunto relacionado. Esta solicitud se realiza conforme a mis derechos bajo la Ley de Prácticas Justas de Cobro de Deudas (15 U.S.C. § 1692c(c)).

Se le instruye que deje de contactarme en el siguiente número telefónico: ${data.phoneNumber}.

Cualquier comunicación futura solo deberá realizarse según lo permitido por la ley. Esta carta constituye notificación escrita de mi solicitud.

${
  data.accountReference
    ? `Número de referencia: ${data.accountReference}\n\n`
    : ""
}
Atentamente,

${data.fullName}
`.trim();
  }

  // English (default)
  return `
${data.fullName}
${data.addressLine1}
${data.addressLine2 ? data.addressLine2 + "\n" : ""}${data.city}, ${data.state} ${data.zip}

${date}

${data.collectorName}
${data.collectorAddress ? data.collectorAddress + "\n" : ""}
Re: Cease Communication Request

To whom it may concern:

I am writing to formally request that you cease all communication with me regarding any alleged debt or related matter. This request is made pursuant to my rights under the Fair Debt Collection Practices Act (15 U.S.C. § 1692c(c)).

You are hereby instructed to stop contacting me at the following phone number: ${data.phoneNumber}.

Any further communication should only be made as permitted by law. This letter serves as written notice of my request.

${
  data.accountReference
    ? `Reference number: ${data.accountReference}\n\n`
    : ""
}
Sincerely,

${data.fullName}
`.trim();
}
