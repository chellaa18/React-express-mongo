var express = require('express');
var router = express.Router();
const User = require('../model/userModel');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
});

// router.post('/', async (req, res) => {
//   try {
//     const data =  req.body; // Access form data from the request body

//     console.log("data:", data); // Log the form data to the server console

//     res.status(200).json({ message: 'Received and logged form data successfully' });
//   } catch (error) {
//     res.status(400).json({ message: 'Form data processing failed', error: error.message });
//   }
// });

module.exports = router;
