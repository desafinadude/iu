// ─────────────────────────────────────────────────────────────────────────────
// verbData.js — Japanese Learning App: Verb Data
//
// Each verb entry:
//   dict    = dictionary form (kanji)
//   kana    = hiragana reading
//   type    = 'ichidan' | 'godan' | 'irregular'
//   meaning = English gloss
//   examples = array of { jp, kana, en, form } — natural example sentences
//              form: 'polite_present' | 'casual_past' | 'te'
//   polite  = { present_pos, present_neg, past_pos, past_neg }
//   casual  = { present_pos, present_neg, past_pos, past_neg, te }
//
// Each conjugation form: { word, kana, meaning }
//
// て-form (te) lives inside casual — it is derived from casual past_pos
//   by replacing た→て or だ→で, and shares the same register.
//   た-form = casual.past_pos  (e.g. 食べた)
//   て-form = casual.te        (e.g. 食べて)
// ─────────────────────────────────────────────────────────────────────────────

export const VERB_LIST = [

  // ── Core sense verbs ────────────────────────────────────────────────────

  {
    dict: '見る', kana: 'みる', type: 'ichidan', meaning: 'to see / watch',
    examples: [
      { jp: '映画を見ます。',         kana: 'えいがをみます。',         en: 'I watch a film.',               form: 'polite_present' },
      { jp: '昨日、テレビを見た。',   kana: 'きのう、テレビをみた。',   en: 'I watched TV yesterday.',       form: 'casual_past' },
      { jp: 'これを見てください。',   kana: 'これをみてください。',     en: 'Please look at this.',          form: 'te' },
    ],
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
      te:          { word: '見て',              kana: 'みて',              meaning: 'watching' },
    },
  },

  {
    dict: '聞く', kana: 'きく', type: 'godan', meaning: 'to listen / hear / ask',
    examples: [
      { jp: 'ジャズを聞きます。',           kana: 'ジャズをききます。',           en: 'I listen to jazz.',                     form: 'polite_present' },
      { jp: '友達の話を聞いた。',           kana: 'ともだちのはなしをきいた。',   en: "I listened to what my friend said.",    form: 'casual_past' },
      { jp: '音楽を聞いてリラックスします。', kana: 'おんがくをきいてリラックスします。', en: 'I listen to music and relax.',     form: 'te' },
    ],
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
      te:          { word: '聞いて',             kana: 'きいて',             meaning: 'listening' },
    },
  },

  {
    dict: '味わう', kana: 'あじわう', type: 'godan', meaning: 'to taste / savour',
    examples: [
      { jp: '新しい料理を味わいます。',     kana: 'あたらしいりょうりをあじわいます。', en: 'I taste new food.',              form: 'polite_present' },
      { jp: 'ゆっくり味わった。',           kana: 'ゆっくりあじわった。',             en: 'I savoured it slowly.',          form: 'casual_past' },
      { jp: '味わって食べてください。',     kana: 'あじわってたべてください。',         en: 'Please eat and savour it.',      form: 'te' },
    ],
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
      te:          { word: '味わって',            kana: 'あじわって',          meaning: 'tasting' },
    },
  },

  {
    dict: '感じる', kana: 'かんじる', type: 'ichidan', meaning: 'to feel / sense',
    examples: [
      { jp: '秋を感じます。',           kana: 'あきをかんじます。',       en: 'I feel autumn.',              form: 'polite_present' },
      { jp: '風を感じた。',             kana: 'かぜをかんじた。',         en: 'I felt the wind.',            form: 'casual_past' },
      { jp: '感じてみてください。',     kana: 'かんじてみてください。',   en: 'Please try to feel it.',      form: 'te' },
    ],
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
      te:          { word: '感じて',              kana: 'かんじて',            meaning: 'feeling' },
    },
  },

  {
    dict: '言う', kana: 'いう', type: 'godan', meaning: 'to say',
    examples: [
      { jp: 'アンディに「おはよう」と言います。',   kana: 'アンディに「おはよう」といいます。', en: 'I say good morning to Andi.',   form: 'polite_present' },
      { jp: '先生に「ありがとう」と言った。',       kana: 'せんせいに「ありがとう」といった。', en: 'I said thank you to my teacher.', form: 'casual_past' },
      { jp: '言ってから行きます。',               kana: 'いってからいきます。',             en: "I'll say it and then leave.",   form: 'te' },
    ],
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
      te:          { word: '言って',              kana: 'いって',              meaning: 'saying' },
    },
  },

  {
    dict: '行く', kana: 'いく', type: 'godan', meaning: 'to go',
    examples: [
      { jp: '公園に行きます。',           kana: 'こうえんにいきます。',     en: 'I go to the park.',                        form: 'polite_present' },
      { jp: '昨日、図書館に行った。',     kana: 'きのう、としょかんにいった。', en: 'I went to the library yesterday.',       form: 'casual_past' },
      { jp: '行ってきます！',             kana: 'いってきます！',           en: "I'm heading out! (lit. I'll go and come back)", form: 'te' },
    ],
    // Note: 行く has an irregular て-form — 行って (not 行いて)
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
      te:          { word: '行って',              kana: 'いって',              meaning: 'going' },
    },
  },

  {
    dict: '来る', kana: 'くる', type: 'irregular', meaning: 'to come',
    examples: [
      { jp: '友達が家に来ます。',       kana: 'ともだちがいえにきます。', en: 'A friend comes to the house.',   form: 'polite_present' },
      { jp: 'アンディが早く来た。',     kana: 'アンディがはやくきた。',   en: 'Andi came early.',               form: 'casual_past' },
      { jp: '来てください。',           kana: 'きてください。',           en: 'Please come.',                   form: 'te' },
    ],
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
      te:          { word: '来て',               kana: 'きて',               meaning: 'coming' },
    },
  },

  {
    dict: '食べる', kana: 'たべる', type: 'ichidan', meaning: 'to eat',
    examples: [
      { jp: '朝ごはんを食べます。',         kana: 'あさごはんをたべます。',     en: 'I eat breakfast.',               form: 'polite_present' },
      { jp: '昨日、寿司を食べた。',         kana: 'きのう、すしをたべた。',     en: 'I ate sushi yesterday.',         form: 'casual_past' },
      { jp: '食べてから出かけます。',       kana: 'たべてからでかけます。',     en: 'I go out after eating.',         form: 'te' },
    ],
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
      te:          { word: '食べて',               kana: 'たべて',               meaning: 'eating' },
    },
  },

  {
    dict: '飲む', kana: 'のむ', type: 'godan', meaning: 'to drink',
    examples: [
      { jp: 'コーヒーを飲みます。',       kana: 'コーヒーをのみます。',       en: 'I drink coffee.',                form: 'polite_present' },
      { jp: '水を飲んだ。',               kana: 'みずをのんだ。',             en: 'I drank water.',                 form: 'casual_past' },
      { jp: '薬を飲んでください。',       kana: 'くすりをのんでください。',   en: 'Please take the medicine.',      form: 'te' },
    ],
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
      te:          { word: '飲んで',              kana: 'のんで',              meaning: 'drinking' },
    },
  },

  {
    dict: 'する', kana: 'する', type: 'irregular', meaning: 'to do',
    examples: [
      { jp: '毎朝、運動をします。',       kana: 'まいあさ、うんどうをします。', en: 'I exercise every morning.',     form: 'polite_present' },
      { jp: '宿題をした。',               kana: 'しゅくだいをした。',           en: 'I did my homework.',            form: 'casual_past' },
      { jp: 'してから寝ます。',           kana: 'してからねます。',             en: "I'll do it and then sleep.",    form: 'te' },
    ],
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
      te:          { word: 'して',                kana: 'して',                meaning: 'doing' },
    },
  },

  {
    dict: '買う', kana: 'かう', type: 'godan', meaning: 'to buy',
    examples: [
      { jp: '歴史の本を買います。',       kana: 'れきしのほんをかいます。',   en: 'I buy a history book.',          form: 'polite_present' },
      { jp: 'スーパーで野菜を買った。',   kana: 'スーパーでやさいをかった。', en: 'I bought vegetables at the supermarket.', form: 'casual_past' },
      { jp: '買って帰ります。',           kana: 'かってかえります。',         en: "I'll buy it and go home.",       form: 'te' },
    ],
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
      te:          { word: '買って',              kana: 'かって',              meaning: 'buying' },
    },
  },

  {
    dict: '話す', kana: 'はなす', type: 'godan', meaning: 'to speak / talk',
    examples: [
      { jp: '日本語を話します。',         kana: 'にほんごをはなします。',     en: 'I speak Japanese.',              form: 'polite_present' },
      { jp: '友達と話した。',             kana: 'ともだちとはなした。',       en: 'I spoke with a friend.',         form: 'casual_past' },
      { jp: '話してください。',           kana: 'はなしてください。',         en: 'Please speak.',                  form: 'te' },
    ],
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
      te:          { word: '話して',              kana: 'はなして',             meaning: 'speaking' },
    },
  },

  {
    dict: '読む', kana: 'よむ', type: 'godan', meaning: 'to read',
    examples: [
      { jp: '歴史の本を読みます。',       kana: 'れきしのほんをよみます。',   en: 'I read a history book.',         form: 'polite_present' },
      { jp: '昨夜、小説を読んだ。',       kana: 'さくや、しょうせつをよんだ。', en: 'I read a novel last night.',   form: 'casual_past' },
      { jp: '読んでいます。',             kana: 'よんでいます。',             en: 'I am reading.',                  form: 'te' },
    ],
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
      te:          { word: '読んで',              kana: 'よんで',              meaning: 'reading' },
    },
  },

  {
    dict: '書く', kana: 'かく', type: 'godan', meaning: 'to write',
    examples: [
      { jp: '手紙を書きます。',           kana: 'てがみをかきます。',         en: 'I write a letter.',              form: 'polite_present' },
      { jp: '日記を書いた。',             kana: 'にっきをかいた。',           en: 'I wrote in my diary.',           form: 'casual_past' },
      { jp: '書いてください。',           kana: 'かいてください。',           en: 'Please write it.',               form: 'te' },
    ],
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
      te:          { word: '書いて',              kana: 'かいて',              meaning: 'writing' },
    },
  },

  {
    dict: '考える', kana: 'かんがえる', type: 'ichidan', meaning: 'to think',
    examples: [
      { jp: 'AIについて考えます。',       kana: 'AIについてかんがえます。',   en: 'I think about AI.',              form: 'polite_present' },
      { jp: '色々考えた。',               kana: 'いろいろかんがえた。',       en: 'I thought about various things.', form: 'casual_past' },
      { jp: '考えてみます。',             kana: 'かんがえてみます。',         en: "I'll try thinking about it.",    form: 'te' },
    ],
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
      te:          { word: '考えて',               kana: 'かんがえて',             meaning: 'thinking' },
    },
  },

  {
    dict: '歩く', kana: 'あるく', type: 'godan', meaning: 'to walk',
    examples: [
      { jp: '毎朝、公園を歩きます。',     kana: 'まいあさ、こうえんをあるきます。', en: 'I walk in the park every morning.', form: 'polite_present' },
      { jp: '海岸を歩いた。',             kana: 'かいがんをあるいた。',           en: 'I walked along the coast.',         form: 'casual_past' },
      { jp: '歩いて行きます。',           kana: 'あるいていきます。',             en: "I'll walk there.",                  form: 'te' },
    ],
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
      te:          { word: '歩いて',              kana: 'あるいて',             meaning: 'walking' },
    },
  },

  {
    dict: '座る', kana: 'すわる', type: 'godan', meaning: 'to sit',
    examples: [
      { jp: '木の下に座ります。',         kana: 'きのしたにすわります。',     en: 'I sit under a tree.',            form: 'polite_present' },
      { jp: '椅子に座った。',             kana: 'いすにすわった。',           en: 'I sat on the chair.',            form: 'casual_past' },
      { jp: '座ってください。',           kana: 'すわってください。',         en: 'Please sit down.',               form: 'te' },
    ],
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
      te:          { word: '座って',              kana: 'すわって',             meaning: 'sitting' },
    },
  },

  {
    dict: '運転する', kana: 'うんてんする', type: 'irregular', meaning: 'to drive',
    examples: [
      { jp: '毎日、車を運転します。',     kana: 'まいにち、くるまをうんてんします。', en: 'I drive every day.',           form: 'polite_present' },
      { jp: '一人で運転した。',           kana: 'ひとりでうんてんした。',           en: 'I drove alone.',               form: 'casual_past' },
      { jp: '運転して行きます。',         kana: 'うんてんしていきます。',           en: "I'll drive there.",            form: 'te' },
    ],
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
      te:          { word: '運転して',              kana: 'うんてんして',           meaning: 'driving' },
    },
  },

  {
    dict: '寝る', kana: 'ねる', type: 'ichidan', meaning: 'to sleep / go to bed',
    examples: [
      { jp: '十一時に寝ます。',           kana: 'じゅういちじにねます。',     en: 'I go to sleep at 11.',           form: 'polite_present' },
      { jp: '疲れてすぐ寝た。',           kana: 'つかれてすぐねた。',         en: 'I was tired and fell asleep quickly.', form: 'casual_past' },
      { jp: '寝ています。',               kana: 'ねています。',               en: 'I am sleeping.',                 form: 'te' },
    ],
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
      te:          { word: '寝て',                kana: 'ねて',                meaning: 'sleeping' },
    },
  },

  // ── Additional essential verbs ─────────────────────────────────────────

  {
    dict: '帰る', kana: 'かえる', type: 'godan', meaning: 'to return / go home',
    examples: [
      { jp: '家に帰ります。',             kana: 'いえにかえります。',         en: 'I return home.',                 form: 'polite_present' },
      { jp: '早く帰った。',               kana: 'はやくかえった。',           en: 'I went home early.',             form: 'casual_past' },
      { jp: '帰ってから連絡します。',     kana: 'かえってかられんらくします。', en: "I'll contact you after I get home.", form: 'te' },
    ],
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
      te:          { word: '帰って',              kana: 'かえって',             meaning: 'returning' },
    },
  },

  {
    dict: '起きる', kana: 'おきる', type: 'ichidan', meaning: 'to wake up / get up',
    examples: [
      { jp: '六時に起きます。',           kana: 'ろくじにおきます。',         en: 'I wake up at 6.',                form: 'polite_present' },
      { jp: '今日、七時に起きた。',       kana: 'きょう、しちじにおきた。',   en: 'Today I woke up at 7.',          form: 'casual_past' },
      { jp: '起きてすぐシャワーを浴びます。', kana: 'おきてすぐシャワーをあびます。', en: 'I shower right after waking up.', form: 'te' },
    ],
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
      te:          { word: '起きて',               kana: 'おきて',               meaning: 'waking up' },
    },
  },

  {
    dict: '待つ', kana: 'まつ', type: 'godan', meaning: 'to wait',
    examples: [
      { jp: '駅で待ちます。',             kana: 'えきでまちます。',           en: 'I wait at the station.',         form: 'polite_present' },
      { jp: 'バスを待った。',             kana: 'バスをまった。',             en: 'I waited for the bus.',          form: 'casual_past' },
      { jp: '待ってください。',           kana: 'まってください。',           en: 'Please wait.',                   form: 'te' },
    ],
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
      te:          { word: '待って',              kana: 'まって',              meaning: 'waiting' },
    },
  },

  {
    dict: '会う', kana: 'あう', type: 'godan', meaning: 'to meet',
    examples: [
      { jp: '友達に会います。',           kana: 'ともだちにあいます。',       en: 'I meet a friend.',               form: 'polite_present' },
      { jp: '駅で会った。',               kana: 'えきであった。',             en: 'We met at the station.',         form: 'casual_past' },
      { jp: '会って話しましょう。',       kana: 'あってはなしましょう。',     en: "Let's meet and talk.",           form: 'te' },
    ],
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
      te:          { word: '会って',              kana: 'あって',              meaning: 'meeting' },
    },
  },

  {
    dict: '分かる', kana: 'わかる', type: 'godan', meaning: 'to understand',
    examples: [
      { jp: '日本語が分かります。',       kana: 'にほんごがわかります。',     en: 'I understand Japanese.',         form: 'polite_present' },
      { jp: 'やっと意味が分かった。',     kana: 'やっといみがわかった。',     en: 'I finally understood the meaning.', form: 'casual_past' },
      { jp: '分かってよかった。',         kana: 'わかってよかった。',         en: "I'm glad I understood.",         form: 'te' },
    ],
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
      te:          { word: '分かって',             kana: 'わかって',             meaning: 'understanding' },
    },
  },

  {
    dict: '使う', kana: 'つかう', type: 'godan', meaning: 'to use',
    examples: [
      { jp: 'パソコンを使います。',       kana: 'パソコンをつかいます。',     en: 'I use a computer.',              form: 'polite_present' },
      { jp: '新しいアプリを使った。',     kana: 'あたらしいアプリをつかった。', en: 'I used a new app.',             form: 'casual_past' },
      { jp: '使ってみてください。',       kana: 'つかってみてください。',     en: 'Please try using it.',           form: 'te' },
    ],
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
      te:          { word: '使って',              kana: 'つかって',             meaning: 'using' },
    },
  },

  {
    dict: '作る', kana: 'つくる', type: 'godan', meaning: 'to make / create',
    examples: [
      { jp: '料理を作ります。',           kana: 'りょうりをつくります。',     en: 'I make food.',                   form: 'polite_present' },
      { jp: '息子たちとケーキを作った。', kana: 'むすこたちとケーキをつくった。', en: 'I made a cake with my sons.',  form: 'casual_past' },
      { jp: '作って食べましょう。',       kana: 'つくってたべましょう。',     en: "Let's make it and eat!",         form: 'te' },
    ],
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
      te:          { word: '作って',              kana: 'つくって',             meaning: 'making' },
    },
  },

  {
    dict: '開ける', kana: 'あける', type: 'ichidan', meaning: 'to open',
    examples: [
      { jp: 'ドアを開けます。',           kana: 'ドアをあけます。',           en: 'I open the door.',               form: 'polite_present' },
      { jp: '窓を開けた。',               kana: 'まどをあけた。',             en: 'I opened the window.',           form: 'casual_past' },
      { jp: '開けてください。',           kana: 'あけてください。',           en: 'Please open it.',                form: 'te' },
    ],
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
      te:          { word: '開けて',               kana: 'あけて',               meaning: 'opening' },
    },
  },
]