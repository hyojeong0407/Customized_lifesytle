// React의 useState, useEffect 훅 불러오기
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ✅ 심박수 상태값
  const [hrDec4, setHrDec4] = useState(null);
  const [hrNov28, setHrNov28] = useState(null);

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06"; // FCM 토큰
  const type = "steps"; // ✅ 심박수 타입 고정

  // 특정 날짜 심박수 가져오기 함수
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
        setter(result.data[0].count || 0); // ✅ 심박수 값
      } else {
        setter(null); // ✅ 데이터 없으면 null
      }
    } catch (err) {
      console.error("심박수 불러오기 에러:", err);
      setter(null);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 심박수 데이터 가져오기
  useEffect(() => {
    fetchHeartRate("2025-12-04", setHrDec4);
    fetchHeartRate("2025-11-28", setHrNov28);
  }, []);

  return (
    <div className="app-container">
      {/* ✅ 심박수 두 개만 표시 */}
      <h3>❤️ 심박수 데이터 (단위: BPM)</h3>
      <p>2025-12-04: {hrDec4 !== null ? `${hrDec4} BPM` : "없음"}</p>
      <p>2025-11-28: {hrNov28 !== null ? `${hrNov28} BPM` : "없음"}</p>
    </div>
  );
}

export default App;