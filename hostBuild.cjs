const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
    console.log('hit');
    res.setHeader('Content-Type', 'javascript');
    res.sendFile(path.join(__dirname, 'dist', 'ytmplus.user.js'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});