import { useState } from "react";

const useSelect = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);

  const field = {
    value,
    onChange: (e) => {
      setValue(e.target.value);
    },
  };

  const reset = () => {
    setValue("");
  };

  return {
    field,
    reset,
  };
};

export default useSelect;
