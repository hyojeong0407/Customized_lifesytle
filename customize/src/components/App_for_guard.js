import { useState } from 'react';
import deepStreamImage from '../Deep_Stream.png';
import '../App.css';

function App_for_guard({ onClose, guardians, setGuardians, users, setUsers }) {
  const [showRegister, setShowRegister] = useState(false);
  const [userUid, setUserUid] = useState('');
  const [userNickname, setUserNickname] = useState('');

  const handleSaveUser = () => {
    if (userUid && userNickname) {
      setUsers([...users, { uid: userUid, nickname: userNickname }]);
      alert('사용자 등록 완료!');
      setUserUid('');
      setUserNickname('');
      setShowRegister(false);
    }
  };

  return (
    <div>
      <div className="image">
        <img className="deep-stream" src={deepStreamImage} alt="Deep stream" />
      </div>

      <div className='button-container'>
        <button className='health'>
          <span className="btn-icon">🤖</span>
          <span className="btn-label">사용자 맞춤 피드백</span>
        </button>

        <button className='feedback'>
          <span className="btn-icon">📈</span>
          <span className="btn-label">데이터 확인</span>
        </button>

        <button className='medication'>
          <span className="btn-icon">💊</span>
          <span className="btn-label">복용 약 정보</span>
        </button>

        {/* 보호자 화면 전용: 사용자 등록 버튼 */}
        <button className='register' onClick={() => setShowRegister(true)}>
          <span className="btn-icon">👤</span>
          <span className="btn-label">사용자 등록</span>
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

      {/* 보호자 목록 */}
      <div className="uid-list">
        <h3>보호자 목록</h3>
        <ul>
          {guardians.map((g, index) => (
            <li key={index}>{g.uid} - {g.nickname}</li>
          ))}
        </ul>
      </div>

      {/* 사용자 목록 */}
      <div className="uid-list">
        <h3>사용자 목록</h3>
        <ul>
          {users.map((u, index) => (
            <li key={index}>{u.uid} - {u.nickname}</li>
          ))}
        </ul>
      </div>

      <button onClick={onClose}>메뉴로 돌아가기</button>
    </div>
  );
}

export default App_for_guard;