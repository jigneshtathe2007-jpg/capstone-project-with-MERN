console.log("Server file started");

const express = require("express");
const cors = require("cors");
const converterRoutes = require("./routes/converter.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", converterRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(5000, () => {
    console.log("Converter server running on port 5000");
});