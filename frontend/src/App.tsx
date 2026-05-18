import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Chat from "./pages/Chat";
import Quiz from "./pages/Quiz";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}