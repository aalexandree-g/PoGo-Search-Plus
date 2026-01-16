const SearchInput = ({
  refEl,
  hasSubmitted,
  value,
  onChange,
  onInput,
  showReset,
  onReset,
}) => {
  return (
    <div className="search-input">
      <textarea
        ref={refEl}
        className={`search-input__content u-surface u-elevated ${
          hasSubmitted ? 'is-active' : ''
        }`}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={onInput}
        spellCheck="false"
        placeholder={`Tapez votre recherche. Exemple : (pikachu&chromatique),4*`}
      />

      <div className="search-input__actions">
        {showReset && (
          <button
            type="button"
            className="search-input__button search-input__button--reset"
            onClick={onReset}
          >
            Reset
          </button>
        )}

        <button
          className="search-input__button search-input__button--submit"
          type="submit"
        >
          Convertir
        </button>
      </div>
    </div>
  )
}

export default SearchInput
