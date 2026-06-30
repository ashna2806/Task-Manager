if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const connectDB = require("./db");
const Task = require("./models/Task");
const User = require("./models/user");
const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

/* ================= AUTH ================= */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});
app.put("/api/users/me", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/* ================= TASKS ================= */

app.post("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy: req.user.userId
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

app.get("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user.userId
    });

    res.status(200).json(tasks);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

app.get("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.userId
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);

  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

/* ================= ACCOUNT ================= */

app.delete(
  "/api/auth/delete-account",
  authMiddleware,
  async (req, res) => {
    try {
      await Task.deleteMany({
        createdBy: req.user.userId
      });

      await User.findByIdAndDelete(
        req.user.userId
      );

      res.status(200).json({
        message: "Account deleted successfully"
      });

    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
