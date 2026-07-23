import { useState } from "react";
import {
  useGetFlashcardsByNoteQuery,
  useGenerateFlashcardsMutation,
} from "../../apis/notes-api";
import FlashcardCard from "./FlashcardCard";
import FlashcardEmptyState from "./FlashcardEmptyState";
import { RefreshCw, AlertCircle } from "lucide-react";

interface FlashcardSectionProps {
  noteId: number;
}

const FlashcardSection = ({ noteId }: FlashcardSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { data: flashcardsData, isLoading: isLoadingFlashcards } =
    useGetFlashcardsByNoteQuery(noteId, { skip: !noteId });
  const [generateFlashcards, { isLoading: isGenerating }] =
    useGenerateFlashcardsMutation();

  const flashcards = flashcardsData?.flashcards || [];

  const handleGenerate = async () => {
    setError(null);
    try {
      await generateFlashcards({ noteId, count: 10, difficulty: "MEDIUM" });
      setCurrentIndex(0);
    } catch (error) {
      const errorMessage =
        error?.data?.detail ||
        "Failed to generate flashcards. Please try again.";
      setError(errorMessage);
    }
  };

  const handleRegenerate = async () => {
    setError(null);
    try {
      await generateFlashcards({ noteId, count: 10, difficulty: "MEDIUM" });
      setCurrentIndex(0);
    } catch (error) {
      const errorMessage =
        error?.data?.detail ||
        "Failed to regenerate flashcards. Please try again.";
      setError(errorMessage);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isLoadingFlashcards) {
    return (
      <div className="mb-6 p-6 bg-gray-50 border rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-2 text-sm text-red-600 hover:text-red-700 disabled:text-red-400"
            >
              {isGenerating ? "Retrying..." : "Try again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="mb-6">
        <FlashcardEmptyState
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Flashcards</h3>
        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw
            className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`}
          />
          Regenerate
        </button>
      </div>
      <FlashcardCard
        flashcard={flashcards[currentIndex]}
        currentIndex={currentIndex}
        total={flashcards.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default FlashcardSection;
