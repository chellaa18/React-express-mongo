const mongoose = require('mongoose');

// Replace 'your_database_url' with the actual connection URL for your MongoDB database.
const dbURL = 'mongodb://localhost:27017/users';

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Handling connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the database.');
});
