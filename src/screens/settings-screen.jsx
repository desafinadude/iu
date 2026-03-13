import { Volume2, BookOpen, Palette } from 'lucide-react'
import { SettingsGroup, SettingItem } from '../components/ui/settings'
import { Switch } from '../components/ui/switch'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useTheme, THEMES } from '../hooks/useTheme'

export default function KanaSettingsScreen() {
  // TODO: Connect to actual settings state
  const soundEnabled = true
  const vibrationEnabled = false
  const autoAdvance = false
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-headline-small mb-2">Settings</h2>
        <p className="text-body-medium text-muted-foreground">
          Customize your learning experience
        </p>
      </div>

      {/* Theme Settings */}
      <SettingsGroup title="Appearance">
        <div className="space-y-3">
          <p className="text-body-small text-muted-foreground px-4">
            Choose your visual style
          </p>
          <div className="grid grid-cols-1 gap-3 px-4">
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`
                  flex items-center gap-4 p-4 rounded-lg border-2 transition-all
                  ${theme === t.id 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-border bg-surface hover:border-primary/50'}
                `}
                onClick={() => setTheme(t.id)}
                aria-pressed={theme === t.id}
              >
                {/* Color Preview */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center border-2 shrink-0"
                  style={{ 
                    backgroundColor: t.preview.bg,
                    borderColor: t.preview.fg 
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: t.preview.accent }}
                  />
                </div>
                
                {/* Theme Info */}
                <div className="flex-1 text-left">
                  <div className="text-title-medium font-medium">{t.name}</div>
                  <div className="text-body-small text-muted-foreground">{t.description}</div>
                </div>
                
                {/* Selected Indicator */}
                {theme === t.id && (
                  <Badge variant="default" className="shrink-0">Active</Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </SettingsGroup>

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
