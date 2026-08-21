import { useQuery } from "@apollo/client/react";
import { GET_ALL_AUTHORS } from "../queries";
import BookStoreContext from "./bookStoreContex";

const BookStoreProvider = ({ children }) => {
  const { loading, error, data } = useQuery(GET_ALL_AUTHORS);

  const result = {
    books: data?.allBooks ?? [],
    loading: loading,
    error: error,
  };

  return (
    <BookStoreContext.Provider value={result}>
      {children}
    </BookStoreContext.Provider>
  );
};

export default BookStoreProvider;
