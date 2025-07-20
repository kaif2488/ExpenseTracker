const express = require('express');
const cors = require('cors');

const db = require('./db');  ///import from db.js 

const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
//MidleWare
app.use(cors());
app.use(express.json());

app.use('/api', transactionRoutes);

app.get('/', (req, res) => {
    res.send('🚀 Expense Tracker API is running!');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server started on http://localhost:${PORT}`);

});