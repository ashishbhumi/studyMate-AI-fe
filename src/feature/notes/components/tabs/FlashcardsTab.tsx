import { useState } from "react";
import {
  useGetFlashcardsByNoteQuery,
  useGenerateFlashcardsMutation,
} from "../../apis/notes-api";
import {
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

interface FlashcardsTabProps {
  noteId: number;
}

const FlashcardsTab = ({ noteId }: FlashcardsTabProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: flashcardsData, isLoading: isLoadingFlashcards } =
    useGetFlashcardsByNoteQuery(noteId, { skip: !noteId });
  const [generateFlashcards, { isLoading: isGenerating }] =
    useGenerateFlashcardsMutation();

  const flashcards = flashcardsData?.flashcards || [];

  // Inject custom styles for 3D flip
  if (typeof document !== "undefined") {
    const styleId = "flashcard-3d-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `;
      document.head.appendChild(style);
    }
  }

  const handleGenerate = async () => {
    setError(null);
    try {
      await generateFlashcards({ noteId, count: 10, difficulty: "MEDIUM" });
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { detail?: string } })?.data?.detail ||
        "Failed to generate flashcards. Please try again.";
      setError(errorMessage);
    }
  };

  const handleRegenerate = async () => {
    setError(null);
    try {
      await generateFlashcards({ noteId, count: 10, difficulty: "MEDIUM" });
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { detail?: string } })?.data?.detail ||
        "Failed to regenerate flashcards. Please try again.";
      setError(errorMessage);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (isLoadingFlashcards) {
    return (
      <div className="p-12">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12">
        <div className="max-w-md mx-auto">
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-1">
                  Error
                </h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? "Retrying..." : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <RotateCcw className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Generate Flashcards
          </h3>
          <p className="text-gray-500 mb-6">
            Create interactive flashcards from your note to study effectively
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            <RotateCcw
              className={`h-5 w-5 ${isGenerating ? "animate-spin" : ""}`}
            />
            {isGenerating ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
      </div>
    );
  }

  const currentFlashcard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Flashcards</h3>
            <p className="text-sm text-gray-500">
              {currentIndex + 1} of {flashcards.length}
            </p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
            />
            Regenerate
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="perspective-1000 mb-6">
          <div
            className="relative w-full h-80 cursor-pointer transition-transform duration-500 transform-style-3d"
            onClick={handleFlip}
            style={{
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8 flex items-center justify-center backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="text-center">
                <p className="text-sm text-purple-600 font-medium mb-3">
                  Question
                </p>
                <p className="text-xl text-gray-900 font-medium leading-relaxed">
                  {currentFlashcard.question}
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  Click to reveal answer
                </p>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-8 flex items-center justify-center backface-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="text-center">
                <p className="text-sm text-indigo-600 font-medium mb-3">
                  Answer
                </p>
                <p className="text-xl text-gray-900 font-medium leading-relaxed">
                  {currentFlashcard.answer}
                </p>
                <p className="text-sm text-gray-400 mt-4">Click to flip back</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsTab;
