import { useState } from "react";

export const HelloReact = () => {
  const [count, setCount] = useState(0);

  return (
    <button
      type="button"
      onClick={() => setCount((c) => c + 1)}
      className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
    >
      React island clicks: {count}
    </button>
  );
};
