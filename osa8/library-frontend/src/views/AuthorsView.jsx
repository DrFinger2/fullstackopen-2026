import useAuthors from "../hooks/useAuthors";
import AuthorTable from "../components/AuthorTable";
import EditAuthorForm from "../components/EditAuthorForm";

const AuthorsView = (props) => {
  const { authors, loading, editAuthor } = useAuthors();

  if (!props.show) {
    return null;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>authors</h2>
      <AuthorTable authors={authors} />
      <EditAuthorForm authors={authors} onEditAuthor={editAuthor} />
    </div>
  );
};

export default AuthorsView;
