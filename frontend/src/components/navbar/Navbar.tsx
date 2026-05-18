import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <h1 className="text-xl font-bold">StudySense AI</h1>

      <div className="flex gap-6 text-sm">
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/quiz">Quiz</Link>
      </div>
    </nav>
  );
}