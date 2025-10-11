export default function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="bg-red-400 text-black font-bold px-6 py-3 rounded-lg shadow-md hover:bg-red-300 transition"
    >
      {children}
    </button>
  );
}
