const express = require('express');
const router = express.Router();
const Report = require('../models/Report'); // レポートモデルのインポート

// 新規日報作成
router.post('/new', async (req, res) => {
  try {
    const { workingHours, workStatus, plan, accomplishment, futurePlan} = req.body;

    // 新しい日報オブジェクトの作成
    const newReport = new Report({
      workingHours,
      workStatus,
      plan,
      accomplishment,
      futurePlan,
    });

    // 日報を保存
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '日報の作成に失敗しました。' });
  }
});

module.exports = router;

