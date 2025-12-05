import deepStreamImage from '../Deep_Stream.png';
import '../App.css';

function App_for_user({ onClose }) {
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
      </div>

      <button onClick={onClose}>메뉴로 돌아가기</button>
    </div>
  );
}

export default App_for_user;