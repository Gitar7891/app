import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "@/pages/Landing";
import Game from "@/pages/Game";
import TeacherDashboard from "@/pages/TeacherDashboard";

function App() {
  return (
    <div className="App">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#FFFDF7",
            color: "#2A2421",
            border: "2px solid #D68C45",
            fontFamily: "Literata, serif",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/oyun/:sessionId" element={<Game />} />
          <Route path="/ogretmen" element={<TeacherDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
