import Header from '../components/header/Header'
import { useAutoResizeTextarea } from '../hooks/useAutoResizeTextarea'

const Home = () => {
  const { ref, onInput } = useAutoResizeTextarea()

  return (
    <div className="app">
      <Header />

      <form className="home__form">
        <textarea
          ref={ref}
          className="home__textarea"
          rows={1}
          onInput={onInput}
          spellCheck="false"
          placeholder={`Tapez votre recherche.
Ex : (pikachu&chromatique),4*`}
        />

        <button className="home__button" type="submit">
          Convertir
        </button>
      </form>
    </div>
  )
}

export default Home
