import { useEffect, useState } from "react";

export default function Timer({ start, onComplete }) {
  const [time, setTime] = useState(30);

  useEffect(() => {
    let interval;
    if (start) {
      setTime(30);
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [start, onComplete]);

  if (!start) return null;

  return (
    <div className="text-center my-4 text-2xl font-bold text-red-500">
      {time}s
    </div>
  );
}
