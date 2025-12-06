import { useState } from 'react';
import deepStreamImage from '../Deep_Stream.png';
import './App_for_guard.css';

function App_for_guard({ guardians, users = [], setUsers, isLoggedIn, setIsLoggedIn, setView, setSelectedUser, setReturnTo,
  selectedUser, onLogoClick, onToggleView }) {
  const [showRegister, setShowRegister] = useState(false);
  const [userUid, setUserUid] = useState('');
  const [userNickname, setUserNickname] = useState('');
  const [showList, setShowList] = useState(false);

  const handleSaveUser = () => {
    if (userUid && userNickname) {
      const existingIndex = users.findIndex(u => u.uid === userUid);

      if (existingIndex !== -1) {
        // 이미 존재 → 별명만 수정
        const updatedUsers = [...users];
        updatedUsers[existingIndex] = { ...updatedUsers[existingIndex], nickname: userNickname };
        setUsers(updatedUsers);
        alert('기존 사용자 UID의 별명을 수정했습니다!');
      } else {
        // 새로 추가
        setUsers([...users, { uid: userUid, nickname: userNickname }]);
        alert('새 사용자 등록 완료!');
      }

      setUserUid('');
      setUserNickname('');
      setShowRegister(false);
    }
  };

  // 보호자 화면에서 다른 화면으로 이동할 때: selectedUser가 있어야 이동
  const navigateWithUser = (target) => {
    // 복귀 지점 설정 (보호자 화면으로 돌아오게)
    if (typeof setReturnTo === 'function') setReturnTo('app_for_guard');

    // 이미 선택된 user가 있으면 바로 이동
    if (selectedUser && selectedUser.uid) {
      setView(target);
      return;
    }
  };

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
        <img 
          className="deep-stream" 
          src={deepStreamImage} 
          alt="Deep stream"
          onClick={() => {
            // 로고 클릭 시 부모에서 onLogoClick을 넘겼으면 호출, 아니면 보호자 화면으로 리셋
            if (typeof onLogoClick === 'function') {
              onLogoClick();
              return;
            }
            if (typeof setReturnTo === 'function') setReturnTo(null);
            setView('app_for_guard');
          }}
        />
      </div>

      <h3 className='guardian-title'>보호자 화면</h3>

      <div className='button-container'>
        <button className='guardian-health' onClick={() => navigateWithUser('healthfeedback')}>
          <span className="btn-icon" aria-hidden="true">🤖</span>
          <span className="btn-label">사용자 맞춤 피드백</span>
        </button>

        <button className='guardian-feedback' onClick={() => navigateWithUser('getfeedback')}>
          <span className="btn-icon" aria-hidden="true">📈</span>
          <span className="btn-label">데이터 확인</span>
        </button>

        <button className='guardian-medication' onClick={() => navigateWithUser('medication')}>
          <span className="btn-icon" aria-hidden="true">💊</span>
          <span className="btn-label">복용 약 정보</span>
        </button>

        {/* 사용자 등록 버튼 */}
        <button className='register' onClick={() => setShowRegister(true)}>
          <span className="btn-icon" aria-hidden="true">👤</span>
          <span className="btn-label">사용자 등록</span>
        </button>
      </div>

      <div className='conversion'>
        <button className='toggle-view'
          onClick={() => { if (typeof onToggleView === 'function') onToggleView(); }}>
            🔁 전환
        </button>
      </div>

      {showRegister && (
        <div className="guardian-input">
          <label className='guardian-label-user'>사용자 UID: </label>
          <input className='guardian-input-field'
            type="text"
            value={userUid}
            onChange={(e) => setUserUid(e.target.value)}
          />
          <label className='guardian-label-nick'>별명: </label>
          <input className='guardian-input-field'
            type="text"
            value={userNickname}
            onChange={(e) => setUserNickname(e.target.value)}
          />
          <button className='guardian-save' onClick={handleSaveUser}>저장</button>
        </div>
      )}

      {/* 오른쪽 아래 사용자 목록 버튼 */}
      <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
        <button className='user' onClick={() => setShowList(!showList)}>📋 사용자 목록</button>
      </div>

      {showList && (
        <div className="user-list">
          <h4>등록된 사용자</h4>
          <ul>
            {users.map((u, index) => (
              <li key={index}>
                <button className='user-name'
                  onClick={() => {
                    // 목록에서 사용자 선택 시 App의 selectedUser 상태에 저장하고 보호자 복귀지점 설정
                    setSelectedUser(u); // 선택된 사용자 저장
                    if (typeof setReturnTo === 'function') setReturnTo('app_for_guard');
                    // 선택 직후 기본 동작: 사용자 화면으로 이동 (사용자 전용 뷰)
                    setView('app_for_user'); // 해당 사용자로 컴포넌트 접속
                  }}
                >
                  {u.nickname}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App_for_guard;