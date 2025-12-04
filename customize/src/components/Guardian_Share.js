import { useState } from 'react';
import './Guardian_Share.css';

const Guardian_Share = ({ onClose }) => {
    return (
        <div className='guardian-container'>
            <button onClick={() => onClose()}>
                닫기
            </button>
        </div>
    );
};

export default Guardian_Share;