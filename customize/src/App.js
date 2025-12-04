const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06";  
const type = "heart_rate";   // ✅ 심박수 타입
const startDate = "2025-11-28";  // ✅ 날짜만 (T00:00:00 제거)
const endDate   = "2025-12-04";  // ✅ 날짜만

fetch(`https://capstone-lozi.onrender.com/v1/data/me?type=${type}&start_date=${startDate}&end_date=${endDate}`, {
    method: "GET",
    headers: {
        "X-DEVICE-TOKEN": fcmToken   // ✅ 올바른 헤더 키
    }
})
.then(res => res.json())
.then(data => {
    console.log("📌 심박수 결과:", data);
})
.catch(err => console.error(err));