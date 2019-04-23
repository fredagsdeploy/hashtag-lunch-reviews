import styled from "styled-components";

export const Cell = styled.div`
  padding: 10px 1em;
  word-break: break-all;
  display: flex;
  align-items: center;
`;

export const WhiteRow = styled.div`
  background-color: white;
`;
export const LastCell = styled.div`
  text-align: center;
`;

export const StarCell = styled(Cell)`
  white-space: nowrap;
  text-align: center;
`;

export const Row = styled.div`
  width: 60%;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.8);
  margin: 1em;
  background-color: #fff;
  border-radius: 24px;
`;

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: any;
  name: string;
}

export var TextInput: (props: TextInputProps) => any = styled.input`
  width: 100%;
`;

export const Button = styled.div`
  background-color: #fff;
  padding: 0.3em 1em;

  width: max-content;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.8);
  border-radius: 24px;

  &:hover {
    cursor: pointer;
    background-color: #ccc;
  }
`;
