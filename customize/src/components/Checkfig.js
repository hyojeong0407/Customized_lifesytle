import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Checkfig.css';
import deepStreamImage from '../Deep_Stream.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// ICONS: key는 내부 식별자, apiKey는 서버/응답에서 사용하는 실제 필드명
const ICONS = [
  { key: 'steps', apiKey: 'steps', label: '걸음수', emoji: '🚶' },
  { key: 'distance', apiKey: 'distance_m', label: '이동거리', emoji: '📏' },
  { key: 'calories', apiKey: 'calories_kcal', label: '칼로리', emoji: '🔥' },
  { key: 'sleep', apiKey: 'sleep_minutes', label: '수면', emoji: '😴' },
];

const IconButtons = ({ selected, onSelect }) => {
  return (
    <div className="icon-column" role="tablist" aria-label="데이터 항목">
      {ICONS.map(ic => (
        <button
          key={ic.key}
          type="button"
          className={`small-icon-btn ${selected === ic.key ? 'active' : ''}`}
          onClick={() => onSelect(ic.key)}
          aria-pressed={selected === ic.key}
          title={ic.label}
        >
          <span className="emoji" aria-hidden="true">{ic.emoji}</span>
        </button>
      ))}
    </div>
  );
};

const Checkfig = ({ onClose }) => {
  const [healthData, setHealthData] = useState([]);
  const [selectedType, setSelectedType] = useState('steps'); // ✅ 기본 선택을 걸음수로
  const fcmToken = '9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06';

  // types 리스트는 ICONS의 key 기준
  const types = ICONS.map(c => c.key);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      // ✅ 시작일은 그 달의 첫날
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${day}`;

      try {
        // API 호출 (각 타입별)
        const responses = await Promise.all(
          types.map(async (type) => {
            const res = await fetch(
              `https://capstone-lozi.onrender.com/v1/data/me?type=${type}&start_date=${startDate}&end_date=${endDate}`,
              {
                method: 'GET',
                headers: { 'X-DEVICE-TOKEN': fcmToken },
              }
            );
            const result = await res.json();
            return { type, data: result.data || [] };
          })
        );

        // 날짜 범위 생성
        const allDates = [];
        let current = new Date(startDate);
        const end = new Date(endDate);
        while (current <= end) {
          allDates.push(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }

        // dateMap 초기화 (내부 key: ICONS.key)
        const dateMap = {};
        allDates.forEach((date) => {
          dateMap[date] = { date };
          ICONS.forEach(c => {
            dateMap[date][c.key] = 0;
          });
        });

        // 응답 파싱: apiKey 기준으로 안전하게 값 추출
        responses.forEach(({ type, data }) => {
          const apiKey = ICONS.find(c => c.key === type)?.apiKey ?? type;
          data.forEach((item) => {
            // 안전한 날짜 추출
            let date = '';
            if (item.start_time) date = String(item.start_time).split('T')[0];
            else if (item.date) date = String(item.date).split('T')[0];
            else if (item.timestamp) {
              try { date = new Date(item.timestamp).toISOString().split('T')[0]; } catch { date = ''; }
            }
            if (!date || !dateMap[date]) return;

            // 값 추출: apiKey 우선, 이후 가능한 폴백들
            let value = 0;
            if (type === 'steps') {
              value = item[apiKey] ?? item.steps ?? item.count ?? item.step_count ?? 0;
            } else if (type === 'distance') {
              value = item[apiKey] ?? item.distance_m ?? item.distance ?? 0;
            } else if (type === 'calories') {
              value = item[apiKey] ?? item.calories_kcal ?? item.calories ?? 0;
            } else if (type === 'sleep') {
              value = item[apiKey] ?? item.sleep_minutes ?? item.sleep ?? 0;
            } else {
              value = item[apiKey] ?? 0;
            }

            dateMap[date][type] = Number(value) || 0;
          });
        });

        const mergedData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

        setHealthData(mergedData);

        // 서버로 전송할 페이로드: ICONS의 apiKey를 키로 사용
        const todayStr = new Date().toISOString().split('T')[0];
        const payload = {
          message: `지난 ${startDate}부터 ${todayStr}까지 데이터 분석 요청`,
          date: todayStr,
        };
        ICONS.forEach(c => {
          payload[c.apiKey] = mergedData.map(d => d[c.key]);
        });

        // 전송
        fetch('https://capstone-lozi.onrender.com/v1/data/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-DEVICE-TOKEN': fcmToken,
          },
          body: JSON.stringify(payload),
        })
          .then(res => res.json())
          .then(data => {
            console.log('서버 응답:', data);
          })
          .catch(err => {
            console.error('전송 에러:', err);
          });

      } catch (err) {
        console.error('에러 발생:', err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = {
    labels: healthData.map(d => d.date),
    datasets: [
      {
        label: ICONS.find(i => i.key === selectedType)?.label ?? selectedType,
        data: healthData.map((d) => d[selectedType]),
        borderColor: '#4e79a7',
        backgroundColor: '#4e79a7',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="checkfig-container">
      <div className="image">
        <img
          className="deep-stream"
          src={deepStreamImage}
          alt="Deep stream"
          onClick={() => onClose && onClose()}
        />
      </div>

      <div className="text-wrapper">
        <h1>데이터 피드백</h1>
      </div>

      <div className="data-graphs">
        <div className="quadrant q1">목표 할당량 / 오늘 할당량</div>
        <div className="quadrant q2">오늘 목표 달성   이번 목표 달성</div>
        <div className="quadrant q3">
          <h3>📊 최근 변화</h3>
          <div className="q3-inner">
            <IconButtons selected={selectedType} onSelect={setSelectedType} />
            <div className="selected-info">
              <strong>{ICONS.find(i => i.key === selectedType)?.label ?? selectedType}</strong>
            </div>
          </div>
          <div className="mini-chart">
            {healthData.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : null}
          </div>
        </div>
        <div className="quadrant q4">분석결과</div>
      </div>
    </div>
  );
};

export default Checkfig;