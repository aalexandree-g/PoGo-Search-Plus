import { Copy } from 'lucide-react'

const ResultBox = ({ show, hasSubmitted, result }) => {
  if (!show) return null

  const text = result ?? ''

  const handleCopy = async () => {
    if (!text) return
    await navigator.clipboard.writeText(text)
  }

  return (
    <div className="result-box">
      <div
        className={`u-surface result-box__content  ${
          hasSubmitted ? 'is-active' : ''
        }`}
      >
        {text ? (
          <pre className="result-box__text">{text}</pre>
        ) : (
          <span className="result-box__placeholder">
            Le résultat apparaîtra ici...
          </span>
        )}
      </div>

      <button
        type="button"
        className="result-box__copy"
        onClick={handleCopy}
        aria-label="Copier le résultat"
        title="Copier"
        disabled={!text}
      >
        <Copy size={16} />
        <span>Copier le code</span>
      </button>
    </div>
  )
}

export default ResultBox
