import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { queueRequest, syncRequests } from "./../offlineSync.js";
import { FaMedal } from "react-icons/fa";
import './Habits.css';
import './Milestone.css';

function Milestones() {
    const { getToken, isSignedIn } = useAuth();
    const [milestones, setMilestones] = useState([]);
    const [error, setError] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = async () => {
            setIsOnline(true);
            await syncRequests(getToken);
            fetchMilestones();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const fetchMilestones = async () => {
        if (!isSignedIn) return;

        const token = await getToken();

        try {
            if (isOnline) {
                const response = await axios.get("http://localhost:4000/api/milestones", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMilestones(response.data);
            } else {
                await queueRequest({
                    method: 'GET',
                    url: "http://localhost:4000/api/milestones",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if ('serviceWorker' in navigator && 'SyncManager' in window) {
                    navigator.serviceWorker.ready.then((registration) => {
                        registration.sync.register('sync-habits');
                    });
                }
            }
        } catch (error) {
            console.error("Napaka pri pridobivanju mejnikov:", error);
            setError("Napaka pri pridobivanju mejnikov. Poskusite znova.");
        }
    };

    useEffect(() => {
        fetchMilestones();
    }, [isSignedIn, isOnline]);

    const renderMedal = (progress) => {
        if (progress >= 100) return <FaMedal style={{ color: 'gold' }} title="Zlata medalja" />;
        if (progress >= 50) return <FaMedal style={{ color: 'silver' }} title="Srebrna medalja" />;
        return null;
    };

    const renderProgressBar = (progress) => (
        <div className="progress-container">
            <div
                className="progress-bar"
                style={{
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: progress >= 100 ? '#ffd700' : '#c0c0c0',
                }}
            ></div>
        </div>
    );

    const getMilestoneTitle = (type) => {
        switch (type) {
            case 'half':
                return "Half way there!";
            case 'full':
                return "Mission accomplished!";
            default:
                return "Napredek dosežen";
        }
    };

    const filterMilestones = (milestones) => {
        const habitMap = new Map();

        milestones.forEach((milestone) => {
            if (!milestone.habit) return; 

            const habitId = milestone.habit?._id;
            const existing = habitMap.get(habitId);
            if (!existing || (existing.type === 'half' && milestone.type === 'full')) {
                habitMap.set(habitId, milestone);
            }
        });

        return Array.from(habitMap.values());
    };

    return (
        <div className="habit-page-wrapper">
            <div className="habit-container">
                <h2><FaMedal className="icon" />Moji dosežki {isOnline ? '' : '(Offline)'}</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {milestones.length === 0 ? (
                    <p>Ni mejnikov za prikaz.</p>
                ) : (
                    <div className="habit-list">
                        {filterMilestones(milestones).map((milestone) => {
                            if (!milestone.habit) return null; 

                            const points = milestone.habit?.points || 0;
                            const goal = milestone.habit?.goal || 1;
                            const progress = (points / goal) * 100;
                            const title = getMilestoneTitle(milestone.type);

                            return (
                                <div key={milestone._id} className="habit-card">
                                    <div className="habit-card-content">
                                        <h3 className="medal-icon">{renderMedal(progress)} {title}</h3>
                                        <p><strong>Navada:</strong> {milestone.habit.name || 'Neznano'}</p>
                                        <p><strong>Napredek:</strong> {Math.round(progress)}%</p>
                                        {renderProgressBar(progress)}
                                        <p><strong>Datum:</strong> {new Date(milestone.createdAt).toLocaleString('sl-SI')}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Milestones;
