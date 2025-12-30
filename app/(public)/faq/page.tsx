import ui from "../../styles/ui.module.css";

export const metadata = {
  title: "FAQ | StopCalls",
  description:
    "Frequently asked questions about stopping debt collection calls using StopCalls.",
};

export default function FAQPage() {
  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.card}>
          <div className={ui.cardHeader}>
            <div className={ui.eyebrow}>Help</div>
            <h1 className={ui.cardTitle}>Frequently Asked Questions</h1>
            <p className={ui.cardSubtitle}>
              Clear answers about how StopCalls works and what to expect.
            </p>
          </div>

          <div style={{ display: "grid", gap: 32 }}>
            <section>
              <h2>What is StopCalls?</h2>
              <p>
                StopCalls is an online service that helps consumers generate and
                mail a legally compliant cease-communication letter to debt
                collectors under the Fair Debt Collection Practices Act (FDCPA).
              </p>
            </section>

            <section>
              <h2>Is this legal?</h2>
              <p>
                Yes. Federal law allows consumers to demand that debt collectors
                stop contacting them. StopCalls uses statutory language aligned
                with FDCPA §1692c(c).
              </p>
            </section>

            <section>
              <h2>Do I need a lawyer?</h2>
              <p>
                No. You do not need a lawyer to send a cease-communication
                request. StopCalls is not a law firm and does not provide legal
                advice.
              </p>
            </section>

            <section>
              <h2>How long does it take?</h2>
              <p>
                Completing the form takes about three minutes. Once submitted,
                the letter is generated and mailed via USPS with tracking.
              </p>
            </section>

            <section>
              <h2>Will this stop all calls?</h2>
              <p>
                Once the collector receives the letter, federal law generally
                prohibits further contact, with limited exceptions defined by
                law.
              </p>
            </section>

            <section>
              <h2>What if the collector ignores it?</h2>
              <p>
                Continued contact after receipt may constitute a violation of
                federal law. You may choose to consult an attorney regarding
                next steps.
              </p>
            </section>

            <section>
              <h2>Is my information secure?</h2>
              <p>
                Yes. Your information is used only to generate and send your
                letter. We do not sell or share personal data.
              </p>
            </section>

            <section>
              <h2>How much does it cost?</h2>
              <p>
                StopCalls charges a flat, one-time fee per letter. There are no
                subscriptions or recurring charges.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
