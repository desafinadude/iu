import { useState } from 'react'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { cn } from '../lib/utils'

const TABS = [
  { id: 'kana', label: 'Kana' },
  { id: 'vocab', label: 'Vocab' },
  { id: 'writing', label: 'Writing' },
]

// Sample progress data - TODO: Connect to actual mastery data
const SAMPLE_PROGRESS = {
  kana: {
    total: 46,
    mastered: 28,
    learning: 12,
    new: 6,
  },
  vocab: {
    total: 100,
    mastered: 45,
    learning: 30,
    new: 25,
  },
  writing: {
    total: 46,
    mastered: 15,
    learning: 20,
    new: 11,
  },
}

function ProgressSummary({ data }) {
  const percentage = Math.round((data.mastered / data.total) * 100)
  
  return (
    <Card variant="filled" className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-title-large">Overall Progress</h3>
        <span className="text-headline-medium font-bold text-primary">
          {percentage}%
        </span>
      </div>
      
      <Progress value={data.mastered} max={data.total} variant="primary" className="h-3" />
      
      <div className="grid grid-cols-3 gap-4 pt-2">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{data.mastered}</div>
          <div className="text-body-small text-muted-foreground">Mastered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{data.learning}</div>
          <div className="text-body-small text-muted-foreground">Learning</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{data.new}</div>
          <div className="text-body-small text-muted-foreground">New</div>
        </div>
      </div>
    </Card>
  )
}

function ProgressItem({ char, romaji, mastery, maxMastery = 5 }) {
  const mastered = mastery >= maxMastery
  const percentage = (mastery / maxMastery) * 100
  
  return (
    <div className="p-4 bg-surface rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary text-secondary-foreground">
          <span className="text-2xl font-japanese font-medium">{char}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-body-medium font-medium">{romaji}</span>
            {mastered && <Badge variant="primary" className="text-xs">★ Mastered</Badge>}
          </div>
          <Progress value={mastery} max={maxMastery} variant="primary" className="h-1.5" />
        </div>
        
        <div className="text-label-large text-muted-foreground">
          {mastery}/{maxMastery}
        </div>
      </div>
    </div>
  )
}

export default function ProgressScreen() {
  const [activeTab, setActiveTab] = useState('kana')
  const data = SAMPLE_PROGRESS[activeTab]

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-headline-small mb-2">Your Progress</h2>
        <p className="text-body-medium text-muted-foreground">
          Track your learning journey
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface-container rounded-full">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 px-4 py-2 rounded-full text-label-large font-medium transition-all',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <ProgressSummary data={data} />

      {/* Individual Progress Items - TODO: Replace with actual data */}
      <div className="space-y-3">
        <h3 className="text-title-medium px-2">Character Progress</h3>
        
        {/* Sample items */}
        <ProgressItem char="あ" romaji="a" mastery={5} />
        <ProgressItem char="か" romaji="ka" mastery={4} />
        <ProgressItem char="さ" romaji="sa" mastery={3} />
        <ProgressItem char="た" romaji="ta" mastery={2} />
        <ProgressItem char="な" romaji="na" mastery={1} />
        <ProgressItem char="は" romaji="ha" mastery={0} />
      </div>

      <div className="h-8" /> {/* Bottom spacing */}
    </div>
  )
}
