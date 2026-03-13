import { NavProvider, useNav } from './context/NavContext'
import AppShell from './components/layout/app-shell'
import HomeScreen from './screens/home-screen'
import KanaQuizScreen from './screens/kana-quiz-screen'
import SettingsScreen from './screens/settings-screen'
import ProgressScreen from './screens/progress-screen'
import KanaQuizSettingsScreen from './screens/KanaQuizSettingsScreen'
import WordSearchScreen from './screens/word-search-screen'
import WritingScreen from './screens/writing-screen'
import VerbDrillScreen from './screens/verb-drill-screen'
import SentenceBuilderScreen from './screens/sentence-builder-screen'

function Screens() {
  const { screen, params } = useNav()

  switch (screen) {
    case 'kana_quiz':
      return <KanaQuizScreen key={params?.mode ?? 'select'} />
    case 'settings':
      return <SettingsScreen />
    case 'kana_quiz_settings':
      return <KanaQuizSettingsScreen />
    case 'progress':
      return <ProgressScreen />
    case 'word_search':
      return <WordSearchScreen />
    case 'writing':
      return <WritingScreen />
    case 'verb_drill':
      return <VerbDrillScreen />
    case 'sentence_builder':
      return <SentenceBuilderScreen />
    case 'home':
    default:
      return <HomeScreen />
  }
}

export default function App() {
  return (
    <NavProvider>
      <AppShell>
        <Screens />
      </AppShell>
    </NavProvider>
  )
}
