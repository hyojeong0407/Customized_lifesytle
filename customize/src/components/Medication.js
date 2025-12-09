import { useRef, useState } from 'react';
import './Medication.css';
import deepStreamImage from '../Deep_Stream.png';
import axios from "axios";

// 📌 업로드 API 그대로 사용
async function uploadPillImage(uid, file) {
  const formData = new FormData();
  formData.append("uid", uid);
  formData.append("file", file);

  const res = await axios.post(
    "https://capstone-lozi.onrender.com/v1/ingest/pill_image",
    formData,
    {
      headers: {
        Authorization: "Bearer capstone_token_0905",
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}

const Medication = ({ onOpenMediInfo, onClose, selectedUser }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  // 📌 파일 선택 시 업로드 처리
  const handleUpload = async (file) => {
    if (!file) return;

    const uid = selectedUser?.uid;
    if (!uid) {
      alert("UID가 없습니다.");
      return;
    }

    try {
      setUploading(true);
      const res = await uploadPillImage(uid, file);
      setResult(res);
      alert("알약 이미지 업로드 완료!");

      console.log("업로드 결과:", res);

    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 실패");
    } finally {
      setUploading(false);
    }
  };

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

      <button
        className='mediinfo'
        onClick={() =>
          typeof onOpenMediInfo === 'function' && onOpenMediInfo()
        }
      >
        복용 약 정보 보기
      </button>

      <button className='takepill'>
        알약 찍기
      </button>

      {/* 📌 사진 업로드 버튼 */}
      <button
        className='upload-picture'
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "업로드 중..." : "사진 업로드"}
      </button>

      {/* 📌 숨겨진 파일 선택 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      {result && (
        <pre style={{ marginTop: "10px", fontSize: "12px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Medication;
