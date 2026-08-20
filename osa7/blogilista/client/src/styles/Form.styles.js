import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`

export const Input = styled.input`
  padding: 12px 16px;
  background: #161618;
  border: 1px solid #2c2c2e;
  border-radius: 10px;
  color: #e8e8e8;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: all 0.2s ease;
  outline: none;

  &::placeholder {
    color: #6a6a6c;
  }

  &:focus {
    border-color: #7c7cf8;
    box-shadow: 0 0 0 3px rgba(124, 124, 248, 0.2);
    background: #1c1c1e;
  }
`