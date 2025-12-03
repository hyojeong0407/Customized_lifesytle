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

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CheckData = ({ onClose }) => {
  // 입력값 상태
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  // 차트 데이터 상태
  const [chartData, setChartData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06";  
  const type = "steps";

  /**
   *  응답 데이터를 날짜별로 매핑
   */
  const mapRawData = (data) => {
    return data.reduce((acc, item) => {
      const date = item.start_time.split("T")[0];
      acc[date] = item.count;
      return acc;
    }, {});
  };

  /**
   *  전체 날짜 범위 생성
   */
  const generateDateRange = (startISO, endISO) => {
    const allDates = [];
    let current = new Date(startISO);
    const end = new Date(endISO);
    while (current <= end) {
      allDates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return allDates;
  };

  /**
   *  선형 보간 적용
   */
  const interpolateSteps = (allDates, rawData) => {
    return allDates.map((date, idx) => {
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
  };

  /**
   *  주차별 합계 계산
   */
  const calculateWeeklyData = (steps) => {
    const week1 = steps.slice(0, 7).reduce((a, b) => a + b, 0);
    const week2 = steps.slice(7, 14).reduce((a, b) => a + b, 0);
    const week3 = steps.slice(14).reduce((a, b) => a + b, 0);
    return [week1, week2, week3];
  };

  /**
   *  검색 버튼 클릭 시 실행
   */
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
          headers: { "X-DEVICE-TOKEN": fcmToken },
        }
      );
      const result = await res.json();
      console.log(" 결과:", result);

      if (!result || !result.data) {
        setChartData(null);
        setErrorMsg("데이터 없음");
        return;
      }

      // 데이터 처리
      const rawData = mapRawData(result.data);
      const allDates = generateDateRange(startISO, endISO);
      const steps = interpolateSteps(allDates, rawData);
      const weeklyData = calculateWeeklyData(steps);

      // 차트 데이터 설정
      setChartData({
        labels: ["1주", "2주", "3주"], // ✅ 라벨 고정
        datasets: [
          {
            label: '걸음 수 (주차별 합계)',
            data: weeklyData,
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

      {/* 날짜 입력 영역 */}
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

      {/* 결과 출력 영역 */}
      <div className="data-lines">
        {chartData && <Line data={chartData} />}
        {!chartData && errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default CheckData;