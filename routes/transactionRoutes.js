const express = require('express');
const router = express.Router();

const { addTransaction } = require('../Controllers/transactionController');

router.post('/Transaction', addTransaction);
module.exports = router;