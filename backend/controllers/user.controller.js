const User = require('../models/User');

const getOrCreateUser = async (req, res) => {
  const { clerkId, userEmail, userName } = req;

  try {
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email: userEmail,
        name: userName,
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Napaka pri pridobivanju ali ustvarjanju uporabnika' });
  }
};

const updateUser = async (req, res) => {
  const { clerkId } = req;
  const { name } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { clerkId },
      { name },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'Uporabnik ni najden' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Napaka pri posodabljanju uporabnika' });
  }
};

const deleteUser = async (req, res) => {
  const { clerkId } = req;

  try {
    const user = await User.findOneAndDelete({ clerkId });

    if (!user) return res.status(404).json({ message: 'Uporabnik ni najden' });


    await clerkClient.users.deleteUser(clerkId);

    res.json({ message: 'Uporabnik uspešno izbrisan' });
  } catch (err) {
    res.status(500).json({ message: 'Napaka pri brisanju uporabnika' });
  }
};

const updateUserName= async (req, res) => {
  const { clerkId } = req.params;
  const { name } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(clerkId, { name }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'Uporabnik ni najden' });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Napaka pri posodabljanju uporabnika' });
  }
};

module.exports = {
  getOrCreateUser,
  updateUser,
  deleteUser,
  updateUserName,
};
