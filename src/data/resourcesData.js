// Resources data for the learning materials page
// You can easily modify videos, chapters, and tips by editing this file

export const videosData = [
  {
    id: '6p9Il_j0zjc', // YouTube video ID
    title: 'Learn Hiragana and Katakana',
    description: 'Comprehensive guide to Japanese kana systems',
    chapters: [
      { title: 'Introduction', time: 0, description: 'Welcome and overview' },
      { title: 'Hiragana Basics', time: 120, description: 'Basic hiragana characters' },
      { title: 'Katakana Basics', time: 300, description: 'Basic katakana characters' },
      { title: 'Dakuten & Handakuten', time: 480, description: 'Modified characters with marks' },
      { title: 'Common Words', time: 660, description: 'Practical vocabulary examples' },
      { title: 'Practice Tips', time: 840, description: 'How to practice effectively' }
    ]
  }
  // You can add more videos here in the future:
  // {
  //   id: 'another-video-id',
  //   title: 'Advanced Japanese Writing',
  //   description: 'Next level techniques',
  //   chapters: [
  //     { title: 'Kanji Introduction', time: 0, description: 'Basic kanji concepts' },
  //     // ... more chapters
  //   ]
  // }
];

export const learningTips = [
  {
    title: 'Practice Daily',
    description: 'Consistent daily practice, even just 10-15 minutes, is more effective than long irregular sessions.'
  },
  {
    title: 'Write by Hand',
    description: 'Use the handwriting practice feature to reinforce muscle memory and character recognition.'
  },
  {
    title: 'Learn in Groups',
    description: 'Master one row at a time (あかさた...) before moving to the next for better retention.'
  },
  {
    title: 'Use Context',
    description: 'Practice with vocabulary words to see how characters work together in real usage.'
  }
  // You can add more tips here:
  // {
  //   title: 'Your New Tip',
  //   description: 'Your tip description here.'
  // }
];