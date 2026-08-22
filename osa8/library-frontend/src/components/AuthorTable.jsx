const AuthorTable = ({ authors }) => (
  <table>
    <tbody>
      <tr>
        <th></th>
        <th>born</th>
        <th>books</th>
      </tr>
      {authors.map((author) => (
        <tr key={author.name}>
          <td>{author.name}</td>
          <td>{author.born}</td>
          <td>{author.bookCount}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default AuthorTable;
