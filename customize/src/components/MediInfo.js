import './MediInfo.css';
import deepStreamImage from '../Deep_Stream.png';

const MediInfo = ({ onClose }) => {
    return (
        <div className='mediinfo-container'>
            <div className="image">
                <img
                    className="deep-stream"
                    src={deepStreamImage}
                    alt="Deep stream"
                    onClick={() => onClose()}
                />
            </div>

            <div className='mediinfo-text'>
                약의 정보가 없습니다.
            </div>
        </div>
    );
};

export default MediInfo;