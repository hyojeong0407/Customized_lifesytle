import { useState } from 'react';
import './Guardian_Share.css';

const Guardian_Share = ({ onClose }) => {
    return (
        <div className='guardian-container'>
            <button className='guardian-close' onClick={() => onClose()}>
                닫기
            </button>

            <aside className='profile'>
                <div className='avatar'>👤</div>
            </aside>

            <main className='health-summary'>
                <h3>ㅇㅇㅇ님의 최근 건강상태</h3>
            </main>


            <aside className='health-alerts'>
                <h3>현재 건강 알림</h3>

                <div className="alert-item">
                    <div className="icon-heart">💚</div>
                    <div className="heart-label">건강</div>
                </div>
                <div className="alert-item">
                    <div className="icon-warn">⚠️</div>
                    <div className="warn-label">주의</div>
                </div>
                <div className="alert-item">
                    <div className="icon-danger">🚨</div>
                    <div className="danger-label">위험</div>
                </div>
            </aside>

            <section className='med-status'>
                <h3>복약 상태</h3>
            </section>
        </div>
    );
};

export default Guardian_Share;