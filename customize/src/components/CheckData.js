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

  const fcmToken = "dUblsDINRiKUjJY4sPRruz:APA91bEkyAbW7fwsR9sFi1vYtN9AAGbUXTwchWVuIYu4RDRRRsDTrgANWSUxxNrxkuOm-ivrnGmBTuFHObnZ_0OEzorOGht6d010iRd7tti9IhHqOg_QDO4"; // 실제 토큰으로 교체

  // 검색 버튼 클릭 시 실행
  const handleSearch = async () => {
    const inputDate = new Date(`${year}-${month}-${day}`);
    const startDate = new Date(inputDate);
    startDate.setDate(inputDate.getDate() - 21);

    // ISO 문자열로 변환
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

      // 예시: data가 [{date: "2025-10-20", steps: 3000}, ...] 형태라고 가정
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="checkdata-container">
      {/* 상단 이미지 */}
      <div className="image">
        <img
          className="deep-stream"
          src={deepStreamImage}
          alt="Deep stream"
          onClick={() => onClose()}
        />
      </div>

      {/* 제목 */}
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

      {/* 그래프 출력 */}
      <div className="data-lines">
        {chartData && <Bar data={chartData} />}
      </div>
    </div>
  );
};

export default CheckData;