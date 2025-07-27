const express = require('express');
const router = express.Router();

const { addTransaction , getTransaction } = require('../Controllers/transactionController');

router.post('/Transaction', addTransaction);
router.get('/Transaction', getTransaction);
module.exports = router;