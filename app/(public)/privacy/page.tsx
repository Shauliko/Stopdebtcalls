import ui from "../../styles/ui.module.css";

export const metadata = {
  title: "Privacy Policy | StopCalls",
  description:
    "How StopCalls collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.card}>
          <div className={ui.cardHeader}>
            <div className={ui.eyebrow}>Legal</div>
            <h1 className={ui.cardTitle}>Privacy Policy</h1>
            <p className={ui.cardSubtitle}>
              Your privacy matters. This policy explains what we collect and why.
            </p>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <section>
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you voluntarily provide when using
                StopCalls, including contact details and information necessary
                to generate and mail your letter.
              </p>
            </section>

            <section>
              <h2>2. How We Use Information</h2>
              <p>
                Information is used solely to operate the service, generate your
                letter, process mailing, provide customer support, and improve
                the product.
              </p>
            </section>

            <section>
              <h2>3. Data Sharing</h2>
              <p>
                We do not sell personal information. Limited data may be shared
                with service providers strictly for fulfilling your request
                (e.g., printing and mailing).
              </p>
            </section>

            <section>
              <h2>4. Data Retention</h2>
              <p>
                We retain information only as long as necessary to provide the
                service and comply with legal obligations.
              </p>
            </section>

            <section>
              <h2>5. Security</h2>
              <p>
                Reasonable administrative and technical safeguards are used to
                protect your information. No system is completely secure.
              </p>
            </section>

            <section>
              <h2>6. Cookies and Analytics</h2>
              <p>
                StopCalls may use minimal cookies or analytics tools to
                understand usage patterns and improve performance.
              </p>
            </section>

            <section>
              <h2>7. Your Choices</h2>
              <p>
                You may request access, correction, or deletion of your personal
                information where legally permitted.
              </p>
            </section>

            <section>
              <h2>8. Children’s Privacy</h2>
              <p>
                StopCalls is not intended for use by children under 13. We do
                not knowingly collect information from children.
              </p>
            </section>

            <section>
              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Continued
                use of the service constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2>10. Contact</h2>
              <p>
                Questions about privacy can be directed through the contact
                information provided on this website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
