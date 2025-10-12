import { useEffect, useState } from "react";

export default function Timer({ start, onComplete }) {
  const [time, setTime] = useState(30);

  useEffect(() => {
    if (!start) return;

    setTime(30); // reset time when timer starts

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // defer onComplete so it doesn't run during render
          setTimeout(() => onComplete(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [start, onComplete]);

  if (!start) return null;

  return (
    <div className="text-center my-4 text-2xl font-bold text-red-500">
      {time}s
    </div>
  );
}
