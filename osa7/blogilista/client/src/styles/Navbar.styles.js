import styled from 'styled-components'

export const Nav = styled.nav`
  background: #161618;
  padding: 5px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #2a2a2c;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  flex-wrap: wrap;
  gap: 12px;
  backdrop-filter: blur(4px);
  height: 70px;
`

export const NavLinks = styled.div`
  display: flex;
  gap: 28px;
  align-items: center;
  justify-content: center;
  height: 100%;

  a {
    color: #c8c8c8;
    text-decoration: none;
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    transition:
      color 0.2s,
      border-bottom 0.2s;
    padding-bottom: 4px;
    border-bottom: 2px solid transparent;

    &:hover {
      color: #7c7cf8;
      border-bottom-color: #7c7cf8;
      text-decoration: none;
    }
  }
`

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: #c8c8c8;
  font-family: 'Inter', sans-serif;
`
