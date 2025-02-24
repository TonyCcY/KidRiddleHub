const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Path to the JSON file
const riddlesFile = path.join(__dirname, 'riddles.json');

// Read riddles from JSON file
let riddles = [];
const RIDDLES_PER_PAGE = 10; // Number of riddles to show per page

function loadRiddles() {
    try {
        const data = fs.readFileSync(riddlesFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading riddles:', err);
        return [];
    }
}

function saveRiddles(riddles) {
    try {
        fs.writeFileSync(riddlesFile, JSON.stringify(riddles, null, 4));
    } catch (err) {
        console.error('Error saving riddles:', err);
    }
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Home route - Display mode
app.get('/', (req, res) => {
    const riddles = loadRiddles();  // Load riddles on each request
    const randomIndex = Math.floor(Math.random() * riddles.length);
    res.render('display', { riddle: riddles[randomIndex] });
});

// Manage mode route
app.get('/manage', (req, res) => {
    const riddles = loadRiddles();  // Load riddles on each request
    const page = parseInt(req.query.page) || 1;
    const totalPages = Math.ceil(riddles.length / RIDDLES_PER_PAGE);
    const startIndex = (page - 1) * RIDDLES_PER_PAGE;
    const paginatedRiddles = riddles.slice(startIndex, startIndex + RIDDLES_PER_PAGE);
    
    res.render('manage', { 
        riddles: paginatedRiddles,
        currentPage: page,
        totalPages: totalPages,
        message: req.query.message,
        RIDDLES_PER_PAGE: RIDDLES_PER_PAGE
    });
});

// Add new riddle
app.post('/add-riddle', (req, res) => {
    const riddles = loadRiddles();  // Load current riddles
    const { question, answer } = req.body;
    
    const riddleExists = riddles.some(riddle => 
        riddle.question.toLowerCase().trim() === question.toLowerCase().trim()
    );

    if (riddleExists) {
        return res.redirect('/manage?message=Riddle already exists!');
    }

    riddles.push({ question, answer });
    saveRiddles(riddles);  // Pass riddles array to save
    res.redirect('/manage?message=Riddle added successfully!');
});

// Delete riddle
app.delete('/delete-riddle/:index', (req, res) => {
    const riddles = loadRiddles();  // Load current riddles
    const page = parseInt(req.query.page) || 1;
    const index = ((page - 1) * RIDDLES_PER_PAGE) + parseInt(req.params.index);
    
    if (index >= 0 && index < riddles.length) {
        riddles.splice(index, 1);
        saveRiddles(riddles);  // Pass riddles array to save
    }
    res.sendStatus(200);
});

// Add this new route for AJAX pagination
app.get('/api/riddles', (req, res) => {
    const riddles = loadRiddles();
    const page = parseInt(req.query.page) || 1;
    const totalPages = Math.ceil(riddles.length / RIDDLES_PER_PAGE);
    const startIndex = (page - 1) * RIDDLES_PER_PAGE;
    const paginatedRiddles = riddles.slice(startIndex, startIndex + RIDDLES_PER_PAGE);
    
    res.json({
        riddles: paginatedRiddles,
        currentPage: page,
        totalPages: totalPages
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Riddle app listening at http://localhost:${port}`);
});