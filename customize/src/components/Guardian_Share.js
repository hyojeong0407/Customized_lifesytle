import { useState, useEffect } from 'react';
import './Guardian_Share.css';

const Guardian_Share = ({ onClose, selectedUser }) => {
  const nickname = selectedUser?.nickname || '홍길동';

  const [heart, setHeart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //  FastAPI에서 최신 심박수 가져오기
  useEffect(() => {
    if (!selectedUser?.nickname) return;

    const fetchHeartRate = async () => {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        //const end = now.toISOString().slice(0, 19);
        const end = '2025-10-11T16:15:00' // 테스트용 날짜
        const startObj = new Date(now.getTime() - 15 * 60 * 1000); // 15분 전
        //const start = startObj.toISOString().slice(0, 19);
        const start = '2025-10-11T16:00:00' // 테스트용 날짜
        const url = `https://capstone-lozi.onrender.com/v1/data/me?type=heart_rate&start_date=${start}&end_date=${end}`;

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-DEVICE-TOKEN': selectedUser.uid, // uid 사용
          },
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const json = await res.json();

        if (!json.data || json.data.length === 0) {
          setHeart(null);
          return;
        }

        // id 기준으로 최신 데이터 찾기
        const latest = json.data.reduce((a, b) => (a.id > b.id ? a : b));

        console.log("최신 심박수:", latest.bpm, "id:", latest.id);

        setHeart(latest.bpm);
      } catch (err) {
        console.error("심박수 불러오기 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHeartRate();
  }, [selectedUser]);

  //  심박수에 따른 위험 레벨 계산
  let level = 'none';
  if (heart !== null) {
    if (heart >= 55 && heart <= 100) level = 'health';
    else if ((heart >= 45 && heart < 55) || (heart > 100 && heart <= 130)) level = 'warn';
    else level = 'danger';
  }

  return (
    <div className='guardian-container'>
      <button className='guardian-close' onClick={() => onClose()}>
        닫기
      </button>

      <aside className='profile'>
        <div className='avatar'>👤</div>
      </aside>

      <main className='health-summary'>
        <h3>● {nickname}님의 최근 건강상태</h3>
      </main>

      <aside className='health-alerts'>
        <h3>● 현재 건강 알림</h3>

        <div className={`alert-item ${level !== 'health' ? 'hide-alert' : ''}`}>
          <div className="icon-heart">💚</div>
          <div className="heart-label">건강</div>
        </div>

        <div className={`alert-item ${level !== 'warn' ? 'hide-alert' : ''}`}>
          <div className="icon-warn">⚠️</div>
          <div className="warn-label">주의</div>
        </div>

        <div className={`alert-item ${level !== 'danger' ? 'hide-alert' : ''}`}>
          <div className="icon-danger">🚨</div>
          <div className="danger-label">위험</div>
        </div>
      </aside>

      <section className='med-status'>
        <h3>복약 상태</h3>
      </section>
    </div>
  );
};

export default Guardian_Share;
