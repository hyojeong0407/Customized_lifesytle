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
  const [errorMsg, setErrorMsg] = useState(''); // 에러 메시지 상태 추가

  const fcmToken = "사용자의_FCM_토큰"; // 실제 토큰으로 교체

  const handleSearch = async () => {
    const inputDate = new Date(`${year}-${month}-${day}`);
    const startDate = new Date(inputDate);
    startDate.setDate(inputDate.getDate() - 21);

    const startISO = startDate.toISOString().split("T")[0] + "T00:00:00";
    const endISO = inputDate.toISOString().split("T")[0] + "T00:00:00";

    try {
      const res = await fetch(
        `https://capstone-lozi.onrender.com/v1/data/me?type=steps&start_date=${startISO}&end_date=${endISO}`,
        {
          method: "GET",
          headers: {
            "fcm_token": fcmToken,
          },
        }
      );
      const data = await res.json();
      console.log("📌 결과:", data);

      if (!data || data.length === 0) {
        // 데이터가 없을 경우
        setChartData(null);
        setErrorMsg("데이터 없음");
        return;
      }

      // 데이터가 있을 경우
      const labels = data.map(item => item.date);
      const steps = data.map(item => item.steps);

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
      setErrorMsg(''); // 에러 메시지 초기화
    } catch (err) {
      console.error(err);
      setChartData(null);
      setErrorMsg("데이터 없음"); // 에러 발생 시 메시지 출력
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
        {chartData && <Bar data={chartData} />}
        {!chartData && errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default CheckData;