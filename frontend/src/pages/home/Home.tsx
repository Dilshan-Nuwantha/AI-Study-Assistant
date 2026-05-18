import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGlobalStats, getProfile, getRecentActivity, getStoredUser } from "../../services/api";
import "./Home.css";

type Stats = {
  users: number;
  chats: number;
  summaries: number;
  quizzes: number;
};

type ActivityItem = {
  id: string;
  type: string;
  username: string;
  request: string;
  responsePreview: string;
  createdAt: string;
};

export default function Home() {
  const user = getStoredUser();
  const [globalStats, setGlobalStats] = useState<Stats | null>(null);
  const [userStats, setUserStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [globalRes, activityRes] = await Promise.all([
          getGlobalStats(),
          getRecentActivity(3),
        ]);
        setGlobalStats(globalRes.data.stats);
        setActivity(activityRes.data.items);
      } catch (err) {
        setGlobalStats({ users: 0, chats: 0, summaries: 0, quizzes: 0 });
        setActivity([]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserStats(null);
      return;
    }

    const loadUserStats = async () => {
      try {
        const res = await getProfile();
        setUserStats(res.data.stats);
      } catch (err) {
        setUserStats(null);
      }
    };

    loadUserStats();
  }, [user]);

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
            <Link className="btn btn-primary" to="/upload">Upload Notes</Link>
            <Link className="btn btn-ghost" to="/chat">Ask AI</Link>
            <Link className="btn btn-ghost" to="/quiz">Generate Quiz</Link>
          </div>

          <div className="home__meta">
            <div className="home__stat">
              <span className="home__stat-value">{globalStats?.chats ?? 0}</span>
              <span className="home__stat-label">Total chats</span>
            </div>
            <div className="home__stat">
              <span className="home__stat-value">{globalStats?.summaries ?? 0}</span>
              <span className="home__stat-label">Total summaries</span>
            </div>
            <div className="home__stat">
              <span className="home__stat-value">{globalStats?.quizzes ?? 0}</span>
              <span className="home__stat-label">Total quizzes</span>
            </div>
            <div className="home__stat">
              <span className="home__stat-value">{globalStats?.users ?? 0}</span>
              <span className="home__stat-label">Total users</span>
            </div>
          </div>

          {userStats ? (
            <div className="home__section">
              <div className="home__section-title">Your totals</div>
              <div className="home__meta home__meta--compact">
                <div className="home__stat">
                  <span className="home__stat-value">{userStats.chats}</span>
                  <span className="home__stat-label">Your chats</span>
                </div>
                <div className="home__stat">
                  <span className="home__stat-value">{userStats.summaries}</span>
                  <span className="home__stat-label">Your summaries</span>
                </div>
                <div className="home__stat">
                  <span className="home__stat-value">{userStats.quizzes}</span>
                  <span className="home__stat-label">Your quizzes</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="home__visual">
          <div className="home__card home__card--large">
            <div className="home__card-title">Recent activity</div>
            <div className="home__card-list">
              {activity.length ? (
                activity.map((item) => (
                  <div className="home__card-item home__card-item--stack" key={item.id}>
                    <div className="home__card-item-title">
                      {item.type.toUpperCase()} · {item.username} · {new Date(item.createdAt).toLocaleString()}
                    </div>
                    <div className="home__card-item-body">
                      {item.request}
                    </div>
                  </div>
                ))
              ) : (
                <div className="home__card-empty">No activity yet.</div>
              )}
            </div>
            <span className="home__chip">Live from database</span>
          </div>

          <div className="home__stack" />
        </div>
      </div>
    </section>
  );
}