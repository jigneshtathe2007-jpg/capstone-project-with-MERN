const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/convert", upload.single("file"), (req, res) => {

  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  const filePath = req.file.path;

  const outputDir = "converted";

  const format = req.body.format || "pdf";

  const command = `soffice --headless --convert-to ${format} "${filePath}" --outdir ${outputDir}`;

  exec(command, (error, stdout, stderr) => {

    if (error) {
      console.error(error);
      return res.status(500).send("Conversion failed");
    }

    const files = fs.readdirSync(outputDir);

    const latestFile = files
      .map(name => ({
        name,
        time: fs.statSync(path.join(outputDir, name)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time)[0].name;

    const fileLocation = path.join(outputDir, latestFile);

    res.download(fileLocation);

  });

});

module.exports = router;