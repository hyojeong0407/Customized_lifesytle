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

const CheckData = ({ onClose }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [chartData, setChartData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fcmToken = "사용자의_FCM_토큰"; 
  const type = "steps";

  const handleSearch = async () => {
    const inputDate = new Date(`${year}-${month}-${day}`);
    if (isNaN(inputDate)) {
      setErrorMsg("올바른 날짜를 입력하세요");
      setChartData(null);
      return;
    }

    const startDate = new Date(inputDate);
    startDate.setDate(inputDate.getDate() - 21);

    const startISO = startDate.toISOString().split("T")[0];
    const endISO = inputDate.toISOString().split("T")[0];

    try {
      const res = await fetch(
        `https://capstone-lozi.onrender.com/v1/data/me?type=${type}&start_date=${startISO}&end_date=${endISO}`,
        {
          method: "GET",
          headers: {
            "X-DEVICE-TOKEN": fcmToken,
          },
        }
      );
      const result = await res.json();
      console.log("📌 결과:", result);

      if (!result || !result.data) {
        setChartData(null);
        setErrorMsg("데이터 없음");
        return;
      }

      const rawData = result.data.reduce((acc, item) => {
        const date = item.start_time.split("T")[0];
        acc[date] = item.count;
        return acc;
      }, {});

      const allDates = [];
      let current = new Date(startISO);
      const end = new Date(endISO);
      while (current <= end) {
        allDates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }

      const steps = allDates.map((date, idx) => {
        if (rawData[date]) return rawData[date];
        let prev = null, next = null;
        for (let i = idx - 1; i >= 0; i--) {
          if (rawData[allDates[i]]) { prev = rawData[allDates[i]]; break; }
        }
        for (let j = idx + 1; j < allDates.length; j++) {
          if (rawData[allDates[j]]) { next = rawData[allDates[j]]; break; }
        }
        if (prev !== null && next !== null) return Math.round((prev + next) / 2);
        if (prev !== null) return prev;
        if (next !== null) return next;
        return 0;
      });

      setChartData({
        labels: allDates,
        datasets: [
          {
            label: '걸음 수 (보간 포함)',
            data: steps,
            borderColor: '#4e79a7',
            backgroundColor: '#4e79a7',
            tension: 0.3, // 곡선 부드럽게
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