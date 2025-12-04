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

const Checkfig = ({ onClose }) => {
  const [hrDec4, setHrDec4] = useState(0);
  const [hrNov28, setHrNov28] = useState(0);
  const [selectedType, setSelectedType] = useState("exercise");

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06";  

  // 특정 날짜 심박수 가져오기 함수
  const fetchHeartRate = async (date, setter) => {
    try {
      const res = await fetch(
        `https://capstone-lozi.onrender.com/v1/data/me?type=heartrate&start_date=${date}&end_date=${date}`,
        {
          method: "GET",
          headers: { "X-DEVICE-TOKEN": fcmToken },
        }
      );
      const result = await res.json();
      if (result && result.data && result.data.length > 0) {
        setter(result.data[0].count || 0);
      } else {
        setter(0);
      }
    } catch (err) {
      console.error("심박수 불러오기 에러:", err);
      setter(0);
    }
  };

  useEffect(() => {
    // ✅ 12월 4일, 11월 28일 심박수 가져오기
    fetchHeartRate("2025-12-04", setHrDec4);
    fetchHeartRate("2025-11-28", setHrNov28);
  }, []);

  // 📌 선택된 데이터 그래프 (예시: 운동)
  const chartData = {
    labels: [1, 2, 3], // 단순 인덱스
    datasets: [
      {
        label: selectedType,
        data: [10, 20, 30], // 임시 데이터
        borderColor: "#4e79a7",
        backgroundColor: "#4e79a7",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="checkfig-container">
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
        <h1>데이터 피드백</h1>
      </div>

      {/* 4분할 데이터 영역 */}
      <div className="data-graphs">
        {/* ✅ q1: 심박수 두 개만 표시 */}
        <div className="quadrant q1">
          <h3>❤️ 심박수</h3>
          <p>2025-12-04: {hrDec4}</p>
          <p>2025-11-28: {hrNov28}</p>
        </div>

        <div className="quadrant q2"></div>

        <div className="quadrant q3">
          <h3>📊 3주간 변화량</h3>
          <div className="mini-chart">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="quadrant q4"></div>
      </div>
    </div>
  );
};

export default Checkfig;