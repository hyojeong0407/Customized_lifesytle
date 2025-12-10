import { useEffect, useState } from 'react';
import axios from 'axios';
import './MediInfo.css';

// 🟢 사용자별 알약 기록 조회
async function getPillList(uid) {
  const res = await axios.get(
    `https://capstone-lozi.onrender.com/v1/ingest/pill_list?uid=${uid}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer capstone_token_0905',
      },
    }
  );
  return res.data; // [{ id, pill_name, ... }]
}

// 🔴 알약 기록 삭제
async function deletePill(id) {
  const res = await axios.delete(
    `https://capstone-lozi.onrender.com/v1/ingest/pill/${id}`,
    {
      headers: {
        Authorization: 'Bearer capstone_token_0905',
      },
    }
  );
  return res.data;
}

const MediInfo = ({ onClose, selectedUser, meds: initialMeds = [] }) => {
  const [meds, setMeds] = useState(initialMeds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uid = selectedUser?.uid;

  // ✅ uid 기준으로 알약 리스트 불러오기
  const loadList = async () => {
    if (!uid) {
      setError('UID가 없습니다.');
      setMeds([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getPillList(uid);
      // API에서 오는 그대로 사용 (pill_name만 쓰면 됨)
      setMeds(data || []);
    } catch (err) {
      console.error('복용 약 정보 불러오기 실패:', err);
      setError('복용 약 정보를 불러오지 못했습니다.');
      setMeds([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 / uid 변경 시 자동 조회
  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  // 삭제 버튼 클릭 시
  const handleDelete = async (id) => {
    if (!window.confirm('이 약 정보를 삭제하시겠습니까?')) return;

    try {
      await deletePill(id);
      await loadList(); // 삭제 후 새로고침
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className='mediinfo-container'>
      <button
        className='mediinfo-close'
        onClick={() => {
          if (typeof onClose === 'function') onClose();
        }}
      >
        닫기
      </button>

      <div className='mediInfo'>
        {/* 로딩 / 에러 / 데이터 없음 처리 */}
        {loading ? (
          <div className='mediinfo-text'>복용 약 정보를 불러오는 중...</div>
        ) : error ? (
          <div className='mediinfo-text'>{error}</div>
        ) : !meds || meds.length === 0 ? (
          <div className='mediinfo-text'>약의 정보가 없습니다.</div>
        ) : (
          <div className='medi-list'>
            <table>
              <thead>
                <tr>
                  <th>약이름</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {meds.map((m, idx) => (
                  <tr key={m.id ?? idx}>
                    {/* 🔹 pill_name만 보여주도록 변경 */}
                    <td className='medi-name'>{m.pill_name ?? `약 ${idx + 1}`}</td>

                    <td>
                      <button
                        className='medi-delete'
                        type='button'
                        onClick={() => handleDelete(m.id)}
                      >
                        삭제
                      </button>
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
