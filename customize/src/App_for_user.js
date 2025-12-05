function App_for_user({ onClose }) {
  return (
    <div>
      <h2>사용자 전용 화면</h2>
      <button onClick={onClose}>메뉴로 돌아가기</button>
    </div>
  );
}

export default App_for_user;