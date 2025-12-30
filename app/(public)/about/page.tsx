import ui from "../../styles/ui.module.css";

export const metadata = {
  title: "About | StopCalls",
  description:
    "Learn more about StopCalls and our mission to help consumers stop unwanted debt collection calls.",
};

export default function AboutPage() {
  return (
    <div className={ui.page}>
      <div className={ui.container}>
        <div className={ui.card}>
          <div className={ui.cardHeader}>
            <div className={ui.eyebrow}>Company</div>
            <h1 className={ui.cardTitle}>About StopCalls</h1>
            <p className={ui.cardSubtitle}>
              A simple tool built to give consumers control.
            </p>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <section>
              <h2>Our Mission</h2>
              <p>
                StopCalls exists to help consumers assert their rights and stop
                unwanted debt collection calls quickly and confidently, without
                unnecessary complexity or cost.
              </p>
            </section>

            <section>
              <h2>Why We Built This</h2>
              <p>
                Many consumers are unaware that federal law allows them to
                demand that debt collectors stop contacting them. StopCalls
                removes friction from that process by handling the letter
                generation and mailing for you.
              </p>
            </section>

            <section>
              <h2>What We Are (and Aren’t)</h2>
              <p>
                StopCalls is a software tool. We are not a law firm, and we do
                not provide legal advice. Our role is to help you execute a
                legally recognized request efficiently.
              </p>
            </section>

            <section>
              <h2>Transparency</h2>
              <p>
                We believe in clear pricing, simple workflows, and honest
                communication. There are no subscriptions and no hidden fees.
              </p>
            </section>

            <section>
              <h2>Looking Ahead</h2>
              <p>
                We are continuing to improve StopCalls with better tracking,
                clearer guidance, and expanded consumer protection tools.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
