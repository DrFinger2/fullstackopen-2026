import styled from 'styled-components'

export const UnorderedList = styled.ul`
  font-family: 'Inter', sans-serif;
  color: #e8e8e8;
  margin: 0 0 0.75rem 0;
  padding-left: 1.5rem;
  list-style-type: disc;
  line-height: 1.7;

  ul {
    list-style-type: circle;
  }
  ul ul {
    list-style-type: square;
  }
`

export const OrderedList = styled.ol`
  font-family: 'Inter', sans-serif;
  color: #e8e8e8;
  margin: 0 0 0.75rem 0;
  padding-left: 1.5rem;
  list-style-type: decimal;
  line-height: 1.7;

  ol {
    list-style-type: lower-alpha;
  }
  ol ol {
    list-style-type: lower-roman;
  }
`

export const ListItem = styled.li`
  margin-bottom: 0.25rem;
  color: #e8e8e8;
  text-transform: capitalize;

  &:last-child {
    margin-bottom: 0;
  }
`
