// React의 useState, useEffect 훅 불러오기
import { useState, useEffect } from 'react';
// 스타일 파일 불러오기
import './App.css';
// 이미지 파일 불러오기
import deepStreamImage from './Deep_Stream.png';

// 각 화면(컴포넌트) 불러오기
import HealthFeedback from './components/HealthFeedback';
import Medication from './components/Medication';
import CheckData from './components/CheckData';
import Checkfig from './components/Checkfig';
import MediInfo from './components/MediInfo';
import GetFeedback from './components/GetFeedback';
import Guardian_Share from './components/Guardian_Share';

function App() {
  // 현재 보여줄 화면 상태
  const [view, setView] = useState('menu');

  // ✅ 심박수 상태값
  const [hrDec4, setHrDec4] = useState(null);
  const [hrNov28, setHrNov28] = useState(null);

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06"; // FCM 토큰
  const type = "heartrate";

  // 특정 날짜 심박수 가져오기 함수
  const fetchHeartRate = async (date, setter) => {
    try {
      const res = await fetch(
        `https://capstone-lozi.onrender.com/v1/data/me?type=${type}&start_date=${date}&end_date=${date}`,
        {
          method: "GET",
          headers: { "X-DEVICE-TOKEN": fcmToken },
        }
      );
      const result = await res.json();
      if (result && result.data && result.data.length > 0) {
        setter(result.data[0].count || 0);
      } else {
        setter(null); // 데이터 없으면 null
      }
    } catch (err) {
      console.error("심박수 불러오기 에러:", err);
      setter(null);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 심박수 데이터 가져오기
  useEffect(() => {
    fetchHeartRate("2025-12-04", setHrDec4);
    fetchHeartRate("2025-11-28", setHrNov28);
  }, []);

  // 화면 전환 로직
  if (view === 'healthfeedback') {
    return (
      <HealthFeedback
        onClose={() => setView('menu')}
        onOpenCheckData={() => setView('checkdata')}
        onOpenCheckfig={() => setView('checkfig')}
      />
    );
  }

  if (view === 'checkdata') {
    return <CheckData onClose={() => setView('healthfeedback')} />;
  }

  if (view === 'checkfig') {
    return <Checkfig onClose={() => setView('healthfeedback')} />;
  }

  if (view === 'getfeedback') {
    return (
      <GetFeedback
        onClose={() => setView('menu')}
        onOpenGuardianShare={() => setView('guardian_share')}
      />
    );
  }

  if (view === 'guardian_share') {
    return <Guardian_Share onClose={() => setView('getfeedback')} />;
  }

  if (view === 'medication') {
    return (
      <Medication
        onClose={() => setView('menu')}
        onOpenMediInfo={() => setView('mediinfo')}
      />
    );
  }

  if (view === 'mediinfo') {
    return <MediInfo onClose={() => setView('medication')} />;
  }

  // 기본 화면: 메뉴 화면
  return (
    <>
      <div>
        {/* 상단 이미지 영역 */}
        <div className="image">
          <img
            className="deep-stream"
            src={deepStreamImage}
            alt="Deep stream"
          />
        </div>

        {/* ✅ 심박수 데이터 표시 */}
        <div className="heartrate-box">
          <h3>❤️ 심박수 데이터</h3>
          <p>2025-12-04: {hrDec4 !== null ? hrDec4 : "없음"}</p>
          <p>2025-11-28: {hrNov28 !== null ? hrNov28 : "없음"}</p>
        </div>

        {/* 버튼 영역 */}
        <div className='button-container'>
          <button className='health' onClick={() => setView('healthfeedback')}>
            <span className="btn-icon" aria-hidden="true">🤖</span>
            <span className="btn-label">사용자 맞춤 피드백</span>
          </button>

          <button className='feedback' onClick={() => setView('getfeedback')}>
            <span className="btn-icon" aria-hidden="true">📈</span>
            <span className="btn-label">데이터 확인</span>
          </button>

          <button className='medication' onClick={() => setView('medication')}>
            <span className="btn-icon" aria-hidden="true">💊</span>
            <span className="btn-label">복용 약 정보</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default App;