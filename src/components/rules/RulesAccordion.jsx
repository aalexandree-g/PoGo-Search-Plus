import { ChevronDown } from 'lucide-react'

const RulesAccordion = ({ isOpen, onToggle, rules }) => {
  return (
    <button
      type="button"
      className={`rules u-surface u-elevated ${isOpen ? 'rules--open' : ''}`}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="rules-content"
    >
      <div className="rules__header">
        <h1 className="rules__title">À savoir</h1>
        <span
          className={`rules__icon ${isOpen ? 'rules__icon--open' : ''}`}
          aria-hidden="true"
        >
          <ChevronDown />
        </span>
      </div>
      {isOpen && (
        <div id="rules-content" className="rules__content">
          {rules.map((rule, i) => (
            <span key={i} className="rules__item">
              • {rule}
            </span>
          ))}
        </div>
      )}
    </button>
  )
}

export default RulesAccordion
