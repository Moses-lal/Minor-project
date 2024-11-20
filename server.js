
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());  // Allows cross-origin requests from frontend
app.use(express.json());  // To parse incoming JSON data

// Sample dataset of grocery items (stored as JSON)
const groceryItems = [
    { id: 1, name: 'Rice', price: 50 },
    { id: 2, name: 'Sugar', price: 40 },
    { id: 3, name: 'Wheat', price: 60 },
    { id: 4, name: 'Milk', price: 30 },
    { id: 5, name: 'Eggs', price: 5 },
    { id: 6, name: 'coffee', price: 35 },
    { id: 7, name: 'biscuit', price: 40 },  
];

// Endpoint to get grocery items
app.get('/api/grocery-items', (req, res) => {
    res.json(groceryItems);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});