import { useState } from "react";
import { RotateCw } from "lucide-react";
import type { FlashcardItem } from "../../interfaces/flashcard.interface";

interface FlashcardCardProps {
  flashcard: FlashcardItem;
  currentIndex: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
}

const FlashcardCard = ({
  flashcard,
  currentIndex,
  total,
  onNext,
  onPrevious,
}: FlashcardCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {total}
        </span>
        <button
          onClick={handleFlip}
          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
        >
          <RotateCw className="h-4 w-4" />
          {isFlipped ? "Show Question" : "Show Answer"}
        </button>
      </div>

      {/* Card */}
      <div
        className="relative bg-white border rounded-xl p-6 shadow-sm min-h-[200px] cursor-pointer transition-all duration-300 hover:shadow-md"
        onClick={handleFlip}
      >
        {isFlipped ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-700 text-center text-lg">
              {flashcard.answer}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-900 text-center text-lg font-medium">
              {flashcard.question}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === total - 1}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashcardCard;
