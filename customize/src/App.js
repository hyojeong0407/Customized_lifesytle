import { useState } from 'react';
import './App.css';
import deepStreamImage from './Deep_Stream.png';
import HealthFeedback from './components/HealthFeedback';
import Medication from './components/Medication';
import CheckData from './components/CheckData';
import Checkfig from './components/Checkfig';
import MediInfo from './components/MediInfo';

function App() {
  const [view, setView] = useState('menu');

  if (view === 'healthfeedback') {
    return (
      <HealthFeedback
          onClose={() => setView('menu')}
          onOpenCheckData={() => setView('checkdata')}
          onOpenCheckfig={() => setView('checkfig')}
      />
    );
  }

  if (view === 'checkdata') {
    return <CheckData onClose={() => setView('healthfeedback')} />;
  }

  if (view === 'checkfig') {
    return <Checkfig onClose={() => setView('healthfeedback')} />;
  }

  if (view === 'medication') {
    return (
      <Medication 
          onClose={() => setView('menu')}
          onOpenMediInfo={() => setView('mediinfo')}
      />
    );
  }

  if (view === 'mediinfo') {
    return <MediInfo onClose={() => setView('medication')} />;
  }

  return (
    <>
      <div>
          <div className="image">
              <img
                className="deep-stream"
                src={deepStreamImage}
                alt="Deep stream"
              />
          </div>

          <div className='button-container'>
            <button className='health' onClick={() => setView('healthfeedback')}>사용자 맞춤 피드백</button>
            <button className='medication' onClick={() => setView('medication')}>복용 약 정보</button>
          </div>
      </div>
    </>
  );
}

export default App;