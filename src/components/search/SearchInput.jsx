const SearchInput = ({
  refEl,
  hasSubmitted,
  isFocused,
  value,
  onChange,
  onInput,
  onFocus,
  onBlur,
  showReset,
  onReset,
}) => {
  return (
    <div className="search-input">
      <textarea
        ref={refEl}
        className={[
          'u-surface',
          'search-input__content',
          hasSubmitted && !isFocused && 'is-submitted',
        ]
          .filter(Boolean)
          .join(' ')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        spellCheck="false"
        placeholder={`Tapez votre recherche. Exemple : (pikachu&chromatique),4*`}
      />

      <div className="search-input__actions">
        {showReset && (
          <button
            type="button"
            className="u-surface btn btn--reset"
            onClick={onReset}
          >
            Reset
          </button>
        )}

        <button className="u-surface btn btn--submit" type="submit">
          Convertir
        </button>
      </div>
    </div>
  )
}

export default SearchInput
