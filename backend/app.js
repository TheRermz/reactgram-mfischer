require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

// config JSON and formData resp
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//SOLVE CORS
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

//upload directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//DB connection
const db = require("./config/db");

// routes
const router = require("./routes/Router");
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
