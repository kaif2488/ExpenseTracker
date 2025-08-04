const bcrypt =require('bcryptjs');  /// import the Library
const jwt = require('jsonwebtoken');
const db = require('../db');

const SignUp = async (req , res) =>{
  const {username ,Password} = req.body /// contains username and Password
  if (!username || !Password){
    return res.status(400).json({error: "please provide a username and Password"});
  }
  try {
    ///Hash the Password
    const salt = await bcrypt.genSalt(10);     ///A salt is a random string that gets added to the password before hashing.
    const hashedPassword = await bcrypt.hash(Password, salt); // takes the user normal password and salt and hash the Password.

    const sql = 'INSERT INTO users (username,Password) VALUES (?,?)';
    const value = [username,hashedPassword]; 

    db.query(sql , value ,(err ,result) => {
      if (err){
        console.log('❌ DB Signup Error:', err);
        ////If you try to insert a username that already exists (and there's a UNIQUE constraint on it), the MySQL server will throw an error
        ///and if error is same ER_DUP_ENTRY then its confirm that its error for same username.
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({error:"Username already exists",err});
        }
        return res.status(500).json({error:"DB Error during Signup"});
      }

      const payload = {
        user : {
          id: result.insertId,
          username : username
        }
      };
      const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:'1h'});
      res.status(201).json({message: 'User registered successfully', token});
    });
  } catch (err){
     console.error('❌ Signup Process Error:', err);
    res.status(500).json({ error: 'Server error during signup process' });
  }
};

// login

const login = async (req, res) => { // Made async to use await for bcrypt.compare
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide a username and password' });
  }

  // Find the user in the database by username
  const sql = 'SELECT * FROM users WHERE username = ?'; // Select from 'users' table
  db.query(sql, [username], async (err, results) => { // Make callback async to use await inside
    if (err) {
      console.error('❌ DB Login Error:', err);
      return res.status(500).json({ error: 'DB error during login' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' }); // 401 Unauthorized (username not found)
    }

    const user = results[0]; // Get the first user found (should be only one due to UNIQUE constraint)

    try {
      // 1. Compare the provided plain password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password); // Await bcrypt.compare

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' }); // 401 Unauthorized (password mismatch)
      }

      // 2. Generate a JWT upon successful login
      const payload = {
        user: {
          id: user.id,
          username: user.username
        }
      };

      // Sign the token with your secret key and set an expiration time
      // IMPORTANT: Replace 'YOUR_SECRET_KEY_FROM_ENV' with process.env.JWT_SECRET
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

      res.status(200).json({ message: 'Login successful', token }); // 200 OK
    } catch (err) {
      console.error('❌ Login Process Error:', err);
      res.status(500).json({ error: 'Server error during login process' });
    }
  });
};

module.exports = { signup, login };
