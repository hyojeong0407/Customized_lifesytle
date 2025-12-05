import deepStreamImage from '../Deep_Stream.png';
import '../App.css';

function App_for_user({ isLoggedIn, setIsLoggedIn, setView, currentUser }) {
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
        <img className="deep-stream" src={deepStreamImage} alt="Deep stream" />
      </div>

      <h3>사용자 화면</h3>
      <p>현재 사용자: {currentUser?.nickname} ({currentUser?.uid})</p>

      <div className='button-container'>
        <button onClick={() => setView('healthfeedback')}>🤖 사용자 맞춤 피드백</button>
        <button onClick={() => setView('getfeedback')}>📈 데이터 확인</button>
        <button onClick={() => setView('medication')}>💊 복용 약 정보</button>
      </div>
    </div>
  );
}

export default App_for_user;