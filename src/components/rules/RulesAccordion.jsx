import { ChevronDown } from 'lucide-react'
import Rule from './rule/Rule'

const RulesAccordion = ({ isOpen, onToggle, title, rules }) => {
  return (
    <button
      type="button"
      className={`u-surface rules ${isOpen ? 'rules--open' : ''}`}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="rules-content"
    >
      <div className="rules__header">
        <h1 className="rules__title">{title}</h1>
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
            <Rule key={i} title={rule.title} content={rule.content} />
          ))}
        </div>
      )}
    </button>
  )
}

export default RulesAccordion
