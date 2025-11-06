import './App.css';
import deepStreamImage from './Deep Stream.png';

function App() {
  return (
    <>
      <div className="image">
        <img className="deep-stream" src={deepStreamImage} alt="Deep stream" />
      </div>

      <button className="button-data">
        <div className="text-wrapper">
          저장된 데이터
          <br />
          확인
        </div>
      </button>

      <button className="button-feedback">
        <div className="text-wrapper">
          저장된 데이터
          <br />
          기반 피드백
        </div>
      </button>
    </>
  );
}

export default App;