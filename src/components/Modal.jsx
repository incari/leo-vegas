import React from 'react';
import '../styles/Modal.scss';

const Modal = ({ show, handleClose, children }) => (
    <div className={`modal ${show ? 'display-block' : 'display-none'}`}>
        <div className="modal-content">
            <span className="close" onClick={handleClose}>&times;</span>
            {children}
        </div>
    </div>
);

export default Modal;
