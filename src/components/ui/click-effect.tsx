"use client";

import React, { useEffect, useState } from "react";

type ClickEffect = {
  x: number;
  y: number;
  id: number;
};

const CursorClickEffect: React.FC = () => {
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [clicks, setClicks] = useState<ClickEffect[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      const newClick: ClickEffect = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      };

      setClicks((prev) => [...prev, newClick]);

      // Remove the effect after animation ends
      setTimeout(() => {
        setClicks((prev) => prev.filter((click) => click.id !== newClick.id));
      }, 500); // Match animation duration
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {/* Cursor dot */}
      <div className="cursor-dot" style={{ left: cursor.x, top: cursor.y }} />

      {/* Ripple effects */}
      {clicks.map((click) => (
        <div
          key={click.id}
          className="click-effect"
          style={{ left: click.x, top: click.y }}
        />
      ))}
    </>
  );
};

export default CursorClickEffect;
