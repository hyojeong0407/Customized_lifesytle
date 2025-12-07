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

    const metric = METRICS.find(m => m.key === metricKey);
    if (!metric) {
      setErrorMsg("잘못된 항목 선택");
      return;
    }

    let retries = 0;
    const maxRetries = 5; // 최대 5번 재시도
    let result = null;

    while (retries < maxRetries) {
      try {
        const res = await fetch(
          `https://capstone-lozi.onrender.com/v1/data/me?type=${metric.apiKey}&start_date=${startISO}&end_date=${endISO}`,
          {
            method: "GET",
            headers: { "X-DEVICE-TOKEN": fcmToken },
          }
        );
        result = await res.json();

        if (result && result.data && result.data.length > 0) {
          break; // ✅ 데이터가 있으면 루프 종료
        }
      } catch (err) {
        console.error("요청 에러:", err);
      }

      retries++;
      if (retries < maxRetries) {
        console.log(`데이터 없음, ${retries}번째 재시도...`);
        await new Promise(r => setTimeout(r, 2000)); // 2초 대기 후 재시도
      }
    }

    if (!result || !result.data || result.data.length === 0) {
      setChartData(null);
      setErrorMsg("데이터 없음");
      return;
    }

    // ✅ date 필드만 사용하고 중복 제거 + 날짜 정렬
    const items = result.data.map(item => {
      const date = item.date ? String(item.date).split("T")[0] : null;
      const value = item[metric.apiKey] ?? 0;
      return { date, value };
    }).filter(it => it.date);

    // 중복 제거 (같은 날짜는 마지막 값만 남김)
    const uniqueItems = Array.from(
      new Map(items.map(it => [it.date, it])).values()
    );

    // 날짜 오름차순 정렬
    uniqueItems.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (uniqueItems.length === 0) {
      setChartData(null);
      setErrorMsg("데이터 없음");
      return;
    }

    const labels = uniqueItems.map(it => it.date);
    const values = uniqueItems.map(it => it.value);

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