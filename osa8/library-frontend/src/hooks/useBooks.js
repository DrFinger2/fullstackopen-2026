import { useContext } from "react";
import BookStoreContext from "../contex/bookStoreContex";

const useBooks = () => {
  const context = useContext(BookStoreContext);
  return {
    books: context.books,
    loading: context.loading,
    addBook: context.addBook,
  };
};

export default useBooks;
