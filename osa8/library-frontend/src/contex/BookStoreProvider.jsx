import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_ALL_AUTHORS,
  GET_ALL_BOOKS,
  ADD_BOOK,
  EDIT_AUTHOR,
} from "../queries";
import BookStoreContext from "./BookStoreContex";

// needs to be refactored pretty bad...

const BookStoreProvider = ({ children }) => {
  const booksQuery = useQuery(GET_ALL_BOOKS);
  const authorsQuery = useQuery(GET_ALL_AUTHORS);

  const [addMutation, addResult] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_ALL_BOOKS }, { query: GET_ALL_AUTHORS }],
  });
  const [editMutation, editResult] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }],
  });

  const addBook = async ({ title, author, published, genres }) => {
    const result = await addMutation({
      variables: {
        title: String(title),
        author: String(author),
        published: Number(published),
        genres: genres.map((genre) => String(genre)),
      },
    });

    return result.data.addBook;
  };

  // $name: String!, $setBornTo: Int!
  const editAuthor = async ({ name, setToBeBorn }) => {
    const result = await editMutation({
      variables: {
        name: String(name),
        setBornTo: Number(setToBeBorn),
      },
    });
    return result.data.editAuthor;
  };

  const result = {
    books: booksQuery.data?.allBooks ?? [],
    authors: authorsQuery.data?.allAuthors ?? [],
    // probably not the best approach
    loading:
      booksQuery.loading ||
      authorsQuery.loading ||
      addResult.loading ||
      editResult.loading,

    error:
      booksQuery.error ||
      authorsQuery.error ||
      addResult.error ||
      editResult.error,

    addBook: addBook,
    editAuthor: editAuthor,
  };

  return (
    <BookStoreContext.Provider value={result}>
      {children}
    </BookStoreContext.Provider>
  );
};

export default BookStoreProvider;
