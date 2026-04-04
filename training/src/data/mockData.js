export const employee = {
  id: 1,
  name: 'Alex Rivera',
  role: 'Server',
  hireDate: '2024-01-15',
  initials: 'AR',
}

export const topic = {
  id: 1,
  title: 'Food Safety: Cross-Contamination',
  description:
    'Understand how pathogens transfer between surfaces and food, and the protocols to stop it cold.',
  // Mock YouTube embed — replace videoId with a real one before production
  videoId: 'TxnZnMFGbP4',
  duration: '2:04',
  requiredScore: 80,
}

export const quizzes = [
  {
    id: 1,
    day: 0,
    type: 'fill-in-the-blank',
    title: 'Day 0 Check-In',
    question: 'Wash hands for at least ___ seconds.',
    answer: '20',
    points: 100,
    hint: 'Think FDA handwashing guidelines.',
  },
  {
    id: 2,
    day: 3,
    type: 'multiple-choice',
    title: 'Day 3 Scenario',
    question: 'You see raw chicken touching lettuce. What do you do?',
    options: [
      'Continue service — it looks fine.',
      'Remove and discard the lettuce, then sanitize the surface immediately.',
      'Just remove the chicken and keep the lettuce.',
      'Note it and report to your manager at end of shift.',
    ],
    correctIndex: 1,
    points: 100,
    explanation:
      'Raw poultry carries salmonella risk. The lettuce must be discarded and the surface sanitized right away — waiting is not an option.',
  },
]
