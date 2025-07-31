const db = require('../db');

////Add Transaction

const addTransaction = (req, res) => {
  const { description, amount, type } = req.body;

  if (!description || !amount || !type) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }
  const sql = 'INSERT INTO transaction (description, amount, type) VALUES (?, ?, ?)';
  const values = [description, amount, type];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log('❌ DB Insert Error: ', err);
      return res.status(500).json({ error: 'DB error' })
    }
    res.status(201).json({ message: 'Transaction added', id: result.insertId });
  });
};

////Get Transaction

const getTransaction =(req, res) =>{
  const query = 'SELECT * FROM transaction';
  db.query(query,(err,result) =>{
    if(err){
      console.log('❌ DB Error fetching transactions:', err);
    return res.status(500).json({error:'Error fetching'});
    }
    res.status(200).json(result);
  });
};

////DELETE Transaction

const deleteTransaction =(req, res) =>{
  const {id} = req.params;   /// Extracting id from URL and using object Express gives id in object form.
  const sql = 'DELETE FROM transaction WHERE id = ?';
  const values = [id];     /// Its contain the value of id and put it in ID so we can use it in sql. 

db.query(sql,values,(err,result)=>{
if(err){
  console.log('❌ DB Delete Error:', err);
  return res.status(500).json({error:'DB Error'});
}
if(result.affectedRows === 0){
  //// result.affectedRows is the predefined is shows the number of rows that were actually changed.
  return res.status(400).json({Error:'Transaction not Found'});  
  // If no row was deleted, it means the transaction with that ID was not found.
}
return res.status(200).json({message:'Transaction Deleted Sucsuccessfully'});
});
};

module.exports = { addTransaction , getTransaction , deleteTransaction};