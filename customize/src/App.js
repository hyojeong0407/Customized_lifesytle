// React의 useState 훅 불러오기
import { useState } from 'react';
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
  // 현재 보여줄 화면을 관리하는 상태
  // 기본값은 'menu' (메인 메뉴 화면)
  const [view, setView] = useState('menu');

  // view 값이 'healthfeedback'일 때 HealthFeedback 컴포넌트 렌더링
  if (view === 'healthfeedback') {
    return (
      <HealthFeedback
          // 닫기 버튼 → 메뉴 화면으로 돌아가기
          onClose={() => setView('menu')}
          // 데이터 확인 버튼 → CheckData 화면으로 이동
          onOpenCheckData={() => setView('checkdata')}
          // 그래프 확인 버튼 → Checkfig 화면으로 이동
          onOpenCheckfig={() => setView('checkfig')}
      />
    );
  }

  // view 값이 'checkdata'일 때 CheckData 컴포넌트 렌더링
  if (view === 'checkdata') {
    return <CheckData onClose={() => setView('healthfeedback')} />;
  }

  // view 값이 'checkfig'일 때 Checkfig 컴포넌트 렌더링
  if (view === 'checkfig') {
    return <Checkfig onClose={() => setView('healthfeedback')} />;
  }

  // view 값이 'getfeedback'일 때 GetFeedback 컴포넌트 렌더링
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

  // view 값이 'medication'일 때 Medication 컴포넌트 렌더링
  if (view === 'medication') {
    return (
      <Medication 
          // 닫기 버튼 → 메뉴 화면으로 돌아가기
          onClose={() => setView('menu')}
          // 약 정보 버튼 → MediInfo 화면으로 이동
          onOpenMediInfo={() => setView('mediinfo')}
      />
    );
  }

  // view 값이 'mediinfo'일 때 MediInfo 컴포넌트 렌더링
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

          {/* 버튼 영역 */}
          <div className='button-container'>
            {/* 사용자 맞춤 피드백 버튼 → healthfeedback 화면으로 이동 */}
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

// App 컴포넌트 내보내기
export default App;