require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { extractTextFromPDF } = require('./utils/pdfExtract');
const { generateExtraction } = require('./ai_client');

const upload = multer({ dest: path.join(__dirname, 'uploads/') });
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

const PORT = process.env.PORT || 4000;
 


app.get('/', (req, res) => {
  res.send(`<p>Server running on port ${PORT}</p>`);
});

const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendPath, { index: false }));
app.post('/api/upload', upload.single('document'), async (req, res) => {
  try {
    console.log('Upload request received');
    const { question } = req.body;
    const file = req.file;
    console.log('File:', file ? file.originalname : 'No file');
    console.log('Question:', question);
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    let extractedText = '';
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf') {
      const data = fs.readFileSync(file.path);
      extractedText = await extractTextFromPDF(data);
    } else if (ext === '.txt') {
      extractedText = fs.readFileSync(file.path, 'utf8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    let extractionJson;
    if (process.env.TEST_MODE === 'true') {
      extractionJson = { mock: true, question, snippet: extractedText.slice(0, 200) };
    } else {
      extractionJson = await generateExtraction(extractedText, question);
    }

    // clean up uploaded file
    fs.unlinkSync(file.path);

    res.json({ extractedText, extractionJson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Processing error' });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});


