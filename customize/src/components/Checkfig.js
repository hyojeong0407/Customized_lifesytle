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
  const [jsonPayload, setJsonPayload] = useState(null); // ✅ JSON 상태 추가
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

      // ✅ JSON 생성
      const todayStr = new Date().toISOString().split("T")[0];
      const payload = {
        message: "걸음수, 이동거리, 칼로리, 수면시간을 분석해서 결과와 간단한 건강 피드백을 작성해줘 날짜는 그달의 첫째 날짜와 현재 날짜까지를 기준으로 6줄 이내로 간단하게참고할 데이터는 json으로 별도 첨부할거야",
        date: todayStr,
        steps: items.map(d => d.steps),
        distance: items.map(d => d.distance),
        calories: items.map(d => d.calories),
        sleep: items.map(d => d.sleep)
      };
      setJsonPayload(JSON.stringify(payload, null, 2));

      // ✅ 서버로 전송
      fetch("https://capstone-lozi.onrender.com/v1/data/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-DEVICE-TOKEN": fcmToken
        },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(data => {
          console.log("서버 응답:", data);
        })
        .catch(err => {
          console.error("전송 에러:", err);
        });
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
        <div className="quadrant q1">
          <h3>🎯 목표 할당량 / 오늘 수치</h3>
          {healthData.length > 0 ? (
            <table className="goal-table">
              <tbody>
                <tr>
                  <td>목표 걸음수</td>
                  <td>4000</td>
                  <td>/</td>
                  <td>{healthData[healthData.length - 1].steps} 보</td>
                </tr>
                <tr>
                  <td>목표 이동거리</td>
                  <td>3.0 km</td>
                  <td>/</td>
                  <td>{(healthData[healthData.length - 1].distance / 1000).toFixed(2)} km</td>
                </tr>
                <tr>
                  <td>목표 칼로리</td>
                  <td>2000 kcal</td>
                  <td>/</td>
                  <td>{healthData[healthData.length - 1].calories} kcal</td>
                </tr>
                <tr>
                  <td>목표 수면시간</td>
                  <td>480 min</td>
                  <td>/</td>
                  <td>{healthData[healthData.length - 1].sleep} min</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>오늘 데이터가 없습니다.</p>
          )}
        </div>
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
        <div className="quadrant q4">
          {/*  
          <h3>📡 서버 전송 데이터</h3>
          {jsonPayload ? (
            <pre className="json-output">{jsonPayload}</pre>
          ) : (
            <p>데이터를 불러오는 중...</p>
          )}
          */}
        </div>
      </div>
    </div>
  );
};

export default Checkfig;