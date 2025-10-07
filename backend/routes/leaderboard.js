const express = require('express');
const router = express.Router();
const Milestone = require('../models/Milestone');


router.get('/milestone', async (req, res) => {
  try {
    const data = await Milestone.aggregate([
      {
        $match: {
          type: { $in: ['full', 'half'] } 
        }
      },
      {
        $group: {
          _id: "$user",
          points: {
            $sum: {
              $cond: [
                { $eq: ["$type", "full"] }, 2, 1 
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",            
          localField: "_id",          
          foreignField: "clerkId",    
          as: "userData"
        }
      },
      {
        $unwind: "$userData"
      },
      {
        $project: {
          name: "$userData.name",
          email: "$userData.email",
          points: 1
        }
      },
      {
        $sort: { points: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json(data);
  } catch (error) {
    console.error("Napaka pri milestone leaderboardu:", error);
    res.status(500).json({ message: "Napaka pri milestone leaderboardu." });
  }
});

module.exports = router;
