import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Upload from "./pages/upload/Upload";
import Chat from "./pages/chat/Chat";
import Quiz from "./pages/quiz/Quiz";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}