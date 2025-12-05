import { useState } from 'react';
import './App.css';
import deepStreamImage from './Deep_Stream.png';

import HealthFeedback from './components/HealthFeedback';
import Medication from './components/Medication';
import CheckData from './components/CheckData';
import Checkfig from './components/Checkfig';
import MediInfo from './components/MediInfo';
import GetFeedback from './components/GetFeedback';
import Guardian_Share from './components/Guardian_Share';

import App_for_guard from './components/App_for_guard';
import App_for_user from './components/App_for_user';

function App() {
  const [view, setView] = useState('menu');
  const [uidInput, setUidInput] = useState('');

  // 보호자 / 사용자 배열 따로 관리
  const [guardians, setGuardians] = useState([]); // [{ uid, nickname }]
  const [users, setUsers] = useState([]);         // [{ uid, nickname }]
  const [showButtons, setShowButtons] = useState(false);

  // uid 검색 처리
  const handleSearch = () => {
    const foundGuardian = guardians.find(g => g.uid === uidInput);
    const foundUser = users.find(u => u.uid === uidInput);

    if (foundGuardian) {
      setView('app_for_guard');
    } else if (foundUser) {
      setView('app_for_user');
    } else {
      setShowButtons(true); // 신규 UID → 보호자/사용자 선택 버튼 표시
    }
  };

  // 신규 UID 등록
  const handleRegisterGuardian = () => {
    setGuardians([...guardians, { uid: uidInput, nickname: uidInput }]);
    setView('app_for_guard');
    setShowButtons(false);
    setUidInput('');
  };

  const handleRegisterUser = () => {
    setUsers([...users, { uid: uidInput, nickname: uidInput }]);
    setView('app_for_user');
    setShowButtons(false);
    setUidInput('');
  };

  // ===== 기존 view 처리 =====
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
    return (
      <App_for_guard
        onClose={() => setView('menu')}
        guardians={guardians}
        setGuardians={setGuardians}
        users={users}
        setUsers={setUsers}
      />
    );
  }

  // 사용자 전용 화면
  if (view === 'app_for_user') {
    return <App_for_user onClose={() => setView('menu')} />;
  }

  // ===== 기본 화면 =====
  return (
    <div>
      <div className="image">
        <img className="deep-stream" src={deepStreamImage} alt="Deep stream" />
      </div>

      <div className='button-container'>
        <button className='health' onClick={() => setView('healthfeedback')}>
          <span className="btn-icon">🤖</span>
          <span className="btn-label">사용자 맞춤 피드백</span>
        </button>

        <button className='feedback' onClick={() => setView('getfeedback')}>
          <span className="btn-icon">📈</span>
          <span className="btn-label">데이터 확인</span>
        </button>

        <button className='medication' onClick={() => setView('medication')}>
          <span className="btn-icon">💊</span>
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

      {/* 보호자/사용자 버튼 (신규 UID 등록 시만 표시) */}
      {showButtons && (
        <div className="role-buttons">
          <button onClick={handleRegisterGuardian}>보호자 버튼</button>
          <button onClick={handleRegisterUser}>사용자 버튼</button>
        </div>
      )}
    </div>
  );
}

export default App;