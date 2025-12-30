import ui from "../../styles/ui.module.css";

export const metadata = {
  title: "Disclaimer | StopCalls",
  description:
    "Legal disclaimer regarding the use of the StopCalls website and services.",
};

export default function DisclaimerPage() {
  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.card}>
          <div className={ui.cardHeader}>
            <div className={ui.eyebrow}>Legal</div>
            <h1 className={ui.cardTitle}>Disclaimer</h1>
            <p className={ui.cardSubtitle}>
              Important information about the scope and limitations of this
              service.
            </p>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <section>
              <h2>No Legal Advice</h2>
              <p>
                StopCalls is not a law firm and does not provide legal advice.
                Information provided through this website is for general
                informational purposes only.
              </p>
            </section>

            <section>
              <h2>No Attorney-Client Relationship</h2>
              <p>
                Use of StopCalls does not create an attorney-client
                relationship. If you require legal advice, consult a qualified
                attorney.
              </p>
            </section>

            <section>
              <h2>Accuracy of Information</h2>
              <p>
                While we strive to keep information accurate and up to date,
                StopCalls makes no warranties regarding completeness,
                reliability, or accuracy.
              </p>
            </section>

            <section>
              <h2>Third-Party Services</h2>
              <p>
                StopCalls may rely on third-party providers to fulfill mailing
                or delivery. We are not responsible for the actions or
                performance of third parties.
              </p>
            </section>

            <section>
              <h2>Limitation of Liability</h2>
              <p>
                StopCalls shall not be liable for any damages arising from use
                of or inability to use the service, to the maximum extent
                permitted by law.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
