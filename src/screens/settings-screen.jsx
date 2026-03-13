import { Volume2, BookOpen, Palette } from 'lucide-react'
import { SettingsGroup, SettingItem } from '../components/ui/settings'
import { Switch } from '../components/ui/switch'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

export default function KanaSettingsScreen() {
  // TODO: Connect to actual settings state
  const soundEnabled = true
  const vibrationEnabled = false
  const autoAdvance = false

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-headline-small mb-2">Settings</h2>
        <p className="text-body-medium text-muted-foreground">
          Customize your learning experience
        </p>
      </div>

      {/* Audio Settings */}
      <SettingsGroup title="Audio">
        <SettingItem
          label="Sound Effects"
          description="Play sounds for correct and incorrect answers"
        >
          <Switch checked={soundEnabled} onCheckedChange={() => {}} />
        </SettingItem>
        
        <SettingItem
          label="Pronunciation"
          description="Speak Japanese text aloud"
        >
          <Switch checked={true} onCheckedChange={() => {}} />
        </SettingItem>
      </SettingsGroup>

      {/* Quiz Settings */}
      <SettingsGroup title="Quiz">
        <SettingItem
          label="Auto-advance"
          description="Automatically move to next question"
        >
          <Switch checked={autoAdvance} onCheckedChange={() => {}} />
        </SettingItem>
        
        <SettingItem
          label="Vibration"
          description="Haptic feedback on answers"
        >
          <Switch checked={vibrationEnabled} onCheckedChange={() => {}} />
        </SettingItem>
      </SettingsGroup>

      {/* About */}
      <SettingsGroup title="About">
        <SettingItem label="Version">
          <Badge variant="secondary">2.0.0</Badge>
        </SettingItem>
        
        <SettingItem
          label="Data Storage"
          description="All progress stored locally"
        >
          <Button variant="text" size="sm">
            Clear Data
          </Button>
        </SettingItem>
      </SettingsGroup>
    </div>
  )
}
