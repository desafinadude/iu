import { NavProvider, useNav } from './context/NavContext'
import AppShell from './components/layout/AppShell'
import HomeScreen from './screens/HomeScreen'
import KanaQuizScreen from './screens/KanaQuizScreen'
import KanaSettingsScreen from './screens/KanaSettingsScreen'
import ProgressScreen from './screens/ProgressScreen'

function Screens() {
  const { screen, params } = useNav()

  switch (screen) {
    case 'kana_quiz':
      return <KanaQuizScreen key={params?.mode ?? 'select'} />
    case 'settings':
      return <KanaSettingsScreen />
    case 'progress':
      return <ProgressScreen />
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
