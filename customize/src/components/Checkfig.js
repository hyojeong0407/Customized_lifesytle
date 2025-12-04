import { useState, useEffect } from "react";

const HeartRateCheck = () => {
  const [hrDec4, setHrDec4] = useState(null);
  const [hrNov28, setHrNov28] = useState(null);

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06";
  const type = "heartrate";

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
        // ✅ 데이터가 있으면 날짜+시간+심박수 출력용 문자열 생성
        const records = result.data.map((item) => {
          const [d, t] = item.start_time.split("T");
          return `${d} ${t} → 심박수: ${item.count}`;
        });
        setter(records);
      } else {
        // ✅ 데이터가 없으면 "날짜 없음" 출력
        setter([`${date} 없음`]);
      }
    } catch (err) {
      console.error("심박수 불러오기 에러:", err);
      setter([`${date} 없음`]);
    }
  };

  useEffect(() => {
    fetchHeartRate("2025-12-04", setHrDec4);
    fetchHeartRate("2025-11-28", setHrNov28);
  }, []);

  return (
    <div>
      <h3>❤️ 심박수 확인</h3>
      <div>
        {hrDec4 ? hrDec4.map((line, idx) => <p key={idx}>{line}</p>) : null}
      </div>
      <div>
        {hrNov28 ? hrNov28.map((line, idx) => <p key={idx}>{line}</p>) : null}
      </div>
    </div>
  );
};

export default HeartRateCheck;