import { useState, useEffect } from 'react';
import './GetFeedback.css';

const GetFeedback = ({ onOpenGuardianShare, onClose, data: propData, fcmToken: propFcmToken }) => {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState(propData ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06";

  // prop으로 data가 없을 때만 자동으로 AI 리포트 호출
  useEffect(() => {
    if (propData) return; // 부모가 data를 전달하면 fetch하지 않음

    const fetchAi = async () => {
      if (!fcmToken) {
        setError('fcmToken 없음');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://capstone-lozi.onrender.com/v1/ai/report', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'X-DEVICE-TOKEN': fcmToken,
          },
        });
        if (!res.ok) {
          const txt = await res.text().catch(()=>null);
          throw new Error(`${res.status} ${res.statusText} ${txt ?? ''}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('AI 호출 실패:', err);
        setError(err.message || 'AI 호출 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchAi();
  }, [propData, fcmToken]);

  // AI 응답 구조에 따라 값 추출
  const healthScore =
    data?.health_score ??
    data?.prediction?.health_score ??
    data?.score ??
    '—';

  const oneLineAdvice =
    data?.one_line_advice ??
    data?.prediction?.one_line_advice ??
    data?.prediction?.one_line_advice ??
    data?.message ??
    '피드백이 없습니다';

  const toggleBox = () => setExpanded((s) => !s);

  return (
    <div className={`feedback-container ${expanded ? 'expanded' : ''}`}>
      <button
        className='close-btn'
        onClick={() => onClose && onClose()}
      >
        닫기
      </button>

      {loading ? (
        <h1 className="feedback-score">로딩 중...</h1>
      ) : error ? (
        <h1 className="feedback-score" style={{ color: 'red' }}>에러: {error}</h1>
      ) : (
        <h1 className="feedback-score">예상 점수 : <span>{healthScore}</span></h1>
      )}

      <div className={`feedback-message-box ${expanded ? 'expanded' : ''}`}>
        <div className={`triangle-marker ${expanded ? 'down' : 'right'}`} />
        <p
          className="feedback-message"
          aria-expanded={expanded}
          onClick={toggleBox}
        >
          "{oneLineAdvice}"
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