interface QuestionOptionProps {
  option: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  showCorrect?: boolean;
  isCorrect?: boolean;
}

export function QuestionOption({
  option,
  label,
  isSelected,
  onClick,
  showCorrect,
  isCorrect,
}: QuestionOptionProps) {
  let borderColor = "border-gray-300";
  let bgColor = "bg-white";

  if (isSelected && !showCorrect) {
    borderColor = "border-blue-600";
    bgColor = "bg-blue-50";
  }

  if (showCorrect) {
    if (isCorrect) {
      borderColor = "border-green-500";
      bgColor = "bg-green-50";
    } else if (isSelected) {
      borderColor = "border-red-500";
      bgColor = "bg-red-50";
    }
  }

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:shadow-sm ${borderColor} ${bgColor}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
          {option}
        </span>
        <span className="text-gray-800">{label}</span>
      </div>
    </button>
  );
}
