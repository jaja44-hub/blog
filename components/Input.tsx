"use client";

import React, { useRef, useState } from "react";

interface InputProps {
  placeholder?: string;
  type?: string;
  className?: string;
}

export const Input = ({ placeholder = "Search...", type = "text", className }: InputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`flex-1 ${className} focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-parchment ${focused ? "border-teal" : "border-line"}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};