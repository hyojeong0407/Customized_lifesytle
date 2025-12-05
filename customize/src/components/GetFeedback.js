// ...existing code...
import { useState } from 'react';
import './GetFeedback.css';

const GetFeedback = ({ onOpenGuardianShare, onClose, data }) => {
  const [expanded, setExpanded] = useState(false);
  const score = data?.score ?? ' ';
  const message = data?.message ?? '피드백이 없습니다';

  const toggleBox = () => setExpanded((s) => !s);

  return (
    // feedback-container에 expanded 클래스 추가
    <div className={`feedback-container ${expanded ? 'expanded' : ''}`}>
      <button 
        className='close-btn'
        onClick={() => onClose()}
      >
        닫기
      </button>

      <h1 className="feedback-score">예상 점수 : <span>{score}</span></h1>

      <div className={`feedback-message-box ${expanded ? 'expanded' : ''}`}>
        <div className={`triangle-marker ${expanded ? 'down' : 'right'}`} />
          <p 
            className="feedback-message"
            aria-expanded={expanded}
            onClick={toggleBox}
          >
            "{message}"
          </p>
        </div>

        <div className={`transform-frame ${expanded ? 'active' : ''}`} aria-hidden={!expanded}>
          {expanded && (
            <button className="dashboard-btn" aria-hidden={!expanded}>상세보기</button>
          )}
        </div>

        <button 
          className="share-btn"
          onClick={() =>
            typeof onOpenGuardianShare === 'function' && onOpenGuardianShare()
          }
        >
          공유
        </button>
    </div>
  );
};

export default GetFeedback;
// ...existing code...