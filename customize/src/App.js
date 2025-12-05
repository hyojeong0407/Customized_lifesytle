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

  const [guardians, setGuardians] = useState([]);
  const [users, setUsers] = useState([]);
  const [showButtons, setShowButtons] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [returnTo, setReturnTo] = useState(null);

  const handleSearch = () => {
    const foundGuardian = guardians.find(g => g.uid === uidInput);
    const foundUser = users.find(u => u.uid === uidInput);

    if (foundGuardian) {
      setView('app_for_guard');
      setIsLoggedIn(true);
    } else if (foundUser) {
      setSelectedUser(foundUser);
      setView('app_for_user');
      setIsLoggedIn(true);
    } else {
      setShowButtons(true);
      setIsLoggedIn(false);
    }
  };

  const handleRegisterGuardian = () => {
    setGuardians([...guardians, { uid: uidInput, nickname: uidInput }]);
    setView('app_for_guard');
    setShowButtons(false);
    setUidInput('');
    setIsLoggedIn(true);
  };

  const handleRegisterUser = () => {
    const newUser = { uid: uidInput, nickname: uidInput };
    setUsers([...users, newUser]);
    setSelectedUser(newUser);
    setView('app_for_user');
    setShowButtons(false);
    setUidInput('');
    setIsLoggedIn(true);
  };

  const goToGuard = () => {
    setView('app_for_guard');
    setReturnTo(null);
  };

  // 변경: 기본 화면(menu)은 로그아웃 상태일 때만 보이도록 처리
  const goBack = (defaultView = 'menu') => {
    if (returnTo) {
      setView(returnTo);
      setReturnTo(null);
    } else {
      if (isLoggedIn) {
        // 로그인 상태면 보호자 화면으로 복귀
        setView('app_for_guard');
      } else {
        // 로그아웃 상태면 기본 화면(menu)
        setView(defaultView);
      }
    }
  };

  // ===== 기존 view 처리 =====
  if (view === 'healthfeedback') {
    return (
      <HealthFeedback
        onClose={() => goBack('menu')}
        onOpenCheckData={() => setView('checkdata')}
        onOpenCheckfig={() => setView('checkfig')}
        selectedUser={selectedUser}
        onLogoClick={goToGuard}
      />
    );
  }

  if (view === 'checkdata') {
    return <CheckData onClose={() => goBack('healthfeedback')} selectedUser={selectedUser} onLogoClick={goToGuard} />;
  }

  if (view === 'checkfig') {
    return <Checkfig onClose={() => goBack('healthfeedback')} selectedUser={selectedUser} onLogoClick={goToGuard} />;
  }

  if (view === 'getfeedback') {
    return (
      <GetFeedback
        onClose={() => goBack('menu')}
        onOpenGuardianShare={() => setView('guardian_share')}
        selectedUser={selectedUser}
        onLogoClick={goToGuard}
      />
    );
  }

  if (view === 'guardian_share') {
    return <Guardian_Share onClose={() => goBack('getfeedback')} selectedUser={selectedUser} onLogoClick={goToGuard} />;
  }

  if (view === 'medication') {
    return (
      <Medication
        onClose={() => goBack('menu')}
        onOpenMediInfo={() => setView('mediinfo')}
        selectedUser={selectedUser}
        onLogoClick={goToGuard}
      />
    );
  }

  if (view === 'mediinfo') {
    return <MediInfo onClose={() => goBack('medication')} selectedUser={selectedUser} onLogoClick={goToGuard} />;
  }

  if (view === 'app_for_guard') {
    return (
      <App_for_guard
        guardians={guardians}
        users={users}
        setUsers={setUsers}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setView={setView}
        setSelectedUser={setSelectedUser}
        setReturnTo={setReturnTo}   // 전달: 보호자화면에서 다른 화면 열 때 복귀지점 설정
        onLogoClick={goToGuard}
      />
    );
  }

  if (view === 'app_for_user') {
    return (
      <App_for_user
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setView={setView}
        currentUser={selectedUser}
      />
    );
  }

  // ===== 기본 화면 =====
  return (
    <div>
      {/* 로그인 상태 버튼 */}
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <button
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: isLoggedIn ? 'green' : 'red',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (isLoggedIn) {
              setIsLoggedIn(false);
              setView('menu');
              setSelectedUser(null);
            }
          }}
        />
      </div>

      <div className="image">
        <img className="deep-stream" src={deepStreamImage} alt="Deep stream" />
      </div>

      <div className='button-container'>
        <button
          className='health'
          onClick={() => {
            if (isLoggedIn) setView('healthfeedback');
            else alert('uid로 먼저 접속해주세요');
          }}
        >
          <span className="btn-icon" aria-hidden="true">🤖</span>
          <span className="btn-label">사용자 맞춤 피드백</span>
        </button>

        <button
          className='feedback'
          onClick={() => {
            if (isLoggedIn) setView('getfeedback');
            else alert('uid로 먼저 접속해주세요');
          }}
        >
          <span className="btn-icon" aria-hidden="true">📈</span>
          <span className="btn-label">데이터 확인</span>
        </button>

        <button
          className='medication'
          onClick={() => {
            if (isLoggedIn) setView('medication');
            else alert('uid로 먼저 접속해주세요');
          }}
        >
          <span className="btn-icon" aria-hidden="true">💊</span>
          <span className="btn-label">복용 약 정보</span>
        </button>
      </div>

      {/* 로그인 상태가 아닐 때만 UID 입력창 표시 */}
      {!isLoggedIn && (
        <div className="uid-search">
          <label className='uid-search-label'>uid를 입력해주세요: </label>
          <input className='uid-search-input'
            type="text"
            value={uidInput}
            onChange={(e) => setUidInput(e.target.value)}
          />
          <button className="uid-search-button" onClick={handleSearch}>검색</button>
        </div>
      )}

      {showButtons && !isLoggedIn && (
        <div className="role-buttons">
          <button className='guardian-button' onClick={handleRegisterGuardian}>보호자 버튼</button>
          <button className='user-button' onClick={handleRegisterUser}>사용자 버튼</button>
        </div>
      )}
    </div>
  );
}

export default App;