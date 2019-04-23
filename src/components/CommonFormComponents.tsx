import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const TextInput = styled.input`
  width: 100%;
  border-radius: 8px;
  background: #edeced;
  border: 0;
  font-size: 1em;
  padding: 1em;
  color: #000;
`;

export const TextArea = styled.textarea`
  width: 100%;
  border-radius: 8px;
  background: #edeced;
  border: 0;
  font-size: 1em;
  padding: 1em;
  color: #000;
  min-height: 10em;
`;

export const Suggestions = styled.div`
  position: absolute;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.8);
  background-color: #fff;
  min-width: 28em;
  border-radius: 8px;
`;

export const SuggestionItem = styled.div`
  padding: 1em;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`;

export const FormLabelWrapper = styled.label`
  margin-bottom: 1em;
`;

export const Label = styled.div`
  font-weight: 700;
  padding-bottom: 0.5em;
`;

export const CommentForm = styled.form`
  display: flex;
  flex-direction: column;

  background-color: #fff;
`;

export const SaveButton = styled.button`
  background-color: #6495ed;
  border: none;
  display: flex;
  justify-content: center;
  border-radius: 8px;
  color: #fff;
  font-size: 1em;
  padding: 1em;

  &:disabled {
    opacity: 0.5;
    color: #edeced;
  }

  &:hover {
    cursor: pointer;
    background-color: #6495ed;
  }
`;
