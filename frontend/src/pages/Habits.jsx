import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { FaListAlt } from 'react-icons/fa';
import { queueRequest, syncRequests } from "./../offlineSync.js";
import './Habits.css';

function Habit() {
    const { getToken, isSignedIn } = useAuth();
    const { user } = useUser();
    const [habits, setHabits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentHabit, setCurrentHabit] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const userId = user?.id;

    useEffect(() => {
        const handleOnline = async () => {
            setIsOnline(true);
            await syncRequests(getToken);
            fetchHabits();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const fetchHabits = async () => {
        if (!isSignedIn) return;

        const token = await getToken();

        try {
            if (isOnline) {
                const response = await axios.get("http://localhost:4000/api/habits", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHabits(response.data);
            } else {
                await queueRequest({
                    method: 'GET',
                    url: "http://localhost:4000/api/habits",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if ('serviceWorker' in navigator && 'SyncManager' in window) {
                    navigator.serviceWorker.ready.then((registration) => {
                        registration.sync.register('sync-habits');
                    });
                }
            }
        } catch (error) {
            console.error("Napaka pri pridobivanju navad:", error);
            setError("Napaka pri pridobivanju navad. Poskusite znova.");
        }
    };

    useEffect(() => {
        fetchHabits();
    }, [isSignedIn, isOnline]);

    const handleAddHabit = async (e) => {
        e.preventDefault();
        if (!isSignedIn) return;

        const token = await getToken();
        const formData = new FormData(e.target);
        const newHabitData = {
            name: formData.get('name'),
            category: formData.get('category'),
            frequency: formData.get('frequency'),
            goal: formData.get('goal'),
            user: userId,
        };
        const url = isEditing ? `http://localhost:4000/api/habits/${currentHabit._id}` : "http://localhost:4000/api/habits";
        const method = isEditing ? 'PUT' : 'POST';

        try {
            let response;
            if (isOnline) {
                response = await axios({
                    method: method,
                    url: url,
                    data: newHabitData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (isEditing) {
                    setHabits(habits.map((habit) => (habit._id === currentHabit._id ? response.data : habit)));
                } else {
                    setHabits([...habits, response.data]);
                }
            } else {
                await queueRequest({
                    method: method,
                    url: url,
                    body: newHabitData,
                });

                if (isEditing) {
                    setHabits(habits.map((habit) => (habit._id === currentHabit._id ? { ...habit, ...newHabitData } : habit)));
                } else {
                    const tempHabit = { ...newHabitData, _id: Date.now().toString(), createdAt: new Date() };
                    setHabits([...habits, tempHabit]);
                }

                if ('serviceWorker' in navigator && 'SyncManager' in window) {
                    navigator.serviceWorker.ready.then((registration) => {
                        registration.sync.register('sync-habits');
                    });
                }
            }

            setIsModalOpen(false);
            setIsEditing(false);
            setCurrentHabit(null);
            e.target.reset();
            setError(null);
            console.log(isEditing ? "Navada posodobljena:" : "Navada dodana:", response?.data || newHabitData);
        } catch (error) {
            console.error(isEditing ? "Napaka pri posodabljanju navade:" : "Napaka pri dodajanju navade:", error);
            setError(isEditing ? "Napaka pri posodabljanju navade. Poskusite znova." : "Napaka pri shranjevanju navade. Poskusite znova.");
        }
    };

    const handleDeleteHabit = async (habitId) => {
        if (!isSignedIn) return;

        const token = await getToken();
        const url = `http://localhost:4000/api/habits/${habitId}`;

        try {
            if (isOnline) {
                await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await queueRequest({
                    method: 'DELETE',
                    url: url,
                });

                if ('serviceWorker' in navigator && 'SyncManager' in window) {
                    navigator.serviceWorker.ready.then((registration) => {
                        registration.sync.register('sync-habits');
                    });
                }
            }

            setHabits(habits.filter((habit) => habit._id !== habitId));
            console.log("Navada izbrisana:", habitId);
            if ('Notification' in window && Notification.permission === 'granted' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification('Navada izbrisana', {
                        body: `Navada je bila uspešno izbrisana.`,
                    });
                });
            }

        } catch (error) {
            console.error("Napaka pri brisanju navade:", error);
            setError("Napaka pri brisanju navade. Poskusite znova.");
        }
    };

    const handleEditHabit = (habit) => {
        setIsEditing(true);
        setCurrentHabit(habit);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrentHabit(null);
        setError(null);
    };

    const filteredHabits = filterCategory
        ? habits.filter((habit) => habit.category === filterCategory)
        : habits;

    return (
        <div className="habit-page-wrapper">
            <div className="habit-container">
                <h2><FaListAlt className="icon" /> Moje navade {isOnline ? '' : '(Offline)'}</h2>
                <button className="add-habit-button" onClick={() => setIsModalOpen(true)}>Dodaj navado</button>

                <div className="filter-container">
                    <label htmlFor="filter-category">Filtriraj po kategoriji:</label>
                    <select
                        id="filter-category"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">Vse kategorije</option>
                        <option value="health">Zdravje</option>
                        <option value="learning">Učenje</option>
                        <option value="finance">Finance</option>
                        <option value="social">Socialno</option>
                        <option value="household">Domača opravila</option>
                        <option value="other">Drugo</option>
                    </select>
                </div>

                {filteredHabits.length === 0 ? (
                    <p>Ni navad za prikaz.</p>
                ) : (
                    <div className="habit-list">
                        {filteredHabits.map((habit) => (
                            <div key={habit._id} className="habit-card">
                                <div className="habit-card-content">
                                    <h3>{habit.name}</h3>
                                    <p><strong>Kategorija:</strong> {habit.category}</p>
                                    <p><strong>Frekvenca:</strong> {habit.frequency}</p>
                                    <p><strong>Cilj:</strong> {habit.goal}</p>
                                    <p><strong>Aktivno:</strong> {habit.active ? "Da" : "Ne"}</p>
                                    <p><strong>Ustvarjeno:</strong> {new Date(habit.createdAt).toLocaleString('sl-SI')}</p>
                                </div>
                                <div className="habit-card-buttons">
                                    <button className="edit-button" onClick={() => handleEditHabit(habit)}>Uredi</button>
                                    <button className="delete-button" onClick={() => handleDeleteHabit(habit._id)}>Izbriši</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className={`modal ${isModalOpen ? 'active' : ''}`}>
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
                        <h3 className="section-title">{isEditing ? 'Uredi navado' : 'Dodaj novo navado'}</h3>
                        <form className="modal-form" onSubmit={handleAddHabit}>
                            <label htmlFor="name">Ime:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="npr. Tek na prostem"
                                defaultValue={isEditing ? currentHabit?.name : ''}
                            />

                            <label htmlFor="category">Kategorija:</label>
                            <select id="category" name="category" required defaultValue={isEditing ? currentHabit?.category : ''}>
                                <option value="">Izberi kategorijo</option>
                                <option value="health">Zdravje</option>
                                <option value="learning">Učenje</option>
                                <option value="finance">Finance</option>
                                <option value="social">Socialno</option>
                                <option value="household">Domača opravila</option>
                                <option value="other">Drugo</option>
                            </select>

                            <label htmlFor="frequency">Frekvenca:</label>
                            <select id="frequency" name="frequency" required defaultValue={isEditing ? currentHabit?.frequency : ''}>
                                <option value="">Izberi frekvenco</option>
                                <option value="daily">Dnevno</option>
                                <option value="weekly">Tedensko</option>
                                <option value="monthly">Mesečno</option>
                            </select>

                            <label htmlFor="goal">Cilj:</label>
                            <input
                                type="text"
                                id="goal"
                                name="goal"
                                required
                                placeholder="npr. kolikokrat želiš to izvesti (število)"
                                defaultValue={isEditing ? currentHabit?.goal : ''}
                            />

                            <div className="button-container">
                                <button type="submit">{isEditing ? 'Posodobi' : 'Shrani'}</button>
                                <button type="button" className="cancel-button" onClick={handleCancel}>Prekliči</button>
                            </div>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Habit;