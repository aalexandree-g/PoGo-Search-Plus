export const rulesContent = {
  title: 'Things to know',
  items: [
    {
      title: 'IV ranges',
      content: (
        <>
          Negation <code>!</code> is ignored for IV ranges (e.g.{' '}
          <code>!1attack</code> = <code>1attack</code>).
        </>
      ),
    },
    {
      title: 'Regional forms',
      content: (
        <>
          Regional forms excluded by <code>!Alola</code>, <code>!Galar</code>,{' '}
          <code>!Hisui</code>, and <code>!Paldea</code> cannot be unexcluded.
        </>
      ),
    },
  ],
}
