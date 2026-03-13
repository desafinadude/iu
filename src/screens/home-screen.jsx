import { useNav } from '../context/NavContext'
import { Card } from '../components/ui/card'
import { cn } from '../lib/utils'

const ACTIVITIES = [
  {
    id: 'kana_quiz',
    title: 'Kana Quiz',
    kana: 'あ',
    gradient: 'from-purple-500 to-purple-700',
    description: 'Test your kana knowledge',
  },
  {
    id: 'word_search',
    title: 'Word Search',
    kana: '語',
    gradient: 'from-blue-500 to-blue-700',
    description: 'Find hidden Japanese words',
  },
  {
    id: 'writing',
    title: 'Writing',
    kana: '書',
    gradient: 'from-green-500 to-green-700',
    description: 'Practice handwriting',
  },
  {
    id: 'verb_drill',
    title: 'Verb Dojo',
    kana: '動',
    gradient: 'from-orange-500 to-orange-700',
    description: 'Master verb conjugations',
  },
  {
    id: 'sentence_builder',
    title: 'Sentence Builder',
    kana: '文',
    gradient: 'from-pink-500 to-pink-700',
    description: 'Construct Japanese sentences',
  },
]

export default function HomeScreen() {
  const { navigate } = useNav()

  return (
    <div className="flex flex-col gap-6 p-4 pb-8">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <h2 className="text-headline-medium mb-2">Welcome to KoiKata</h2>
        <p className="text-body-large text-muted-foreground">
          Choose an activity to start learning
        </p>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {ACTIVITIES.map((activity) => (
          <button
            key={activity.id}
            onClick={() => navigate(activity.id)}
            className="group text-left"
            aria-label={`Start ${activity.title}`}
          >
            <Card 
              variant="elevated" 
              className={cn(
                'overflow-hidden transition-all duration-300',
                'hover:scale-[1.02] active:scale-[0.98]',
                'hover:shadow-md3-3'
              )}
            >
              <div className="relative p-6 flex items-center gap-4">
                {/* Gradient Background */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity',
                  activity.gradient
                )} />
                
                {/* Kana Icon */}
                <div className={cn(
                  'relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br text-white shadow-md3-2',
                  'group-hover:scale-110 transition-transform',
                  activity.gradient
                )}>
                  <span className="text-3xl font-japanese font-bold">
                    {activity.kana}
                  </span>
                </div>

                {/* Text Content */}
                <div className="relative flex-1">
                  <h3 className="text-title-large mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-body-small text-muted-foreground">
                    {activity.description}
                  </p>
                </div>

                {/* Arrow Indicator */}
                <div className="relative">
                  <svg
                    className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
