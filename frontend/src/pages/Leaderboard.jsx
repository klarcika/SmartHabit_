import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { syncRequests } from './../offlineSync'; // Import offlineSync
import './leaderboard.css';

function LeaderboardMilestone() {
  const { getToken, isSignedIn } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine); // Track online/offline status

  // Load cached data from localStorage on mount
  useEffect(() => {
    const cachedLeaders = localStorage.getItem('leaderboard-milestone');
    if (cachedLeaders) {
      setLeaders(JSON.parse(cachedLeaders));
    }
  }, []);

  // Handle online/offline transitions
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      await syncRequests(getToken); // Sync any queued requests from other pages
      fetchData(); // Refresh leaderboard data
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
    fetchData();
  }, [isSignedIn]);

  const fetchData = async () => {
    if (!isOnline) {
      setError("Aplikacija je offline. Prikazani so zadnji znani podatki.");
      return;
    }

    const token = await getToken();
    try {
      const res = await axios.get('http://localhost:4000/api/leaderboard/milestone', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaders(res.data);
      // Cache the data in localStorage
      localStorage.setItem('leaderboard-milestone', JSON.stringify(res.data));
      setError(null);
    } catch (err) {
      console.error("Napaka pri pridobivanju leaderboarda:", err);
      setError("Napaka pri pridobivanju leaderboarda.");
    }
  };

  return (
      <div className="leaderboard-container">
        <h2 className="leaderboard-title">Lestvica najboljših {isOnline ? '' : '(Offline)'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <table className="leaderboard-table">
          <thead>
          <tr>
            <th>#</th>
            <th>Uporabnik</th>
            <th>Email</th>
            <th>Točke</th>
          </tr>
          </thead>
          <tbody>
          {leaders.length === 0 ? (
              <tr>
                <td colSpan="4">Ni podatkov za prikaz.</td>
              </tr>
          ) : (
              leaders.map((user, index) => (
                  <tr key={index}>
                    <td className="leaderboard-rank">{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.points}</td>
                  </tr>
              ))
          )}
          </tbody>
        </table>
      </div>
  );
}

export default LeaderboardMilestone;