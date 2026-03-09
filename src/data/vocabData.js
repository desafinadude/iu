// ─────────────────────────────────────────────────────────────────────────────
// vocabData.js — Japanese Learning App: Core Vocabulary Data
//
// Three named exports:
//   VOCAB_LIST  — nouns, adverbs, phrases, particles, pronouns, numbers
//   VERB_LIST   — verbs with full polite + casual conjugation tables
//   ADJ_LIST    — i-adj and na-adj with full polite + casual conjugation tables
//
// Verbs and adjectives are intentionally NOT in VOCAB_LIST.
// This prevents learners from encountering the same word in multiple
// conflicting forms with no clear relationship shown between them.
//
// Conjugation form keys (both polite and casual):
//   present_pos  — affirmative present / non-past
//   present_neg  — negative present / non-past
//   past_pos     — affirmative past
//   past_neg     — negative past
//
// Note on i-adjectives: the dictionary form IS the casual present positive.
// Note on な-adj casual: uses だ/じゃない pattern (most natural casual speech).
// Note on いい (good): irregular casual forms use よ- stem.
// ─────────────────────────────────────────────────────────────────────────────


// ═══════════════════════════════════════════════════════════════════════════
// VOCAB_LIST — Nouns, Adverbs, Phrases, Particles, Pronouns, Numbers
// word    = display form (kanji / kana)
// kana    = hiragana/katakana reading
// meaning = English gloss
// type    = noun | adverb | conjunction | interjection | phrase |
//           question | pronoun | demonstrative | number | particle
// example = { jp, kana, en } — one natural example sentence
// ═══════════════════════════════════════════════════════════════════════════

