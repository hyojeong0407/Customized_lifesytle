import './MediInfo.css';

const MediInfo = ({ onClose, meds = [] }) => {
    return (
        <div className='mediinfo-container'>
            <button className='mediinfo-close' onClick={() => { if (typeof onClose === 'function') onClose(); }}>
                닫기
            </button>

            <div className='mediInfo'>
                {(!meds || meds.length === 0) ? (
                    <div className='mediinfo-text'>
                        약의 정보가 없습니다.
                    </div>
                ) : (
                    <div className='medi-list'>
                        <table>
                            <thead>
                                <tr>
                                    <th>약이름</th>
                                    <th>수정</th>
                                    <th>삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meds.map((m, idx) => (
                                    <tr key={m.uid ?? idx}>
                                        <td className='medi-name'>{m.name ?? `약 ${idx + 1}`}</td>
                                        <td>
                                            <button className='medi-edit'>수정</button>
                                        </td>
                                        <td>
                                            <button className='medi-delete'>삭제</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediInfo;