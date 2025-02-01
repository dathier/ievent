export interface Option {
  id: number;
  content: string;
}

export interface Question {
  id: number;
  content: string;
  type: "MULTIPLE_CHOICE" | "SINGLE_CHOICE" | "TEXT";
  options: Option[];
}

export interface Survey {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
}
