import { Copy } from 'lucide-react'

const ResultBox = ({ show, hasSubmitted, result, error }) => {
  if (!show) return null

  const text = error || result || ''
  const isError = Boolean(error)

  const handleCopy = async () => {
    if (!result || isError) return
    await navigator.clipboard.writeText(result)
  }

  return (
    <div className="result-box">
      <div
        className={[
          'u-surface',
          'result-box__content',
          hasSubmitted && 'is-active',
          isError && 'is-error',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="result-box__toolbar">
          <span className="result-box__title">
            Formule adaptée à Pokémon GO
          </span>

          {!isError && result && (
            <button
              type="button"
              className="result-box__copy"
              onClick={handleCopy}
              aria-label="Copier le résultat"
              title="Copier"
              disabled={!text}
            >
              <div className="result-box__copy-label">
                {' '}
                <span>Copier le code</span> <Copy size={14} />{' '}
              </div>
            </button>
          )}
        </div>

        {text ? (
          <pre className="result-box__text">{text}</pre>
        ) : (
          <span className="result-box__placeholder">
            Le résultat apparaîtra ici...
          </span>
        )}
      </div>
    </div>
  )
}

export default ResultBox
