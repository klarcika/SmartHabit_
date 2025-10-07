import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Header from "./pages/Header.jsx";
import Habits from "./pages/Habits.jsx";
import Achievements from "./pages/Achivement.jsx";
import Milestones from "./pages/Milestone.jsx";
import Leaderboard from "./pages/leaderboard.jsx";

function App() {
useEffect(() => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      console.log("Notification permission:", permission);
    });
  }
}, []);


  return (
    <Router>
      <Header />
      <div style={{ marginTop: '90px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/milestone" element={<Milestones />} />
          <Route path="/achivements" element={<Achievements />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
