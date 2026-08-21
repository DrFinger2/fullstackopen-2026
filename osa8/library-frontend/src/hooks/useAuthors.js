import { useContext } from "react";
import BookStoreContext from "../contex/bookStoreContex";

const useAuthors = () => {
  const context = useContext(BookStoreContext);
  return { authors: context.authors, loading: context.loading };
};

export default useAuthors;
