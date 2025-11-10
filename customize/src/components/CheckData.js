import './CheckData.css';
import deepStreamImage from '../Deep_Stream.png';

const CheckData = ({ onClose }) => {
    return (
        <div className="checkdata-container">
            <div className="image">
                <img
                    className="deep-stream"
                    src={deepStreamImage}
                    alt="Deep stream"
                    onClick={() => onClose()}
                />
            </div>

            <div className="text-wrapper"> 
                <h1>데이터 확인</h1>
            </div>

            <section className="date-controls">
                <div className="data-field">
                    <input type="text" placeholder="년" />
                </div>

                <div className="data-field">
                    <input type="text" placeholder="월" />
                </div>

                <div className="data-field">
                    <input type="text" placeholder="일" />
                </div>

                <button className="search-button">검색</button>
            </section>

            <div className="data-lines">

            </div>

        </div>
    );
};

export default CheckData;