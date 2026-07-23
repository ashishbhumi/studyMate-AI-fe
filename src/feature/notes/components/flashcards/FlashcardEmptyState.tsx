import { BookOpen, Sparkles } from "lucide-react";

interface FlashcardEmptyStateProps {
  onGenerate: () => void;
  isGenerating?: boolean;
}

const FlashcardEmptyState = ({
  onGenerate,
  isGenerating = false,
}: FlashcardEmptyStateProps) => {
  return (
    <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-100 rounded-lg">
          <BookOpen className="h-6 w-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-purple-900 mb-1">
            Study with Flashcards
          </h3>
          <p className="text-sm text-purple-700 mb-4">
            Generate AI-powered flashcards from this note to test your knowledge
            and reinforce learning.
          </p>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardEmptyState;
