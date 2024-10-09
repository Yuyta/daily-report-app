import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Report {
  _id: string;
  date: string;
  workStatus: string;
  workingHours: string;
  plan: string;
  accomplishment: string;
  futurePlan: string;
}

const ReportList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string>('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('/reports', {
          headers: {
            'x-auth-token': token, // 認証トークンをヘッダーに含める
          },
        });
        setReports(res.data);
      } catch (err) {
        console.error('日報の取得に失敗しました:', err);
        setError('日報の取得に失敗しました。');
      }
    };

    fetchReports();
  }, [token]);

  return (
    <div className="report-list-container">
      <h2>過去の日報一覧</h2>

      {error && <p className="error-message">{error}</p>}

      <ul>
        {reports.map((report) => (
          <li key={report._id}>
            {report.date}: {report.workStatus} ({report.workingHours})
            <br />
            今日の予定: {report.plan}
            <br />
            今日の実績: {report.accomplishment}
            <br />
            今後の計画: {report.futurePlan}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList;