import styled from "styled-components";
import React from "react";

export const Cell = styled.td`
  padding: 0px 1em;
`;

export const WhiteRow = styled.tr`
  background-color: white;
`;
export const LastCell = styled.td`
  text-align: center;
`;

export const StarCell = styled(Cell)`
  white-space: nowrap;
  text-align: center;
`;

export const HeaderCell = styled.th`
  font-weight: bold;
  border-bottom: 2px solid black;
`;

export const Table = styled.table`
  width: 50%;
  border-collapse: collapse;
  justify-self: center;
  grid-area: c;
`;

export const Row = styled.tr`
  &:nth-child(2n + 3) {
    background-color: lightgrey;
  }
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
