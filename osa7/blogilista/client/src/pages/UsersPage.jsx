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
import { useUsers } from '../hooks/useUser'

function UsersPage() {
  const users = useUsers()
  const sortedUsers = [...users].sort((a, b) => b.blogs.length - a.blogs.length)

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
            {sortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableData>{user.name}</TableData>
                <TableData>{user.username}</TableData>
                <TableData>{user.blogs.length}</TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Wrapper>
  )
}

export default UsersPage
