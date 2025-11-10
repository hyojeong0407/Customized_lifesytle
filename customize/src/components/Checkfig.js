import './Checkfig.css';
import deepStreamImage from '../Deep_Stream.png';

const Checkfig = ({ onClose }) => {
    return (
        <div className="checkfig-container">
            <div className="image">
                <img
                    className="deep-stream"
                    src={deepStreamImage}
                    alt="Deep stream"
                    onClick={() => onClose()}
                />
            </div>

            <div className="text-wrapper"> 
                <h1>데이터 피드백</h1>
            </div>

            <div className="data-graphs">
                <div className="quadrant q1"></div>
                <div className="quadrant q2"></div>
                <div className="quadrant q3"></div>
                <div className="quadrant q4"></div>
            </div>
        </div>
    );
};

export default Checkfig;