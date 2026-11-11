export function Toolbar({ onDelete, onSearch }) {
  return (
    <div className="toolbar" style={{ position: 'fixed', bottom: 0, height: '100vh' }}>
      <div onClick={onSearch}><svg width="16" height="16"><circle cx="8" cy="8" r="6" /></svg></div>
      <button onClick={onDelete}><svg width="16" height="16"><path d="M2 2l12 12" /></svg></button>
      <input onPaste={(e) => e.preventDefault()} placeholder="Filter" />
    </div>
  );
}
