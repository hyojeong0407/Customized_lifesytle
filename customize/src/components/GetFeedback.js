import { useState, useEffect } from 'react';
import './GetFeedback.css';

const MetricRow = ({ emoji, label, value, unit, direction }) => {
  const up = direction === 'up';
  const equal = direction === 'equal';
  const color = equal ? '#999' : up ? '#13b44b' : '#e53935';
  const arrow = equal ? '—' : up ? '▲' : '▼';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 50 }}>{emoji}</span>
        <div style={{ marginLeft: 180 }}>
          <div style={{ fontWeight: 700 }}>{label}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{value !== null && value !== undefined ? `${value} ${unit ?? ''}` : '데이터 없음'}</div>
        </div>
      </div>

      <div style={{ marginRight: 280 }}>
        <div style={{ fontSize: 50, color }}>{arrow}</div>
      </div>
    </div>
  );
};

const GetFeedback = ({ onOpenGuardianShare, onClose, data: propData }) => {
  // expanded 기본값을 true로 변경하여 transform-frame 내용이 항상 보이도록 함
  const [expanded, setExpanded] = useState(true);
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
    data?.message ??
    '피드백이 없습니다';

  // 예측값 추출 (prediction 내 또는 최상위)
  const pred = data?.prediction ?? data ?? {};
  const pSteps = pred?.predicted_steps ?? pred?.steps ?? null;
  const pSleep = pred?.predicted_sleep_minutes ?? pred?.predicted_sleep ?? pred?.sleep ?? null;
  const pHeart = pred?.predicted_avg_heart_rate ?? pred?.predicted_avg_heartRate ?? pred?.avg_heart_rate ?? pred?.heart_rate ?? null;
  const pCalories = pred?.predicted_calories_kcal ?? pred?.predicted_calories ?? pred?.calories_kcal ?? pred?.calories ?? null;

  // 목표값(필요시 조정)
  const goals = {
    steps: 4000,
    sleep: 480, // 분 단위
    heart: 70, // 임의 기준: 심박수는 높을수록 활동성↑으로 판단
    calories: 2000,
  };

  const getDirection = (value, goal) => {
    if (value === null || value === undefined) return 'equal';
    if (value > goal) return 'up';
    if (value < goal) return 'down';
    return 'equal';
  };

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

      {/* transform-frame을 항상 보이도록 aria-hidden 고정 false 및 padding 유지 */}
      <div className={`transform-frame ${expanded ? 'active' : ''}`} aria-hidden={false} style={{ padding: 12 }}>
        {/* 요약 인디케이터: 수면 / 걸음수 / 심박수 / 칼로리 */}
        <div className='transform-emoji'>
          <MetricRow
            emoji="😴"
            label="수면"
            value={pSleep}
            unit="min"
            direction={getDirection(pSleep, goals.sleep)}
          />
          <MetricRow
            emoji="👣"
            label="걸음 수"
            value={pSteps}
            unit="걸음"
            direction={getDirection(pSteps, goals.steps)}
          />
          <MetricRow
            emoji="❤️"
            label="심박수"
            value={pHeart}
            unit="bpm"
            direction={getDirection(pHeart, goals.heart)}
          />
          <MetricRow
            emoji="🍽️"
            label="칼로리"
            value={pCalories}
            unit="kcal"
            direction={getDirection(pCalories, goals.calories)}
          />
        </div>

        {/* 기존 상세보기 버튼(항상 보이도록 위치 조정 가능) */}
        <div style={{ marginTop: 8 }}>
          <button className="dashboard-btn" aria-hidden={false}>상세보기</button>
        </div>
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