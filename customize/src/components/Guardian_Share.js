import { useState } from 'react';
import './Guardian_Share.css';

const Guardian_Share = ({ onClose, selectedUser, heart }) => {
    const nickname = selectedUser?.nickname || '홍길동';
    
    // 심박수 기준은 예시 (필요하면 값만 바꾸면 됨)
    // 예: 50~100 정상, 40~50 / 100~110 주의, 그 외는 위험
    let level = 'none'; // 'health' | 'warn' | 'danger'

    if (heart !== null && heart !== undefined) {
        if (heart >= 50 && heart <= 100) {
            level = 'health';
        } else if ((heart >= 40 && heart < 50) || (heart > 100 && heart <= 110)) {
            level = 'warn';
        } else{
            level = 'danger';
        }
    }

    return (
        <div className='guardian-container'>
            <button className='guardian-close' onClick={() => onClose()}>
                닫기
            </button>

            <aside className='profile'>
                <div className='avatar'>👤</div>
            </aside>

            <main className='health-summary'>
                <h3>● {nickname}님의 최근 건강상태</h3>
            </main>


            <aside className='health-alerts'>
                <h3>● 현재 건강 알림</h3>

                <div className={`alert-item ${level !== 'health' ? 'hide-alert' : ''}`}>
                    <div className="icon-heart">💚</div>
                    <div className="heart-label">건강</div>
                </div>

                <div className={`alert-item ${level !== 'warn' ? 'hide-alert' : ''}`}>
                    <div className="icon-warn">⚠️</div>
                    <div className="warn-label">주의</div>
                </div>

                <div className={`alert-item ${level !== 'danger' ? 'hide-alert' : ''}`}>
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