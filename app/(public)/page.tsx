import Link from "next/link";
import styles from "../styles/ui.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <div className={styles.heroWrapper}>
          <div className={`${styles.card} ${styles.heroCard}`}>
            <div className={styles.eyebrow}>Consumer Protection Tool</div>

            <h1 className={styles.heroTitle}>
              Stop Debt Collection Calls.
              <br />
              Permanently.
            </h1>

            <p className={styles.heroSubtitle}>
              Generate and mail a federally compliant cease-communication letter
              under the FDCPA. Takes 3 minutes. Flat fee.
            </p>

            <div className={styles.buttonRow}>
              <Link href="/form" className={styles.primaryButton}>
                Generate My Letter
              </Link>
            </div>

            <div className={styles.heroMeta}>
              FDCPA §1692c(c) compliant · Tracked USPS delivery
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureTitle}>Legally Precise</div>
            <div className={styles.featureText}>
              Uses statutory language required under federal law.
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureTitle}>No Lawyer Required</div>
            <div className={styles.featureText}>
              Skip consultations, retainers, and delays.
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureTitle}>Mailed & Tracked</div>
            <div className={styles.featureText}>
              We print, mail, and track the letter on your behalf.
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footerNote}>
          Not a law firm. No legal advice provided.
        </div>
      </div>
    </div>
  );
}
