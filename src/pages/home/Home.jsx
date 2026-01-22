import Header from '../../components/header/Header'
import RulesAccordion from '../../components/rules/RulesAccordion'
import SearchInput from '../../components/search/SearchInput'
import ResultBox from '../../components/result/ResultBox'

import { useHomeLogic } from '../../hooks/useHomeLogic'
import { useAutoResizeTextarea } from '../../hooks/useAutoResizeTextarea'

const Home = () => {
  const { ref, onInput } = useAutoResizeTextarea()
  const homeLogic = useHomeLogic({ onResize: onInput })

  return (
    <div className="app">
      <Header />
      <form className="home__form" onSubmit={homeLogic.handleSubmit}>
        <RulesAccordion
          isOpen={homeLogic.isRulesOpen}
          onToggle={homeLogic.toggleRules}
          rules={[
            'les parenthèses sont prioritaires',
            'mettre une expression avec un espace entre guillemets. Exemple : "M. Mime"',
          ]}
        />
        <SearchInput
          refEl={ref}
          hasSubmitted={homeLogic.hasSubmitted}
          isFocused={homeLogic.isFocused}
          value={homeLogic.value}
          onChange={homeLogic.handleChange}
          onInput={onInput}
          onFocus={homeLogic.handleFocus}
          onBlur={homeLogic.handleBlur}
          showReset={homeLogic.showReset}
          onReset={homeLogic.handleReset}
        />
        <ResultBox
          show={homeLogic.hasSubmitted}
          hasSubmitted={homeLogic.hasSubmitted}
          result={homeLogic.result}
          error={homeLogic.error}
        />
      </form>
    </div>
  )
}

export default Home
