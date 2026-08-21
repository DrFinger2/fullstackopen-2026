import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableData,
} from '../styles/Table.styles'

import { Wrapper } from '../styles/Page.styles'

function UsersPage() {
  const users = [
    { id: 1, name: 'Alice', username: 'alice', blogs: 2873 },
    { id: 2, name: 'Bob', username: 'bob', blogs: 12382 },
  ]

  return (
    <Wrapper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Username</TableHeader>
              <TableHeader>Blogs created</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableData>{user.name}</TableData>
                <TableData>{user.username}</TableData>
                <TableData>{user.blogs}</TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Wrapper>
  )
}

export default UsersPage
