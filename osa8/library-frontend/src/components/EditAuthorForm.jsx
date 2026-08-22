import useField from "../hooks/useField";
import useSelect from "../hooks/useSelect";

const EditAuthorForm = ({ authors, onEditAuthor }) => {
  const born = useField({ type: "number" });
  const author = useSelect(authors[0]?.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = `Do you really want to update persons ${author.field.value} birthyear to be ${born.field.value}`;
    if (!born.field.value || born.field.value.toString().trim() === "") {
      return;
    }
    if (!window.confirm(message)) {
      return;
    }
    await onEditAuthor({
      name: author.field.value,
      setToBeBorn: born.field.value,
    });
    born.reset();
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

export default EditAuthorForm;
