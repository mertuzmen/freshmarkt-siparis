export function Select({ children, ...props }) {
  return (
    <select
      className="border p-2 rounded-md w-full"
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}
