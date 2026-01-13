import Header from '../components/header/Header'

const Home = () => {
  return (
    <>
      <Header />
      <form className="home__form">
        <textarea
          className="home__textarea"
          rows={6}
          placeholder="Exemple : (bulbizarre&chromatique),4*"
        />
        <button className="home__button" type="submit">
          Valider
        </button>
      </form>
    </>
  )
}

export default Home
