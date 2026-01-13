import { NavLink } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import logo_light from '../../assets/logo_light.svg'
import logo_dark from '../../assets/logo_light.svg'

const Header = () => {
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
  }

  useEffect(() => {
    document.body.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <nav className="main-nav">
      <div className="main-nav__container">
        <NavLink to="/" className="main-nav__logo">
          <img
            className="main-nav__image"
            src={isDark ? logo_dark : logo_light}
            alt="PoGO Search Plus logo"
          />
          <div className="main-nav__text">
            <span className="main-nav__title">PoGO Search Plus</span>
          </div>
        </NavLink>

        <button
          type="button"
          className="main-nav__theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  )
}

export default Header
