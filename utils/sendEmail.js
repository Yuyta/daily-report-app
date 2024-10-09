const nodemailer = require('nodemailer');

// メール送信のユーティリティ関数
const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // 例: Gmailを使用。独自ドメインのメールを使う場合は適宜変更
      auth: {
        user: process.env.EMAIL_USER, // メールアドレス（環境変数から取得）
        pass: process.env.EMAIL_PASS, // メールパスワード（環境変数から取得）
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log('メール送信に成功しました');
  } catch (error) {
    console.error('メール送信に失敗しました', error);
    throw new Error('メール送信に失敗しました');
  }
};

module.exports = sendEmail;