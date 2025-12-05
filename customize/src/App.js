import { useState } from 'react';
import './App.css';
import deepStreamImage from './Deep_Stream.png';

// 기존 컴포넌트
import HealthFeedback from './components/HealthFeedback';
import Medication from './components/Medication';
import CheckData from './components/CheckData';
import Checkfig from './components/Checkfig';
import MediInfo from './components/MediInfo';
import GetFeedback from './components/GetFeedback';
import Guardian_Share from './components/Guardian_Share';

// 새로 추가할 컴포넌트
import App_for_guard from './components/App_for_guard';
import App_for_user from './components/App_for_user';

function App() {
  const [view, setView] = useState('menu');

  // UID 관련 상태
  const [uidInput, setUidInput] = useState('');
  const [uids, setUids] = useState([]); 
  const [showButtons, setShowButtons] = useState(false);
  const [guardianMode, setGuardianMode] = useState(false);
  const [guardianUid, setGuardianUid] = useState('');
  const [guardianNickname, setGuardianNickname] = useState('');

  // uid 검색 처리
  const handleSearch = () => {
    if (!uids.find(u => u.uid === uidInput)) {
      setShowButtons(true);
    } else {
      alert('이미 등록된 UID입니다.');
    }
  };

  // 보호자 저장 처리
  const handleSaveGuardian = () => {
    if (guardianUid && guardianNickname) {
      setUids([...uids, { uid: guardianUid, nickname: guardianNickname }]);
      alert('보호자 UID 저장 완료!');
      setGuardianMode(false);
      setShowButtons(false);
      setGuardianUid('');
      setGuardianNickname('');
    }
  };

  // view 처리
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

  // 보호자 전용 화면
  if (view === 'app_for_guard') {
    return <App_for_guard onClose={() => setView('menu')} />;
  }

  // 사용자 전용 화면
  if (view === 'app_for_user') {
    return <App_for_user onClose={() => setView('menu')} />;
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

        {/* UID 검색창 */}
        <div className="uid-search">
          <label>uid를 입력해주세요:</label>
          <input
            type="text"
            value={uidInput}
            onChange={(e) => setUidInput(e.target.value)}
          />
          <button onClick={handleSearch}>검색</button>
        </div>

        {/* 보호자/사용자 버튼 */}
        {showButtons && (
          <div className="role-buttons">
            <button onClick={() => setView('app_for_guard')}>보호자 버튼</button>
            <button onClick={() => setView('app_for_user')}>사용자 버튼</button>
            <button onClick={() => setGuardianMode(true)}>보호자 UID 등록</button>
          </div>
        )}

        {/* 보호자 UID 입력창 */}
        {guardianMode && (
          <div className="guardian-input">
            <label>사용자 UID:</label>
            <input
              type="text"
              value={guardianUid}
              onChange={(e) => setGuardianUid(e.target.value)}
            />
            <label>별명:</label>
            <input
              type="text"
              value={guardianNickname}
              onChange={(e) => setGuardianNickname(e.target.value)}
            />
            <button onClick={handleSaveGuardian}>저장</button>
          </div>
        )}

        {/* 등록된 UID 목록 */}
        <div className="uid-list">
          <h3>등록된 UID 목록</h3>
          <ul>
            {uids.map((item, index) => (
              <li key={index}>{item.uid} - {item.nickname}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;