import ui from "../../styles/ui.module.css";

export const metadata = {
  title: "Terms & Conditions | StopCalls",
  description:
    "Terms and conditions governing the use of the StopCalls website and services.",
};

export default function TermsPage() {
  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.card}>
          <div className={ui.cardHeader}>
            <div className={ui.eyebrow}>Legal</div>
            <h1 className={ui.cardTitle}>Terms and Conditions</h1>
            <p className={ui.cardSubtitle}>
              Please read these terms carefully before using StopCalls.
            </p>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the StopCalls website or services, you
                agree to be bound by these Terms and Conditions. If you do not
                agree, do not use the service.
              </p>
            </section>

            <section>
              <h2>2. Description of Service</h2>
              <p>
                StopCalls provides a tool that allows users to generate and mail
                a cease-communication letter to debt collectors based on user-
                supplied information. StopCalls is not a law firm and does not
                provide legal advice.
              </p>
            </section>

            <section>
              <h2>3. No Legal Advice</h2>
              <p>
                Information provided through StopCalls is for general
                informational purposes only. Use of the service does not create
                an attorney-client relationship.
              </p>
            </section>

            <section>
              <h2>4. User Responsibilities</h2>
              <p>
                You are responsible for ensuring that all information you
                provide is accurate and complete. StopCalls is not responsible
                for errors resulting from incorrect or incomplete information.
              </p>
            </section>

            <section>
              <h2>5. Fees and Payments</h2>
              <p>
                StopCalls charges a one-time fee per letter. All payments are
                final once processing has begun.
              </p>
            </section>

            <section>
              <h2>6. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, StopCalls shall not be
                liable for any indirect, incidental, or consequential damages
                arising from use of the service.
              </p>
            </section>

            <section>
              <h2>7. Service Availability</h2>
              <p>
                We may modify, suspend, or discontinue the service at any time
                without notice.
              </p>
            </section>

            <section>
              <h2>8. Governing Law</h2>
              <p>
                These terms are governed by and construed in accordance with the
                laws of the applicable jurisdiction, without regard to conflict
                of law principles.
              </p>
            </section>

            <section>
              <h2>9. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. Continued use of
                the service constitutes acceptance of the revised terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
