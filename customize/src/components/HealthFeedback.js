import { useState, useEffect } from 'react';
import deepStreamImage from '../Deep_Stream.png';
import './HealthFeedback.css';

const HealthFeedback = ({ onOpenCheckData, onOpenCheckfig, onClose }) => {
  const [healthData, setHealthData] = useState([]);

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06"; // ✅ 토큰
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
        // 모든 타입 병렬 요청
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

        // 날짜별 데이터 병합
        const dateMap = {};
        responses.forEach(({ type, data }) => {
          data.forEach((item) => {
            const date = item.start_time.split("T")[0];
            if (!dateMap[date]) {
              dateMap[date] = { date, steps: 0, distance: 0, exercise: 0, sleep: 0 };
            }
            if (type === "steps") dateMap[date].steps = item.count || 0;
            if (type === "distance") dateMap[date].distance = item.count || 0;
            if (type === "exercise") dateMap[date].exercise = item.count || 0;
            if (type === "sleep") dateMap[date].sleep = item.count || 0;
          });
        });

        // 최종 배열 생성 (날짜순 정렬)
        const mergedData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
        setHealthData(mergedData);
        console.log("✅ 최종 배열:", mergedData);
      } catch (err) {
        console.error("에러 발생:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="image">
        <img
          className="deep-stream"
          src={deepStreamImage}
          alt="Deep stream"
          onClick={() => onClose()}
        />
      </div>

      <button
        className="button-data"
        onClick={() => typeof onOpenCheckData === "function" && onOpenCheckData()}
      >
        <div className="text-wrapper">
          저장된 데이터
          <br />
          확인
        </div>
      </button>

      <button
        className="button-feedback"
        onClick={() => typeof onOpenCheckfig === "function" && onOpenCheckfig()}
      >
        <div className="text-wrapper">
          저장된 데이터
          <br />
          기반 피드백
        </div>
      </button>

      {/* ✅ 배열 출력 확인용 */}
      <div className="data-preview">
        {healthData.map((d, idx) => (
          <div key={idx}>
            <strong>{d.date}</strong> 👣 {d.steps} / 📏 {d.distance} / 🏃 {d.exercise} / 😴 {d.sleep}
          </div>
        ))}
      </div>
    </>
  );
};

export default HealthFeedback;