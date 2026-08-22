import useAuthors from "../hooks/useAuthors";
import useField from "../hooks/useField";
import useSelect from "../hooks/useSelect";

const UpdateAuthor = () => {
  const { authors, loading, editAuthor } = useAuthors();
  const born = useField("number");
  const author = useSelect(authors[0]?.name);

  if (loading) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = `Do you really want to update persons ${author.field.value} birthyear to be ${born.field.value}`;

    if (!born.field.value || !born.field.value.trim() === "") {
      return;
    }
    if (!window.confirm(message)) {
      return;
    }

    await editAuthor({
      name: author.field.value,
      setToBeBorn: born.field.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <div>Choose an author:</div>
        <div>
          <select {...author.field}>
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div>Born:</div>
          <input {...born.field} />
        </div>
        <div>
          <button type="submit">Update</button>
        </div>
      </fieldset>
    </form>
  );
};

export default UpdateAuthor;
