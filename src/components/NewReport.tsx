import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NewReport.css';

const NewReport = () => {
  const [workingHours, setWorkingHours] = useState('');
  const [workStatus, setWorkStatus] = useState('出社');
  const [plan, setPlan] = useState('');
  const [accomplishment, setAccomplishment] = useState('');
  const [futurePlan, setFuturePlan] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // フォーム送信時にAPIリクエストを送る関数
  const submitReport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // デフォルトのフォーム動作をキャンセル
    setError(''); // エラーメッセージをクリア

    //全項目が入力されているかをチェック
    if (!workingHours || !plan || !accomplishment || !futurePlan) {
      setError('すべてのフィールドを記入してください。');
      return;
    }

    const reportData = {
      workingHours,
      workStatus,
      plan,
      accomplishment,
      futurePlan,
    };

    try {
      const res = await axios.post('/reports/new', reportData, {
        headers: {
          'x-auth-token': token, // 認証トークンをヘッダーに含める
        },
      });

      console.log('日報が作成されました:', res.data);
      navigate('/calendar'); // 日報作成後にカレンダーページにリダイレクト
    } catch (err) {
      console.error('日報作成中にエラーが発生しました:', err);
      setError('日報の作成に失敗しました。再度お試しください。');
    }
  };

  //一時保存ボタンの処理
  const tempSaveReport = async () => {
    const reportData = {
      workingHours,
      workStatus,
      plan,
      accomplishment,
      futurePlan,
    };

    try{
      const res = await axios.post('/reports/temp-save', reportData, {
        headers:{
          'x-auth-token': token, //認証トークンをヘッダーに含める
        },
      });

      console.log('日報が一時保存されました:', res.data);
      navigate('/calendar'); //一時保存後にカレンダーページにリダイレクト
    } catch (err) {
      console.error('日報の一時保存中にエラーが発生しました:', err);
      setError('日報の一時保存に失敗しました。再度お試しください。');
    }
  };

  return (
    <div className="report-container">
      <h2>日報の作成</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={submitReport} className='report-form'>
        <div className="form-group">
          <label htmlFor="workingHours">勤務時間</label>
          <input
            type="text"
            id="workingHours"
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            placeholder="例: 8:00-19:00"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="workStatus">勤務状況</label>
          <select
            id="workStatus"
            value={workStatus}
            onChange={(e) => setWorkStatus(e.target.value)}
          >
            <option value="出社">出社</option>
            <option value="在宅">在宅</option>
            <option value="出張">出張</option>
            <option value="休暇">休暇</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="plan">今日の予定</label>
          <textarea
            id="plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            placeholder="今日の予定を入力"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="accomplishment">今日の実績</label>
          <textarea
            id="accomplishment"
            value={accomplishment}
            onChange={(e) => setAccomplishment(e.target.value)}
            placeholder="今日の実績を入力"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="futurePlan">今後の計画</label>
          <textarea
            id="futurePlan"
            value={futurePlan}
            onChange={(e) => setFuturePlan(e.target.value)}
            placeholder="今後の計画を入力"
            required
          ></textarea>
        </div>
        <div className="button-container">
        <button type="submit" className="submit-button">日報を登録</button>
        <button type="button" onClick={tempSaveReport} className="temp-save-button">一時保存</button>
        <button onClick={() => navigate('/top')} className="return-button">戻る</button>
        </div>
        
      </form>
    </div>
  );
};//日報の一時保存ボタンと戻るボタン欲しい、登録は終業時に本登録として使う(全て入力欄が埋まった時のみ押せるようにする？)

export default NewReport;
