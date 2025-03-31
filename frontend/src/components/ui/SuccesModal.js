import React from 'react';
import './SuccesModal.css';

const SuccessModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>✅ Aplikimi u dërgua me sukses!</h2>
        <p>Faleminderit që aplikove. Do të njoftohesh së shpejti.</p>
        <button onClick={onClose}>Mbyll</button>
      </div>
    </div>
  );
};

export default SuccessModal;
