import './Medication.css';
import deepStreamImage from '../Deep_Stream.png';

const Medication = ({ onOpenMediInfo, onClose }) => {
    return (
        <div className='medication-container'>
            <div className="image">
                <img
                    className="deep-stream"
                    src={deepStreamImage}
                    alt="Deep stream"
                    onClick={() => onClose()}
                />
            </div>

            <button className='mediinfo' onClick={() => typeof onOpenMediInfo === 'function' && onOpenMediInfo()}>
                복용 약 정보 보기
            </button>

            <button className='takepill'>
                알약 찍기
            </button>

            <button className='upload-picture'>
                사진 업로드 // test
            </button>
        </div>
    );
};

export default Medication;