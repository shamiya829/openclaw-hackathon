import { useState, useEffect } from 'react'
import { employee, topic, quizzes } from './data/mockData'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import QuizView from './components/QuizView'

const STORAGE_SCORES = 'ms_training_scores'
const STORAGE_DAYS   = 'ms_training_days'
const STORAGE_VIDEO  = 'ms_training_video_watched'

function load(key, fallback) {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [view,         setView]         = useState('dashboard')
  const [activeQuiz,   setActiveQuiz]   = useState(null)
  const [scores,       setScores]       = useState(() => load(STORAGE_SCORES, {}))
  const [unlockedDays, setUnlockedDays] = useState(() => load(STORAGE_DAYS, [0]))
  const [videoWatched, setVideoWatched] = useState(() => load(STORAGE_VIDEO, false))

  useEffect(() => { localStorage.setItem(STORAGE_SCORES, JSON.stringify(scores)) }, [scores])
  useEffect(() => { localStorage.setItem(STORAGE_DAYS,   JSON.stringify(unlockedDays)) }, [unlockedDays])
  useEffect(() => { localStorage.setItem(STORAGE_VIDEO,  JSON.stringify(videoWatched)) }, [videoWatched])

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz)
    setView('quiz')
  }

  const handleQuizComplete = (quizId, score, correct) => {
    setScores((prev) => ({
      ...prev,
      [quizId]: { score, correct, completedAt: new Date().toISOString() },
    }))
    // Completing quiz 1 unlocks day-3 quiz (simulated — in prod, schedule for real date)
    if (quizId === 1 && !unlockedDays.includes(3)) {
      setUnlockedDays((prev) => [...prev, 3])
    }
    setView('dashboard')
  }

  const handleSimulateDay3 = () => {
    if (!unlockedDays.includes(3)) {
      setUnlockedDays((prev) => [...prev, 3])
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      <Header employee={employee} />
      {view === 'dashboard' && (
        <Dashboard
          employee={employee}
          topic={topic}
          quizzes={quizzes}
          scores={scores}
          unlockedDays={unlockedDays}
          onStartQuiz={handleStartQuiz}
          onSimulateDay3={handleSimulateDay3}
          videoWatched={videoWatched}
          onVideoWatched={() => setVideoWatched(true)}
        />
      )}
      {view === 'quiz' && activeQuiz && (
        <QuizView
          quiz={activeQuiz}
          onComplete={handleQuizComplete}
          onBack={() => setView('dashboard')}
        />
      )}
    </div>
  )
}
