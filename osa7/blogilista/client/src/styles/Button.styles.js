import styled from 'styled-components'

export const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  background: #7c7cf8;
  color: #0d0d0d;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #6a6af0;
  }

  &:disabled {
    background: #3a3a3c;
    color: #6a6a6c;
    cursor: not-allowed;
  }
`

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 12px;
  border: none;
  border-radius: 5px;
  background: #7c7cf8;
  color: #0d0d0d;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover:not(:disabled) {
    background: #6a6af0; /* same hover */
  }

  &:disabled {
    background: #3a3a3c;
    color: #6a6a6c;
    cursor: not-allowed;
  }
`

export const ToggleGroup = styled.div`
  display: inline-grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;

  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #3a3a3c;
  background: #161618;
`

export const ToggleOption = styled.button`
  padding: 12px 28px;
  background: ${({ $active }) => ($active ? '#7c7cf8' : 'transparent')};
  color: ${({ $active }) => ($active ? '#0d0d0d' : '#c8c8c8')};
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.25s ease;
  text-align: center;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? '#6a6af0' : '#2c2c2e')};
    color: ${({ $active }) => ($active ? '#0d0d0d' : '#f0f0f0')};
  }

  &:not(:last-child) {
    border-right: 1px solid #3a3a3c;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`
