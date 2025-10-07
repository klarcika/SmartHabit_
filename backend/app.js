const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const habitRoutes = require('./routes/habit.routes');
const achievementRoutes = require('./routes/achievement.routes');
const milestoneRoutes = require('./routes/milestone.routes');
const leaderboardRoutes = require('./routes/leaderboard');

require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 4000;

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // removed deprecated options
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Strežnik teče na ${PORT}`);
    });

  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

startServer();
