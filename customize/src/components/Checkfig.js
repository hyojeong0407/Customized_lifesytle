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
  const [healthData, setHealthData] = useState([]);

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06"; 
  const types = ["steps", "distance", "exercise", "sleep"];

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${day}`;

      try {
        const responses = await Promise.all(
          types.map(async (type) => {
            const res = await fetch(
              `https://capstone-lozi.onrender.com/v1/data/me?type=${type}&start_date=${startDate}&end_date=${endDate}`,
              {
                method: "GET",
                headers: { "X-DEVICE-TOKEN": fcmToken },
              }
            );
            const result = await res.json();
            return { type, data: result.data || [] };
          })
        );

        // 날짜 범위 전체 생성
        const allDates = [];
        let current = new Date(startDate);
        const end = new Date(endDate);
        while (current <= end) {
          allDates.push(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }

        // 날짜별 데이터 병합
        const dateMap = {};
        allDates.forEach((date) => {
          dateMap[date] = { date, steps: 0, distance: 0, exercise: 0, sleep: 0 };
        });

        responses.forEach(({ type, data }) => {
          data.forEach((item) => {
            const date = item.start_time.split("T")[0];
            if (dateMap[date]) {
              if (type === "steps") dateMap[date].steps = item.count || 0;
              if (type === "distance") dateMap[date].distance = item.count || 0;
              if (type === "exercise") dateMap[date].exercise = item.count || 0;
              if (type === "sleep") dateMap[date].sleep = item.count || 0;
            }
          });
        });

        const mergedData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
        setHealthData(mergedData);
      } catch (err) {
        console.error("에러 발생:", err);
      }
    };

    fetchData();
  }, []);

  // 📌 q3 그래프 데이터 (운동 변화량)
  const exerciseData = {
    labels: healthData.map((_, idx) => idx), // 날짜 대신 인덱스만 사용
    datasets: [
      {
        label: "운동 변화량",
        data: healthData.map((d) => d.exercise),
        borderColor: "#4e79a7",
        backgroundColor: "#4e79a7",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    plugins: { legend: { display: false } }, // 범례 제거
    scales: {
      x: { display: false }, // x축 라벨 제거
      y: { display: false }, // y축 라벨 제거
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
        <div className="quadrant q1">
          <h3>👣 걸음수</h3>
          {healthData.map((d, idx) => (
            <div key={idx}>{d.date}: {d.steps}</div>
          ))}
        </div>
        <div className="quadrant q2">
          <h3>📏 거리</h3>
          {healthData.map((d, idx) => (
            <div key={idx}>{d.date}: {d.distance}</div>
          ))}
        </div>
        <div className="quadrant q3">
          <h3>🏃 운동 변화량</h3>
          {/* ✅ 선 그래프 표시 */}
          {healthData.length > 0 && <Line data={exerciseData} options={chartOptions} />}
        </div>
        <div className="quadrant q4">
          <h3>😴 수면</h3>
          {healthData.map((d, idx) => (
            <div key={idx}>{d.date}: {d.sleep}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Checkfig;