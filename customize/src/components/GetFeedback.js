// ...existing code...
import { useState } from 'react';
import './GetFeedback.css';
import deepStreamImage from '../Deep_Stream.png';

const GetFeedback = ({ onClose, data }) => {
  const [expanded, setExpanded] = useState(false);
  const score = data?.score ?? ' ';
  const message = data?.message ?? '피드백이 없습니다';

  const toggleBox = () => setExpanded((s) => !s);

  return (
    // feedback-container에 expanded 클래스 추가
    <div className={`feedback-container ${expanded ? 'expanded' : ''}`}>
        <div className="image">
          <img
              className="deep-stream"
              src={deepStreamImage}
              alt="Deep stream"
              onClick={() => onClose()}
          />
        </div>

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
        {/* 추후 내용 삽입 */}
      </div>

      <button className="share-btn">공유</button>
    </div>
  );
};

export default GetFeedback;
// ...existing code...