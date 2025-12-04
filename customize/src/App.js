import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [hrDec4, setHrDec4] = useState(null);
  const [hrNov28, setHrNov28] = useState(null);

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06"; // 실제 토큰 입력
  const type = "heart_rate";

  // 특정 날짜 심박수 가져오기
  const fetchHeartRate = async (date, setter) => {
    try {
      const res = await fetch(
        `https://capstone-lozi.onrender.com/v1/data/me?type=${type}&start_date=${date}&end_date=${date}`,
        {
          method: "GET",
          headers: { "X-DEVICE-TOKEN": fcmToken },
        }
      );
      const result = await res.json();

      if (result && result.data && result.data.length > 0) {
        // ✅ 날짜와 심박수 함께 출력
        const item = result.data[0];
        const dateOnly = item.start_time.split("T")[0];
        setter(`${dateOnly} → ${item.count} BPM`);
      } else {
        setter(`${date} 없음`);
      }
    } catch (err) {
      console.error("심박수 불러오기 에러:", err);
      setter(`${date} 없음`);
    }
  };

  useEffect(() => {
    fetchHeartRate("2025-12-04", setHrDec4);
    fetchHeartRate("2025-11-28", setHrNov28);
  }, []);

  return (
    <div className="app-container">
      <h3>❤️ 심박수 데이터</h3>
      <p>{hrDec4}</p>
      <p>{hrNov28}</p>
    </div>
  );
}

export default App;