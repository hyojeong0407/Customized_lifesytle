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

  const [sharedHeart, setSharedHeart] = useState(null); // 심박수 공유용

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

  const goToUser = (user = null) => {
    if (user && user.uid) {
      setSelectedUser(user);
    } else if (!selectedUser || !selectedUser.uid) {
      if (users.length === 1) {
        setSelectedUser(users[0]);
      } else {
        alert('사용자가 선택되어 있지 않습니다. 사용자 목록에서 선택하세요.');
        return;
      }
    }
    setReturnTo(null);
    setView('app_for_user');
  };

  const goToUserView = () => {
    // 선택된 사용자가 있으면 사용자 화면으로, 없으면 보호자 화면으로 (기존 동작 유지)
    if (selectedUser && selectedUser.uid) {
      setReturnTo(null);
      setView('app_for_user');
    } else {
      goToGuard();
    }
  };

  // 변경: 기본 화면(menu)은 로그아웃 상태일 때만 보이도록 처리
  const goBack = (defaultView = 'menu') => {
    if (returnTo) {
      setView(returnTo);
      setReturnTo(null);
      return;
    }

    if (isLoggedIn && selectedUser && selectedUser.uid) {
      setView('app_for_user');
      return;
    }

    if (isLoggedIn) {
      setView('app_for_guard');
      return;
    }

    setView(defaultView);
  };

  // 보호자 <-> 사용자 전환 함수 (버튼에 연결)
  const toggleGuardUser = () => {
    // 현재 보호자 화면이면 사용자 화면으로 전환
    if (view === 'app_for_guard') {
      if (selectedUser && selectedUser.uid) {
        setView('app_for_user');
        setReturnTo(null);
        return;
      }
      if (users.length === 1) {
        setSelectedUser(users[0]);
        setView('app_for_user');
        setReturnTo(null);
        return;
      }
      alert('전환하려면 먼저 사용자를 선택하거나 등록하세요.');
      return;
    }

    // 현재 사용자 화면이면 보호자 화면으로 전환
    if (view === 'app_for_user') {
      setView('app_for_guard');
      setReturnTo(null);
      return;
    }

    // 그 외: 로그인 상태에 따라 기본 전환 동작
    if (isLoggedIn) setView('app_for_guard');
    else setView('menu');
  };

  if (view === 'healthfeedback') {
    return (
      <HealthFeedback
        onClose={() => goBack('menu')}
        onOpenCheckData={() => setView('checkdata')}
        onOpenCheckfig={() => setView('checkfig')}
        selectedUser={selectedUser}
        onLogoClick={goToUserView}           // 변경: 사용자 화면으로 복귀
        onToggleView={toggleGuardUser}
        setReturnTo={setReturnTo}
      />
    );
  }

  if (view === 'checkdata') {
    return (
      <CheckData
        onClose={() => goBack('healthfeedback')}
        selectedUser={selectedUser}
        onLogoClick={goToUserView}           // 변경
        onToggleView={toggleGuardUser}
        setReturnTo={setReturnTo}
      />
    );
  }

  if (view === 'checkfig') {
    return (
      <Checkfig
        onClose={() => goBack('healthfeedback')}
        selectedUser={selectedUser}
        onLogoClick={goToUserView}           // 변경
        onToggleView={toggleGuardUser}
        setReturnTo={setReturnTo}
      />
    );
  }

  if (view === 'getfeedback') {
    return (
      <GetFeedback
        onClose={() => goBack('menu')}
        onOpenGuardianShare={(heartValue) => {
        setSharedHeart(heartValue);   
        setView('guardian_share'); 
      }}
        selectedUser={selectedUser}
        onLogoClick={goToUserView}           // 변경
        onToggleView={toggleGuardUser}
        setReturnTo={setReturnTo}
      />
    );
  }

  if (view === 'guardian_share') {
    return (
      <Guardian_Share
        onClose={() => goBack('getfeedback')}
        selectedUser={selectedUser}
        heart={sharedHeart}
        onLogoClick={goToUserView}           // 변경
        onToggleView={toggleGuardUser}
        setReturnTo={setReturnTo}
      />
    );
  }

  if (view === 'medication') {
    return (
      <Medication
        onClose={() => goBack('menu')}
        onOpenMediInfo={() => setView('mediinfo')}
        selectedUser={selectedUser}
        onLogoClick={goToUserView}           // 변경
        onToggleView={toggleGuardUser}
        setReturnTo={setReturnTo}
      />
    );
  }

  if (view === 'mediinfo') {
    return (
      <MediInfo
        onClose={() => goBack('medication')}
        selectedUser={selectedUser}
        onLogoClick={goToUserView}           // 변경
        onToggleView={toggleGuardUser}
        setReturnTo={setReturnTo}
      />
    );
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
        setReturnTo={setReturnTo}
        onLogoClick={goToGuard}
        selectedUser={selectedUser}
        onToggleView={toggleGuardUser} // 전환 버튼 콜백 전달
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
        onToggleView={toggleGuardUser} // 전환 버튼 콜백 전달
        // 변경: 사용자 화면에서 로고 클릭하면 사용자 화면으로 복귀
        onLogoClick={() => { setReturnTo(null); setView('app_for_user'); }}
        setReturnTo={setReturnTo}          // 중요: 사용자 화면에서 다른 화면으로 이동 시 복귀 지점 설정 가능
        onGoToUser={goToUser}
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
          <button className='guardian-button' onClick={handleRegisterGuardian}>보호자</button>
          <button className='user-button' onClick={handleRegisterUser}>사용자</button>
        </div>
      )}
    </div>
  );
}

export default App;