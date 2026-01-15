import { useState } from 'react'
import Header from '../../components/header/Header'
import { useAutoResizeTextarea } from '../../hooks/useAutoResizeTextarea'

const Home = () => {
  const { ref, onInput } = useAutoResizeTextarea()

  const [value, setValue] = useState('')
  const [result, setResult] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)

  const toggleRules = () => {
    setIsRulesOpen((prev) => !prev)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setResult(value)
    setHasSubmitted(true)
  }

  return (
    <div className="app">
      <Header />

      <form className="home__form" onSubmit={handleSubmit}>
        <div
          className={`home__field home__field--rules ${isRulesOpen ? 'is-open' : ''} u-elevated `}
        >
          <button
            type="button"
            className="home__field--rules-header"
            onClick={toggleRules}
            aria-expanded={isRulesOpen}
            aria-controls="rules-content"
          >
            <h1>À savoir</h1>
            <span className="home__rules-icon">{isRulesOpen ? '▲' : '▼'}</span>
          </button>

          <div
            id="rules-content"
            className={`rules ${isRulesOpen ? 'is-open' : ''}`}
          >
            <span>
              • mettre une expression avec un espace entre guillemets. Exemple :
              "M. Mime"
            </span>
            <span>
              • mettre une expression avec un espace entre guillemets. Exemple :
              "M. Mime"
            </span>
          </div>
        </div>

        <textarea
          ref={ref}
          className="home__field home__field--input u-elevated"
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onInput={onInput}
          spellCheck="false"
          placeholder={`Tapez votre recherche. Exemple : (pikachu&chromatique),4*`}
        />

        <button className="home__button u-elevated" type="submit">
          Convertir
        </button>

        {hasSubmitted && (
          <div className="home__field home__field--result u-elevated">
            {result || <span>Le résultat apparaîtra ici...</span>}
          </div>
        )}
      </form>
    </div>
  )
}

export default Home
