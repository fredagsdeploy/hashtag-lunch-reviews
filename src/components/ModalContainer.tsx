import React from "react";
import styled from "styled-components";

interface ModalContainerProps {
  title: string;
  onClose: () => void;
}

export const ModalContainer: React.FC<ModalContainerProps> = ({
  children,
  onClose,
  title
}) => (
  <CommentContainerWrapper>
    <Row>
      <PlaceName>{title}</PlaceName>
      <button
        type={"button"}
        onClick={onClose}
        style={{
          background: "transparent",
          border: 0,
          fontSize: 35,
          color: "#909090",
          padding: 0
        }}
      >
        &times;
      </button>
    </Row>
    {children}
  </CommentContainerWrapper>
);

const PlaceName = styled.h2`
  margin: 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const CommentContainerWrapper = styled.div`
  display: grid;
  grid-row-gap: 10px;

  padding: 1em;

  min-width: 30em;

  background-color: #fff;

  @media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;

    min-width: initial;
    flex: 1;
  }
`;
