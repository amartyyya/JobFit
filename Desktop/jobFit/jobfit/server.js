const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.post('/api/match', upload.single('resume'), (req, res) => {
  if (!req.file || !req.body.jobDescription) {
    return res.status(400).json({ error: 'Missing resume or job description' });
  }

  const resumePath = req.file.path;
  const jobDescription = req.body.jobDescription;

  const pythonProcess = spawn('python', [
    path.join(__dirname, 'process_resume.py'),
    resumePath,
    jobDescription
  ]);

  let result = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python script error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Error processing resume' });
    }
    res.json(JSON.parse(result));
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