export const VOCAB_LIST = [

  // ── Time words ─────────────────────────────────────────────────────────
  { word: '秋',     kana: 'あき',     meaning: 'autumn',                 type: 'noun',   example: { jp: '秋は涼しいです。',         kana: 'あきはすずしいです。',       en: 'Autumn is cool.' } },
  { word: '朝',     kana: 'あさ',     meaning: 'morning',                type: 'noun',   example: { jp: '朝、早く起きます。',       kana: 'あさ、はやくおきます。',     en: 'I wake up early in the morning.' } },
  { word: '朝ご飯', kana: 'あさごはん', meaning: 'breakfast',             type: 'noun',   example: { jp: '朝ご飯を食べます。',       kana: 'あさごはんをたべます。',     en: 'I eat breakfast.' } },
  { word: '明日',   kana: 'あした',   meaning: 'tomorrow',               type: 'noun',   example: { jp: '明日は雨です。',           kana: 'あしたはあめです。',         en: 'Tomorrow it will rain.' } },
  { word: 'あさって', kana: 'あさって', meaning: 'day after tomorrow',     type: 'noun',   example: { jp: 'あさって会いましょう。',   kana: 'あさってあいましょう。',     en: "Let's meet the day after tomorrow." } },
  { word: '一昨日', kana: 'おととい', meaning: 'day before yesterday',    type: 'noun',   example: { jp: '一昨日、雨でした。',       kana: 'おととい、あめでした。',     en: 'It rained the day before yesterday.' } },
  { word: '昨日',   kana: 'きのう',   meaning: 'yesterday',              type: 'noun',   example: { jp: '昨日、勉強しました。',     kana: 'きのう、べんきょうしました。', en: 'I studied yesterday.' } },
  { word: '今',     kana: 'いま',     meaning: 'now',                    type: 'noun',   example: { jp: '今、何時ですか。',         kana: 'いま、なんじですか。',       en: 'What time is it now?' } },
  { word: '今日',   kana: 'きょう',   meaning: 'today',                  type: 'noun',   example: { jp: '今日は暑いです。',         kana: 'きょうはあついです。',       en: 'Today is hot.' } },
  { word: '昼',     kana: 'ひる',     meaning: 'noon / daytime',         type: 'noun',   example: { jp: '昼に休みます。',           kana: 'ひるにやすみます。',         en: 'I rest at noon.' } },
  { word: '昼ご飯', kana: 'ひるごはん', meaning: 'lunch',                 type: 'noun',   example: { jp: '昼ご飯を食べます。',       kana: 'ひるごはんをたべます。',     en: 'I eat lunch.' } },
  { word: '晩',     kana: 'ばん',     meaning: 'evening',                type: 'noun',   example: { jp: '晩ご飯は何ですか。',       kana: 'ばんごはんはなんですか。',   en: 'What is for dinner?' } },
  { word: '晩ご飯', kana: 'ばんごはん', meaning: 'dinner',                type: 'noun',   example: { jp: '晩ご飯を作ります。',       kana: 'ばんごはんをつくります。',   en: 'I make dinner.' } },
  { word: '夜',     kana: 'よる',     meaning: 'night',                  type: 'noun',   example: { jp: '夜、音楽を聞きます。',     kana: 'よる、おんがくをききます。', en: 'I listen to music at night.' } },
  { word: '午前',   kana: 'ごぜん',   meaning: 'morning / AM',           type: 'noun',   example: { jp: '午前に授業があります。',   kana: 'ごぜんにじゅぎょうがあります。', en: 'There is a class in the morning.' } },
  { word: '午後',   kana: 'ごご',     meaning: 'afternoon / PM',         type: 'noun',   example: { jp: '午後、公園に行きます。',   kana: 'ごご、こうえんにいきます。', en: 'I go to the park in the afternoon.' } },
  { word: '先週',   kana: 'せんしゅう', meaning: 'last week',              type: 'noun',   example: { jp: '先週、友達に会いました。', kana: 'せんしゅう、ともだちにあいました。', en: 'I met a friend last week.' } },
  { word: '今週',   kana: 'こんしゅう', meaning: 'this week',              type: 'noun',   example: { jp: '今週は忙しいです。',       kana: 'こんしゅうはいそがしいです。', en: 'This week is busy.' } },
  { word: '来週',   kana: 'らいしゅう', meaning: 'next week',              type: 'noun',   example: { jp: '来週、テストがあります。', kana: 'らいしゅう、テストがあります。', en: 'There is a test next week.' } },
  { word: '先月',   kana: 'せんげつ', meaning: 'last month',              type: 'noun',   example: { jp: '先月、本を買いました。',   kana: 'せんげつ、ほんをかいました。', en: 'I bought a book last month.' } },
  { word: '今月',   kana: 'こんげつ', meaning: 'this month',              type: 'noun',   example: { jp: '今月は寒いです。',         kana: 'こんげつはさむいです。',     en: 'This month is cold.' } },
  { word: '来月',   kana: 'らいげつ', meaning: 'next month',              type: 'noun',   example: { jp: '来月、日本に行きます。',   kana: 'らいげつ、にほんにいきます。', en: 'I will go to Japan next month.' } },
  { word: '去年',   kana: 'きょねん', meaning: 'last year',               type: 'noun',   example: { jp: '去年、日本語を始めました。', kana: 'きょねん、にほんごをはじめました。', en: 'I started Japanese last year.' } },
  { word: '今年',   kana: 'ことし',   meaning: 'this year',               type: 'noun',   example: { jp: '今年は忙しかったです。',   kana: 'ことしはいそがしかったです。', en: 'This year was busy.' } },
  { word: '来年',   kana: 'らいねん', meaning: 'next year',               type: 'noun',   example: { jp: '来年、日本に行きたいです。', kana: 'らいねん、にほんにいきたいです。', en: 'I want to go to Japan next year.' } },

  // ── Seasons ────────────────────────────────────────────────────────────
  { word: '春',     kana: 'はる',     meaning: 'spring',                 type: 'noun',   example: { jp: '春は暖かいです。',           kana: 'はるはあたたかいです。',     en: 'Spring is warm.' } },
  { word: '夏',     kana: 'なつ',     meaning: 'summer',                 type: 'noun',   example: { jp: '夏は暑いです。',             kana: 'なつはあついです。',         en: 'Summer is hot.' } },
  { word: '冬',     kana: 'ふゆ',     meaning: 'winter',                 type: 'noun',   example: { jp: '冬は寒いです。',             kana: 'ふゆはさむいです。',         en: 'Winter is cold.' } },

  // ── Months ─────────────────────────────────────────────────────────────
  { word: '一月',   kana: 'いちがつ', meaning: 'January',                type: 'noun',   example: { jp: '一月は寒いです。',           kana: 'いちがつはさむいです。',     en: 'January is cold.' } },
  { word: '二月',   kana: 'にがつ',   meaning: 'February',               type: 'noun',   example: { jp: '二月に雪が降ります。',       kana: 'にがつにゆきがふります。',   en: 'It snows in February.' } },
  { word: '三月',   kana: 'さんがつ', meaning: 'March',                  type: 'noun',   example: { jp: '三月に桜が咲きます。',       kana: 'さんがつにさくらがさきます。', en: 'Cherry blossoms bloom in March.' } },
  { word: '四月',   kana: 'しがつ',   meaning: 'April',                  type: 'noun',   example: { jp: '四月に学校が始まります。',   kana: 'しがつにがっこうがはじまります。', en: 'School starts in April.' } },
  { word: '五月',   kana: 'ごがつ',   meaning: 'May',                    type: 'noun',   example: { jp: '五月は気持ちいいです。',     kana: 'ごがつはきもちいいです。',   en: 'May is pleasant.' } },
  { word: '六月',   kana: 'ろくがつ', meaning: 'June',                   type: 'noun',   example: { jp: '六月は雨が多いです。',       kana: 'ろくがつはあめがおおいです。', en: 'There is a lot of rain in June.' } },
  { word: '七月',   kana: 'しちがつ', meaning: 'July',                   type: 'noun',   example: { jp: '七月は暑いです。',           kana: 'しちがつはあついです。',     en: 'July is hot.' } },
  { word: '八月',   kana: 'はちがつ', meaning: 'August',                 type: 'noun',   example: { jp: '八月に海へ行きます。',       kana: 'はちがつにうみへいきます。', en: 'I go to the sea in August.' } },
  { word: '九月',   kana: 'くがつ',   meaning: 'September',              type: 'noun',   example: { jp: '九月から秋になります。',     kana: 'くがつからあきになります。', en: 'Autumn starts from September.' } },
  { word: '十月',   kana: 'じゅうがつ', meaning: 'October',              type: 'noun',   example: { jp: '十月は涼しいです。',         kana: 'じゅうがつはすずしいです。', en: 'October is cool.' } },
  { word: '十一月', kana: 'じゅういちがつ', meaning: 'November',         type: 'noun',   example: { jp: '十一月に紅葉が見られます。', kana: 'じゅういちがつにこうようがみられます。', en: 'You can see autumn leaves in November.' } },
  { word: '十二月', kana: 'じゅうにがつ', meaning: 'December',           type: 'noun',   example: { jp: '十二月はクリスマスがあります。', kana: 'じゅうにがつはクリスマスがあります。', en: 'There is Christmas in December.' } },

  // ── Frequency / manner adverbs ──────────────────────────────────────────
  { word: 'いつも',   kana: 'いつも',   meaning: 'always',                 type: 'adverb', example: { jp: 'いつも元気です。',         kana: 'いつもげんきです。',         en: 'Always cheerful.' } },
  { word: 'よく',     kana: 'よく',     meaning: 'often',                  type: 'adverb', example: { jp: 'よく図書館へ行きます。',   kana: 'よくとしょかんへいきます。', en: 'I often go to the library.' } },
  { word: '時々',     kana: 'ときどき', meaning: 'sometimes',               type: 'adverb', example: { jp: '時々、映画を見ます。',     kana: 'ときどき、えいがをみます。', en: 'Sometimes I watch films.' } },
  { word: 'あまり',   kana: 'あまり',   meaning: 'not much (+ negative)',   type: 'adverb', example: { jp: 'あまり好きではありません。', kana: 'あまりすきではありません。', en: "I don't like it very much." } },
  { word: '全然',     kana: 'ぜんぜん', meaning: 'not at all (+ negative)', type: 'adverb', example: { jp: '全然わかりません。',       kana: 'ぜんぜんわかりません。',     en: "I don't understand at all." } },
  { word: 'もう',     kana: 'もう',     meaning: 'already',                 type: 'adverb', example: { jp: 'もう食べました。',         kana: 'もうたべました。',           en: 'I already ate.' } },
  { word: 'まだ',     kana: 'まだ',     meaning: 'not yet',                 type: 'adverb', example: { jp: 'まだ終わっていません。',   kana: 'まだおわっていません。',     en: 'It is not finished yet.' } },
  { word: 'すぐ',     kana: 'すぐ',     meaning: 'immediately / soon',      type: 'adverb', example: { jp: 'すぐ来ます。',             kana: 'すぐきます。',               en: 'I will come right away.' } },
  { word: 'ゆっくり', kana: 'ゆっくり', meaning: 'slowly',                  type: 'adverb', example: { jp: 'ゆっくり話してください。', kana: 'ゆっくりはなしてください。', en: 'Please speak slowly.' } },
  { word: 'たくさん', kana: 'たくさん', meaning: 'a lot / many',             type: 'adverb', example: { jp: '人がたくさんいます。',     kana: 'ひとがたくさんいます。',     en: 'There are many people.' } },
  { word: '少し',     kana: 'すこし',   meaning: 'a little',                type: 'adverb', example: { jp: '少し待ってください。',     kana: 'すこしまってください。',     en: 'Please wait a little.' } },
  { word: 'ちょっと', kana: 'ちょっと', meaning: 'a little / a moment',     type: 'adverb', example: { jp: 'ちょっといいですか。',     kana: 'ちょっといいですか。',       en: 'Do you have a moment?' } },
  { word: 'とても',   kana: 'とても',   meaning: 'very',                    type: 'adverb', example: { jp: 'とても美味しいです。',     kana: 'とてもおいしいです。',       en: 'It is very delicious.' } },
  { word: '一緒に',   kana: 'いっしょに', meaning: 'together',              type: 'adverb', example: { jp: '一緒に帰りましょう。',     kana: 'いっしょにかえりましょう。', en: "Let's go home together." } },
  { word: 'たぶん',   kana: 'たぶん',   meaning: 'probably / perhaps',      type: 'adverb', example: { jp: 'たぶん雨でしょう。',       kana: 'たぶんあめでしょう。',       en: 'It will probably rain.' } },
  { word: 'きっと',   kana: 'きっと',   meaning: 'surely',                  type: 'adverb', example: { jp: 'きっとうまくいきます。',   kana: 'きっとうまくいきます。',     en: 'It will surely go well.' } },
  { word: 'もちろん', kana: 'もちろん', meaning: 'of course',               type: 'adverb', example: { jp: 'もちろん行きます。',       kana: 'もちろんいきます。',         en: 'Of course I will go.' } },
  { word: 'そろそろ', kana: 'そろそろ', meaning: 'about time / soon',       type: 'adverb', example: { jp: 'そろそろ寝ます。',         kana: 'そろそろねます。',           en: "It's about time I slept." } },
  { word: 'だんだん', kana: 'だんだん', meaning: 'gradually',               type: 'adverb', example: { jp: 'だんだん寒くなります。',   kana: 'だんだんさむくなります。',   en: 'It gradually gets cold.' } },
  { word: 'ぜひ',     kana: 'ぜひ',     meaning: 'by all means',            type: 'adverb', example: { jp: 'ぜひ来てください。',       kana: 'ぜひきてください。',         en: 'Please do come.' } },

  // ── Conjunctions ───────────────────────────────────────────────────────
  { word: 'でも',     kana: 'でも',     meaning: 'but',                    type: 'conjunction', example: { jp: '高いです。でも、買います。', kana: 'たかいです。でも、かいます。', en: "It's expensive. But I'll buy it." } },
  { word: 'しかし',   kana: 'しかし',   meaning: 'however',                type: 'conjunction', example: { jp: '安いです。しかし、大きいです。', kana: 'やすいです。しかし、おおきいです。', en: "It's cheap. However, it's big." } },
  { word: 'そして',   kana: 'そして',   meaning: 'and then',               type: 'conjunction', example: { jp: '食べました。そして、寝ました。', kana: 'たべました。そして、ねました。', en: 'I ate. And then I slept.' } },
  { word: 'それから', kana: 'それから', meaning: 'after that',              type: 'conjunction', example: { jp: '買い物をして、それから帰ります。', kana: 'かいものをして、それからかえります。', en: "I'll shop, and after that go home." } },
  { word: 'だから',   kana: 'だから',   meaning: 'therefore / so',         type: 'conjunction', example: { jp: '雨です。だから、行きません。', kana: 'あめです。だから、いきません。', en: "It's raining. So I won't go." } },
  { word: 'または',   kana: 'または',   meaning: 'or',                     type: 'conjunction', example: { jp: 'コーヒーまたはお茶を飲みます。', kana: 'コーヒーまたはおちゃをのみます。', en: 'I drink coffee or tea.' } },
  { word: 'もし',     kana: 'もし',     meaning: 'if',                     type: 'conjunction', example: { jp: 'もし時間があれば、来てください。', kana: 'もしじかんがあれば、きてください。', en: 'If you have time, please come.' } },
  { word: 'では',     kana: 'では',     meaning: 'well then',              type: 'conjunction', example: { jp: 'では、始めましょう。',       kana: 'では、はじめましょう。',     en: "Well then, let's begin." } },
  { word: 'じゃ',     kana: 'じゃ',     meaning: 'well then (casual)',     type: 'conjunction', example: { jp: 'じゃ、また明日。',           kana: 'じゃ、またあした。',         en: 'Well then, see you tomorrow.' } },

  // ── Interjections ──────────────────────────────────────────────────────
  { word: 'はい',   kana: 'はい',   meaning: 'yes',           type: 'interjection', example: { jp: 'はい、そうです。',   kana: 'はい、そうです。',   en: "Yes, that's right." } },
  { word: 'いいえ', kana: 'いいえ', meaning: 'no',            type: 'interjection', example: { jp: 'いいえ、違います。', kana: 'いいえ、ちがいます。', en: "No, that's not right." } },
  { word: 'ええ',   kana: 'ええ',   meaning: 'yes (softer)',  type: 'interjection', example: { jp: 'ええ、知っています。', kana: 'ええ、しっています。', en: 'Yes, I know.' } },
  { word: 'さあ',   kana: 'さあ',   meaning: 'well…',         type: 'interjection', example: { jp: 'さあ、どうしましょう。', kana: 'さあ、どうしましょう。', en: 'Well… what shall we do?' } },

  // ── Common phrases ─────────────────────────────────────────────────────
  { word: 'すみません',       kana: 'すみません',       meaning: 'excuse me / sorry',       type: 'phrase', example: { jp: 'すみません、トイレはどこですか。', kana: 'すみません、トイレはどこですか。', en: 'Excuse me, where is the toilet?' } },
  { word: 'ありがとうございます', kana: 'ありがとうございます', meaning: 'thank you',          type: 'phrase', example: { jp: 'ありがとうございます。',       kana: 'ありがとうございます。',       en: 'Thank you very much.' } },
  { word: 'どうぞ',           kana: 'どうぞ',           meaning: 'please / here you go',    type: 'phrase', example: { jp: 'どうぞ、座ってください。',       kana: 'どうぞ、すわってください。',   en: 'Please, have a seat.' } },
  { word: 'おはよう',         kana: 'おはよう',         meaning: 'good morning',            type: 'phrase', example: { jp: 'おはようございます。',         kana: 'おはようございます。',         en: 'Good morning.' } },
  { word: 'こんにちは',       kana: 'こんにちは',       meaning: 'hello',                   type: 'phrase', example: { jp: 'こんにちは！',               kana: 'こんにちは！',                 en: 'Hello!' } },
  { word: 'こんばんは',       kana: 'こんばんは',       meaning: 'good evening',            type: 'phrase', example: { jp: 'こんばんは、遅いですね。',     kana: 'こんばんは、おそいですね。',   en: "Good evening — it's late, isn't it." } },
  { word: 'さようなら',       kana: 'さようなら',       meaning: 'goodbye',                 type: 'phrase', example: { jp: 'さようなら、また会いましょう。', kana: 'さようなら、またあいましょう。', en: "Goodbye, let's meet again." } },
  { word: 'おやすみ',         kana: 'おやすみ',         meaning: 'good night',              type: 'phrase', example: { jp: 'おやすみなさい。',             kana: 'おやすみなさい。',             en: 'Good night.' } },
  { word: 'はじめまして',     kana: 'はじめまして',     meaning: 'nice to meet you',        type: 'phrase', example: { jp: 'はじめまして、ディです。',     kana: 'はじめまして、ディです。',     en: "Nice to meet you, I'm Di." } },
  { word: 'よろしくお願いします', kana: 'よろしくおねがいします', meaning: 'please treat me well', type: 'phrase', example: { jp: 'よろしくお願いします。',       kana: 'よろしくおねがいします。',     en: 'Pleased to meet you / I appreciate your help.' } },
  { word: 'いただきます',     kana: 'いただきます',     meaning: "let's eat",               type: 'phrase', example: { jp: 'いただきます！',             kana: 'いただきます！',               en: "Let's eat!" } },
  { word: 'ごちそうさま',     kana: 'ごちそうさま',     meaning: 'thank you for the meal',  type: 'phrase', example: { jp: 'ごちそうさまでした。',         kana: 'ごちそうさまでした。',         en: 'Thank you for the meal.' } },
  { word: 'ただいま',         kana: 'ただいま',         meaning: "I'm home",                type: 'phrase', example: { jp: 'ただいま！',                 kana: 'ただいま！',                   en: "I'm home!" } },
  { word: 'おかえり',         kana: 'おかえり',         meaning: 'welcome back',            type: 'phrase', example: { jp: 'おかえりなさい。',             kana: 'おかえりなさい。',             en: 'Welcome back.' } },
  { word: 'ごめんなさい',     kana: 'ごめんなさい',     meaning: "I'm sorry",               type: 'phrase', example: { jp: '遅れて、ごめんなさい。',       kana: 'おくれて、ごめんなさい。',     en: "I'm sorry I'm late." } },
  { word: 'わかりました',     kana: 'わかりました',     meaning: 'I understand / got it',   type: 'phrase', example: { jp: 'はい、わかりました。',         kana: 'はい、わかりました。',         en: 'Yes, understood.' } },
  { word: 'わかりません',     kana: 'わかりません',     meaning: "I don't understand",      type: 'phrase', example: { jp: 'すみません、わかりません。',   kana: 'すみません、わかりません。',   en: "Sorry, I don't understand." } },
  { word: 'がんばって',       kana: 'がんばって',       meaning: 'good luck / hang in there', type: 'phrase', example: { jp: 'テスト、がんばってください。', kana: 'テスト、がんばってください。', en: 'Good luck on the test.' } },
  { word: 'どういたしまして', kana: 'どういたしまして', meaning: "you're welcome",           type: 'phrase', example: { jp: 'ありがとう。どういたしまして。', kana: 'ありがとう。どういたしまして。', en: "Thank you. — You're welcome." } },
  { word: 'おめでとう',       kana: 'おめでとう',       meaning: 'congratulations',         type: 'phrase', example: { jp: '誕生日、おめでとうございます。', kana: 'たんじょうび、おめでとうございます。', en: 'Happy birthday!' } },

  // ── Question words ─────────────────────────────────────────────────────
  { word: '何',   kana: 'なに／なん', meaning: 'what?',             type: 'question', example: { jp: '何を食べますか。',       kana: 'なにをたべますか。',     en: 'What will you eat?' } },
  { word: 'どこ', kana: 'どこ',       meaning: 'where?',            type: 'question', example: { jp: 'トイレはどこですか。',   kana: 'トイレはどこですか。',   en: 'Where is the toilet?' } },
  { word: 'いつ', kana: 'いつ',       meaning: 'when?',             type: 'question', example: { jp: '誕生日はいつですか。',   kana: 'たんじょうびはいつですか。', en: 'When is your birthday?' } },
  { word: 'だれ', kana: 'だれ',       meaning: 'who?',              type: 'question', example: { jp: 'あれは誰ですか。',       kana: 'あれはだれですか。',     en: 'Who is that?' } },
  { word: 'どれ', kana: 'どれ',       meaning: 'which one?',        type: 'question', example: { jp: 'どれが好きですか。',     kana: 'どれがすきですか。',     en: 'Which one do you like?' } },
  { word: 'どの', kana: 'どの',       meaning: 'which (+ noun)?',   type: 'question', example: { jp: 'どの本を読みますか。',   kana: 'どのほんをよみますか。', en: 'Which book will you read?' } },
  { word: 'どう', kana: 'どう',       meaning: 'how?',              type: 'question', example: { jp: '日本語はどうですか。',   kana: 'にほんごはどうですか。', en: 'How is Japanese?' } },
  { word: 'なぜ', kana: 'なぜ',       meaning: 'why?',              type: 'question', example: { jp: 'なぜ勉強しますか。',     kana: 'なぜべんきょうしますか。', en: 'Why do you study?' } },
  { word: 'いくら', kana: 'いくら',   meaning: 'how much?',         type: 'question', example: { jp: 'これはいくらですか。',   kana: 'これはいくらですか。',   en: 'How much is this?' } },
  { word: 'いくつ', kana: 'いくつ',   meaning: 'how many?',         type: 'question', example: { jp: 'いくつありますか。',     kana: 'いくつありますか。',     en: 'How many are there?' } },
  { word: 'どんな', kana: 'どんな',   meaning: 'what kind of?',     type: 'question', example: { jp: 'どんな音楽が好きですか。', kana: 'どんなおんがくがすきですか。', en: 'What kind of music do you like?' } },

  // ── Pronouns and demonstratives ────────────────────────────────────────
  { word: '私',       kana: 'わたし',     meaning: 'I',                   type: 'pronoun',      example: { jp: '私は学生です。',     kana: 'わたしはがくせいです。',   en: 'I am a student.' } },
  { word: '私たち',   kana: 'わたしたち', meaning: 'we',                  type: 'pronoun',      example: { jp: '私たちは友達です。', kana: 'わたしたちはともだちです。', en: 'We are friends.' } },
  { word: 'あなた',   kana: 'あなた',     meaning: 'you',                 type: 'pronoun',      example: { jp: 'あなたは何をしますか。', kana: 'あなたはなにをしますか。', en: 'What will you do?' } },
  { word: '彼',       kana: 'かれ',       meaning: 'he / boyfriend',      type: 'pronoun',      example: { jp: '彼は先生です。',     kana: 'かれはせんせいです。',     en: 'He is a teacher.' } },
  { word: '彼女',     kana: 'かのじょ',   meaning: 'she / girlfriend',    type: 'pronoun',      example: { jp: '彼女は学生です。',   kana: 'かのじょはがくせいです。', en: 'She is a student.' } },
  { word: 'これ',     kana: 'これ',       meaning: 'this (near me)',      type: 'pronoun',      example: { jp: 'これは何ですか。',   kana: 'これはなんですか。',       en: 'What is this?' } },
  { word: 'それ',     kana: 'それ',       meaning: 'that (near you)',     type: 'pronoun',      example: { jp: 'それは私の本です。', kana: 'それはわたしのほんです。', en: 'That is my book.' } },
  { word: 'あれ',     kana: 'あれ',       meaning: 'that (over there)',   type: 'pronoun',      example: { jp: 'あれは何ですか。',   kana: 'あれはなんですか。',       en: 'What is that over there?' } },
  { word: 'この',     kana: 'この',       meaning: 'this (+ noun)',       type: 'demonstrative', example: { jp: 'この本は面白いです。', kana: 'このほんはおもしろいです。', en: 'This book is interesting.' } },
  { word: 'その',     kana: 'その',       meaning: 'that (+ noun)',       type: 'demonstrative', example: { jp: 'その人は誰ですか。', kana: 'そのひとはだれですか。',   en: 'Who is that person?' } },
  { word: 'あの',     kana: 'あの',       meaning: 'that over there (+ noun)', type: 'demonstrative', example: { jp: 'あの山は高いです。', kana: 'あのやまはたかいです。', en: 'That mountain over there is tall.' } },
  { word: 'ここ',     kana: 'ここ',       meaning: 'here',                type: 'pronoun',      example: { jp: 'ここに座ります。',   kana: 'ここにすわります。',       en: 'I sit here.' } },
  { word: 'そこ',     kana: 'そこ',       meaning: 'there (near you)',    type: 'pronoun',      example: { jp: 'そこで待ちます。',   kana: 'そこでまちます。',         en: 'I will wait there.' } },
  { word: 'あそこ',   kana: 'あそこ',     meaning: 'over there',          type: 'pronoun',      example: { jp: 'あそこに駅があります。', kana: 'あそこにえきがあります。', en: 'There is a station over there.' } },

  // ── Key particles (standalone reference) ──────────────────────────────
  { word: 'も',   kana: 'も',   meaning: 'also / too', type: 'particle', example: { jp: '私も行きます。',   kana: 'わたしもいきます。',   en: 'I will go too.' } },
  { word: 'だけ', kana: 'だけ', meaning: 'only',       type: 'particle', example: { jp: '水だけ飲みます。', kana: 'みずだけのみます。',   en: 'I drink only water.' } },

  // ── People, family, relationships ──────────────────────────────────────
  { word: '人',       kana: 'ひと',     meaning: 'person',            type: 'noun', example: { jp: 'あの人は誰ですか。',     kana: 'あのひとはだれですか。',   en: 'Who is that person?' } },
  { word: '友達',     kana: 'ともだち', meaning: 'friend',            type: 'noun', example: { jp: '友達と映画を見ます。',   kana: 'ともだちとえいがをみます。', en: 'I watch a film with a friend.' } },
  { word: '先生',     kana: 'せんせい', meaning: 'teacher',           type: 'noun', example: { jp: '先生に聞きます。',       kana: 'せんせいにききます。',     en: 'I ask the teacher.' } },
  { word: '学生',     kana: 'がくせい', meaning: 'student',           type: 'noun', example: { jp: '私は学生です。',         kana: 'わたしはがくせいです。',   en: 'I am a student.' } },
  { word: 'お母さん', kana: 'おかあさん', meaning: 'mother',           type: 'noun', example: { jp: 'お母さんは料理が上手です。', kana: 'おかあさんはりょうりがじょうずです。', en: 'My mother is good at cooking.' } },
  { word: 'お父さん', kana: 'おとうさん', meaning: 'father',           type: 'noun', example: { jp: 'お父さんは会社で働きます。', kana: 'おとうさんはかいしゃではたらきます。', en: 'My father works at a company.' } },
  { word: '子ども',   kana: 'こども',   meaning: 'child / children',  type: 'noun', example: { jp: '子どもたちは公園で遊びます。', kana: 'こどもたちはこうえんであそびます。', en: 'The children play in the park.' } },

  // ── Places ─────────────────────────────────────────────────────────────
  { word: '家',     kana: 'いえ',       meaning: 'house / home',      type: 'noun', example: { jp: '家に帰ります。',         kana: 'いえにかえります。',       en: 'I return home.' } },
  { word: '部屋',   kana: 'へや',       meaning: 'room',              type: 'noun', example: { jp: '部屋を掃除します。',     kana: 'へやをそうじします。',     en: 'I clean my room.' } },
  { word: '学校',   kana: 'がっこう',   meaning: 'school',            type: 'noun', example: { jp: '学校へ行きます。',       kana: 'がっこうへいきます。',     en: 'I go to school.' } },
  { word: '大学',   kana: 'だいがく',   meaning: 'university',        type: 'noun', example: { jp: '大学で勉強します。',     kana: 'だいがくでべんきょうします。', en: 'I study at university.' } },
  { word: '図書館', kana: 'としょかん', meaning: 'library',            type: 'noun', example: { jp: '図書館で本を読みます。', kana: 'としょかんでほんをよみます。', en: 'I read books at the library.' } },
  { word: '病院',   kana: 'びょういん', meaning: 'hospital',           type: 'noun', example: { jp: '病院へ行きます。',       kana: 'びょういんへいきます。',   en: 'I go to the hospital.' } },
  { word: '会社',   kana: 'かいしゃ',   meaning: 'company / office',   type: 'noun', example: { jp: '会社で働きます。',       kana: 'かいしゃではたらきます。', en: 'I work at a company.' } },
  { word: '銀行',   kana: 'ぎんこう',   meaning: 'bank',               type: 'noun', example: { jp: '銀行でお金を下ろします。', kana: 'ぎんこうでおかねをおろします。', en: 'I withdraw money at the bank.' } },
  { word: '公園',   kana: 'こうえん',   meaning: 'park',               type: 'noun', example: { jp: '公園を歩きます。',       kana: 'こうえんをあるきます。',   en: 'I walk in the park.' } },
  { word: '駅',     kana: 'えき',       meaning: 'station',            type: 'noun', example: { jp: '駅で待ちます。',         kana: 'えきでまちます。',         en: 'I wait at the station.' } },
  { word: '空港',   kana: 'くうこう',   meaning: 'airport',            type: 'noun', example: { jp: '空港へ行きます。',       kana: 'くうこうへいきます。',     en: 'I go to the airport.' } },
  { word: 'レストラン', kana: 'レストラン', meaning: 'restaurant',      type: 'noun', example: { jp: 'レストランで食べます。', kana: 'レストランでたべます。',   en: 'I eat at a restaurant.' } },
  { word: 'カフェ', kana: 'カフェ',     meaning: 'café',               type: 'noun', example: { jp: 'カフェでコーヒーを飲みます。', kana: 'カフェでコーヒーをのみます。', en: 'I drink coffee at a café.' } },
  { word: 'スーパー', kana: 'スーパー', meaning: 'supermarket',        type: 'noun', example: { jp: 'スーパーで野菜を買います。', kana: 'スーパーでやさいをかいます。', en: 'I buy vegetables at the supermarket.' } },
  { word: 'コンビニ', kana: 'コンビニ', meaning: 'convenience store',  type: 'noun', example: { jp: 'コンビニで弁当を買います。', kana: 'コンビニでべんとうをかいます。', en: 'I buy a bento at the convenience store.' } },
  { word: 'ホテル', kana: 'ホテル',     meaning: 'hotel',              type: 'noun', example: { jp: 'ホテルに泊まります。',   kana: 'ホテルにとまります。',     en: 'I stay at a hotel.' } },

  // ── Objects & everyday items ───────────────────────────────────────────
  { word: '本',   kana: 'ほん',     meaning: 'book',              type: 'noun', example: { jp: '本を読みます。',         kana: 'ほんをよみます。',         en: 'I read a book.' } },
  { word: '手紙', kana: 'てがみ',   meaning: 'letter',            type: 'noun', example: { jp: '手紙を書きます。',       kana: 'てがみをかきます。',       en: 'I write a letter.' } },
  { word: '新聞', kana: 'しんぶん', meaning: 'newspaper',         type: 'noun', example: { jp: '朝、新聞を読みます。',   kana: 'あさ、しんぶんをよみます。', en: 'I read the newspaper in the morning.' } },
  { word: 'お金', kana: 'おかね',   meaning: 'money',             type: 'noun', example: { jp: 'お金がありません。',     kana: 'おかねがありません。',     en: "I don't have money." } },
  { word: '車',   kana: 'くるま',   meaning: 'car',               type: 'noun', example: { jp: '車で行きます。',         kana: 'くるまでいきます。',       en: 'I go by car.' } },
  { word: '電車', kana: 'でんしゃ', meaning: 'train',             type: 'noun', example: { jp: '電車で来ます。',         kana: 'でんしゃできます。',       en: 'I come by train.' } },
  { word: '自転車', kana: 'じてんしゃ', meaning: 'bicycle',       type: 'noun', example: { jp: '自転車で行きます。',     kana: 'じてんしゃでいきます。',   en: 'I go by bicycle.' } },
  { word: '傘',   kana: 'かさ',     meaning: 'umbrella',          type: 'noun', example: { jp: '傘を持ちます。',         kana: 'かさをもちます。',         en: 'I bring an umbrella.' } },
  { word: '鞄',   kana: 'かばん',   meaning: 'bag',               type: 'noun', example: { jp: '鞄を持っています。',     kana: 'かばんをもっています。',   en: 'I have a bag.' } },
  { word: '財布', kana: 'さいふ',   meaning: 'wallet',            type: 'noun', example: { jp: '財布を忘れました。',     kana: 'さいふをわすれました。',   en: 'I forgot my wallet.' } },
  { word: '鍵',   kana: 'かぎ',     meaning: 'key',               type: 'noun', example: { jp: '鍵をかけます。',         kana: 'かぎをかけます。',         en: 'I lock the door.' } },
  { word: '時計', kana: 'とけい',   meaning: 'clock / watch',     type: 'noun', example: { jp: '時計を見ます。',         kana: 'とけいをみます。',         en: 'I look at the clock.' } },
  { word: '眼鏡', kana: 'めがね',   meaning: 'glasses',           type: 'noun', example: { jp: '眼鏡をかけます。',       kana: 'めがねをかけます。',       en: 'I put on glasses.' } },
  { word: 'テレビ', kana: 'テレビ', meaning: 'TV',                type: 'noun', example: { jp: 'テレビを見ます。',       kana: 'テレビをみます。',         en: 'I watch TV.' } },
  { word: 'パソコン', kana: 'パソコン', meaning: 'computer',      type: 'noun', example: { jp: 'パソコンを使います。',   kana: 'パソコンをつかいます。',   en: 'I use a computer.' } },
  { word: '携帯', kana: 'けいたい', meaning: 'mobile phone',      type: 'noun', example: { jp: '携帯で写真を撮ります。', kana: 'けいたいでしゃしんをとります。', en: 'I take photos with my phone.' } },
  { word: 'カメラ', kana: 'カメラ', meaning: 'camera',            type: 'noun', example: { jp: 'カメラを持っています。', kana: 'カメラをもっています。',   en: 'I have a camera.' } },
  { word: '机',   kana: 'つくえ',   meaning: 'desk',              type: 'noun', example: { jp: '机の上に本があります。', kana: 'つくえのうえにほんがあります。', en: 'There is a book on the desk.' } },
  { word: '椅子', kana: 'いす',     meaning: 'chair',             type: 'noun', example: { jp: '椅子に座ります。',       kana: 'いすにすわります。',       en: 'I sit on the chair.' } },
  { word: 'ドア', kana: 'ドア',     meaning: 'door',              type: 'noun', example: { jp: 'ドアを開けます。',       kana: 'ドアをあけます。',         en: 'I open the door.' } },
  { word: '窓',   kana: 'まど',     meaning: 'window',            type: 'noun', example: { jp: '窓を開けます。',         kana: 'まどをあけます。',         en: 'I open the window.' } },

  // ── Clothing (essentials only) ─────────────────────────────────────────
  { word: '服',   kana: 'ふく',     meaning: 'clothes',           type: 'noun', example: { jp: '服を着ます。',           kana: 'ふくをきます。',           en: 'I put on clothes.' } },
  { word: '靴',   kana: 'くつ',     meaning: 'shoes',             type: 'noun', example: { jp: '靴を履きます。',         kana: 'くつをはきます。',         en: 'I put on shoes.' } },
  { word: '帽子', kana: 'ぼうし',   meaning: 'hat',               type: 'noun', example: { jp: '帽子をかぶります。',     kana: 'ぼうしをかぶります。',     en: 'I wear a hat.' } },
  { word: 'コート', kana: 'コート', meaning: 'coat',              type: 'noun', example: { jp: 'コートを着ます。',       kana: 'コートをきます。',         en: 'I put on a coat.' } },

  // ── Food and drink ─────────────────────────────────────────────────────
  { word: 'ご飯',   kana: 'ごはん',   meaning: 'rice / meal',      type: 'noun', example: { jp: 'ご飯を食べます。',     kana: 'ごはんをたべます。',     en: 'I eat rice.' } },
  { word: 'パン',   kana: 'パン',     meaning: 'bread',            type: 'noun', example: { jp: 'パンを食べます。',     kana: 'パンをたべます。',       en: 'I eat bread.' } },
  { word: '肉',     kana: 'にく',     meaning: 'meat',             type: 'noun', example: { jp: '肉が好きです。',       kana: 'にくがすきです。',       en: 'I like meat.' } },
  { word: '魚',     kana: 'さかな',   meaning: 'fish',             type: 'noun', example: { jp: '魚を食べます。',       kana: 'さかなをたべます。',     en: 'I eat fish.' } },
  { word: '野菜',   kana: 'やさい',   meaning: 'vegetables',       type: 'noun', example: { jp: '野菜を食べます。',     kana: 'やさいをたべます。',     en: 'I eat vegetables.' } },
  { word: '果物',   kana: 'くだもの', meaning: 'fruit',            type: 'noun', example: { jp: '果物が好きです。',     kana: 'くだものがすきです。',   en: 'I like fruit.' } },
  { word: '卵',     kana: 'たまご',   meaning: 'egg',              type: 'noun', example: { jp: '卵を食べます。',       kana: 'たまごをたべます。',     en: 'I eat eggs.' } },
  { word: '牛乳',   kana: 'ぎゅうにゅう', meaning: 'milk',         type: 'noun', example: { jp: '牛乳を飲みます。',     kana: 'ぎゅうにゅうをのみます。', en: 'I drink milk.' } },
  { word: '水',     kana: 'みず',     meaning: 'water',            type: 'noun', example: { jp: '水を飲みます。',       kana: 'みずをのみます。',       en: 'I drink water.' } },
  { word: 'お茶',   kana: 'おちゃ',   meaning: 'tea',              type: 'noun', example: { jp: 'お茶を飲みます。',     kana: 'おちゃをのみます。',     en: 'I drink tea.' } },
  { word: 'コーヒー', kana: 'コーヒー', meaning: 'coffee',         type: 'noun', example: { jp: 'コーヒーを飲みます。', kana: 'コーヒーをのみます。',   en: 'I drink coffee.' } },
  { word: 'ジュース', kana: 'ジュース', meaning: 'juice',          type: 'noun', example: { jp: 'ジュースを飲みます。', kana: 'ジュースをのみます。',   en: 'I drink juice.' } },
  { word: 'ビール', kana: 'ビール',   meaning: 'beer',             type: 'noun', example: { jp: 'ビールを飲みます。',   kana: 'ビールをのみます。',     en: 'I drink beer.' } },
  { word: 'ワイン', kana: 'ワイン',   meaning: 'wine',             type: 'noun', example: { jp: 'ワインを飲みます。',   kana: 'ワインをのみます。',     en: 'I drink wine.' } },
  { word: 'お酒',   kana: 'おさけ',   meaning: 'alcohol',          type: 'noun', example: { jp: 'お酒を飲みません。',   kana: 'おさけをのみません。',   en: "I don't drink alcohol." } },
  { word: '料理',   kana: 'りょうり', meaning: 'cooking / dish',   type: 'noun', example: { jp: '料理を作ります。',     kana: 'りょうりをつくります。', en: 'I make a dish.' } },
  { word: '味',     kana: 'あじ',     meaning: 'taste / flavour',  type: 'noun', example: { jp: '味はどうですか。',     kana: 'あじはどうですか。',     en: 'How does it taste?' } },

  // ── Nature, weather, places ────────────────────────────────────────────
  { word: '天気',   kana: 'てんき',   meaning: 'weather',          type: 'noun', example: { jp: '今日は天気がいいです。', kana: 'きょうはてんきがいいです。', en: 'The weather is nice today.' } },
  { word: '雨',     kana: 'あめ',     meaning: 'rain',             type: 'noun', example: { jp: '雨が降ります。',       kana: 'あめがふります。',       en: 'It rains.' } },
  { word: '雪',     kana: 'ゆき',     meaning: 'snow',             type: 'noun', example: { jp: '雪が降りました。',     kana: 'ゆきがふりました。',     en: 'It snowed.' } },
  { word: '山',     kana: 'やま',     meaning: 'mountain',         type: 'noun', example: { jp: '山を歩きます。',       kana: 'やまをあるきます。',     en: 'I walk in the mountains.' } },
  { word: '海',     kana: 'うみ',     meaning: 'sea / ocean',      type: 'noun', example: { jp: '海を見ます。',         kana: 'うみをみます。',         en: 'I look at the sea.' } },
  { word: '花',     kana: 'はな',     meaning: 'flower',           type: 'noun', example: { jp: '花が好きです。',       kana: 'はながすきです。',       en: 'I like flowers.' } },
  { word: '木',     kana: 'き',       meaning: 'tree',             type: 'noun', example: { jp: '木の下に座ります。',   kana: 'きのしたにすわります。', en: 'I sit under a tree.' } },

  // ── Arts, hobbies, entertainment ──────────────────────────────────────
  { word: '音楽',   kana: 'おんがく',   meaning: 'music',          type: 'noun', example: { jp: '音楽が好きです。',     kana: 'おんがくがすきです。',   en: 'I like music.' } },
  { word: '映画',   kana: 'えいが',     meaning: 'film / movie',   type: 'noun', example: { jp: '映画を見ます。',       kana: 'えいがをみます。',       en: 'I watch a film.' } },
  { word: 'ジャズ', kana: 'ジャズ',     meaning: 'jazz',           type: 'noun', example: { jp: 'ジャズを聞きます。',   kana: 'ジャズをききます。',     en: 'I listen to jazz.' } },
  { word: '歴史',   kana: 'れきし',     meaning: 'history',        type: 'noun', example: { jp: '歴史の本を読みます。', kana: 'れきしのほんをよみます。', en: 'I read history books.' } },
  { word: 'ピアノ', kana: 'ピアノ',     meaning: 'piano',          type: 'noun', example: { jp: 'ピアノを弾きます。',   kana: 'ピアノをひきます。',     en: 'I play piano.' } },
  { word: '趣味',   kana: 'しゅみ',     meaning: 'hobby',          type: 'noun', example: { jp: '趣味は何ですか。',     kana: 'しゅみはなんですか。',   en: 'What is your hobby?' } },
  { word: '写真',   kana: 'しゃしん',   meaning: 'photograph',     type: 'noun', example: { jp: '写真を撮ります。',     kana: 'しゃしんをとります。',   en: 'I take a photograph.' } },
  { word: 'アート', kana: 'アート',     meaning: 'art',            type: 'noun', example: { jp: 'アートが好きです。',   kana: 'アートがすきです。',     en: 'I like art.' } },

  // ── Abstract / general nouns ──────────────────────────────────────────
  { word: '名前',   kana: 'なまえ',   meaning: 'name',             type: 'noun', example: { jp: '名前は何ですか。',     kana: 'なまえはなんですか。',   en: 'What is your name?' } },
  { word: '言葉',   kana: 'ことば',   meaning: 'word / language',  type: 'noun', example: { jp: '新しい言葉を覚えます。', kana: 'あたらしいことばをおぼえます。', en: 'I memorise new words.' } },
  { word: '意味',   kana: 'いみ',     meaning: 'meaning',          type: 'noun', example: { jp: 'この言葉の意味は何ですか。', kana: 'このことばのいみはなんですか。', en: 'What does this word mean?' } },
  { word: '仕事',   kana: 'しごと',   meaning: 'work / job',       type: 'noun', example: { jp: '仕事は忙しいです。',   kana: 'しごとはいそがしいです。', en: 'Work is busy.' } },
  { word: '勉強',   kana: 'べんきょう', meaning: 'study',           type: 'noun', example: { jp: '毎日勉強します。',     kana: 'まいにちべんきょうします。', en: 'I study every day.' } },
  { word: '旅行',   kana: 'りょこう', meaning: 'travel',            type: 'noun', example: { jp: '旅行が好きです。',     kana: 'りょこうがすきです。',   en: 'I like travelling.' } },
  { word: '約束',   kana: 'やくそく', meaning: 'promise / appointment', type: 'noun', example: { jp: '約束を守ります。', kana: 'やくそくをまもります。', en: 'I keep promises.' } },
  { word: '問題',   kana: 'もんだい', meaning: 'problem / question', type: 'noun', example: { jp: '問題があります。',     kana: 'もんだいがあります。',   en: 'There is a problem.' } },
  { word: '時間',   kana: 'じかん',   meaning: 'time',             type: 'noun', example: { jp: '時間がありません。',   kana: 'じかんがありません。',   en: "I don't have time." } },
  { word: '場所',   kana: 'ばしょ',   meaning: 'place',            type: 'noun', example: { jp: 'いい場所です。',       kana: 'いいばしょです。',       en: "It's a nice place." } },
  { word: '日本語', kana: 'にほんご', meaning: 'Japanese (language)', type: 'noun', example: { jp: '日本語を勉強します。', kana: 'にほんごをべんきょうします。', en: 'I study Japanese.' } },
  { word: '英語',   kana: 'えいご',   meaning: 'English (language)', type: 'noun', example: { jp: '英語を話します。',     kana: 'えいごをはなします。',   en: 'I speak English.' } },
  { word: '音',     kana: 'おと',     meaning: 'sound',            type: 'noun', example: { jp: '音がします。',         kana: 'おとがします。',         en: 'There is a sound.' } },
  { word: '色',     kana: 'いろ',     meaning: 'colour',           type: 'noun', example: { jp: '好きな色は何ですか。', kana: 'すきないろはなんですか。', en: 'What is your favourite colour?' } },

  // ── Numbers ────────────────────────────────────────────────────────────
  { word: '一', kana: 'いち',   meaning: 'one',          type: 'number', example: { jp: '一つください。',     kana: 'ひとつください。',   en: 'One please.' } },
  { word: '二', kana: 'に',     meaning: 'two',          type: 'number', example: { jp: '二つあります。',     kana: 'ふたつあります。',   en: 'There are two.' } },
  { word: '三', kana: 'さん',   meaning: 'three',        type: 'number', example: { jp: '三人で来ます。',     kana: 'さんにんできます。', en: 'Three people are coming.' } },
  { word: '四', kana: 'よん',   meaning: 'four',         type: 'number', example: { jp: '四時です。',         kana: 'よじです。',         en: "It's 4 o'clock." } },
  { word: '五', kana: 'ご',     meaning: 'five',         type: 'number', example: { jp: '五人います。',       kana: 'ごにんいます。',     en: 'There are five people.' } },
  { word: '六', kana: 'ろく',   meaning: 'six',          type: 'number', example: { jp: '六時に起きます。',   kana: 'ろくじにおきます。', en: 'I wake up at 6.' } },
  { word: '七', kana: 'なな',   meaning: 'seven',        type: 'number', example: { jp: '七人います。',       kana: 'ななにんいます。',   en: 'There are seven people.' } },
  { word: '八', kana: 'はち',   meaning: 'eight',        type: 'number', example: { jp: '八時です。',         kana: 'はちじです。',       en: "It's 8 o'clock." } },
  { word: '九', kana: 'きゅう', meaning: 'nine',         type: 'number', example: { jp: '九時です。',         kana: 'くじです。',         en: "It's 9 o'clock." } },
  { word: '十', kana: 'じゅう', meaning: 'ten',          type: 'number', example: { jp: '十人います。',       kana: 'じゅうにんいます。', en: 'There are ten people.' } },
  { word: '百', kana: 'ひゃく', meaning: 'one hundred',  type: 'number', example: { jp: '百円です。',         kana: 'ひゃくえんです。',   en: "It's 100 yen." } },
  { word: '千', kana: 'せん',   meaning: 'one thousand', type: 'number', example: { jp: '千円あります。',     kana: 'せんえんあります。', en: 'I have 1,000 yen.' } },
  { word: '万', kana: 'まん',   meaning: 'ten thousand', type: 'number', example: { jp: '一万円あります。',   kana: 'いちまんえんあります。', en: 'I have 10,000 yen.' } },
]


