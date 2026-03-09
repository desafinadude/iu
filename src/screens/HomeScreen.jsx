import { useNav } from '../context/NavContext'
import './HomeScreen.css'

export default function HomeScreen() {
  const { navigate } = useNav()

  return (
    <div className="home">
      <div className="home__grid">
        <button
          className="home__card"
          onClick={() => navigate('kana_quiz')}
          aria-label="Start Kana Quiz"
        >
          <div className="home__card-halftone" aria-hidden="true" />
          <span className="home__card-kana" aria-hidden="true">あ</span>
          <span className="home__card-label">Kana Quiz</span>
        </button>

        <button
          className="home__card"
          onClick={() => navigate('word_search')}
          aria-label="Start Word Search"
        >
          <div className="home__card-halftone" aria-hidden="true" />
          <span className="home__card-kana" aria-hidden="true">語</span>
          <span className="home__card-label">Word Search</span>
        </button>

        <button
          className="home__card"
          onClick={() => navigate('writing')}
          aria-label="Start Writing Practice"
        >
          <div className="home__card-halftone" aria-hidden="true" />
          <span className="home__card-kana" aria-hidden="true">書</span>
          <span className="home__card-label">Writing</span>
        </button>
      </div>
    </div>
  )
}
