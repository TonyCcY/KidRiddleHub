const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();
const port = process.env.PORT || 3000;

// Check if MongoDB URI exists
if (!process.env.MONGODB_URI) {
    console.error('MongoDB URI is not defined');
    process.exit(1);
}

// Global connection promise
let cachedDb = null;
let cachedClient = null;

async function connectDB() {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        if (!cachedClient) {
            cachedClient = new MongoClient(process.env.MONGODB_URI);
            await cachedClient.connect();
        }
        
        cachedDb = cachedClient.db('riddleDB');
        return cachedDb;
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
}

async function loadRiddles() {
    try {
        const db = await connectDB();
        const collection = db.collection('riddles');
        return await collection.find({}).toArray();
    } catch (err) {
        console.error('Error reading riddles:', err);
        return [];
    }
}

async function saveRiddles(riddles) {
    try {
        const db = await connectDB();
        const collection = db.collection('riddles');
        await collection.deleteMany({});
        await collection.insertMany(riddles);
    } catch (err) {
        console.error('Error saving riddles:', err);
        throw err;
    }
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Add this function to handle user sessions
async function updateUserStats(sessionId) {
    try {
        const db = await connectDB();
        const collection = db.collection('stats');
        
        // Update or create total visits counter
        await collection.updateOne(
            { _id: 'visits' },
            { $inc: { count: 1 } },
            { upsert: true }
        );

        // Update active users
        const now = Date.now();
        activeUserSessions.set(sessionId, now);

        // Clean up old sessions
        for (const [sid, timestamp] of activeUserSessions) {
            if (now - timestamp > activeUserTimeout) {
                activeUserSessions.delete(sid);
            }
        }

        activeUsers = activeUserSessions.size;

        // Get total visits
        const stats = await collection.findOne({ _id: 'visits' });
        return {
            activeUsers,
            totalVisits: stats.count
        };
    } catch (err) {
        console.error('Error updating user stats:', err);
        return { activeUsers: 0, totalVisits: 0 };
    }
}

// Home route - Display mode
app.get('/', async (req, res) => {
    try {
        const sessionId = req.ip;
        const stats = await updateUserStats(sessionId);
        const riddles = await loadRiddles();
        const randomIndex = Math.floor(Math.random() * riddles.length);
        
        res.render('display', { 
            riddle: riddles[randomIndex],
            activeUsers: stats.activeUsers,
            totalVisits: stats.totalVisits
        });
    } catch (err) {
        console.error('Error in home route:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Manage mode route
app.get('/manage', async (req, res) => {
    const riddles = await loadRiddles();
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
app.post('/add-riddle', async (req, res) => {
    const riddles = await loadRiddles();  // Load current riddles
    const { question, answer } = req.body;
    
    const riddleExists = riddles.some(riddle => 
        riddle.question.toLowerCase().trim() === question.toLowerCase().trim()
    );

    if (riddleExists) {
        return res.redirect('/manage?message=Riddle already exists!');
    }

    riddles.push({ question, answer });
    await saveRiddles(riddles);  // Pass riddles array to save
    res.redirect('/manage?message=Riddle added successfully!');
});

// Delete riddle
app.delete('/delete-riddle/:index', async (req, res) => {
    const riddles = await loadRiddles();  // Load current riddles
    const page = parseInt(req.query.page) || 1;
    const index = ((page - 1) * RIDDLES_PER_PAGE) + parseInt(req.params.index);
    
    if (index >= 0 && index < riddles.length) {
        riddles.splice(index, 1);
        await saveRiddles(riddles);  // Pass riddles array to save
    }
    res.sendStatus(200);
});

// Add this new route for AJAX pagination
app.get('/api/riddles', async (req, res) => {
    const riddles = await loadRiddles();
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

// Add this function to initialize the database with riddles
async function initializeDatabase() {
    try {
        if (process.env.VERCEL && database) {
            const collection = database.collection('riddles');
            const count = await collection.countDocuments();
            
            // Only initialize if the collection is empty
            if (count === 0) {
                // Read riddles from the JSON file
                const data = fs.readFileSync(path.join(__dirname, 'riddles.json'), 'utf8');
                const riddles = JSON.parse(data);
                
                // Insert riddles into MongoDB
                await collection.insertMany(riddles);
                console.log('Database initialized with riddles');
            }
        }
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

// Add this debug route to check MongoDB contents
app.get('/debug/riddles', async (req, res) => {
    try {
        if (database) {
            const collection = database.collection('riddles');
            const count = await collection.countDocuments();
            const riddles = await collection.find({}).toArray();
            res.json({
                source: 'MongoDB',
                count: count,
                riddles: riddles
            });
        } else {
            // Fallback to file system
            const data = fs.readFileSync(riddlesFile, 'utf8');
            const riddles = JSON.parse(data);
            res.json({
                source: 'File System',
                count: riddles.length,
                riddles: riddles
            });
        }
    } catch (err) {
        res.json({
            error: err.message,
            stack: err.stack
        });
    }
});

// Add these new routes for import/export
app.get('/api/riddles/all', async (req, res) => {
    try {
        const riddles = await loadRiddles();
        res.json({ riddles });
    } catch (err) {
        res.status(500).json({ error: 'Error loading riddles' });
    }
});

app.post('/api/riddles/import', async (req, res) => {
    try {
        const { riddles } = req.body;
        
        // Validate riddles format
        if (!Array.isArray(riddles) || !riddles.every(r => r.question && r.answer)) {
            return res.status(400).json({ error: 'Invalid riddle format' });
        }
        
        // Save riddles
        await saveRiddles(riddles);
        res.json({ message: 'Riddles imported successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error importing riddles' });
    }
});

// Add this new route for random riddle API
app.get('/api/riddle/random', async (req, res) => {
    try {
        const sessionId = req.ip;
        const stats = await updateUserStats(sessionId);
        const riddles = await loadRiddles();
        const randomIndex = Math.floor(Math.random() * riddles.length);
        
        res.json({
            riddle: riddles[randomIndex],
            stats: {
                activeUsers: stats.activeUsers,
                totalVisits: stats.totalVisits
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching riddle' });
    }
});

// Export the app for Vercel
module.exports = app;

// Only start the server in development
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Riddle app listening at http://localhost:${port}`);
    });
}