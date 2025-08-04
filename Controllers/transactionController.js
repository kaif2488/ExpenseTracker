const db = require('../db');

////Add Transaction

const addTransaction = (req, res) => {
  const { description, amount, type } = req.body; /// req.body contains 3 variables

  if (!description || !amount || !type) {
    return res.status(400).json({ error: 'Please fill all fields' });  /// Check if all the 3 variable filled
  }
  const sql = 'INSERT INTO transaction (description, amount, type) VALUES (?, ?, ?)';  /// insert into table
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

const getTransaction = (req, res) => {
 
  const { type } = req.query; // This will be 'income', 'expense', or undefined   (query parameter)

  // 2. Start with a base SQL query to select all transactions
  let sql = 'SELECT id, description, amount, type, create_at FROM transaction'; // Your table name is 'transaction' (singular)
  let values = []; // This array will hold values for SQL placeholders (e.g., for 'type')

  // 3. Conditionally add a WHERE clause if a valid 'type' filter is provided
  if (type === 'income' || type === 'expense') {
    sql += ' WHERE type = ?'; // Append WHERE clause to the SQL string
    values.push(type); // Add the type value to the 'values' array for the placeholder
  }

  // 4. Always order by creation date (newest first)
  sql += ' ORDER BY create_at DESC';

  // 5. Execute the SQL query with the dynamically built 'sql' string and 'values' array
  db.query(sql, values, (err, results) => { // Pass the 'values' array to db.query
    if (err) {
      console.error('❌ DB Error fetching transactions:', err);
      return res.status(500).json({ error: 'Error fetching' });
    }
    // 6. Send the fetched transactions as a JSON response
    res.status(200).json(results);
  });
};

////DELETE Transaction

const deleteTransaction =(req, res) =>{
  const {id} = req.params;   /// Extracting id from URL and Express gives id in object form.
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