import { NavProvider, useNav } from './context/NavContext'
import { useTheme } from './hooks/useTheme'
import AppShell from './components/layout/AppShell'
import HomeScreen from './screens/HomeScreen'
import KanaQuizScreen from './screens/KanaQuizScreen'
import KanaSettingsScreen from './screens/KanaSettingsScreen'
import KanaQuizSettingsScreen from './screens/KanaQuizSettingsScreen'
import ProgressScreen from './screens/ProgressScreen'
import WordSearchScreen from './screens/WordSearchScreen'
import WritingScreen from './screens/WritingScreen'
import VerbDrillScreen from './screens/VerbDrillScreen'
import SentenceBuilderScreen from './screens/SentenceBuilderScreen'

function Screens() {
  const { screen, params } = useNav()

  switch (screen) {
    case 'kana_quiz':
      return <KanaQuizScreen key={params?.mode ?? 'select'} />
    case 'settings':
      return <KanaSettingsScreen />
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
  // Initialises theme from localStorage and applies data-theme to <html>
  useTheme()

  return (
    <NavProvider>
      <AppShell>
        <Screens />
      </AppShell>
    </NavProvider>
  )
}
