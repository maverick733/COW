const express = require('express');
const app = express();
const xlsx = require('xlsx');
const cors = require('cors');
const path = require('path');

app.use(cors());
app.use(express.static('public'));

// Endpoint to get prices
app.get('/api/prices', (req, res) => {
    try {
        const workbook = xlsx.readFile(path.join(__dirname, 'price.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error reading Excel file' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
