import { useState } from 'react';
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
import './CheckData.css';
import deepStreamImage from '../Deep_Stream.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 운동과 심박수 제외
const METRICS = [
  { key: 'steps', apiKey: 'steps', label: '걸음수' },
  { key: 'distance', apiKey: 'distance_m', label: '이동거리' },
  { key: 'calories', apiKey: 'calories_kcal', label: '칼로리' },
  { key: 'sleep', apiKey: 'sleep_minutes', label: '수면시간' },
];

const CheckData = ({ onClose }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [chartData, setChartData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('steps');
  const [showMetrics, setShowMetrics] = useState(false);

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06";

  const handleSearch = async (metricKey = selectedMetric) => {
    const inputDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(inputDate)) {
      setErrorMsg("올바른 날짜를 입력하세요");
      setChartData(null);
      return;
    }

    // ✅ 시작 날짜는 그 달의 첫날
    const startDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);

    const startISO = startDate.toISOString().split("T")[0];
    const endISO = inputDate.toISOString().split("T")[0];

    try {
      const metric = METRICS.find(m => m.key === metricKey);
      if (!metric) {
        setErrorMsg("잘못된 항목 선택");
        return;
      }

      const res = await fetch(
        `https://capstone-lozi.onrender.com/v1/data/me?type=${metric.apiKey}&start_date=${startISO}&end_date=${endISO}`,
        {
          method: "GET",
          headers: { "X-DEVICE-TOKEN": fcmToken },
        }
      );
      const result = await res.json();
      console.log("서버 응답:", result);

      if (!result || !result.data) {
        setChartData(null);
        setErrorMsg("데이터 없음");
        return;
      }

      // 모든 항목을 일별 라인 차트로 처리
      const items = result.data.map(item => {
        const date = item.date ?? (item.start_time ? item.start_time.split("T")[0] : '');
        const value = item[metric.apiKey] ?? 0;
        return { date, value };
      }).filter(it => it.date);

      if (items.length === 0) {
        setChartData(null);
        setErrorMsg("데이터 없음");
        return;
      }

      const labels = items.map(it => it.date);
      const values = items.map(it => it.value);

      setChartData({
        labels,
        datasets: [
          {
            label: metric.label,
            data: values,
            borderColor: '#4e79a7',
            backgroundColor: '#4e79a7',
            tension: 0.3,
          },
        ],
      });
      setErrorMsg('');
    } catch (err) {
      console.error(err);
      setChartData(null);
      setErrorMsg("데이터 없음");
    }
  };

  const handleMetricClick = (key) => {
    setSelectedMetric(key);
    handleSearch(key);
  };

  return (
    <div className="checkdata-container">
      <div className="image">
        <img
          className="deep-stream"
          src={deepStreamImage}
          alt="Deep stream"
          onClick={() => onClose()}
        />
      </div>

      <div className="text-wrapper">
        <h1>데이터 확인</h1>
      </div>

      <section className="date-controls">
        <div className="data-field">
          <input type="text" placeholder="년" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <div className="data-field">
          <input type="text" placeholder="월" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <div className="data-field">
          <input type="text" placeholder="일" value={day} onChange={(e) => setDay(e.target.value)} />
        </div>

        <button
          type="button"
          className={`toggle-metrics-btn ${showMetrics ? 'open' : ''}`}
          aria-expanded={showMetrics}
          onClick={() => setShowMetrics(s => !s)}
        >
          항목
        </button>

        <section className={`metric-buttons ${showMetrics ? 'open' : ''}`} aria-hidden={!showMetrics}>
          {METRICS.map(m => (
            <button
              key={m.key}
              type="button"
              className={`metric-btn ${selectedMetric === m.key ? 'active' : ''}`}
              onClick={() => handleMetricClick(m.key)}
            >
              {m.label}
            </button>
          ))}
        </section>

        <button className="search-button" onClick={handleSearch}>검색</button>
      </section>

      <div className="data-lines">
        {chartData && <Line data={chartData} />}
        {!chartData && errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default CheckData;