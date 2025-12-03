// React 훅 불러오기
import { useState } from 'react';
import './CheckData.css';
import deepStreamImage from '../Deep_Stream.png';

const CheckData = ({ onClose }) => {
    // 입력값 상태 관리
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    // 결과 표시 상태 관리
    const [result, setResult] = useState('');

    // 검색 버튼 클릭 시 실행되는 함수
    const handleSearch = () => {
        // 입력값을 합쳐서 결과 문자열 생성
        setResult(`${year}년 ${month}월 ${day}일 데이터를 표시합니다.`);
    };

    return (
        <div className="checkdata-container">
            {/* 상단 이미지 영역 */}
            <div className="image">
                <img
                    className="deep-stream"
                    src={deepStreamImage}
                    alt="Deep stream"
                    onClick={() => onClose()}
                />
            </div>

            {/* 제목 영역 */}
            <div className="text-wrapper"> 
                <h1>데이터 확인</h1>
            </div>

            {/* 날짜 입력 영역 */}
            <section className="date-controls">
                <div className="data-field">
                    <input 
                        type="text" 
                        placeholder="년" 
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </div>

                <div className="data-field">
                    <input 
                        type="text" 
                        placeholder="월" 
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    />
                </div>

                <div className="data-field">
                    <input 
                        type="text" 
                        placeholder="일" 
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                    />
                </div>

                <button className="search-button" onClick={handleSearch}>
                    검색
                </button>
            </section>

            {/* 검색 결과 표시 영역 */}
            <div className="data-lines">
                {result && <p>{result}</p>}
            </div>
        </div>
    );
};

export default CheckData;