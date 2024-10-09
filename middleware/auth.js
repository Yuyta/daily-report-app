const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // リクエストヘッダーからトークンを取得
  const token = req.header('x-auth-token');

  // トークンがない場合、認証エラー
  if (!token) {
    return res.status(401).json({ msg: '認証が必要です' });
  }

  try {
    // トークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
    req.user = decoded.user; // ユーザー情報をリクエストに追加
    next();
  } catch (err) {
    res.status(401).json({ msg: '無効なトークンです' });
  }
};
