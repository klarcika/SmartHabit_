import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Achievements from "./pages/Achivement.jsx";
import Habits from "./pages/Habits.jsx";
import Header from "./pages/Header.jsx";
import HomePage from './pages/HomePage';
import Leaderboard from "./pages/Leaderboard.jsx";
import Milestones from "./pages/Milestone.jsx";
import ProfilePage from './pages/ProfilePage';

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
