import { useState } from 'react';
import './App.css';
import deepStreamImage from './Deep_Stream.png';
import CheckData from './components/CheckData';
import Checkfig from './components/Checkfig';

function App() {
  const [showCheckData, setShowCheckData] = useState(false);
  const [showCheckfig, setShowCheckfig] = useState(false);

  if (showCheckData) {
    return <CheckData onClose={() => setShowCheckData(false)} />;
  }

  if (showCheckfig) {
    return <Checkfig onClose={() => setShowCheckfig(false)} />;
  }

  return (
    <>
      <div className="image">
        <img
          className="deep-stream"
          src={deepStreamImage}
          alt="Deep stream"
        />
      </div>

      <button className="button-data" onClick={() => setShowCheckData(true)}>
        <div className="text-wrapper">
          저장된 데이터
          <br />
          확인
        </div>
      </button>

      <button className="button-feedback" onClick={() => setShowCheckfig(true)}>
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