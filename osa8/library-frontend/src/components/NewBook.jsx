import { useState } from "react";
import useField from "../hooks/useField";
import useBooks from "../hooks/useBooks";

const NewBook = (props) => {
  const title = useField("text");
  const author = useField("text");
  const published = useField("number");
  const genre = useField("text");
  const [genres, setGenres] = useState([]);
  const { addBook } = useBooks();

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    await addBook({
      title: title.field.value,
      author: author.field.value,
      published: published.field.value,
      genres,
    });

    console.log("added a book");
    title.reset();
    published.reset();
    author.reset();
    genre.reset();
    setGenres([]);
  };

  const addGenre = () => {
    if (genre.field.value.trim() === "") return;
    setGenres(genres.concat(genre.field.value));
    genre.reset();
  };

  const genresString = genres.join(" ");
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title <input {...title.field} />
        </div>
        <div>
          author <input {...author.field} />
        </div>
        <div>
          published <input {...published.field} />
        </div>
        <div>
          <input {...genre.field} />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genresString}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
