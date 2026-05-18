import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>© {new Date().getFullYear()} StudySense AI</span>
        <div className="footer__links">
          <span>Built for modern learners</span>
        </div>
      </div>
    </footer>
  );
}