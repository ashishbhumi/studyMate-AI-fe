import { HelpCircle } from "lucide-react";

interface QuizTabProps {
  noteId: number;
}

const QuizTab = ({ noteId }: QuizTabProps) => {
  return (
    <div className="p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <HelpCircle className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quiz Coming Soon
        </h3>
        <p className="text-gray-500 mb-6">
          Test your knowledge with AI-generated quizzes based on your notes
        </p>
        <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg inline-block">
          Coming Soon{noteId}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;
