const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ユーザー登録の処理
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'すべてのフィールドが必要です。' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'ユーザーが既に存在します' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'アカウント作成成功' });
    
  } catch (error) {
    console.error(error); // エラーをコンソールに出力
    res.status(500).json({ error: 'アカウント作成に失敗しました' });
  }
};

// ログインの処理
exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'ユーザーが見つかりません' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'パスワードが正しくありません' });
    }

    res.status(200).json({ message: 'ログイン成功' });
    
  } catch (error) {
    console.error(error); // エラーをコンソールに出力
    res.status(500).json({ error: 'ログインに失敗しました' });
  }
};
