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

// 서버 응답 필드명 그대로 사용
const METRICS = [
  { key: 'steps', label: '걸음수' },
  { key: 'avg_heart_rate', label: '심박수' },
  { key: 'distance_m', label: '이동거리' },
  { key: 'calories_kcal', label: '칼로리 소모량' },
  { key: 'sleep_minutes', label: '수면시간' },
  { key: 'exercise_count', label: '운동' },
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

  // 값 추출: 서버 필드명 그대로 사용
  const extractValue = (item, metricKey) => {
    return item[metricKey] ?? 0;
  };

  const handleSearch = async (metricKey = selectedMetric) => {
    const inputDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(inputDate)) {
      setErrorMsg("올바른 날짜를 입력하세요");
      setChartData(null);
      return;
    }

    // 3주 전 날짜 계산
    const startDate = new Date(inputDate);
    startDate.setDate(inputDate.getDate() - 21);

    const startISO = startDate.toISOString().split("T")[0];
    const endISO = inputDate.toISOString().split("T")[0];

    try {
      const res = await fetch(
        `https://capstone-lozi.onrender.com/v1/data/me?type=${metricKey}&start_date=${startISO}&end_date=${endISO}`,
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

      // 걸음수는 주차별 합계로 처리
      if (metricKey === 'steps') {
        const allDates = [];
        let current = new Date(startISO);
        const end = new Date(endISO);
        while (current <= end) {
          allDates.push(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }

        const raw = {};
        result.data.forEach(item => {
          const date = item.date ?? (item.start_time ? item.start_time.split("T")[0] : '');
          if (date) raw[date] = item.steps ?? 0;
        });

        const values = allDates.map(d => raw[d] ?? 0);
        const week1 = values.slice(0, 7).reduce((a, b) => a + b, 0);
        const week2 = values.slice(7, 14).reduce((a, b) => a + b, 0);
        const week3 = values.slice(14).reduce((a, b) => a + b, 0);

        setChartData({
          labels: ["1주", "2주", "3주"],
          datasets: [{
            label: '걸음 수 (주차별 합계)',
            data: [week1, week2, week3],
            borderColor: '#4e79a7',
            backgroundColor: 'rgba(78,121,167,0.15)',
            fill: true,
            tension: 0.3,
            pointRadius: 4
          }]
        });
        setErrorMsg('');
        return;
      }

      // 일반 메트릭: 일별 라인
      const items = result.data.map(item => {
        const date = item.date ?? (item.start_time ? item.start_time.split("T")[0] : '');
        const value = extractValue(item, metricKey);
        return { date, value };
      }).filter(it => it.date);

      if (items.length === 0) {
        setChartData(null);
        setErrorMsg("데이터 없음");
        return;
      }

      const labels = items.map(it => it.date);
      const values = items.map(it => it.value);
      const metricLabel = METRICS.find(m => m.key === metricKey)?.label ?? metricKey;

      setChartData({
        labels,
        datasets: [
          {
            label: metricLabel,
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