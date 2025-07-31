const express = require('express');
const router = express.Router();

const { addTransaction , getTransaction , deleteTransaction } = require('../Controllers/transactionController');

router.post('/transaction', addTransaction);
router.get('/transaction', getTransaction);
router.delete('/transaction/:id', deleteTransaction);
module.exports = router;