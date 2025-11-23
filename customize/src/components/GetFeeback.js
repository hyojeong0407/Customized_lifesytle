import './GetFeedback.css';

const GetFeeback = ({ onClose, data }) => {
  const score = data?.score ?? ' ';
  const message = data?.message ?? '피드백이 없습니다';

  return (
    <div className="feedback-container">
      <h1 className="feedback-score">예상 점수 : <span>{score}</span></h1>

      <div className="feedback-message-box">
        <div className="triangle-marker" />
        <p className="feedback-message">"{message}"</p>
      </div>

      <button className="share-btn">공유</button>
    </div>
  );
};

export default GetFeeback;