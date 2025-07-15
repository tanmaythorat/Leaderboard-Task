const User = require("../models/User");
const ClaimHistory = require("../models/ClaimHistory");

//to add points to the user
exports.claimPoints = async (req, res) => {
  try {
    const { userId } = req.body;
    const points = Math.floor(Math.random() * 10) + 1;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.totalPoints += points;
    await user.save();

    const history = new ClaimHistory({ userId, points });
    await history.save();

    res.status(200).json({ points, totalPoints: user.totalPoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//to get the users coins 
exports.getUserClaims = async (req, res) => {
  try {
    const { userId } = req.params;
    const claims = await ClaimHistory.find({ userId }).sort({ timestamp: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//to get the recent history of users that get coins
exports.getRecentClaims = async (req, res) => {
  try {
    const claims = await ClaimHistory
      .find({})
      .sort({ timestamp: -1 })
      .limit(5)
      .populate('userId', 'name'); 
    const formatted = claims.map(claim => ({
      userName: claim.userId?.name || 'Unknown',
      points: claim.points,
      claimedAt: claim.timestamp,
    }));
    res.json(formatted);
  } catch (err) {
    console.error('[ClaimHistory] Recent fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch recent claims' });
  }
};
