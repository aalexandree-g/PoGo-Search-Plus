const Rule = ({ title, content }) => {
  return (
    <div className="rule">
      <h2 className="rule__title">{title}</h2>
      <p className="rule__text">{content}</p>
    </div>
  )
}

export default Rule
