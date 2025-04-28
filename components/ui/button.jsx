export function Button({ children, ...props }) {
  return (
    <button className="p-2 rounded-lg shadow-md bg-blue-500 text-white" {...props}>
      {children}
    </button>
  );
}
