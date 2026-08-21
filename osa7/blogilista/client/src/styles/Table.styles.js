import styled from 'styled-components'

export const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #2c2c2e;
  background: #161618;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #e8e8e8;
`

export const TableHead = styled.thead`
  background: #0d0d0d;
  border-bottom: 2px solid #2c2c2e;
`

export const TableBody = styled.tbody``

export const TableRow = styled.tr`
  transition: background 0.2s ease;
  &:hover {
    background: #242426;
  }
`

export const TableHeader = styled.th`
  padding: 14px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #f0f0f0;
  border-bottom: 1px solid #2c2c2e;
  white-space: nowrap;
  &:last-child {
    text-align: right;
  }
`

export const TableData = styled.td`
  padding: 14px 20px;
  border-bottom: 1px solid #2c2c2e;
  color: #e8e8e8;
  &:last-child {
    text-align: right;
  }
`
