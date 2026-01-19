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
          value={homeLogic.value}
          onChange={homeLogic.setValue}
          onInput={onInput}
          onFocus={homeLogic.setIsFocused}
          showReset={homeLogic.showReset}
          onReset={homeLogic.handleReset}
        />
        <ResultBox
          show={homeLogic.hasSubmitted}
          hasSubmitted={homeLogic.hasSubmitted}
          result={homeLogic.result}
        />
      </form>
    </div>
  )
}

export default Home
