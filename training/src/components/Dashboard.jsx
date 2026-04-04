import VideoSection from './VideoSection'

function ProgressBar({ completed, total }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  return (
    <div>
      <div className="flex justify-between text-xs text-muted mb-1.5">
        <span>Progress</span>
        <span>{completed}/{total} quizzes</span>
      </div>
      <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
        <div
          className="h-full shimmer-bg rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function ScoreBadge({ score }) {
  const passed = score.score >= 80
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
      passed
        ? 'bg-ms-green/15 text-ms-green'
        : 'bg-ms-red/15 text-ms-red'
    }`}>
      {score.score}%
    </span>
  )
}

function QuizCard({ quiz, score, isUnlocked, onStart, onSimulate }) {
  const completed = !!score

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 animate-fade-up ${
        completed
          ? 'border-ms-green/25 bg-surface2'
          : isUnlocked
          ? 'border-accent/40 bg-surface hover:border-accent/70 hover:animate-glow'
          : 'border-border bg-surface opacity-50'
      }`}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              quiz.day === 0
                ? 'bg-accent/20 text-accent'
                : 'bg-purple-500/15 text-purple-300'
            }`}
          >
            Day {quiz.day}
          </span>
          <span className="text-xs text-muted capitalize">
            {quiz.type === 'fill-in-the-blank' ? 'Fill-in-the-blank' : 'Scenario'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {completed && <ScoreBadge score={score} />}
          {!isUnlocked && <span className="text-muted text-base">🔒</span>}
        </div>
      </div>

      {/* Question */}
      <p className="text-sm text-text leading-relaxed mb-3">{quiz.question}</p>

      {/* Action row */}
      {completed ? (
        <div className="flex items-center gap-1.5 text-xs text-ms-green font-medium">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Completed · {score.correct ? 'Passed' : 'Needs review'}
        </div>
      ) : isUnlocked ? (
        <button
          onClick={() => onStart(quiz)}
          className="text-xs font-semibold text-bg bg-accent hover:bg-accent2 active:scale-95 px-3 py-1.5 rounded-lg transition-all duration-150"
        >
          Take Quiz →
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">Unlocks on Day {quiz.day}</span>
          <button
            onClick={onSimulate}
            className="text-xs text-accent/70 hover:text-accent underline transition-colors"
          >
            Simulate unlock
          </button>
        </div>
      )}
    </div>
  )
}

function NextQuizBadge({ allDone }) {
  if (!allDone) return null
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 animate-fade-up">
      <span className="text-accent text-lg">📅</span>
      <div>
        <p className="text-xs font-semibold text-accent">All done for now</p>
        <p className="text-xs text-muted">Next quiz scheduled in <span className="text-text font-semibold">7 days</span></p>
      </div>
    </div>
  )
}

export default function Dashboard({
  employee,
  topic,
  quizzes,
  scores,
  unlockedDays,
  onStartQuiz,
  onSimulateDay3,
  videoWatched,
  onVideoWatched,
}) {
  const completedCount = Object.keys(scores).length
  const allDone = completedCount === quizzes.length

  return (
    <main className="max-w-xl mx-auto px-4 py-5 space-y-5 pb-10">

      {/* Topic header */}
      <div className="animate-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Training Topic</span>
        </div>
        <h1 className="text-xl font-bold text-text leading-tight">{topic.title}</h1>
        <p className="text-sm text-muted mt-1 leading-relaxed">{topic.description}</p>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border bg-surface px-4 py-3 animate-fade-up">
        <ProgressBar completed={completedCount} total={quizzes.length} />
      </div>

      {/* Video */}
      <VideoSection
        topic={topic}
        watched={videoWatched}
        onWatched={onVideoWatched}
      />

      {/* Quizzes */}
      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Quizzes</p>
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              score={scores[quiz.id] ?? null}
              isUnlocked={unlockedDays.includes(quiz.day)}
              onStart={onStartQuiz}
              onSimulate={onSimulateDay3}
            />
          ))}
        </div>
      </div>

      {/* Scores table (shown once at least one quiz done) */}
      {completedCount > 0 && (
        <div className="rounded-xl border border-border bg-surface overflow-hidden animate-fade-up">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Score History</p>
          </div>
          <div className="divide-y divide-border">
            {quizzes
              .filter((q) => scores[q.id])
              .map((quiz) => {
                const s = scores[quiz.id]
                const date = new Date(s.completedAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })
                return (
                  <div key={quiz.id} className="flex items-center justify-between px-4 py-2.5">
                    <div>
                      <p className="text-xs font-medium text-text">{quiz.title}</p>
                      <p className="text-xs text-muted">{date}</p>
                    </div>
                    <ScoreBadge score={s} />
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Next quiz banner */}
      <NextQuizBadge allDone={allDone} />

    </main>
  )
}
