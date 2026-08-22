import { useContext } from "react";
import BookStoreContext from "../contex/bookStoreContex";

const useAuthors = () => {
  const context = useContext(BookStoreContext);
  return {
    authors: context.authors,
    loading: context.loading,
    editAuthor: context.editAuthor,
  };
};

export default useAuthors;
