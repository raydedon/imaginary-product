import React from "react";

interface NoteProps {
  title: string;
  content: string;
}

const Note: React.FC<NoteProps> = ({ title, content }) => {
  return (
    <div className="max-w-sm mx-auto bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-md mt-4">
      <h2 className="text-lg font-bold text-yellow-800">{title}</h2>
      <p className="text-yellow-900 mt-2">{content}</p>
    </div>
  );
};

export default Note;
