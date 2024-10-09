const express = require('express');
const router = express.Router();
const { createReport, getReportsByUser } = require('../controllers/reportController');
const auth = require('../middleware/auth');

// 認証済みユーザーの日報作成
router.post('/reports/new', auth, createReport); // エンドポイントを修正

// 認証済みユーザーの日報一覧を取得
router.get('/reports/user', auth, getReportsByUser); // エンドポイントを修正

module.exports = router;
