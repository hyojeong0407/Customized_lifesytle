import deepStreamImage from '../Deep_Stream.png';
import '../App.css';

function App_for_user({ isLoggedIn, setIsLoggedIn, setView }) {
  return (
    <div>
      {/* ✅ 우측 상단 로그인 상태 버튼 */}
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
      </div>
    </div>
  );
}

export default App_for_user;