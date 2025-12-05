function App_for_guard({ onClose }) {
  return (
    <div>
      <h2>보호자 전용 화면</h2>
      <button onClick={onClose}>메뉴로 돌아가기</button>
    </div>
  );
}

export default App_for_guard;