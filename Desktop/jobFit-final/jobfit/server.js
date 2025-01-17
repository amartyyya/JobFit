
//GEMINI


const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3001;

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Endpoint to handle resume and job description processing
app.post("/api/match", upload.single("resume"), async (req, res) => {
  try {
    console.log("Received request:", req.file, req.body.jobDescription);

    if (!req.file || !req.body.jobDescription) {
      return res.status(400).json({ error: "Missing resume or job description" });
    }

    const resumePath = path.resolve(__dirname, req.file.path);
    const resumeText = fs.readFileSync(resumePath, "utf8");
    const jobDescription = req.body.jobDescription;

    console.log("Extracted Resume Text:", resumeText);

    // Prompt to send to Google Generative AI
    const prompt = `Match the following resume with this job description and provide suggestions:
    
    Resume: ${resumeText}
    
    Job Description: ${jobDescription}`;

    // Generate content using Google Generative AI
    const result = await model.generateContent([prompt]);

    console.log("Generated Result:", result.response.text());

    res.json({
      result: result.response.text(),
    });
  } catch (err) {
    console.error("Error occurred:", err.message);
    res.status(500).json({ error: "An error occurred while processing your request.", details: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
