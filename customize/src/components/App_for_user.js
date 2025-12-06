import deepStreamImage from '../Deep_Stream.png';
import './App_for_user.css';

function App_for_user({ isLoggedIn, setIsLoggedIn, setView, currentUser, onLogoClick }) {
  const requireUserThenNavigate = (target) => {
    if (!currentUser || !currentUser.uid) {
      alert('사용자가 선택되지 않았습니다.');
      return;
    }
    setView(target);
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
            if (typeof onLogoClick === 'function') onLogoClick();
          }}
        />
      </div>

      <h3 className='user-title'>사용자 화면</h3>
      <p className='now-user'>현재 사용자: {currentUser?.nickname} ({currentUser?.uid})</p>

      <div className='button-container'>
        <button className='user-health' onClick={() => requireUserThenNavigate('healthfeedback')}>
          <span className="btn-icon" aria-hidden="true">🤖</span>
          <span className="btn-label">사용자 맞춤 피드백</span>
        </button>
        <button className='user-feedback' onClick={() => requireUserThenNavigate('getfeedback')}>
          <span className="btn-icon" aria-hidden="true">📈</span>
          <span className="btn-label">데이터 확인</span>
        </button>
        <button className='user-medication' onClick={() => requireUserThenNavigate('medication')}>
          <span className="btn-icon" aria-hidden="true">💊</span>
          <span className="btn-label">복용 약 정보</span>
        </button>
      </div>
    </div>
  );
}

export default App_for_user;