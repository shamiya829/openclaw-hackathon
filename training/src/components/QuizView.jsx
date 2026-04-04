import { useState } from 'react'

/* ── Fill-in-the-blank ── */
function FillInBlank({ quiz, onSubmit }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const correct = value.trim().toLowerCase() === quiz.answer.toLowerCase()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim()) return
    setSubmitted(true)
  }

  const renderQuestion = () => {
    const parts = quiz.question.split('___')
    return (
      <p className="text-base text-text leading-relaxed">
        {parts[0]}
        <span
          className={`inline-block min-w-[3rem] border-b-2 mx-1 px-1 text-center font-bold transition-colors ${
            submitted
              ? correct
                ? 'border-ms-green text-ms-green'
                : 'border-ms-red text-ms-red'
              : 'border-accent text-accent'
          }`}
        >
          {value || '\u00A0\u00A0\u00A0'}
        </span>
        {parts[1]}
      </p>
    )
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface2 px-5 py-4">
        {renderQuestion()}
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type your answer…"
            className="w-full bg-surface2 border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            autoFocus
          />
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!value.trim()}
              className="text-sm font-semibold text-bg bg-accent hover:bg-accent2 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 rounded-lg transition-all duration-150 active:scale-95"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="text-xs text-muted hover:text-text transition-colors"
            >
              {showHint ? 'Hide hint' : 'Show hint'}
            </button>
          </div>
          {showHint && (
            <p className="text-xs text-accent/80 bg-accent/5 border border-accent/20 rounded-lg px-3 py-2">
              💡 {quiz.hint}
            </p>
          )}
        </form>
      ) : (
        <div className="space-y-4 animate-fade-up">
          <div
            className={`rounded-xl border px-4 py-3 ${
              correct
                ? 'border-ms-green/30 bg-ms-green/5'
                : 'border-ms-red/30 bg-ms-red/5'
            }`}
          >
            <p className={`text-sm font-semibold mb-1 ${correct ? 'text-ms-green' : 'text-ms-red'}`}>
              {correct ? '✓ Correct!' : '✗ Not quite'}
            </p>
            {!correct && (
              <p className="text-xs text-muted">
                The correct answer is <span className="text-text font-bold">{quiz.answer}</span>.
              </p>
            )}
          </div>
          <button
            onClick={() => onSubmit(correct ? 100 : 0, correct)}
            className="w-full text-sm font-semibold text-bg bg-accent hover:bg-accent2 py-2.5 rounded-lg transition-all duration-150 active:scale-95"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Multiple choice ── */
function MultipleChoice({ quiz, onSubmit }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const correct = selected === quiz.correctIndex

  return (
    <div className="space-y-5">
      <div className="space-y-2.5">
        {quiz.options.map((option, i) => {
          let style = 'border-border bg-surface2 hover:border-accent/50'
          if (submitted) {
            if (i === quiz.correctIndex) style = 'border-ms-green/50 bg-ms-green/5'
            else if (i === selected) style = 'border-ms-red/50 bg-ms-red/5'
            else style = 'border-border bg-surface2 opacity-50'
          } else if (selected === i) {
            style = 'border-accent bg-accent/10'
          }

          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              className={`w-full text-left border rounded-xl px-4 py-3 text-sm text-text transition-all duration-150 ${style} ${
                !submitted ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border flex items-center justify-center text-xs font-bold transition-colors ${
                    submitted && i === quiz.correctIndex
                      ? 'border-ms-green text-ms-green'
                      : submitted && i === selected && !correct
                      ? 'border-ms-red text-ms-red'
                      : selected === i && !submitted
                      ? 'border-accent text-accent'
                      : 'border-muted text-muted'
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="leading-relaxed">{option}</span>
              </div>
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          onClick={() => selected !== null && setSubmitted(true)}
          disabled={selected === null}
          className="w-full text-sm font-semibold text-bg bg-accent hover:bg-accent2 disabled:opacity-40 disabled:cursor-not-allowed py-2.5 rounded-lg transition-all duration-150 active:scale-95"
        >
          Submit Answer
        </button>
      ) : (
        <div className="space-y-4 animate-fade-up">
          <div
            className={`rounded-xl border px-4 py-3 ${
              correct ? 'border-ms-green/30 bg-ms-green/5' : 'border-ms-red/30 bg-ms-red/5'
            }`}
          >
            <p className={`text-sm font-semibold mb-1.5 ${correct ? 'text-ms-green' : 'text-ms-red'}`}>
              {correct ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-xs text-muted leading-relaxed">{quiz.explanation}</p>
          </div>
          <button
            onClick={() => onSubmit(correct ? 100 : 0, correct)}
            className="w-full text-sm font-semibold text-bg bg-accent hover:bg-accent2 py-2.5 rounded-lg transition-all duration-150 active:scale-95"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Quiz shell ── */
export default function QuizView({ quiz, onComplete, onBack }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-5 space-y-5">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Training
      </button>

      {/* Header */}
      <div className="animate-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            quiz.day === 0 ? 'bg-accent/20 text-accent' : 'bg-purple-500/15 text-purple-300'
          }`}>
            Day {quiz.day}
          </span>
          <span className="text-xs text-muted">
            {quiz.type === 'fill-in-the-blank' ? 'Fill-in-the-blank' : 'Scenario-based'}
          </span>
        </div>
        <h2 className="text-lg font-bold text-text">{quiz.title}</h2>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border bg-surface px-5 py-4 animate-fade-up">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Question</p>
        <p className="text-base text-text leading-relaxed font-medium">{quiz.question}</p>
      </div>

      {/* Quiz body */}
      <div className="animate-fade-up">
        {quiz.type === 'fill-in-the-blank' ? (
          <FillInBlank quiz={quiz} onSubmit={onComplete.bind(null, quiz.id)} />
        ) : (
          <MultipleChoice quiz={quiz} onSubmit={onComplete.bind(null, quiz.id)} />
        )}
      </div>
    </div>
  )
}
