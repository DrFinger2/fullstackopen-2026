import { useState } from "react";
import useField from "../hooks/useField";

const NewBookForm = ({ onAddBook }) => {
  const title = useField({ type: "text" });
  const author = useField({ type: "text" });
  const published = useField({ type: "number" });
  const genreField = useField({ type: "text" });
  const [genres, setGenres] = useState([]);

  const submit = async (event) => {
    event.preventDefault();

    await onAddBook({
      title: title.field.value,
      author: author.field.value,
      published: published.field.value,
      genres,
    });

    title.reset();
    author.reset();
    published.reset();
    genreField.reset();
    setGenres([]);
  };

  const addGenre = () => {
    setGenres(genres.concat(genreField.field.value));
    genreField.reset();
  };

  return (
    <form onSubmit={submit}>
      <div>
        title
        <input {...title.field} />
      </div>
      <div>
        author
        <input {...author.field} />
      </div>
      <div>
        published
        <input {...published.field} />
      </div>
      <div>
        <input {...genreField.field} />
        <button onClick={addGenre} type="button">
          add genre
        </button>
      </div>
      <div>genres: {genres.join(" ")}</div>
      <button type="submit">create book</button>
    </form>
  );
};

export default NewBookForm;
