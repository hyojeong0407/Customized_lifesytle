import { useState } from 'react';
import deepStreamImage from '../Deep_Stream.png';
import '../App.css';

function App_for_guard({ guardians, users, setUsers, isLoggedIn, setIsLoggedIn, setView, setSelectedUser }) {
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

      <h3>보호자 화면</h3>

      <div className='button-container'>
        <button onClick={() => setView('healthfeedback')}>🤖 사용자 맞춤 피드백</button>
        <button onClick={() => setView('getfeedback')}>📈 데이터 확인</button>
        <button onClick={() => setView('medication')}>💊 복용 약 정보</button>

        {/* 사용자 등록 버튼 */}
        <button className='register' onClick={() => setShowRegister(true)}>
          👤 사용자 등록
        </button>
      </div>

      {showRegister && (
        <div className="guardian-input">
          <label>사용자 UID:</label>
          <input
            type="text"
            value={userUid}
            onChange={(e) => setUserUid(e.target.value)}
          />
          <label>별명:</label>
          <input
            type="text"
            value={userNickname}
            onChange={(e) => setUserNickname(e.target.value)}
          />
          <button onClick={handleSaveUser}>저장</button>
        </div>
      )}

      {/* 오른쪽 아래 사용자 목록 버튼 */}
      <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
        <button onClick={() => setShowList(!showList)}>📋 사용자 목록</button>
      </div>

      {showList && (
        <div className="user-list">
          <h4>등록된 사용자</h4>
          <ul>
            {users.map((u, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    setSelectedUser(u); // 선택된 사용자 저장
                    setView('healthfeedback'); // 해당 사용자로 컴포넌트 접속
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