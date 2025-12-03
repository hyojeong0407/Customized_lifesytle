import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './CheckData.css';
import deepStreamImage from '../Deep_Stream.png';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CheckData = ({ onClose }) => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [chartData, setChartData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06"; 
  const type = "steps";

  const handleSearch = async () => {
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
        `https://capstone-lozi.onrender.com/v1/data/me?type=${type}&start_date=${startISO}&end_date=${endISO}`,
        {
          method: "GET",
          headers: {
            "X-DEVICE-TOKEN": fcmToken, // ✅ 헤더 이름 확인 필요
          },
        }
      );
      const result = await res.json();
      console.log("📌 결과:", result);

      // 데이터가 없거나 배열이 비어있으면
      if (!result || !result.data) {
        setChartData(null);
        setErrorMsg("데이터 없음");
        return;
      }

      // ✅ count 값이 있는 데이터만 필터링
      const validData = result.data.filter(item => item.count && item.count > 0);

      if (validData.length === 0) {
        setChartData(null);
        setErrorMsg("데이터 없음");
        return;
      }

      // 날짜와 걸음 수 추출
      const labels = validData.map(item => item.start_time.split("T")[0]);
      const steps = validData.map(item => item.count);

      setChartData({
        labels,
        datasets: [
          {
            label: '걸음 수',
            data: steps,
            backgroundColor: '#4e79a7',
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

      {/* 날짜 입력 */}
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

      {/* 결과 출력 */}
      <div className="data-lines">
        {chartData && <Bar data={chartData} />}
        {!chartData && errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default CheckData;