import React, { Suspense } from "react";
import Modal from "react-modal";
import { Spinner } from "../Spinner";
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
    bodyOpenClassName={"modal-open"}
    shouldCloseOnEsc
    shouldCloseOnOverlayClick
    onRequestClose={onRequestClose}
  >
    <Suspense fallback={<Spinner size={"large"} padding={"4rem"} />}>
      {children}
    </Suspense>
  </Modal>
);
