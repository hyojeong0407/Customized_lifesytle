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

const ICONS = [
  { key: 'steps', apiKey: 'steps', label: '걸음수', emoji: '🚶' },
  { key: 'distance', apiKey: 'distance_m', label: '이동거리', emoji: '📏' },
  { key: 'calories', apiKey: 'calories_kcal', label: '칼로리', emoji: '🔥' },
  { key: 'sleep', apiKey: 'sleep_minutes', label: '수면시간', emoji: '😴' },
];

const IconButtons = ({ selected, onSelect }) => (
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

const Checkfig = ({ onClose }) => {
  const [healthData, setHealthData] = useState([]);
  const [selectedType, setSelectedType] = useState('steps');
  const fcmToken = '9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06';

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${day}`;

      let retries = 0;
      const maxRetries = 5;
      let result = null;

      while (retries < maxRetries) {
        try {
          const res = await fetch(
            `https://capstone-lozi.onrender.com/v1/data/me-summary?start_date=${startDate}&end_date=${endDate}`,
            {
              method: 'GET',
              headers: { 'X-DEVICE-TOKEN': fcmToken },
            }
          );
          result = await res.json();

          if (result && result.summary && result.summary.length > 0) {
            break;
          }
        } catch (err) {
          console.error("요청 에러:", err);
        }

        retries++;
        if (retries < maxRetries) {
          console.log(`데이터 없음, ${retries}번째 재시도...`);
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      if (!result || !result.summary || result.summary.length === 0) {
        setHealthData([]);
        return;
      }

      // ✅ 데이터 파싱
      const items = result.summary.map(item => {
        const date = item.date ? String(item.date).split("T")[0] : null;
        return {
          date,
          steps: item.steps ?? 0,
          distance: item.distance_m ?? item.distance ?? 0,
          calories: item.calories_kcal ?? item.calories ?? 0,
          sleep: item.sleep_minutes ?? item.sleep ?? item.total_sleep ?? item.avg_sleep_minutes ?? 0,
        };
      }).filter(it => it.date);

      // 날짜 오름차순 정렬
      items.sort((a, b) => new Date(a.date) - new Date(b.date));

      setHealthData(items);
    };

    fetchData();
  }, []);

  const chartData = {
    labels: healthData.map(d => d.date),
    datasets: [
      {
        label: ICONS.find(i => i.key === selectedType)?.label ?? selectedType,
        data: healthData.map(d => d[selectedType]),
        borderColor: '#4e79a7',
        backgroundColor: '#4e79a7',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
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
            {healthData.length > 0 ? <Line data={chartData} options={chartOptions} /> : null}
          </div>
        </div>
        <div className="quadrant q4">분석결과</div>
      </div>
    </div>
  );
};

export default Checkfig;