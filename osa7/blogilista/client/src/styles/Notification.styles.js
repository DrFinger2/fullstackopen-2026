import styled, { css } from 'styled-components'

export const Container = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Message = styled.p`
  display: flex;
  align-items: center;
  padding: 0 50px;
  margin: 0;
  height: 70%;
  font-size: 14px;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;

  ${({ $type }) =>
    $type === 'error' &&
    css`
      border: 1px solid #f1b8b8;
      background-color: #ffe3e3;
      color: darkred;
      &::first-letter {
        text-transform: uppercase;
      }
    `}

  ${({ $type }) =>
    $type === 'success' &&
    css`
      border: 1px solid #a8d5a8;
      background-color: #e3f5e3;
      color: #287a28;
    `}

  ${({ $visible }) =>
    $visible &&
    css`
      opacity: 1;
      pointer-events: auto;
    `}
`