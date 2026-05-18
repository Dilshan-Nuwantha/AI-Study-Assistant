import "./Home.css";

export default function Home() {
  return (
    <section className="home page-shell">
      <div className="home__hero">
        <div>
          <span className="home__eyebrow">University Website</span>
          <h2 className="home__title">Welcome to the future of education systems</h2>
          <p className="home__subtitle">
            Summarize notes, chat with AI, and generate quizzes instantly with
            a calm, organized workspace designed for students.
          </p>

          <div className="home__actions">
            <button className="btn btn-primary" type="button">Get Started</button>
            <button className="btn btn-ghost" type="button">View Demo</button>
          </div>

          <div className="home__meta">
            <div className="home__stat">
              <span className="home__stat-value">24/7</span>
              <span className="home__stat-label">AI study support</span>
            </div>
            <div className="home__stat">
              <span className="home__stat-value">4.9/5</span>
              <span className="home__stat-label">Student satisfaction</span>
            </div>
            <div className="home__stat">
              <span className="home__stat-value">120+</span>
              <span className="home__stat-label">Universities onboard</span>
            </div>
          </div>
        </div>

        <div className="home__visual">
          <div className="home__card home__card--large">
            <div className="home__card-title">Graduate Student Fees</div>
            <div className="home__card-list">
              <div className="home__card-item">
                <span>Computer Science</span>
                <span>$1,420</span>
              </div>
              <div className="home__card-item">
                <span>Business Analytics</span>
                <span>$1,280</span>
              </div>
              <div className="home__card-item">
                <span>Design Systems</span>
                <span>$1,050</span>
              </div>
            </div>
            <span className="home__chip">Updated weekly</span>
          </div>

          <div className="home__stack">
            <div className="home__card">
              <div className="home__card-title">AI Summaries</div>
              <div className="home__card-item">
                <span>Condense lectures</span>
                <span>2 mins</span>
              </div>
              <div className="home__card-item">
                <span>Highlight key topics</span>
                <span>Auto-tag</span>
              </div>
            </div>
            <div className="home__card home__accent">
              <div className="home__card-title">Live Office Hours</div>
              <div className="home__card-item">
                <span>Next session</span>
                <span>03:00 PM</span>
              </div>
              <div className="home__card-item">
                <span>Seats remaining</span>
                <span>12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}