require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const reportRoutes = require('./routes/reportRoutes'); // ルートのインポート
console.log(process.env.MONGODB_URI); // ここでURIを確認
const app = express();
const PORT = 5000;
app.use(bodyParser.json());
app.use(cors()); //corsの有効化

// JSONデータをパースするためのミドルウェア
app.use(express.json());// JSONのパース

// MongoDB接続
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// ルーティング
//app.use('/api', authRoutes);
// Routes
app.use('/reports', reportRoutes); // reports用のルート
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
