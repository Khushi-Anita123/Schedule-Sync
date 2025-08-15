const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = process.env.JWT_SECRET || "1234567890qwertyuiopasdfghjk";

// ---------------- GET TIMETABLE BY EMAIL (Admin use) ----------------
const getTimetableByEmail = async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const teacher = await User.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher.timetable || []);
  } catch (error) {
    console.error("Error in /timetable route:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------- SIGNUP ----------------
const Signup = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already exists" });

    const newUser = new User({ username, email, password, role });
    await newUser.save();

    res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LOGIN ----------------
const Login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ username, email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    // Check existing token
    if (user.currentToken) {
      try {
        jwt.verify(user.currentToken, SECRET_KEY);
        return res.status(403).json({ message: "User already logged in in another tab" });
      } catch (err) {
        // Expired token - clean up
        user.currentToken = null;
        await user.save();
      }
    }

    const token = jwt.sign(
      { username: user.username, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    user.currentToken = token;
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LOGOUT ----------------
const Logout = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(400).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ username: decoded.username });

    if (user && user.currentToken === token) {
      user.currentToken = null;
      await user.save();
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    // Handle expired tokens gracefully
    const decoded = jwt.decode(token);
    if (decoded?.username) {
      const user = await User.findOne({ username: decoded.username });
      if (user && user.currentToken === token) {
        user.currentToken = null;
        await user.save();
      }
    }
    res.status(200).json({ message: "Logout completed (token invalid or expired)" });
  }
};

// ---------------- ADD LECTURE ----------------
const lecture = async (req, res) => {
  const { email, timetable } = req.body;

  try {
    const teacher = await User.findOne({ email, role: "Teacher" });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.timetable.push(...timetable);
    await teacher.save();

    res.json({ message: "Lecture added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding lecture" });
  }
};

// ---------------- TEACHER'S OWN TIMETABLE ----------------
const getMyTimetable = async (req, res) => {
  try {
     console.log("User from token:", req.user);
    const email = req.user.email;
    const teacher = await User.findOne({ email, role: "Teacher" });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json(teacher.timetable || []);
  } catch (err) {
    console.error("Error fetching my timetable:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------- GET ALL TEACHERS ----------------
const teachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }, 'username email');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  Signup,
  Login,
  Logout,
  lecture,
  getTimetableByEmail,
  getMyTimetable,
  teachers
};
