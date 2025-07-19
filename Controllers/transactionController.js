const db = require('../db');

const addTransaction = (req, res) => {
  const { description, amount, type } = req.body;

  if (!description || !amount || !type) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }
  const sql = 'INSERT INTO transactions (description, amount, type) VALUES (?, ?, ?)';
  const values = [description, amount, type];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log('❌ DB Insert Error: ', err);
      return res.status(500).json({ error: 'DB error' })
    }
    res.status(201).json({ message: 'Transaction added', id: result.insertId });
  });
};
module.exports = { addTransaction };