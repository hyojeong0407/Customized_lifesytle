// ==============================
// ✅ 라이브러리 및 리소스 임포트 영역
// ==============================
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

// Chart.js 플러그인 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


// ==============================
// ✅ 아이콘 정의 영역
// ==============================
const ICONS = [
  { key: 'steps', label: '걸음수', emoji: '🚶' },
  { key: 'distance', label: '거리', emoji: '📏' },
  { key: 'exercise', label: '운동', emoji: '🏃' },
  { key: 'sleep', label: '수면', emoji: '😴' },
];


// ==============================
// ✅ 아이콘 버튼 컴포넌트 영역
// ==============================
const IconButtons = ({ selected, onSelect }) => {
  return (
    <div className="icon-column" role="tablist" aria-label="데이터 항목">
      {ICONS.map(ic => (
        <button
          key={ic.key}
          type="button"
          className={`small-icon-btn ${selected === ic.key ? 'active' : ''}`}
          onClick={() => onSelect(ic.key)}
          aria-pressed={selected === ic.key}
          title={ic.label}
        >
          <span className="emoji" aria-hidden="true">{ic.emoji}</span>
        </button>
      ))}
    </div>
  );
};


// ==============================
// ✅ 메인 컴포넌트 영역
// ==============================
const Checkfig = ({ onClose }) => {
  // 상태 정의
  const [healthData, setHealthData] = useState([]);
  const [selectedType, setSelectedType] = useState("exercise"); // 기본값: 운동

  // 각 항목별 배열 상태
  const [stepsArray, setStepsArray] = useState([]);
  const [distanceArray, setDistanceArray] = useState([]);
  const [exerciseArray, setExerciseArray] = useState([]);
  const [sleepArray, setSleepArray] = useState([]);

  const fcmToken = "9e8ef4ea-877e-3bf2-943f-ec7d4ef21e06";  
  const types = ["steps", "distance", "exercise", "sleep"]; // 심박수 없음

  // ==============================
  // ✅ 데이터 가져오기 (useEffect)
  // ==============================
  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");

      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-${day}`;

      try {
        // API 호출 (steps, distance, exercise, sleep)
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
              dateMap[date][type] = item.count || 0;
            }
          });
        });

        const mergedData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

        // 각 항목별 배열로 변환
        setStepsArray(mergedData.map(d => d.steps));
        setDistanceArray(mergedData.map(d => d.distance));
        setExerciseArray(mergedData.map(d => d.exercise));
        setSleepArray(mergedData.map(d => d.sleep));

        // 전체 데이터 저장
        setHealthData(mergedData);

        // ✅ 서버로 JSON 전송
        const todayStr = new Date().toISOString().split("T")[0];
        const payload = {
          message: "지난 1일부터 todayStr까지 steps, distance, exercise, sleep수치를 분석해서 분석결과와 간단한 피드백을 작성해줘 피드백은 6줄 이내로 글로",
          date: todayStr,
          steps: mergedData.map(d => d.steps),
          distance: mergedData.map(d => d.distance),
          exercise: mergedData.map(d => d.exercise),
          sleep: mergedData.map(d => d.sleep)
        };

        fetch("https://capstone-lozi.onrender.com/v1/data/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-DEVICE-TOKEN": fcmToken
          },
          body: JSON.stringify(payload)
        })
          .then(res => res.json())
          .then(data => {
            console.log("서버 응답:", data);
          })
          .catch(err => {
            console.error("전송 에러:", err);
          });

      } catch (err) {
        console.error("에러 발생:", err);
      }
    };

    fetchData();
  }, []);


  // ==============================
  // ✅ 그래프 데이터 및 옵션
  // ==============================
  const chartData = {
    labels: healthData.map((_, idx) => idx),
    datasets: [
      {
        label: selectedType,
        data: healthData.map((d) => d[selectedType]),
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


  // ==============================
  // ✅ 렌더링 영역
  // ==============================
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
        <div className="quadrant q1">목표 할당량 / 오늘 할당량</div>
        <div className="quadrant q2">오늘 목표 달성   이번 목표 달성</div>
        <div className="quadrant q3">
          <h3>📊 3주간 변화량</h3>
          <div className="q3-inner">
            <IconButtons selected={selectedType} onSelect={setSelectedType} />
            <div className="selected-info">
              <strong>{ICONS.find(i => i.key === selectedType)?.label ?? selectedType}</strong>
            </div>
          </div>
          <div className="mini-chart">
            {healthData.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : null}
          </div>
        </div>
        <div className="quadrant q4">분석결과</div>
      </div>
    </div>
  );
};

export default Checkfig;