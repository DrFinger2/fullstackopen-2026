import styled from 'styled-components'

export const Container = styled.div`
  background: #1c1c1e;
  border-radius: 16px;
  padding: 32px 36px;
  margin: ${({ $margin = '20px auto' }) => $margin};
  width: ${({ $width = '100%' }) => $width};
  max-width: 500px;
  height: fit-content;
  display: flex;
  flex-direction: ${({ $direction = 'column' }) => $direction};
  gap: ${({ $gap = '0' }) => $gap};
  align-items: ${({ $alignX = 'center' }) => {
    switch ($alignX) {
      case 'left':
        return 'flex-start'
      case 'right':
        return 'flex-end'
      default:
        return 'center'
    }
  }};
  justify-content: ${({ $alignY = 'start' }) => {
    switch ($alignY) {
      case 'top':
        return 'flex-start'
      case 'center':
        return 'center'
      case 'bottom':
        return 'flex-end'
      default:
        return 'flex-start'
    }
  }};
  border: 1px solid #2c2c2e;
`

export const Wrapper = styled.div`
  margin: ${({ $margin = '20px auto' }) => $margin};
  width: ${({ $width = '100%' }) => $width};
  max-width: 500px;
  height: fit-content;
  display: flex;
  flex-direction: ${({ $direction = 'column' }) => $direction};
  gap: ${({ $gap = '0' }) => $gap};
  align-items: ${({ $alignX = 'center' }) => {
    switch ($alignX) {
      case 'left':
        return 'flex-start'
      case 'right':
        return 'flex-end'
      default:
        return 'center'
    }
  }};
  justify-content: ${({ $alignY = 'start' }) => {
    switch ($alignY) {
      case 'top':
        return 'flex-start'
      case 'center':
        return 'center'
      case 'bottom':
        return 'flex-end'
      default:
        return 'flex-start'
    }
  }};
`

export const Section = styled.div`
  background: #0d0d0d;
  padding: 40px 20px;
  border-radius: 0;
  display: flex;
  justify-content: center;
  min-height: 80vh;
  margin: 0;
`

export const Title = styled.h2`
  margin: ${({ $margin = '1.5rem 0 0.5rem 0' }) => $margin};
  padding: ${({ $padding = '0 0 12px 0' }) => $padding};
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #f0f0f0;
  letter-spacing: -0.5px;
  width: auto;
  display: inline-block;
`

const headingBase = `
  font-family: 'Inter', sans-serif;
  color: #f0f0f0;
  margin: 0 0 0.5em 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
`

export const H1 = styled.h1`
  ${headingBase}
  font-size: 2.2rem;
  font-weight: 700;
`

export const H2 = styled.h2`
  ${headingBase}
  font-size: 1.7rem;
  font-weight: 600;
`

export const H3 = styled.h3`
  ${headingBase}
  font-size: 1.3rem;
  font-weight: 600;
`

export const H4 = styled.h4`
  ${headingBase}
  font-size: 1rem;
  font-weight: 500;
`

export const Paragraph = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #b0b0b0;
  margin: 0 0 0.75em 0;
  line-height: 1.7;
  letter-spacing: 0;
  margin: 0px;
`

export const Card = styled.div`
  background: #242426;
  padding: 25px 30px;
  margin: 12px 0;
  border: 1px solid #323234;
  border-radius: 14px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);

  cursor: default;

  a {
    color: #7c7cf8;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      color: #a8a8ff;
    }
  }
`
