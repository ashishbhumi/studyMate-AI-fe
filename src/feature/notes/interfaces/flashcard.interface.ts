export interface FlashcardItem {
  question: string;
  answer: string;
}

export interface FlashcardsResponse {
  flashcards: FlashcardItem[];
}

export interface GenerateFlashcardsRequest {
  noteId: number;
  count?: number;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}
