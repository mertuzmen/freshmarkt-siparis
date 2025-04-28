export function Card({ children, ...props }) {
  return (
    <div className="border rounded-2xl shadow-md" {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, ...props }) {
  return (
    <div className="p-4" {...props}>
      {children}
    </div>
  );
}
