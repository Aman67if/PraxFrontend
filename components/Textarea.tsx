import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm mb-2 text-gray-700">{label}</label>
      )}
      <textarea
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical ${className}`}
        {...props}
      />
    </div>
  );
}
