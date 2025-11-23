import deepStreamImage from '../Deep_Stream.png';
import './HealthFeedback.css';
const HealthFeedback = ({ onOpenCheckData, onOpenCheckfig, onClose }) => {

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
            
            <button className="button-data" onClick={() => typeof onOpenCheckData === 'function' && onOpenCheckData()}>
                <div className="text-wrapper">
                    저장된 데이터
                    <br />
                    확인
                </div>
            </button>
            
            <button className="button-feedback" onClick={() => typeof onOpenCheckfig === 'function' && onOpenCheckfig()}>
                <div className="text-wrapper">
                    저장된 데이터
                    <br />
                    기반 피드백
                </div>
            </button>
        </>
    );
};

export default HealthFeedback;