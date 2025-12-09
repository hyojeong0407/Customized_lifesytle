import { useState, useEffect } from 'react';
import axios from 'axios';          // ✅ axios 추가
import './Guardian_Share.css';

// 🟢 알약 목록 조회
async function getPillList(uid) {
  const res = await axios.get(
    `https://capstone-lozi.onrender.com/v1/ingest/pill_list?uid=${uid}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer capstone_token_0905',   // ✅ Bearer 붙이기
      },
    }
  );
  // res.data 는 네가 보여준 배열 그대로:
  // [{ id, image_path, pill_name, appearance, main_usage, ... }]
  return res.data;
}

// 🔴 알약 삭제
async function deletePill(id) {
  const res = await axios.delete(
    `https://capstone-lozi.onrender.com/v1/ingest/pill/${id}`,
    {
      headers: {
        Authorization: 'Bearer capstone_token_0905',   // ✅ 동일
      },
    }
  );
  return res.data;
}


const Guardian_Share = ({ onClose, selectedUser }) => {
  const nickname = selectedUser?.nickname || '홍길동';

  const [heart, setHeart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 금일 요약 데이터 (me-summary)
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // 🔹 복약(알약) 리스트
  const [pillList, setPillList] = useState([]);
  const [pillLoading, setPillLoading] = useState(false);
  const [pillError, setPillError] = useState(null);

  /** 🟩 알약 목록 불러오기 (PillHistoryList의 loadList와 같은 역할) */
  const loadPillList = async (uid) => {
    if (!uid) return;
    try {
      setPillLoading(true);
      setPillError(null);

      const data = await getPillList(uid);

      // 아침/점심/저녁 체크 상태를 위한 필드 추가
      const withFlags = (data || []).map((p) => ({
        ...p,
        morning: false,
        noon: false,
        night: false,
      }));

      setPillList(withFlags);
    } catch (err) {
      console.error('복약 리스트 불러오기 실패:', err);
      setPillError(err.message);
    } finally {
      setPillLoading(false);
    }
  };

  /** 🔴 삭제 버튼 클릭 시 */
  const deleteItem = async (id) => {
    if (!window.confirm('이 복약 기록을 삭제하시겠습니까?')) return;
    try {
      await deletePill(id);
      // 예시와 동일하게: 삭제 후 리스트 새로고침
      await loadPillList(selectedUser?.uid);
    } catch (err) {
      console.error('복약 기록 삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  //  FastAPI에서 최신 심박수 + 요약 + 복약정보 가져오기
  useEffect(() => {
    if (!selectedUser?.uid) return;

    const fetchHeartRate = async () => {
      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const end = '2025-10-11T16:15:00'; // 테스트용
        const startObj = new Date(now.getTime() - 15 * 60 * 1000);
        const start = '2025-10-11T16:00:00'; // 테스트용

        const url = `https://capstone-lozi.onrender.com/v1/data/me?type=heart_rate&start_date=${start}&end_date=${end}`;

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-DEVICE-TOKEN': selectedUser.uid,
          },
        });

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const json = await res.json();

        if (!json.data || json.data.length === 0) {
          setHeart(null);
          return;
        }

        const latest = json.data.reduce((a, b) => (a.id > b.id ? a : b));
        console.log('최신 심박수:', latest.bpm, 'id:', latest.id);
        setHeart(latest.bpm);
      } catch (err) {
        console.error('심박수 불러오기 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        // const dateStr = `${year}-${month}-${day}`;
        const dateStr = '2025-11-10'; // 테스트용

        const url = `https://capstone-lozi.onrender.com/v1/data/me-summary?start_date=${dateStr}&end_date=${dateStr}`;

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-DEVICE-TOKEN': selectedUser.uid,
          },
        });

        if (!res.ok) throw new Error(`Summary API Error: ${res.status}`);

        const json = await res.json();
        if (!json.summary || json.summary.length === 0) {
          setSummary(null);
          return;
        }

        const todaySummary = json.summary[0];
        console.log('오늘 요약 데이터:', todaySummary);
        setSummary(todaySummary);
      } catch (err) {
        console.error('요약 데이터 불러오기 실패:', err);
        setSummaryError(err.message);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchHeartRate();
    fetchSummary();
    loadPillList(selectedUser.uid);   // ✅ PillHistoryList.loadList()와 같은 타이밍
  }, [selectedUser]);

  //  심박수에 따른 위험 레벨 계산
  let level = 'none';
  if (heart !== null) {
    if (heart >= 55 && heart <= 100) level = 'health';
    else if ((heart >= 45 && heart < 55) || (heart > 100 && heart <= 130))
      level = 'warn';
    else level = 'danger';
  }

  // 아침/점심/저녁 토글
  const toggleDose = (id, field) => {
    setPillList((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: !p[field] } : p
      )
    );
  };

  return (
    <div className='guardian-container'>
      <button className='guardian-close' onClick={() => onClose()}>
        닫기
      </button>

      <aside className='profile'>
        <div className='avatar'>👤</div>
      </aside>

      {/* ▶ 기존 건강 상태 요약 영역 그대로 */}
      <main className='health-summary'>
        <h3>● {nickname}님의 최근 건강상태</h3>

        {summaryLoading ? (
          <p className='summary-text'>오늘 데이터 불러오는 중...</p>
        ) : summaryError ? (
          <p className='summary-text error'>
            요약 데이터를 불러오지 못했습니다.
          </p>
        ) : summary ? (
          <div className='summary-text'>
            <p>📊 오늘 걸음 수: {summary.steps?.toLocaleString()} 보</p>
            <p>🫀 평균 심박수: {summary.avg_heart_rate} bpm</p>
            <p>😴 수면 시간: {summary.sleep_minutes} 분</p>
            <p>🔥 소모 칼로리: {summary.calories_kcal} kcal</p>
          </div>
        ) : (
          <p className='summary-text'>
            오늘 기록된 건강 데이터가 없습니다.
          </p>
        )}
      </main>

      {/* ▶ 기존 건강 알림 영역 그대로 */}
      <aside className='health-alerts'>
        <h3>● 현재 건강 알림</h3>

        <div className={`alert-item ${level !== 'health' ? 'hide-alert' : ''}`}>
          <div className='icon-heart'>💚</div>
          <div className='heart-label'>건강</div>
        </div>

        <div className={`alert-item ${level !== 'warn' ? 'hide-alert' : ''}`}>
          <div className='icon-warn'>⚠️</div>
          <div className='warn-label'>주의</div>
        </div>

        <div className={`alert-item ${level !== 'danger' ? 'hide-alert' : ''}`}>
          <div className='icon-danger'>🚨</div>
          <div className='danger-label'>위험</div>
        </div>
      </aside>

      {/* ▶ 복약 상태 (여기에 PillHistoryList 기능 이식) */}
       <section className='med-status'>
        <h3>● 복약 상태</h3>

        {pillLoading ? (
          <p className='summary-text'>복약 정보를 불러오는 중...</p>
        ) : pillError ? (
          <p className='summary-text error'>
            복약 정보를 불러오지 못했습니다.
          </p>
        ) : pillList.length === 0 ? (
          <p className='summary-text'>등록된 복약 정보가 없습니다.</p>
        ) : (
          <div className='pill-table'>
            {/* 🔹 이미지 컬럼 제거한 헤더 */}
            <div className='pill-header-row'>
              <span>약 이름</span>
              <span>아침</span>
              <span>점심</span>
              <span>저녁</span>
              <span> </span> {/* 삭제 버튼 자리 */}
            </div>

            {/* 🔹 각 알약 행 (이미지 없는 버전) */}
            {pillList.map((p) => (
              <div className='pill-row' key={p.id}>
                {/* 약 이름 */}
                <span className='pill-name'>{p.pill_name}</span>

                {/* 아침 / 점심 / 저녁 토글 */}
                <button
                  type='button'
                  className={`dose-toggle ${p.morning ? 'on' : 'off'}`}
                  onClick={() => toggleDose(p.id, 'morning')}
                >
                  {p.morning ? '✅' : '❌'}
                </button>

                <button
                  type='button'
                  className={`dose-toggle ${p.noon ? 'on' : 'off'}`}
                  onClick={() => toggleDose(p.id, 'noon')}
                >
                  {p.noon ? '✅' : '❌'}
                </button>

                <button
                  type='button'
                  className={`dose-toggle ${p.night ? 'on' : 'off'}`}
                  onClick={() => toggleDose(p.id, 'night')}
                >
                  {p.night ? '✅' : '❌'}
                </button>

                {/* 삭제 버튼 */}
                <button
                  type='button'
                  className='pill-delete-btn'
                  onClick={() => deleteItem(p.id)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Guardian_Share;
