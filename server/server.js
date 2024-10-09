const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // 認証ルート

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB接続
mongoose.connect('mongodb://localhost:27017/dailyreport', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', authRoutes);

app.listen(5000, () => {
  console.log('サーバーが5000番ポートで起動しました');
});