// ═══════════════════════════════════════════════════════════════════════════
// VERB_LIST — All verbs with polite and casual conjugation tables
//
// dict    = dictionary form (kanji where applicable)
// kana    = reading of dict form
// type    = 'ichidan' | 'godan' | 'irregular'
// meaning = English infinitive gloss
// example = one polite example sentence
// polite / casual = { present_pos, present_neg, past_pos, past_neg }
//   Each form: { word, kana, meaning }
// ═══════════════════════════════════════════════════════════════════════════

export const VERB_LIST = [

  // ── Core sense verbs (from verb table PDF) ─────────────────────────────

  {
    dict: '見る', kana: 'みる', type: 'ichidan', meaning: 'to see / watch',
    example: { jp: '映画を見ます。', kana: 'えいがをみます。', en: 'I watch a film.' },
    polite: {
      present_pos: { word: '見ます',          kana: 'みます',           meaning: 'watch / see' },
      present_neg: { word: '見ません',         kana: 'みません',          meaning: "don't watch" },
      past_pos:    { word: '見ました',          kana: 'みました',          meaning: 'watched / saw' },
      past_neg:    { word: '見ませんでした',     kana: 'みませんでした',     meaning: "didn't watch" },
    },
    casual: {
      present_pos: { word: '見る',             kana: 'みる',              meaning: 'watch / see' },
      present_neg: { word: '見ない',            kana: 'みない',            meaning: "don't watch" },
      past_pos:    { word: '見た',              kana: 'みた',              meaning: 'watched / saw' },
      past_neg:    { word: '見なかった',         kana: 'みなかった',         meaning: "didn't watch" },
    },
  },

  {
    dict: '聞く', kana: 'きく', type: 'godan', meaning: 'to listen / hear / ask',
    example: { jp: 'ジャズを聞きます。', kana: 'ジャズをききます。', en: 'I listen to jazz.' },
    polite: {
      present_pos: { word: '聞きます',          kana: 'ききます',          meaning: 'listen / hear' },
      present_neg: { word: '聞きません',         kana: 'ききません',         meaning: "don't listen" },
      past_pos:    { word: '聞きました',          kana: 'ききました',         meaning: 'listened / heard' },
      past_neg:    { word: '聞きませんでした',     kana: 'ききませんでした',    meaning: "didn't listen" },
    },
    casual: {
      present_pos: { word: '聞く',              kana: 'きく',              meaning: 'listen / hear' },
      present_neg: { word: '聞かない',           kana: 'きかない',           meaning: "don't listen" },
      past_pos:    { word: '聞いた',             kana: 'きいた',             meaning: 'listened / heard' },
      past_neg:    { word: '聞かなかった',        kana: 'きかなかった',        meaning: "didn't listen" },
    },
  },

  {
    dict: '味わう', kana: 'あじわう', type: 'godan', meaning: 'to taste / savour',
    example: { jp: '新しい料理を味わいます。', kana: 'あたらしいりょうりをあじわいます。', en: 'I taste new food.' },
    polite: {
      present_pos: { word: '味わいます',         kana: 'あじわいます',        meaning: 'taste / savour' },
      present_neg: { word: '味わいません',        kana: 'あじわいません',       meaning: "don't taste" },
      past_pos:    { word: '味わいました',         kana: 'あじわいました',       meaning: 'tasted' },
      past_neg:    { word: '味わいませんでした',    kana: 'あじわいませんでした',  meaning: "didn't taste" },
    },
    casual: {
      present_pos: { word: '味わう',             kana: 'あじわう',           meaning: 'taste / savour' },
      present_neg: { word: '味わわない',          kana: 'あじわわない',        meaning: "don't taste" },
      past_pos:    { word: '味わった',            kana: 'あじわった',          meaning: 'tasted' },
      past_neg:    { word: '味わわなかった',       kana: 'あじわわなかった',     meaning: "didn't taste" },
    },
  },

  {
    dict: '感じる', kana: 'かんじる', type: 'ichidan', meaning: 'to feel / sense',
    example: { jp: '秋を感じます。', kana: 'あきをかんじます。', en: 'I feel autumn.' },
    polite: {
      present_pos: { word: '感じます',           kana: 'かんじます',         meaning: 'feel / sense' },
      present_neg: { word: '感じません',          kana: 'かんじません',        meaning: "don't feel" },
      past_pos:    { word: '感じました',           kana: 'かんじました',        meaning: 'felt' },
      past_neg:    { word: '感じませんでした',      kana: 'かんじませんでした',   meaning: "didn't feel" },
    },
    casual: {
      present_pos: { word: '感じる',             kana: 'かんじる',           meaning: 'feel / sense' },
      present_neg: { word: '感じない',            kana: 'かんじない',          meaning: "don't feel" },
      past_pos:    { word: '感じた',              kana: 'かんじた',            meaning: 'felt' },
      past_neg:    { word: '感じなかった',         kana: 'かんじなかった',       meaning: "didn't feel" },
    },
  },

  {
    dict: '言う', kana: 'いう', type: 'godan', meaning: 'to say',
    example: { jp: 'アンディに「おはよう」と言います。', kana: 'アンディに「おはよう」といいます。', en: 'I say good morning to Andi.' },
    polite: {
      present_pos: { word: '言います',           kana: 'いいます',           meaning: 'say' },
      present_neg: { word: '言いません',          kana: 'いいません',          meaning: "don't say" },
      past_pos:    { word: '言いました',           kana: 'いいました',          meaning: 'said' },
      past_neg:    { word: '言いませんでした',      kana: 'いいませんでした',     meaning: "didn't say" },
    },
    casual: {
      present_pos: { word: '言う',               kana: 'いう',               meaning: 'say' },
      present_neg: { word: '言わない',            kana: 'いわない',            meaning: "don't say" },
      past_pos:    { word: '言った',              kana: 'いった',              meaning: 'said' },
      past_neg:    { word: '言わなかった',         kana: 'いわなかった',         meaning: "didn't say" },
    },
  },

  {
    dict: '行く', kana: 'いく', type: 'godan', meaning: 'to go',
    example: { jp: '公園に行きます。', kana: 'こうえんにいきます。', en: 'I go to the park.' },
    polite: {
      present_pos: { word: '行きます',           kana: 'いきます',           meaning: 'go' },
      present_neg: { word: '行きません',          kana: 'いきません',          meaning: "don't go" },
      past_pos:    { word: '行きました',           kana: 'いきました',          meaning: 'went' },
      past_neg:    { word: '行きませんでした',      kana: 'いきませんでした',     meaning: "didn't go" },
    },
    casual: {
      present_pos: { word: '行く',               kana: 'いく',               meaning: 'go' },
      present_neg: { word: '行かない',            kana: 'いかない',            meaning: "don't go" },
      past_pos:    { word: '行った',              kana: 'いった',              meaning: 'went' },
      past_neg:    { word: '行かなかった',         kana: 'いかなかった',         meaning: "didn't go" },
    },
  },

  {
    dict: '来る', kana: 'くる', type: 'irregular', meaning: 'to come',
    example: { jp: '友達が家に来ます。', kana: 'ともだちがいえにきます。', en: 'A friend comes to the house.' },
    polite: {
      present_pos: { word: '来ます',             kana: 'きます',             meaning: 'come' },
      present_neg: { word: '来ません',            kana: 'きません',            meaning: "don't come" },
      past_pos:    { word: '来ました',             kana: 'きました',            meaning: 'came' },
      past_neg:    { word: '来ませんでした',        kana: 'きませんでした',       meaning: "didn't come" },
    },
    casual: {
      present_pos: { word: '来る',               kana: 'くる',               meaning: 'come' },
      present_neg: { word: '来ない',              kana: 'こない',              meaning: "don't come" },
      past_pos:    { word: '来た',               kana: 'きた',               meaning: 'came' },
      past_neg:    { word: '来なかった',           kana: 'こなかった',           meaning: "didn't come" },
    },
  },

  {
    dict: '食べる', kana: 'たべる', type: 'ichidan', meaning: 'to eat',
    example: { jp: '朝ごはんを食べます。', kana: 'あさごはんをたべます。', en: 'I eat breakfast.' },
    polite: {
      present_pos: { word: '食べます',            kana: 'たべます',            meaning: 'eat' },
      present_neg: { word: '食べません',           kana: 'たべません',           meaning: "don't eat" },
      past_pos:    { word: '食べました',            kana: 'たべました',           meaning: 'ate' },
      past_neg:    { word: '食べませんでした',       kana: 'たべませんでした',      meaning: "didn't eat" },
    },
    casual: {
      present_pos: { word: '食べる',              kana: 'たべる',              meaning: 'eat' },
      present_neg: { word: '食べない',             kana: 'たべない',             meaning: "don't eat" },
      past_pos:    { word: '食べた',               kana: 'たべた',               meaning: 'ate' },
      past_neg:    { word: '食べなかった',          kana: 'たべなかった',          meaning: "didn't eat" },
    },
  },

  {
    dict: '飲む', kana: 'のむ', type: 'godan', meaning: 'to drink',
    example: { jp: 'コーヒーを飲みます。', kana: 'コーヒーをのみます。', en: 'I drink coffee.' },
    polite: {
      present_pos: { word: '飲みます',            kana: 'のみます',            meaning: 'drink' },
      present_neg: { word: '飲みません',           kana: 'のみません',           meaning: "don't drink" },
      past_pos:    { word: '飲みました',            kana: 'のみました',           meaning: 'drank' },
      past_neg:    { word: '飲みませんでした',       kana: 'のみませんでした',      meaning: "didn't drink" },
    },
    casual: {
      present_pos: { word: '飲む',               kana: 'のむ',               meaning: 'drink' },
      present_neg: { word: '飲まない',            kana: 'のまない',            meaning: "don't drink" },
      past_pos:    { word: '飲んだ',              kana: 'のんだ',              meaning: 'drank' },
      past_neg:    { word: '飲まなかった',         kana: 'のまなかった',         meaning: "didn't drink" },
    },
  },

  {
    dict: 'する', kana: 'する', type: 'irregular', meaning: 'to do',
    example: { jp: '毎朝、運動をします。', kana: 'まいあさ、うんどうをします。', en: 'I exercise every morning.' },
    polite: {
      present_pos: { word: 'します',              kana: 'します',              meaning: 'do' },
      present_neg: { word: 'しません',             kana: 'しません',             meaning: "don't do" },
      past_pos:    { word: 'しました',              kana: 'しました',             meaning: 'did' },
      past_neg:    { word: 'しませんでした',         kana: 'しませんでした',        meaning: "didn't do" },
    },
    casual: {
      present_pos: { word: 'する',               kana: 'する',               meaning: 'do' },
      present_neg: { word: 'しない',              kana: 'しない',              meaning: "don't do" },
      past_pos:    { word: 'した',                kana: 'した',                meaning: 'did' },
      past_neg:    { word: 'しなかった',           kana: 'しなかった',           meaning: "didn't do" },
    },
  },

  {
    dict: '買う', kana: 'かう', type: 'godan', meaning: 'to buy',
    example: { jp: '歴史の本を買います。', kana: 'れきしのほんをかいます。', en: 'I buy a history book.' },
    polite: {
      present_pos: { word: '買います',            kana: 'かいます',            meaning: 'buy' },
      present_neg: { word: '買いません',           kana: 'かいません',           meaning: "don't buy" },
      past_pos:    { word: '買いました',            kana: 'かいました',           meaning: 'bought' },
      past_neg:    { word: '買いませんでした',       kana: 'かいませんでした',      meaning: "didn't buy" },
    },
    casual: {
      present_pos: { word: '買う',               kana: 'かう',               meaning: 'buy' },
      present_neg: { word: '買わない',            kana: 'かわない',            meaning: "don't buy" },
      past_pos:    { word: '買った',              kana: 'かった',              meaning: 'bought' },
      past_neg:    { word: '買わなかった',         kana: 'かわなかった',         meaning: "didn't buy" },
    },
  },

  {
    dict: '話す', kana: 'はなす', type: 'godan', meaning: 'to speak / talk',
    example: { jp: '日本語を話します。', kana: 'にほんごをはなします。', en: 'I speak Japanese.' },
    polite: {
      present_pos: { word: '話します',            kana: 'はなします',           meaning: 'speak' },
      present_neg: { word: '話しません',           kana: 'はなしません',          meaning: "don't speak" },
      past_pos:    { word: '話しました',            kana: 'はなしました',          meaning: 'spoke' },
      past_neg:    { word: '話しませんでした',       kana: 'はなしませんでした',     meaning: "didn't speak" },
    },
    casual: {
      present_pos: { word: '話す',               kana: 'はなす',              meaning: 'speak' },
      present_neg: { word: '話さない',            kana: 'はなさない',           meaning: "don't speak" },
      past_pos:    { word: '話した',              kana: 'はなした',             meaning: 'spoke' },
      past_neg:    { word: '話さなかった',         kana: 'はなさなかった',        meaning: "didn't speak" },
    },
  },

  {
    dict: '読む', kana: 'よむ', type: 'godan', meaning: 'to read',
    example: { jp: '歴史の本を読みます。', kana: 'れきしのほんをよみます。', en: 'I read a history book.' },
    polite: {
      present_pos: { word: '読みます',            kana: 'よみます',            meaning: 'read' },
      present_neg: { word: '読みません',           kana: 'よみません',           meaning: "don't read" },
      past_pos:    { word: '読みました',            kana: 'よみました',           meaning: 'read (past)' },
      past_neg:    { word: '読みませんでした',       kana: 'よみませんでした',      meaning: "didn't read" },
    },
    casual: {
      present_pos: { word: '読む',               kana: 'よむ',               meaning: 'read' },
      present_neg: { word: '読まない',            kana: 'よまない',            meaning: "don't read" },
      past_pos:    { word: '読んだ',              kana: 'よんだ',              meaning: 'read (past)' },
      past_neg:    { word: '読まなかった',         kana: 'よまなかった',         meaning: "didn't read" },
    },
  },

  {
    dict: '書く', kana: 'かく', type: 'godan', meaning: 'to write',
    example: { jp: '手紙を書きます。', kana: 'てがみをかきます。', en: 'I write a letter.' },
    polite: {
      present_pos: { word: '書きます',            kana: 'かきます',            meaning: 'write' },
      present_neg: { word: '書きません',           kana: 'かきません',           meaning: "don't write" },
      past_pos:    { word: '書きました',            kana: 'かきました',           meaning: 'wrote' },
      past_neg:    { word: '書きませんでした',       kana: 'かきませんでした',      meaning: "didn't write" },
    },
    casual: {
      present_pos: { word: '書く',               kana: 'かく',               meaning: 'write' },
      present_neg: { word: '書かない',            kana: 'かかない',            meaning: "don't write" },
      past_pos:    { word: '書いた',              kana: 'かいた',              meaning: 'wrote' },
      past_neg:    { word: '書かなかった',         kana: 'かかなかった',         meaning: "didn't write" },
    },
  },

  {
    dict: '考える', kana: 'かんがえる', type: 'ichidan', meaning: 'to think',
    example: { jp: 'AIについて考えます。', kana: 'AIについてかんがえます。', en: 'I think about AI.' },
    polite: {
      present_pos: { word: '考えます',            kana: 'かんがえます',          meaning: 'think' },
      present_neg: { word: '考えません',           kana: 'かんがえません',         meaning: "don't think" },
      past_pos:    { word: '考えました',            kana: 'かんがえました',         meaning: 'thought' },
      past_neg:    { word: '考えませんでした',       kana: 'かんがえませんでした',    meaning: "didn't think" },
    },
    casual: {
      present_pos: { word: '考える',              kana: 'かんがえる',            meaning: 'think' },
      present_neg: { word: '考えない',             kana: 'かんがえない',           meaning: "don't think" },
      past_pos:    { word: '考えた',               kana: 'かんがえた',             meaning: 'thought' },
      past_neg:    { word: '考えなかった',          kana: 'かんがえなかった',        meaning: "didn't think" },
    },
  },

  {
    dict: '歩く', kana: 'あるく', type: 'godan', meaning: 'to walk',
    example: { jp: '毎朝、公園を歩きます。', kana: 'まいあさ、こうえんをあるきます。', en: 'I walk in the park every morning.' },
    polite: {
      present_pos: { word: '歩きます',            kana: 'あるきます',           meaning: 'walk' },
      present_neg: { word: '歩きません',           kana: 'あるきません',          meaning: "don't walk" },
      past_pos:    { word: '歩きました',            kana: 'あるきました',          meaning: 'walked' },
      past_neg:    { word: '歩きませんでした',       kana: 'あるきませんでした',     meaning: "didn't walk" },
    },
    casual: {
      present_pos: { word: '歩く',               kana: 'あるく',              meaning: 'walk' },
      present_neg: { word: '歩かない',            kana: 'あるかない',           meaning: "don't walk" },
      past_pos:    { word: '歩いた',              kana: 'あるいた',             meaning: 'walked' },
      past_neg:    { word: '歩かなかった',         kana: 'あるかなかった',        meaning: "didn't walk" },
    },
  },

  {
    dict: '座る', kana: 'すわる', type: 'godan', meaning: 'to sit',
    example: { jp: '木の下に座ります。', kana: 'きのしたにすわります。', en: 'I sit under a tree.' },
    polite: {
      present_pos: { word: '座ります',            kana: 'すわります',           meaning: 'sit' },
      present_neg: { word: '座りません',           kana: 'すわりません',          meaning: "don't sit" },
      past_pos:    { word: '座りました',            kana: 'すわりました',          meaning: 'sat' },
      past_neg:    { word: '座りませんでした',       kana: 'すわりませんでした',     meaning: "didn't sit" },
    },
    casual: {
      present_pos: { word: '座る',               kana: 'すわる',              meaning: 'sit' },
      present_neg: { word: '座らない',            kana: 'すわらない',           meaning: "don't sit" },
      past_pos:    { word: '座った',              kana: 'すわった',             meaning: 'sat' },
      past_neg:    { word: '座らなかった',         kana: 'すわらなかった',        meaning: "didn't sit" },
    },
  },

  {
    dict: '運転する', kana: 'うんてんする', type: 'irregular', meaning: 'to drive',
    example: { jp: '毎日、車を運転します。', kana: 'まいにち、くるまをうんてんします。', en: 'I drive every day.' },
    polite: {
      present_pos: { word: '運転します',           kana: 'うんてんします',        meaning: 'drive' },
      present_neg: { word: '運転しません',          kana: 'うんてんしません',       meaning: "don't drive" },
      past_pos:    { word: '運転しました',           kana: 'うんてんしました',       meaning: 'drove' },
      past_neg:    { word: '運転しませんでした',      kana: 'うんてんしませんでした',  meaning: "didn't drive" },
    },
    casual: {
      present_pos: { word: '運転する',             kana: 'うんてんする',          meaning: 'drive' },
      present_neg: { word: '運転しない',            kana: 'うんてんしない',         meaning: "don't drive" },
      past_pos:    { word: '運転した',              kana: 'うんてんした',           meaning: 'drove' },
      past_neg:    { word: '運転しなかった',         kana: 'うんてんしなかった',      meaning: "didn't drive" },
    },
  },

  {
    dict: '寝る', kana: 'ねる', type: 'ichidan', meaning: 'to sleep / go to bed',
    example: { jp: '十一時に寝ます。', kana: 'じゅういちじにねます。', en: 'I go to sleep at 11.' },
    polite: {
      present_pos: { word: '寝ます',              kana: 'ねます',              meaning: 'sleep' },
      present_neg: { word: '寝ません',             kana: 'ねません',             meaning: "don't sleep" },
      past_pos:    { word: '寝ました',              kana: 'ねました',             meaning: 'slept' },
      past_neg:    { word: '寝ませんでした',         kana: 'ねませんでした',        meaning: "didn't sleep" },
    },
    casual: {
      present_pos: { word: '寝る',               kana: 'ねる',               meaning: 'sleep' },
      present_neg: { word: '寝ない',              kana: 'ねない',              meaning: "don't sleep" },
      past_pos:    { word: '寝た',                kana: 'ねた',                meaning: 'slept' },
      past_neg:    { word: '寝なかった',           kana: 'ねなかった',           meaning: "didn't sleep" },
    },
  },

  // ── Additional essential verbs ─────────────────────────────────────────

  {
    dict: '帰る', kana: 'かえる', type: 'godan', meaning: 'to return / go home',
    example: { jp: '家に帰ります。', kana: 'いえにかえります。', en: 'I return home.' },
    polite: {
      present_pos: { word: '帰ります',            kana: 'かえります',           meaning: 'return / go home' },
      present_neg: { word: '帰りません',           kana: 'かえりません',          meaning: "don't go home" },
      past_pos:    { word: '帰りました',            kana: 'かえりました',          meaning: 'went home' },
      past_neg:    { word: '帰りませんでした',       kana: 'かえりませんでした',     meaning: "didn't go home" },
    },
    casual: {
      present_pos: { word: '帰る',               kana: 'かえる',              meaning: 'return / go home' },
      present_neg: { word: '帰らない',            kana: 'かえらない',           meaning: "don't go home" },
      past_pos:    { word: '帰った',              kana: 'かえった',             meaning: 'went home' },
      past_neg:    { word: '帰らなかった',         kana: 'かえらなかった',        meaning: "didn't go home" },
    },
  },

  {
    dict: '起きる', kana: 'おきる', type: 'ichidan', meaning: 'to wake up / get up',
    example: { jp: '六時に起きます。', kana: 'ろくじにおきます。', en: 'I wake up at 6.' },
    polite: {
      present_pos: { word: '起きます',            kana: 'おきます',            meaning: 'wake up' },
      present_neg: { word: '起きません',           kana: 'おきません',           meaning: "don't wake up" },
      past_pos:    { word: '起きました',            kana: 'おきました',           meaning: 'woke up' },
      past_neg:    { word: '起きませんでした',       kana: 'おきませんでした',      meaning: "didn't wake up" },
    },
    casual: {
      present_pos: { word: '起きる',              kana: 'おきる',              meaning: 'wake up' },
      present_neg: { word: '起きない',             kana: 'おきない',             meaning: "don't wake up" },
      past_pos:    { word: '起きた',               kana: 'おきた',               meaning: 'woke up' },
      past_neg:    { word: '起きなかった',          kana: 'おきなかった',          meaning: "didn't wake up" },
    },
  },

  {
    dict: '待つ', kana: 'まつ', type: 'godan', meaning: 'to wait',
    example: { jp: '駅で待ちます。', kana: 'えきでまちます。', en: 'I wait at the station.' },
    polite: {
      present_pos: { word: '待ちます',            kana: 'まちます',            meaning: 'wait' },
      present_neg: { word: '待ちません',           kana: 'まちません',           meaning: "don't wait" },
      past_pos:    { word: '待ちました',            kana: 'まちました',           meaning: 'waited' },
      past_neg:    { word: '待ちませんでした',       kana: 'まちませんでした',      meaning: "didn't wait" },
    },
    casual: {
      present_pos: { word: '待つ',               kana: 'まつ',               meaning: 'wait' },
      present_neg: { word: '待たない',            kana: 'またない',            meaning: "don't wait" },
      past_pos:    { word: '待った',              kana: 'まった',              meaning: 'waited' },
      past_neg:    { word: '待たなかった',         kana: 'またなかった',         meaning: "didn't wait" },
    },
  },

  {
    dict: '会う', kana: 'あう', type: 'godan', meaning: 'to meet',
    example: { jp: '友達に会います。', kana: 'ともだちにあいます。', en: 'I meet a friend.' },
    polite: {
      present_pos: { word: '会います',            kana: 'あいます',            meaning: 'meet' },
      present_neg: { word: '会いません',           kana: 'あいません',           meaning: "don't meet" },
      past_pos:    { word: '会いました',            kana: 'あいました',           meaning: 'met' },
      past_neg:    { word: '会いませんでした',       kana: 'あいませんでした',      meaning: "didn't meet" },
    },
    casual: {
      present_pos: { word: '会う',               kana: 'あう',               meaning: 'meet' },
      present_neg: { word: '会わない',            kana: 'あわない',            meaning: "don't meet" },
      past_pos:    { word: '会った',              kana: 'あった',              meaning: 'met' },
      past_neg:    { word: '会わなかった',         kana: 'あわなかった',         meaning: "didn't meet" },
    },
  },

  {
    dict: '分かる', kana: 'わかる', type: 'godan', meaning: 'to understand',
    example: { jp: '日本語が分かります。', kana: 'にほんごがわかります。', en: 'I understand Japanese.' },
    polite: {
      present_pos: { word: '分かります',           kana: 'わかります',           meaning: 'understand' },
      present_neg: { word: '分かりません',          kana: 'わかりません',          meaning: "don't understand" },
      past_pos:    { word: '分かりました',           kana: 'わかりました',          meaning: 'understood' },
      past_neg:    { word: '分かりませんでした',      kana: 'わかりませんでした',     meaning: "didn't understand" },
    },
    casual: {
      present_pos: { word: '分かる',              kana: 'わかる',              meaning: 'understand' },
      present_neg: { word: '分からない',           kana: 'わからない',           meaning: "don't understand" },
      past_pos:    { word: '分かった',             kana: 'わかった',             meaning: 'understood' },
      past_neg:    { word: '分からなかった',        kana: 'わからなかった',        meaning: "didn't understand" },
    },
  },

  {
    dict: '使う', kana: 'つかう', type: 'godan', meaning: 'to use',
    example: { jp: 'パソコンを使います。', kana: 'パソコンをつかいます。', en: 'I use a computer.' },
    polite: {
      present_pos: { word: '使います',            kana: 'つかいます',           meaning: 'use' },
      present_neg: { word: '使いません',           kana: 'つかいません',          meaning: "don't use" },
      past_pos:    { word: '使いました',            kana: 'つかいました',          meaning: 'used' },
      past_neg:    { word: '使いませんでした',       kana: 'つかいませんでした',     meaning: "didn't use" },
    },
    casual: {
      present_pos: { word: '使う',               kana: 'つかう',              meaning: 'use' },
      present_neg: { word: '使わない',            kana: 'つかわない',           meaning: "don't use" },
      past_pos:    { word: '使った',              kana: 'つかった',             meaning: 'used' },
      past_neg:    { word: '使わなかった',         kana: 'つかわなかった',        meaning: "didn't use" },
    },
  },

  {
    dict: '作る', kana: 'つくる', type: 'godan', meaning: 'to make / create',
    example: { jp: '料理を作ります。', kana: 'りょうりをつくります。', en: 'I make food.' },
    polite: {
      present_pos: { word: '作ります',            kana: 'つくります',           meaning: 'make / create' },
      present_neg: { word: '作りません',           kana: 'つくりません',          meaning: "don't make" },
      past_pos:    { word: '作りました',            kana: 'つくりました',          meaning: 'made' },
      past_neg:    { word: '作りませんでした',       kana: 'つくりませんでした',     meaning: "didn't make" },
    },
    casual: {
      present_pos: { word: '作る',               kana: 'つくる',              meaning: 'make / create' },
      present_neg: { word: '作らない',            kana: 'つくらない',           meaning: "don't make" },
      past_pos:    { word: '作った',              kana: 'つくった',             meaning: 'made' },
      past_neg:    { word: '作らなかった',         kana: 'つくらなかった',        meaning: "didn't make" },
    },
  },

  {
    dict: '開ける', kana: 'あける', type: 'ichidan', meaning: 'to open',
    example: { jp: 'ドアを開けます。', kana: 'ドアをあけます。', en: 'I open the door.' },
    polite: {
      present_pos: { word: '開けます',            kana: 'あけます',            meaning: 'open' },
      present_neg: { word: '開けません',           kana: 'あけません',           meaning: "don't open" },
      past_pos:    { word: '開けました',            kana: 'あけました',           meaning: 'opened' },
      past_neg:    { word: '開けませんでした',       kana: 'あけませんでした',      meaning: "didn't open" },
    },
    casual: {
      present_pos: { word: '開ける',              kana: 'あける',              meaning: 'open' },
      present_neg: { word: '開けない',             kana: 'あけない',             meaning: "don't open" },
      past_pos:    { word: '開けた',               kana: 'あけた',               meaning: 'opened' },
      past_neg:    { word: '開けなかった',          kana: 'あけなかった',          meaning: "didn't open" },
    },
  },
]


