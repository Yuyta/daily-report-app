const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./models/User'); // ユーザモデルをインポート
const router = express.Router();

//ユーザー登録のAPI
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // 新規ユーザの作成
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // 認証用のトークンを作成してメールで送信
    const token = jwt.sign({ id: newUser._id }, 'secret', { expiresIn: '1h' });

    // Nodemailerを使って認証メールを送信
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'メール認証',
      text: `認証コード: ${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'アカウント作成が成功しました。確認メールを送信しました。' });
  } catch (error) {
    res.status(500).json({ message: 'アカウント作成に失敗しました。' });
  }
});

//ログイン処理
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // ユーザを探す
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'ユーザが存在しません。' });
      }
  
      // パスワードを確認
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'パスワードが正しくありません。' });
      }
  
      // JWTトークンを作成
      const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'ログインに失敗しました。' });
    }
  });
module.exports = router;
