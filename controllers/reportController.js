const Report = require('../models/Report');

// 日報作成エンドポイント
exports.createReport = async (req, res) => {
  const { workingHours, workStatus, plan, accomplishment, futurePlan } = req.body;

  // バリデーション
  if (!workingHours || !workStatus || !plan || !accomplishment || !futurePlan) {
    return res.status(400).json({ error: 'すべてのフィールドが必要です。' });
  }

  try {
    const newReport = new Report({
      user: req.user.id,  // 認証されたユーザーのIDを保存
      workingHours,
      workStatus,
      plan,
      accomplishment,
      futurePlan,
    });

    const report = await newReport.save();
    res.status(201).json(report); // レポート作成成功時は201を返す
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'サーバーエラー' }); // エラーメッセージをJSON形式で返す
  }
};

// 認証ユーザーの日報一覧取得エンドポイント
exports.getReportsByUser = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'サーバーエラー' }); // エラーメッセージをJSON形式で返す
  }
};
