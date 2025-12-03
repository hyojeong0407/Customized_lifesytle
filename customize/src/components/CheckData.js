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

  const handleSearch = () => {
    // 입력 날짜 객체 생성
    const inputDate = new Date(`${year}-${month}-${day}`);

    // 3주 전 날짜 계산
    const startDate = new Date(inputDate);
    startDate.setDate(inputDate.getDate() - 21);

    // 주차별 범위 계산
    const week1Start = new Date(startDate);
    const week1End = new Date(startDate);
    week1End.setDate(week1Start.getDate() + 6);

    const week2Start = new Date(week1End);
    week2Start.setDate(week2Start.getDate() + 1);
    const week2End = new Date(week2Start);
    week2End.setDate(week2Start.getDate() + 6);

    const week3Start = new Date(week2End);
    week3Start.setDate(week3Start.getDate() + 1);

    // 차트 데이터 구성
    setChartData({
      labels: ['1주차', '2주차', '3주차'],
      datasets: [
        {
          label: '날짜 범위',
          data: [7, 7, (inputDate - week3Start) / (1000 * 60 * 60 * 24) + 1],
          backgroundColor: ['#4e79a7', '#f28e2b', '#e15759'],
        },
      ],
    });
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
        <input type="text" placeholder="년" value={year} onChange={(e) => setYear(e.target.value)} />
        <input type="text" placeholder="월" value={month} onChange={(e) => setMonth(e.target.value)} />
        <input type="text" placeholder="일" value={day} onChange={(e) => setDay(e.target.value)} />
        <button className="search-button" onClick={handleSearch}>검색</button>
      </section>

      <div className="data-lines">
        {chartData && <Bar data={chartData} />}
      </div>
    </div>
  );
};

export default CheckData;