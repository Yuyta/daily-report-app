const express = require('express');
const { registerUser, login } = require('../controllers/authController'); // コントローラーから関数をインポート

const router = express.Router();

// ユーザー登録のルート
router.post('/register', registerUser); // registerUser が正しくインポートされているか確認
// ログインのルート
router.post('/login', login); // login が正しくインポートされているか確認

module.exports = router;