const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for session management (if needed)
app.use(session({
    secret: 'your_secret_key', // Change this to a secure random string
    resave: false,
    saveUninitialized: true
}));

// Alerts management (for admin)
let alertMessage = null;

// Route to handle root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// POST route to handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Here you would typically validate username and password
    // For demonstration purposes, let's assume a simple check
    if (username === 'admin' && password === '1234') {
        req.session.username = username; // Store username in session
        res.redirect('/home.html'); // Redirect to home page after login
    } else {
        res.redirect('/notlogged.html'); // Redirect to not logged in page
    }
});

// Route to handle other pages
app.get('/home.html', (req, res) => {
    // Check if user is logged in here if needed
    if (!req.session.username) {
        return res.redirect('/notlogged.html');
    }

    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/profile.html', (req, res) => {
    // Check if user is logged in here if needed
    if (!req.session.username) {
        return res.redirect('/notlogged.html');
    }

    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/messages.html', (req, res) => {
    // Check if user is logged in here if needed
    if (!req.session.username) {
        return res.redirect('/notlogged.html');
    }

    res.sendFile(path.join(__dirname, 'public', 'messages.html'));
});

app.get('/blog.html', (req, res) => {
    // Check if user is logged in here if needed
    if (!req.session.username) {
        return res.redirect('/notlogged.html');
    }

    res.sendFile(path.join(__dirname, 'public', 'blog.html'));
});

// Route to handle not logged in page
app.get('/notlogged.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notlogged.html'));
});

// Route to handle alert management (only accessible by admin)
app.get('/adminpanel.html', (req, res) => {
    // Check if user is logged in and is admin here if needed
    if (!req.session.username || req.session.username !== 'admin') {
        return res.status(403).send('Access Forbidden');
    }

    // Display admin panel with options to manage alerts
    let adminPanelHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Panel</title>
        </head>
        <body>
            <h1>Welcome, Admin!</h1>
            <h2>Current Alert Message:</h2>
            <div>${alertMessage ? alertMessage : 'No alert currently set.'}</div>
            <h2>Change Alert Message:</h2>
            <form action="/admin/setAlert" method="post">
                <input type="text" name="alertMessage" placeholder="Enter new alert message">
                <button type="submit">Set Alert</button>
            </form>
        </body>
        </html>
    `;

    res.send(adminPanelHTML);
});

// Route to handle setting alert message (only accessible by admin)
app.post('/admin/setAlert', (req, res) => {
    // Check if user is logged in and is admin here if needed
    if (!req.session.username || req.session.username !== 'admin') {
        return res.status(403).send('Access Forbidden');
    }

    const { alertMessage: newAlertMessage } = req.body;
    alertMessage = newAlertMessage;
    res.redirect('/adminpanel.html');
});

// Route to handle unknown requests (404 Not Found)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