// ═══════════════════════════════════════════════════════════════════════════
// ADJ_LIST — Adjectives with polite and casual conjugation tables
//
// dict    = dictionary form
// kana    = reading
// type    = 'i-adj' | 'na-adj'
// meaning = English gloss
// note    = optional pedagogical note (e.g. irregular stems)
// polite / casual = { present_pos, present_neg, past_pos, past_neg }
//
// Note on i-adj: the dict form IS the casual present positive.
// Note on いい: irregular — casual negative/past forms use よ- stem.
// Note on な-adj: casual uses だ/じゃない pattern.
// ═══════════════════════════════════════════════════════════════════════════

export const ADJ_LIST = [

  // ── い-adjectives ──────────────────────────────────────────────────────

  {
    dict: '大きい', kana: 'おおきい', type: 'i-adj', meaning: 'big / large',
    example: { jp: '大きい家です。', kana: 'おおきいいえです。', en: "It's a big house." },
    polite: {
      present_pos: { word: '大きいです',           kana: 'おおきいです',          meaning: 'is big' },
      present_neg: { word: '大きくないです',        kana: 'おおきくないです',       meaning: "isn't big" },
      past_pos:    { word: '大きかったです',         kana: 'おおきかったです',       meaning: 'was big' },
      past_neg:    { word: '大きくなかったです',     kana: 'おおきくなかったです',    meaning: "wasn't big" },
    },
    casual: {
      present_pos: { word: '大きい',              kana: 'おおきい',             meaning: 'big' },
      present_neg: { word: '大きくない',           kana: 'おおきくない',          meaning: "not big" },
      past_pos:    { word: '大きかった',           kana: 'おおきかった',          meaning: 'was big' },
      past_neg:    { word: '大きくなかった',        kana: 'おおきくなかった',       meaning: "wasn't big" },
    },
  },

  {
    dict: '小さい', kana: 'ちいさい', type: 'i-adj', meaning: 'small / little',
    example: { jp: '小さい犬です。', kana: 'ちいさいいぬです。', en: "It's a small dog." },
    polite: {
      present_pos: { word: '小さいです',           kana: 'ちいさいです',          meaning: 'is small' },
      present_neg: { word: '小さくないです',        kana: 'ちいさくないです',       meaning: "isn't small" },
      past_pos:    { word: '小さかったです',         kana: 'ちいさかったです',       meaning: 'was small' },
      past_neg:    { word: '小さくなかったです',     kana: 'ちいさくなかったです',    meaning: "wasn't small" },
    },
    casual: {
      present_pos: { word: '小さい',              kana: 'ちいさい',             meaning: 'small' },
      present_neg: { word: '小さくない',           kana: 'ちいさくない',          meaning: "not small" },
      past_pos:    { word: '小さかった',           kana: 'ちいさかった',          meaning: 'was small' },
      past_neg:    { word: '小さくなかった',        kana: 'ちいさくなかった',       meaning: "wasn't small" },
    },
  },

  {
    dict: 'いい', kana: 'いい', type: 'i-adj', meaning: 'good',
    note: 'Irregular: casual negatives and past forms use よ- stem (よくない, よかった).',
    example: { jp: 'いい天気です。', kana: 'いいてんきです。', en: "It's nice weather." },
    polite: {
      present_pos: { word: 'いいです',             kana: 'いいです',             meaning: 'is good' },
      present_neg: { word: 'よくないです',          kana: 'よくないです',          meaning: "isn't good" },
      past_pos:    { word: 'よかったです',           kana: 'よかったです',          meaning: 'was good' },
      past_neg:    { word: 'よくなかったです',       kana: 'よくなかったです',       meaning: "wasn't good" },
    },
    casual: {
      present_pos: { word: 'いい',                kana: 'いい',                meaning: 'good' },
      present_neg: { word: 'よくない',             kana: 'よくない',             meaning: "not good" },
      past_pos:    { word: 'よかった',             kana: 'よかった',             meaning: 'was good' },
      past_neg:    { word: 'よくなかった',          kana: 'よくなかった',          meaning: "wasn't good" },
    },
  },

  {
    dict: '悪い', kana: 'わるい', type: 'i-adj', meaning: 'bad',
    example: { jp: '悪いニュースです。', kana: 'わるいニュースです。', en: "It's bad news." },
    polite: {
      present_pos: { word: '悪いです',             kana: 'わるいです',            meaning: 'is bad' },
      present_neg: { word: '悪くないです',          kana: 'わるくないです',         meaning: "isn't bad" },
      past_pos:    { word: '悪かったです',           kana: 'わるかったです',         meaning: 'was bad' },
      past_neg:    { word: '悪くなかったです',       kana: 'わるくなかったです',      meaning: "wasn't bad" },
    },
    casual: {
      present_pos: { word: '悪い',                kana: 'わるい',               meaning: 'bad' },
      present_neg: { word: '悪くない',             kana: 'わるくない',            meaning: "not bad" },
      past_pos:    { word: '悪かった',             kana: 'わるかった',            meaning: 'was bad' },
      past_neg:    { word: '悪くなかった',          kana: 'わるくなかった',         meaning: "wasn't bad" },
    },
  },

  {
    dict: '新しい', kana: 'あたらしい', type: 'i-adj', meaning: 'new',
    example: { jp: '新しい車です。', kana: 'あたらしいくるまです。', en: "It's a new car." },
    polite: {
      present_pos: { word: '新しいです',           kana: 'あたらしいです',         meaning: 'is new' },
      present_neg: { word: '新しくないです',        kana: 'あたらしくないです',      meaning: "isn't new" },
      past_pos:    { word: '新しかったです',         kana: 'あたらしかったです',      meaning: 'was new' },
      past_neg:    { word: '新しくなかったです',     kana: 'あたらしくなかったです',   meaning: "wasn't new" },
    },
    casual: {
      present_pos: { word: '新しい',              kana: 'あたらしい',            meaning: 'new' },
      present_neg: { word: '新しくない',           kana: 'あたらしくない',         meaning: "not new" },
      past_pos:    { word: '新しかった',           kana: 'あたらしかった',         meaning: 'was new' },
      past_neg:    { word: '新しくなかった',        kana: 'あたらしくなかった',      meaning: "wasn't new" },
    },
  },

  {
    dict: '古い', kana: 'ふるい', type: 'i-adj', meaning: 'old (things)',
    example: { jp: '古い本です。', kana: 'ふるいほんです。', en: "It's an old book." },
    polite: {
      present_pos: { word: '古いです',             kana: 'ふるいです',            meaning: 'is old' },
      present_neg: { word: '古くないです',          kana: 'ふるくないです',         meaning: "isn't old" },
      past_pos:    { word: '古かったです',           kana: 'ふるかったです',         meaning: 'was old' },
      past_neg:    { word: '古くなかったです',       kana: 'ふるくなかったです',      meaning: "wasn't old" },
    },
    casual: {
      present_pos: { word: '古い',                kana: 'ふるい',               meaning: 'old' },
      present_neg: { word: '古くない',             kana: 'ふるくない',            meaning: "not old" },
      past_pos:    { word: '古かった',             kana: 'ふるかった',            meaning: 'was old' },
      past_neg:    { word: '古くなかった',          kana: 'ふるくなかった',         meaning: "wasn't old" },
    },
  },

  {
    dict: '暑い', kana: 'あつい', type: 'i-adj', meaning: 'hot (weather)',
    example: { jp: '今日は暑いです。', kana: 'きょうはあついです。', en: "Today is hot." },
    polite: {
      present_pos: { word: '暑いです',             kana: 'あついです',            meaning: 'is hot' },
      present_neg: { word: '暑くないです',          kana: 'あつくないです',         meaning: "isn't hot" },
      past_pos:    { word: '暑かったです',           kana: 'あつかったです',         meaning: 'was hot' },
      past_neg:    { word: '暑くなかったです',       kana: 'あつくなかったです',      meaning: "wasn't hot" },
    },
    casual: {
      present_pos: { word: '暑い',                kana: 'あつい',               meaning: 'hot' },
      present_neg: { word: '暑くない',             kana: 'あつくない',            meaning: "not hot" },
      past_pos:    { word: '暑かった',             kana: 'あつかった',            meaning: 'was hot' },
      past_neg:    { word: '暑くなかった',          kana: 'あつくなかった',         meaning: "wasn't hot" },
    },
  },

  {
    dict: '寒い', kana: 'さむい', type: 'i-adj', meaning: 'cold (weather)',
    example: { jp: '冬は寒いです。', kana: 'ふゆはさむいです。', en: "Winter is cold." },
    polite: {
      present_pos: { word: '寒いです',             kana: 'さむいです',            meaning: 'is cold' },
      present_neg: { word: '寒くないです',          kana: 'さむくないです',         meaning: "isn't cold" },
      past_pos:    { word: '寒かったです',           kana: 'さむかったです',         meaning: 'was cold' },
      past_neg:    { word: '寒くなかったです',       kana: 'さむくなかったです',      meaning: "wasn't cold" },
    },
    casual: {
      present_pos: { word: '寒い',                kana: 'さむい',               meaning: 'cold' },
      present_neg: { word: '寒くない',             kana: 'さむくない',            meaning: "not cold" },
      past_pos:    { word: '寒かった',             kana: 'さむかった',            meaning: 'was cold' },
      past_neg:    { word: '寒くなかった',          kana: 'さむくなかった',         meaning: "wasn't cold" },
    },
  },

  {
    dict: '難しい', kana: 'むずかしい', type: 'i-adj', meaning: 'difficult',
    example: { jp: '日本語は難しいです。', kana: 'にほんごはむずかしいです。', en: 'Japanese is difficult.' },
    polite: {
      present_pos: { word: '難しいです',           kana: 'むずかしいです',         meaning: 'is difficult' },
      present_neg: { word: '難しくないです',        kana: 'むずかしくないです',      meaning: "isn't difficult" },
      past_pos:    { word: '難しかったです',         kana: 'むずかしかったです',      meaning: 'was difficult' },
      past_neg:    { word: '難しくなかったです',     kana: 'むずかしくなかったです',   meaning: "wasn't difficult" },
    },
    casual: {
      present_pos: { word: '難しい',              kana: 'むずかしい',            meaning: 'difficult' },
      present_neg: { word: '難しくない',           kana: 'むずかしくない',         meaning: "not difficult" },
      past_pos:    { word: '難しかった',           kana: 'むずかしかった',         meaning: 'was difficult' },
      past_neg:    { word: '難しくなかった',        kana: 'むずかしくなかった',      meaning: "wasn't difficult" },
    },
  },

  {
    dict: '楽しい', kana: 'たのしい', type: 'i-adj', meaning: 'fun / enjoyable',
    example: { jp: '旅行は楽しいです。', kana: 'りょこうはたのしいです。', en: 'Travel is fun.' },
    polite: {
      present_pos: { word: '楽しいです',           kana: 'たのしいです',           meaning: 'is fun' },
      present_neg: { word: '楽しくないです',        kana: 'たのしくないです',        meaning: "isn't fun" },
      past_pos:    { word: '楽しかったです',         kana: 'たのしかったです',        meaning: 'was fun' },
      past_neg:    { word: '楽しくなかったです',     kana: 'たのしくなかったです',     meaning: "wasn't fun" },
    },
    casual: {
      present_pos: { word: '楽しい',              kana: 'たのしい',              meaning: 'fun' },
      present_neg: { word: '楽しくない',           kana: 'たのしくない',           meaning: "not fun" },
      past_pos:    { word: '楽しかった',           kana: 'たのしかった',           meaning: 'was fun' },
      past_neg:    { word: '楽しくなかった',        kana: 'たのしくなかった',        meaning: "wasn't fun" },
    },
  },

  {
    dict: '高い', kana: 'たかい', type: 'i-adj', meaning: 'expensive / tall',
    example: { jp: 'この本は高いです。', kana: 'このほんはたかいです。', en: 'This book is expensive.' },
    polite: {
      present_pos: { word: '高いです',             kana: 'たかいです',            meaning: 'is expensive / tall' },
      present_neg: { word: '高くないです',          kana: 'たかくないです',         meaning: "isn't expensive" },
      past_pos:    { word: '高かったです',           kana: 'たかかったです',         meaning: 'was expensive' },
      past_neg:    { word: '高くなかったです',       kana: 'たかくなかったです',      meaning: "wasn't expensive" },
    },
    casual: {
      present_pos: { word: '高い',                kana: 'たかい',               meaning: 'expensive / tall' },
      present_neg: { word: '高くない',             kana: 'たかくない',            meaning: "not expensive" },
      past_pos:    { word: '高かった',             kana: 'たかかった',            meaning: 'was expensive' },
      past_neg:    { word: '高くなかった',          kana: 'たかくなかった',         meaning: "wasn't expensive" },
    },
  },

  {
    dict: '安い', kana: 'やすい', type: 'i-adj', meaning: 'cheap / inexpensive',
    example: { jp: 'この店は安いです。', kana: 'このみせはやすいです。', en: 'This shop is cheap.' },
    polite: {
      present_pos: { word: '安いです',             kana: 'やすいです',            meaning: 'is cheap' },
      present_neg: { word: '安くないです',          kana: 'やすくないです',         meaning: "isn't cheap" },
      past_pos:    { word: '安かったです',           kana: 'やすかったです',         meaning: 'was cheap' },
      past_neg:    { word: '安くなかったです',       kana: 'やすくなかったです',      meaning: "wasn't cheap" },
    },
    casual: {
      present_pos: { word: '安い',                kana: 'やすい',               meaning: 'cheap' },
      present_neg: { word: '安くない',             kana: 'やすくない',            meaning: "not cheap" },
      past_pos:    { word: '安かった',             kana: 'やすかった',            meaning: 'was cheap' },
      past_neg:    { word: '安くなかった',          kana: 'やすくなかった',         meaning: "wasn't cheap" },
    },
  },

  {
    dict: 'おいしい', kana: 'おいしい', type: 'i-adj', meaning: 'delicious / tasty',
    example: { jp: '寿司はおいしいです。', kana: 'すしはおいしいです。', en: 'Sushi is delicious.' },
    polite: {
      present_pos: { word: 'おいしいです',          kana: 'おいしいです',           meaning: 'is delicious' },
      present_neg: { word: 'おいしくないです',       kana: 'おいしくないです',        meaning: "isn't delicious" },
      past_pos:    { word: 'おいしかったです',        kana: 'おいしかったです',        meaning: 'was delicious' },
      past_neg:    { word: 'おいしくなかったです',    kana: 'おいしくなかったです',     meaning: "wasn't delicious" },
    },
    casual: {
      present_pos: { word: 'おいしい',             kana: 'おいしい',              meaning: 'delicious' },
      present_neg: { word: 'おいしくない',          kana: 'おいしくない',           meaning: "not delicious" },
      past_pos:    { word: 'おいしかった',          kana: 'おいしかった',           meaning: 'was delicious' },
      past_neg:    { word: 'おいしくなかった',       kana: 'おいしくなかった',        meaning: "wasn't delicious" },
    },
  },

  {
    dict: 'かわいい', kana: 'かわいい', type: 'i-adj', meaning: 'cute / adorable',
    example: { jp: 'かわいい猫です。', kana: 'かわいいねこです。', en: "It's a cute cat." },
    polite: {
      present_pos: { word: 'かわいいです',          kana: 'かわいいです',           meaning: 'is cute' },
      present_neg: { word: 'かわいくないです',       kana: 'かわいくないです',        meaning: "isn't cute" },
      past_pos:    { word: 'かわいかったです',        kana: 'かわいかったです',        meaning: 'was cute' },
      past_neg:    { word: 'かわいくなかったです',    kana: 'かわいくなかったです',     meaning: "wasn't cute" },
    },
    casual: {
      present_pos: { word: 'かわいい',             kana: 'かわいい',              meaning: 'cute' },
      present_neg: { word: 'かわいくない',          kana: 'かわいくない',           meaning: "not cute" },
      past_pos:    { word: 'かわいかった',          kana: 'かわいかった',           meaning: 'was cute' },
      past_neg:    { word: 'かわいくなかった',       kana: 'かわいくなかった',        meaning: "wasn't cute" },
    },
  },

  {
    dict: '面白い', kana: 'おもしろい', type: 'i-adj', meaning: 'interesting / funny',
    example: { jp: 'この本は面白いです。', kana: 'このほんはおもしろいです。', en: 'This book is interesting.' },
    polite: {
      present_pos: { word: '面白いです',           kana: 'おもしろいです',          meaning: 'is interesting' },
      present_neg: { word: '面白くないです',        kana: 'おもしろくないです',       meaning: "isn't interesting" },
      past_pos:    { word: '面白かったです',         kana: 'おもしろかったです',       meaning: 'was interesting' },
      past_neg:    { word: '面白くなかったです',     kana: 'おもしろくなかったです',    meaning: "wasn't interesting" },
    },
    casual: {
      present_pos: { word: '面白い',              kana: 'おもしろい',             meaning: 'interesting' },
      present_neg: { word: '面白くない',           kana: 'おもしろくない',          meaning: "not interesting" },
      past_pos:    { word: '面白かった',           kana: 'おもしろかった',          meaning: 'was interesting' },
      past_neg:    { word: '面白くなかった',        kana: 'おもしろくなかった',       meaning: "wasn't interesting" },
    },
  },

  {
    dict: '忙しい', kana: 'いそがしい', type: 'i-adj', meaning: 'busy',
    example: { jp: '今週は忙しいです。', kana: 'こんしゅうはいそがしいです。', en: 'This week is busy.' },
    polite: {
      present_pos: { word: '忙しいです',           kana: 'いそがしいです',          meaning: 'is busy' },
      present_neg: { word: '忙しくないです',        kana: 'いそがしくないです',       meaning: "isn't busy" },
      past_pos:    { word: '忙しかったです',         kana: 'いそがしかったです',       meaning: 'was busy' },
      past_neg:    { word: '忙しくなかったです',     kana: 'いそがしくなかったです',    meaning: "wasn't busy" },
    },
    casual: {
      present_pos: { word: '忙しい',              kana: 'いそがしい',             meaning: 'busy' },
      present_neg: { word: '忙しくない',           kana: 'いそがしくない',          meaning: "not busy" },
      past_pos:    { word: '忙しかった',           kana: 'いそがしかった',          meaning: 'was busy' },
      past_neg:    { word: '忙しくなかった',        kana: 'いそがしくなかった',       meaning: "wasn't busy" },
    },
  },

  {
    dict: '長い', kana: 'ながい', type: 'i-adj', meaning: 'long',
    example: { jp: '長い映画です。', kana: 'ながいえいがです。', en: "It's a long film." },
    polite: {
      present_pos: { word: '長いです',             kana: 'ながいです',             meaning: 'is long' },
      present_neg: { word: '長くないです',          kana: 'ながくないです',          meaning: "isn't long" },
      past_pos:    { word: '長かったです',           kana: 'ながかったです',          meaning: 'was long' },
      past_neg:    { word: '長くなかったです',       kana: 'ながくなかったです',       meaning: "wasn't long" },
    },
    casual: {
      present_pos: { word: '長い',                kana: 'ながい',                meaning: 'long' },
      present_neg: { word: '長くない',             kana: 'ながくない',             meaning: "not long" },
      past_pos:    { word: '長かった',             kana: 'ながかった',             meaning: 'was long' },
      past_neg:    { word: '長くなかった',          kana: 'ながくなかった',          meaning: "wasn't long" },
    },
  },

  {
    dict: '早い', kana: 'はやい', type: 'i-adj', meaning: 'early / fast',
    example: { jp: '今日は早く起きました。', kana: 'きょうははやくおきました。', en: 'I woke up early today.' },
    polite: {
      present_pos: { word: '早いです',             kana: 'はやいです',             meaning: 'is early / fast' },
      present_neg: { word: '早くないです',          kana: 'はやくないです',          meaning: "isn't early" },
      past_pos:    { word: '早かったです',           kana: 'はやかったです',          meaning: 'was early' },
      past_neg:    { word: '早くなかったです',       kana: 'はやくなかったです',       meaning: "wasn't early" },
    },
    casual: {
      present_pos: { word: '早い',                kana: 'はやい',                meaning: 'early / fast' },
      present_neg: { word: '早くない',             kana: 'はやくない',             meaning: "not early" },
      past_pos:    { word: '早かった',             kana: 'はやかった',             meaning: 'was early' },
      past_neg:    { word: '早くなかった',          kana: 'はやくなかった',          meaning: "wasn't early" },
    },
  },

  // ── な-adjectives ──────────────────────────────────────────────────────

  {
    dict: '好き', kana: 'すき', type: 'na-adj', meaning: 'like / fond of',
    example: { jp: 'ジャズが好きです。', kana: 'ジャズがすきです。', en: 'I like jazz.' },
    polite: {
      present_pos: { word: '好きです',             kana: 'すきです',              meaning: 'like' },
      present_neg: { word: '好きじゃないです',       kana: 'すきじゃないです',        meaning: "don't like" },
      past_pos:    { word: '好きでした',             kana: 'すきでした',             meaning: 'liked' },
      past_neg:    { word: '好きじゃなかったです',    kana: 'すきじゃなかったです',     meaning: "didn't like" },
    },
    casual: {
      present_pos: { word: '好きだ',              kana: 'すきだ',               meaning: 'like' },
      present_neg: { word: '好きじゃない',          kana: 'すきじゃない',           meaning: "don't like" },
      past_pos:    { word: '好きだった',            kana: 'すきだった',             meaning: 'liked' },
      past_neg:    { word: '好きじゃなかった',       kana: 'すきじゃなかった',        meaning: "didn't like" },
    },
  },

  {
    dict: '嫌い', kana: 'きらい', type: 'na-adj', meaning: 'dislike',
    example: { jp: '野菜が嫌いです。', kana: 'やさいがきらいです。', en: 'I dislike vegetables.' },
    polite: {
      present_pos: { word: '嫌いです',             kana: 'きらいです',             meaning: 'dislike' },
      present_neg: { word: '嫌いじゃないです',       kana: 'きらいじゃないです',       meaning: "don't dislike" },
      past_pos:    { word: '嫌いでした',             kana: 'きらいでした',            meaning: 'disliked' },
      past_neg:    { word: '嫌いじゃなかったです',    kana: 'きらいじゃなかったです',    meaning: "didn't dislike" },
    },
    casual: {
      present_pos: { word: '嫌いだ',              kana: 'きらいだ',              meaning: 'dislike' },
      present_neg: { word: '嫌いじゃない',          kana: 'きらいじゃない',          meaning: "don't dislike" },
      past_pos:    { word: '嫌いだった',            kana: 'きらいだった',            meaning: 'disliked' },
      past_neg:    { word: '嫌いじゃなかった',       kana: 'きらいじゃなかった',       meaning: "didn't dislike" },
    },
  },

  {
    dict: 'きれい', kana: 'きれい', type: 'na-adj', meaning: 'beautiful / clean',
    example: { jp: 'きれいな花です。', kana: 'きれいなはなです。', en: "It's a beautiful flower." },
    polite: {
      present_pos: { word: 'きれいです',            kana: 'きれいです',             meaning: 'is beautiful' },
      present_neg: { word: 'きれいじゃないです',     kana: 'きれいじゃないです',      meaning: "isn't beautiful" },
      past_pos:    { word: 'きれいでした',           kana: 'きれいでした',            meaning: 'was beautiful' },
      past_neg:    { word: 'きれいじゃなかったです',  kana: 'きれいじゃなかったです',   meaning: "wasn't beautiful" },
    },
    casual: {
      present_pos: { word: 'きれいだ',             kana: 'きれいだ',              meaning: 'beautiful' },
      present_neg: { word: 'きれいじゃない',        kana: 'きれいじゃない',          meaning: "not beautiful" },
      past_pos:    { word: 'きれいだった',          kana: 'きれいだった',            meaning: 'was beautiful' },
      past_neg:    { word: 'きれいじゃなかった',     kana: 'きれいじゃなかった',       meaning: "wasn't beautiful" },
    },
  },

  {
    dict: '簡単', kana: 'かんたん', type: 'na-adj', meaning: 'easy / simple',
    example: { jp: 'この問題は簡単です。', kana: 'このもんだいはかんたんです。', en: 'This problem is easy.' },
    polite: {
      present_pos: { word: '簡単です',             kana: 'かんたんです',            meaning: 'is easy' },
      present_neg: { word: '簡単じゃないです',       kana: 'かんたんじゃないです',     meaning: "isn't easy" },
      past_pos:    { word: '簡単でした',             kana: 'かんたんでした',           meaning: 'was easy' },
      past_neg:    { word: '簡単じゃなかったです',    kana: 'かんたんじゃなかったです',  meaning: "wasn't easy" },
    },
    casual: {
      present_pos: { word: '簡単だ',              kana: 'かんたんだ',             meaning: 'easy' },
      present_neg: { word: '簡単じゃない',          kana: 'かんたんじゃない',        meaning: "not easy" },
      past_pos:    { word: '簡単だった',            kana: 'かんたんだった',          meaning: 'was easy' },
      past_neg:    { word: '簡単じゃなかった',       kana: 'かんたんじゃなかった',     meaning: "wasn't easy" },
    },
  },

  {
    dict: '元気', kana: 'げんき', type: 'na-adj', meaning: 'healthy / energetic / well',
    example: { jp: '元気ですか。', kana: 'げんきですか。', en: 'Are you well?' },
    polite: {
      present_pos: { word: '元気です',             kana: 'げんきです',             meaning: 'is well / energetic' },
      present_neg: { word: '元気じゃないです',       kana: 'げんきじゃないです',      meaning: "isn't well" },
      past_pos:    { word: '元気でした',             kana: 'げんきでした',            meaning: 'was well' },
      past_neg:    { word: '元気じゃなかったです',    kana: 'げんきじゃなかったです',   meaning: "wasn't well" },
    },
    casual: {
      present_pos: { word: '元気だ',              kana: 'げんきだ',              meaning: 'well / energetic' },
      present_neg: { word: '元気じゃない',          kana: 'げんきじゃない',          meaning: "not well" },
      past_pos:    { word: '元気だった',            kana: 'げんきだった',            meaning: 'was well' },
      past_neg:    { word: '元気じゃなかった',       kana: 'げんきじゃなかった',       meaning: "wasn't well" },
    },
  },

  {
    dict: '大丈夫', kana: 'だいじょうぶ', type: 'na-adj', meaning: 'okay / all right',
    example: { jp: '大丈夫ですか。', kana: 'だいじょうぶですか。', en: 'Are you okay?' },
    polite: {
      present_pos: { word: '大丈夫です',           kana: 'だいじょうぶです',         meaning: 'is okay' },
      present_neg: { word: '大丈夫じゃないです',     kana: 'だいじょうぶじゃないです',  meaning: "isn't okay" },
      past_pos:    { word: '大丈夫でした',           kana: 'だいじょうぶでした',       meaning: 'was okay' },
      past_neg:    { word: '大丈夫じゃなかったです',  kana: 'だいじょうぶじゃなかったです', meaning: "wasn't okay" },
    },
    casual: {
      present_pos: { word: '大丈夫だ',             kana: 'だいじょうぶだ',           meaning: 'okay' },
      present_neg: { word: '大丈夫じゃない',        kana: 'だいじょうぶじゃない',      meaning: "not okay" },
      past_pos:    { word: '大丈夫だった',          kana: 'だいじょうぶだった',        meaning: 'was okay' },
      past_neg:    { word: '大丈夫じゃなかった',     kana: 'だいじょうぶじゃなかった',   meaning: "wasn't okay" },
    },
  },

  {
    dict: '大変', kana: 'たいへん', type: 'na-adj', meaning: 'tough / serious / awful',
    example: { jp: '大変でしたね。', kana: 'たいへんでしたね。', en: 'That was tough, wasn\'t it.' },
    polite: {
      present_pos: { word: '大変です',             kana: 'たいへんです',            meaning: 'is tough / serious' },
      present_neg: { word: '大変じゃないです',       kana: 'たいへんじゃないです',     meaning: "isn't serious" },
      past_pos:    { word: '大変でした',             kana: 'たいへんでした',           meaning: 'was tough' },
      past_neg:    { word: '大変じゃなかったです',    kana: 'たいへんじゃなかったです',  meaning: "wasn't bad" },
    },
    casual: {
      present_pos: { word: '大変だ',              kana: 'たいへんだ',             meaning: 'tough / serious' },
      present_neg: { word: '大変じゃない',          kana: 'たいへんじゃない',         meaning: "not serious" },
      past_pos:    { word: '大変だった',            kana: 'たいへんだった',           meaning: 'was tough' },
      past_neg:    { word: '大変じゃなかった',       kana: 'たいへんじゃなかった',      meaning: "wasn't bad" },
    },
  },

  {
    dict: '有名', kana: 'ゆうめい', type: 'na-adj', meaning: 'famous',
    example: { jp: '有名な映画です。', kana: 'ゆうめいなえいがです。', en: "It's a famous film." },
    polite: {
      present_pos: { word: '有名です',             kana: 'ゆうめいです',            meaning: 'is famous' },
      present_neg: { word: '有名じゃないです',       kana: 'ゆうめいじゃないです',     meaning: "isn't famous" },
      past_pos:    { word: '有名でした',             kana: 'ゆうめいでした',           meaning: 'was famous' },
      past_neg:    { word: '有名じゃなかったです',    kana: 'ゆうめいじゃなかったです',  meaning: "wasn't famous" },
    },
    casual: {
      present_pos: { word: '有名だ',              kana: 'ゆうめいだ',             meaning: 'famous' },
      present_neg: { word: '有名じゃない',          kana: 'ゆうめいじゃない',         meaning: "not famous" },
      past_pos:    { word: '有名だった',            kana: 'ゆうめいだった',           meaning: 'was famous' },
      past_neg:    { word: '有名じゃなかった',       kana: 'ゆうめいじゃなかった',      meaning: "wasn't famous" },
    },
  },
]
