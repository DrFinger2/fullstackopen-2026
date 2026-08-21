import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_AUTHORS, GET_ALL_BOOKS, ADD_BOOK } from "../queries";
import BookStoreContext from "./BookStoreContex";

const BookStoreProvider = ({ children }) => {
  const booksQuery = useQuery(GET_ALL_BOOKS);
  const authorsQuery = useQuery(GET_ALL_AUTHORS);

  const mutationOptions = { refetchQueries: [{ query: GET_ALL_BOOKS }] };
  const [addMutation, addResult] = useMutation(ADD_BOOK, mutationOptions);

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

  const result = {
    books: booksQuery.data?.allBooks ?? [],
    authors: authorsQuery.data?.allAuthors ?? [],
    loading: booksQuery.loading || authorsQuery.loading || addResult.loading,
    error: booksQuery.error || authorsQuery.error || addResult.error,
    addBook: addBook,
  };

  return (
    <BookStoreContext.Provider value={result}>
      {children}
    </BookStoreContext.Provider>
  );
};

export default BookStoreProvider;
