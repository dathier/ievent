export const mockSurvey = {
  id: "1",
  title: "Sample Survey",
  status: "PUBLISHED",
  questions: [
    {
      id: "q1",
      content: "What is your favorite color?",
      options: [
        { id: "o1", content: "Red" },
        { id: "o2", content: "Blue" },
        { id: "o3", content: "Green" },
      ],
    },
  ],
  currentQuestion: 0,
};

export const mockResponses = [
  { questionId: "q1", answer: '"Red"' },
  { questionId: "q1", answer: '"Blue"' },
  { questionId: "q1", answer: '"Blue"' },
  { questionId: "q1", answer: '"Green"' },
  { questionId: "q1", answer: '"Red"' },
];

export const mockStatistics = {
  totalResponses: 5,
  completionRate: 80.0,
  averageTimePerQuestion: 15.25,
};
