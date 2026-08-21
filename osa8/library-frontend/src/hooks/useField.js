import { useState } from "react";

const useField = ({ type }) => {
  const [value, setValue] = useState("");
  const field = {
    type: type,
    value: value,
    onChange: (e) => {
      setValue(e.target.value);
    },
  };
  const reset = () => {
    setValue("");
  };
  return {
    field: field,
    reset: reset,
  };
};

export default useField;
