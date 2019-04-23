import React from "react";
import Modal from "react-modal";
import "./modal.css";

interface LunchModalProps {
  onRequestClose: () => void;
}

export const LunchModal: React.FC<LunchModalProps> = ({
  children,
  onRequestClose
}) => (
  <Modal
    isOpen
    className={"modal-container"}
    overlayClassName={"modal-overlay"}
    shouldCloseOnEsc
    shouldCloseOnOverlayClick
    onRequestClose={onRequestClose}
  >
    {children}
  </Modal>
);
