require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
console.log(process.env.MONGODB_URI); // ここでURIを確認
const app = express();
app.use(bodyParser.json());
app.use(cors());

// JSONデータをパースするためのミドルウェア
app.use(express.json());

// MongoDB接続
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// ルーティング
//app.use('/api', authRoutes);
// ルート設定...
app.use('/api', require('./routes/authRoutes'));
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
