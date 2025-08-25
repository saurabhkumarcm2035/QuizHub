const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 1. Import mongoose
require('dotenv').config();           // 2. Load environment variables
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const resultRoutes = require('./routes/resultRoutes');



const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/api/quizzes', quizRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/results', resultRoutes);


// 3. Connect to MongoDB using the URI from our .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('Connection error', err));

app.get('/', (req, res) => {
  res.send('Hello from the QuizHub API!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});