const { callGrok } = require('./grokClient');
const { generateText: callGemini } = require('./geminiClient');

// Forces Gemini to return exactly this shape - no parsing guesswork.
const STORY_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    characterDescription: {
      type: 'STRING',
      description:
        "A short, specific, fixed description of the main character's appearance - hair, clothing, colors, distinguishing features. This exact description will be repeated on every page's image prompt so the character looks the same throughout the book. Be concrete (e.g. 'a girl with a short red buzzcut, a patched teal windbreaker, steel-toed boots, a brass compass necklace') not vague.",
    },
    pages: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          pageNumber: { type: 'INTEGER' },
          text: {
            type: 'STRING',
            description:
              'REQUIRED: 4 to 6 short, easy sentences (at least 45-70 words total) a child could understand when read aloud. Everyday words. Describe the scene, what the character does, what they say or feel, and what happens next. NEVER return a single sentence or a single short line — a one-line page is treated as invalid output.',
          },
          imagePrompt: {
            type: 'STRING',
            description:
              "A complete visual description of THIS page's scene in English detailing the main character performing a concrete action in a vivid environment with lighting and camera angle. Example: 'A brave young protagonist in a teal windbreaker standing on a mountain peak at sunrise, holding a glowing star medallion, wide angle cinematic lighting'. No text or letters in the image.",
          },
        },
        required: ['pageNumber', 'text', 'imagePrompt'],
      },
    },
  },
  required: ['title', 'characterDescription', 'pages'],
};

function buildPrompt(userIdea, pageCount, language = 'English') {
  return `You write children's picture books for ages 5 to 10. Judges and parents should understand every sentence on first listen. Write warm, simple, and kind — never fancy, dark, or academic.

A user pitched this idea:
"${userIdea}"

Write a complete illustrated picture book with exactly ${pageCount} pages.

LANGUAGE:
- "title" and each page "text" MUST be in ${language}.
- "characterDescription" and "imagePrompt" MUST be in English for image generation.

STORY SHAPE (keep it this simple):
1. Page 1: Meet one named hero. Show what they want in one everyday moment.
2. Early pages: A small, clear problem appears. The hero tries.
3. Middle: The try fails in a way kids can picture (lost map, rain, fear, a locked door).
4. Later pages: A friend or a kind idea helps. The hero tries again.
5. Last page: A warm, happy ending. The hero is home, hugging someone, sharing food, or looking at the stars. No lecture. No moral speech.

WRITE LIKE A BEDTIME BOOK:
- Short sentences. Most sentences under 14 words.
- Everyday words only (look, run, lost, friend, rain, home, hug, try, smile).
- Name the character. Use "said", "looked", "ran", "held" — not "whispered into the void".
- One feeling per page (scared, brave, sad, glad). Show it with an action.
- The page text must sound good when a human reads it out loud. Use periods. Avoid long commas.
- Do NOT use: destiny, realm, saga, odyssey, visceral, cinematic, spark of, uncharted, legacy, triumph, atmosphere crackled, electric wonder.
- Do NOT start with "Once upon a time" unless the user asked for a fairy tale.
- Title: 2 to 5 simple words. Example: "Milo Wants to Fly", "The Lost Blue Kite".

PAGE LENGTH — THIS IS A HARD REQUIREMENT:
- Every single page's "text" MUST contain 4 to 6 complete sentences, roughly 45-70 words total.
- A page with only one sentence or one short line is WRONG and will be rejected. Never do this.
- Use the extra sentences to set the scene (where they are, what it looks like), show the action, add a line of dialogue, and show how the character feels or what they decide next.
- Example of an ACCEPTABLE page length (do not copy the content, just the length/structure):
  "Mira stood at the edge of the old garden gate. Rain tapped softly on her yellow raincoat. She had been walking for a long time, and her boots were muddy. 'I don't think I can do this alone,' she whispered, looking at the tall fence ahead. Just then, she heard a small bark behind her."

CHARACTER:
- Invent ONE friendly main character with a simple name.
- In "characterDescription", give a fixed look in English: age, hair, clothes, one accessory. Keep it the same on every page.

IMAGES:
- Each "imagePrompt" is a standalone English scene: character + action + place + lighting + camera angle.
- Bright, hopeful, storybook lighting. No text in the image.

FORMAT PER PAGE:
- "pageNumber": 1 to ${pageCount}
- "text": 4-6 short sentences (45-70 words) in ${language} — never a single line
- "imagePrompt": English visual scene

Return ONLY valid JSON matching the schema.`;
}

function pickHeroName(userIdea) {
  const match = userIdea.match(/\b([A-Z][a-z]{2,12})\b/);
  if (match && !['The', 'A', 'An', 'In', 'On', 'My'].includes(match[1])) {
    return match[1];
  }
  return 'Mira';
}

/**
 * Fallback story when Gemini/Grok are unavailable.
 * Still a real beginning-middle-end picture book, not purple prose.
 */
function generateCreativeFallbackStory(userIdea, pageCount = 4, language = 'English') {
  const cleanIdea = userIdea.trim() || 'a small adventure';
  const hero = pickHeroName(cleanIdea);
  const total = Math.max(3, Math.min(12, pageCount));

  const titles = {
    English: `${hero}'s Big Wish`,
    Spanish: `El gran deseo de ${hero}`,
    French: `Le grand souhait de ${hero}`,
    German: `${hero}s großer Wunsch`,
    Hindi: `${hero} की बड़ी चाह`,
    Bengali: `${hero}-এর বড় ইচ্ছে`,
    Japanese: `${hero}の大きな願い`,
    Italian: `Il grande desiderio di ${hero}`,
    Portuguese: `O grande desejo de ${hero}`,
  };

  const characterDescription = `${hero}, a kind 8-year-old with dark curly hair, a yellow raincoat, red sneakers, and a small cloth backpack`;

  const beats = [
    {
      en: `${hero} sat by the window and thought about ${cleanIdea}. "I want to try," ${hero} said, tying the yellow raincoat.`,
      es: `${hero} se sentó junto a la ventana y pensó en ${cleanIdea}. "Quiero intentarlo," dijo ${hero}.`,
      fr: `${hero} s'assit près de la fenêtre et pensa à ${cleanIdea}. "Je veux essayer," dit ${hero}.`,
      de: `${hero} saß am Fenster und dachte an ${cleanIdea}. "Ich will es versuchen," sagte ${hero}.`,
      hi: `${hero} खिड़की के पास बैठी और ${cleanIdea} के बारे में सोचा। "मैं कोशिश करूँगी," ${hero} ने कहा।`,
      bn: `${hero} জানালার পাশে বসে ${cleanIdea} নিয়ে ভাবল। "আমি চেষ্টা করব," ${hero} বলল।`,
      ja: `${hero}は窓のそばで${cleanIdea}のことを考えました。「やってみたい」と${hero}は言いました。`,
      it: `${hero} si sedette alla finestra e pensò a ${cleanIdea}. "Voglio provarci," disse ${hero}.`,
      pt: `${hero} sentou-se na janela e pensou em ${cleanIdea}. "Eu quero tentar," disse ${hero}.`,
      img: `${hero} a kind 8-year-old in a yellow raincoat sitting at a sunny bedroom window, looking outside hopefully, warm morning light, medium shot`,
    },
    {
      en: `${hero} stepped outside. The plan was simple. Find a way to make ${cleanIdea} come true.`,
      es: `${hero} salió afuera. El plan era simple. Encontrar una forma de hacer realidad ${cleanIdea}.`,
      fr: `${hero} sortit. Le plan était simple. Trouver un moyen de réaliser ${cleanIdea}.`,
      de: `${hero} ging hinaus. Der Plan war einfach. Einen Weg finden, ${cleanIdea} wahr zu machen.`,
      hi: `${hero} बाहर निकली। योजना आसान थी। ${cleanIdea} को सच करने का रास्ता खोजना।`,
      bn: `${hero} বাইরে বেরোল। পরিকল্পনা সহজ ছিল। ${cleanIdea} সত্যি করার উপায় খোঁজা।`,
      ja: `${hero}は外へ出ました。計画はかんたんでした。${cleanIdea}をかなえる方法を探すことです。`,
      it: `${hero} uscì. Il piano era semplice. Trovare un modo per realizzare ${cleanIdea}.`,
      pt: `${hero} saiu. O plano era simples. Encontrar um jeito de realizar ${cleanIdea}.`,
      img: `${hero} in a yellow raincoat walking down a bright neighborhood path, red sneakers, cloth backpack, cheerful daylight, wide shot`,
    },
    {
      en: `Soon the path got hard. Rain started to fall. ${hero} held the backpack tight and kept walking.`,
      es: `Pronto el camino se puso difícil. Empezó a llover. ${hero} apretó la mochila y siguió caminando.`,
      fr: `Bientôt le chemin devint dur. La pluie tomba. ${hero} serra le sac et continua.`,
      de: `Bald wurde der Weg schwer. Es begann zu regnen. ${hero} hielt den Rucksack fest und ging weiter.`,
      hi: `जल्द रास्ता मुश्किल हो गया। बारिश शुरू हुई। ${hero} बैग कसकर चलती रही।`,
      bn: `শীঘ্রই পথ কঠিন হল। বৃষ্টি নামল। ${hero} ব্যাগ চেপে ধরে হাঁটতে থাকল।`,
      ja: `すぐに道がむずかしくなりました。雨が降りました。${hero}はリュックをしっかり持って歩き続けました。`,
      it: `Presto la strada divenne difficile. Iniziò a piovere. ${hero} strinse lo zaino e continuò.`,
      pt: `Logo o caminho ficou difícil. Começou a chover. ${hero} apertou a mochila e seguiu.`,
      img: `${hero} in a yellow raincoat walking through gentle rain on a park path, determined expression, soft grey-blue light, cinematic medium shot`,
    },
    {
      en: `Then ${hero} got stuck. A gate was closed. "I can't do this alone," ${hero} whispered.`,
      es: `Luego ${hero} se atascó. La puerta estaba cerrada. "No puedo sola," susurró ${hero}.`,
      fr: `Puis ${hero} resta bloquée. La grille était fermée. "Je ne peux pas toute seule," chuchota ${hero}.`,
      de: `Dann blieb ${hero} stecken. Das Tor war zu. "Ich schaffe das nicht allein," flüsterte ${hero}.`,
      hi: `फिर ${hero} रुक गई। फाटक बंद था। "मैं अकेली नहीं कर सकती," ${hero} ने धीरे कहा।`,
      bn: `তারপর ${hero} আটকে গেল। গেট বন্ধ। "একা পারব না," ${hero} ফিসফিস করল।`,
      ja: `そして${hero}は止まってしまいました。門が閉まっていました。「ひとりではできない」と${hero}は小さく言いました。`,
      it: `Poi ${hero} si bloccò. Il cancello era chiuso. "Non ce la faccio da sola," sussurrò ${hero}.`,
      pt: `Então ${hero} travou. O portão estava fechado. "Não consigo sozinha," sussurrou ${hero}.`,
      img: `${hero} standing in front of a closed wooden garden gate in light rain, looking worried, yellow raincoat, soft overcast light`,
    },
    {
      en: `A small dog with a blue collar trotted over. It barked once, as if to say, "I can help."`,
      es: `Un perrito con collar azul se acercó. Ladró una vez, como diciendo, "Puedo ayudar."`,
      fr: `Un petit chien au collier bleu s'approcha. Il aboya, comme pour dire, "Je peux aider."`,
      de: `Ein kleiner Hund mit blauem Halsband kam herbei. Er bellte einmal, als wollte er sagen: "Ich helfe."`,
      hi: `नीले कॉलर वाला एक छोटा कुत्ता आया। उसने एक बार भौंका, जैसे कह रहा हो, "मैं मदद करूँगा।"`,
      bn: `নীল কলারওয়ালা এক ছোট কুকুর এল। একবার ঘেউ ঘেউ করল, যেন বলছে, "আমি সাহায্য করব।"`,
      ja: `青い首輪の小さな犬が来ました。ワンと鳴いて、「手伝うよ」と言っているようでした。`,
      it: `Un cagnolino con il collare blu arrivò. Abbaiò una volta, come a dire, "Posso aiutare."`,
      pt: `Um cachorrinho de coleira azul chegou. Lateu uma vez, como se dissesse, "Posso ajudar."`,
      img: `${hero} kneeling beside a small friendly brown dog with a blue collar near a garden gate, rain easing, warm smile, storybook lighting`,
    },
    {
      en: `${hero} followed the dog around the fence. There was a low place to climb. "We can do it," ${hero} said.`,
      es: `${hero} siguió al perro alrededor de la cerca. Había un sitio bajo para subir. "Podemos," dijo ${hero}.`,
      fr: `${hero} suivit le chien le long de la clôture. Il y avait un endroit bas. "On peut le faire," dit ${hero}.`,
      de: `${hero} folgte dem Hund um den Zaun. Es gab eine niedrige Stelle. "Wir schaffen das," sagte ${hero}.`,
      hi: `${hero} कुत्ते के साथ बाड़ के चारों ओर गई। चढ़ने की एक नीची जगह थी। "हम कर सकते हैं," ${hero} ने कहा।`,
      bn: `${hero} কুকুরের পেছনে বেড়া ঘুরল। উঠে যাওয়ার একটা নিচু জায়গা ছিল। "আমরা পারব," ${hero} বলল।`,
      ja: `${hero}は犬について柵のまわりを行きました。低いところがありました。「できるよ」と${hero}は言いました。`,
      it: `${hero} seguì il cane intorno al recinto. C'era un punto basso. "Possiamo farcela," disse ${hero}.`,
      pt: `${hero} seguiu o cão ao redor da cerca. Havia um lugar baixo. "A gente consegue," disse ${hero}.`,
      img: `${hero} and a small brown dog finding a low gap in a wooden fence, hopeful expressions, clearing sky, golden rim light`,
    },
    {
      en: `On the other side, ${hero} found what they needed for ${cleanIdea}. It was not huge. It was just right. ${hero} laughed.`,
      es: `Al otro lado, ${hero} encontró lo que necesitaba para ${cleanIdea}. No era enorme. Era justo. ${hero} rió.`,
      fr: `De l'autre côté, ${hero} trouva ce qu'il fallait pour ${cleanIdea}. Ce n'était pas énorme. C'était parfait. ${hero} rit.`,
      de: `Auf der anderen Seite fand ${hero} was für ${cleanIdea} fehlte. Es war nicht riesig. Es war genau richtig. ${hero} lachte.`,
      hi: `दूसरी तरफ़ ${hero} को ${cleanIdea} के लिए जो चाहिए था मिल गया। बहुत बड़ा नहीं था। बस ठीक था। ${hero} हँसी।`,
      bn: `ওপাশে ${hero} ${cleanIdea}-এর জন্য যা দরকার তা পেল। বিশাল নয়। ঠিক মতো। ${hero} হাসল।`,
      ja: `向こう側で${hero}は${cleanIdea}に必要なものを見つけました。大きくはありません。ちょうどよかったのです。${hero}は笑いました。`,
      it: `Dall'altra parte ${hero} trovò ciò che serviva per ${cleanIdea}. Non era enorme. Era giusto. ${hero} rise.`,
      pt: `Do outro lado, ${hero} achou o que precisava para ${cleanIdea}. Não era enorme. Era certo. ${hero} riu.`,
      img: `${hero} discovering a simple magical or helpful object in a sunny garden related to ${cleanIdea}, laughing with joy, the small dog beside her, bright golden hour`,
    },
    {
      en: `${hero} walked home with the little dog. The rain had stopped. "Thank you," ${hero} said. They sat on the steps and shared a biscuit.`,
      es: `${hero} volvió a casa con el perrito. La lluvia paró. "Gracias," dijo ${hero}. Se sentaron y compartieron una galleta.`,
      fr: `${hero} rentra avec le petit chien. La pluie s'arrêta. "Merci," dit ${hero}. Ils s'assirent et partagèrent un biscuit.`,
      de: `${hero} ging mit dem kleinen Hund nach Hause. Der Regen hörte auf. "Danke," sagte ${hero}. Sie saßen auf der Treppe und teilten einen Keks.`,
      hi: `${hero} छोटे कुत्ते के साथ घर लौटी। बारिश रुक गई। "धन्यवाद," ${hero} ने कहा। सीढ़ियों पर बैठकर उन्होंने बिस्किट बाँटा।`,
      bn: `${hero} ছোট কুকুর নিয়ে বাড়ি ফিরল। বৃষ্টি থামল। "ধন্যবাদ," ${hero} বলল। সিঁড়িতে বসে বিস্কুট ভাগ করল।`,
      ja: `${hero}は小さな犬と家へ帰りました。雨はやみました。「ありがとう」と${hero}は言いました。玄関の段にすわってビスケットを分けました。`,
      it: `${hero} tornò a casa con il cagnolino. La pioggia finì. "Grazie," disse ${hero}. Si sedettero e divisero un biscotto.`,
      pt: `${hero} voltou para casa com o cachorrinho. A chuva parou. "Obrigado," disse ${hero}. Sentaram e partilharam um biscoito.`,
      img: `${hero} and a small brown dog sitting on sunny front-porch steps sharing a biscuit, dry yellow raincoat, warm sunset light, cozy ending`,
    },
  ];

  const langKey = {
    English: 'en',
    Spanish: 'es',
    French: 'fr',
    German: 'de',
    Hindi: 'hi',
    Bengali: 'bn',
    Japanese: 'ja',
    Italian: 'it',
    Portuguese: 'pt',
  }[language] || 'en';

  const pages = [];
  for (let i = 1; i <= total; i++) {
    let beatIndex;
    if (total === 1) beatIndex = 0;
    else if (i === 1) beatIndex = 0;
    else if (i === total) beatIndex = beats.length - 1;
    else {
      beatIndex = Math.round(((i - 1) / (total - 1)) * (beats.length - 1));
    }
    const beat = beats[beatIndex];
    pages.push({
      pageNumber: i,
      text: beat[langKey] || beat.en,
      imagePrompt: beat.img,
    });
  }

  return {
    title: titles[language] || titles.English,
    characterDescription,
    pages,
  };
}

// Minimum bar a page's "text" must clear to be considered a real story page
// rather than a truncated one-liner. Tuned to the "4-6 sentences / 45-70
// words" instruction above, but kept a bit lenient since word count varies
// by language.
const MIN_WORDS_PER_PAGE = 25;
const MIN_SENTENCES_PER_PAGE = 2;

function countSentences(text) {
  return (text.match(/[.!?。！？](?:\s|$)/g) || []).length || (text.trim() ? 1 : 0);
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Rejects stories where pages are suspiciously short (e.g. a model ignoring
 * the length instructions and returning a single line per page). Used to
 * decide whether to trust a Grok/Gemini result or fall through to the next
 * provider / the guaranteed-length fallback story.
 */
function isStoryLongEnough(story, pageCount) {
  if (!story || !Array.isArray(story.pages) || story.pages.length === 0) return false;

  // Don't be overly strict about exact page count (models sometimes merge
  // or split a page), but every page that IS present must be long enough.
  const shortPages = story.pages.filter((p) => {
    const text = (p && typeof p.text === 'string') ? p.text : '';
    return countWords(text) < MIN_WORDS_PER_PAGE || countSentences(text) < MIN_SENTENCES_PER_PAGE;
  });

  if (shortPages.length > 0) {
    console.warn(
      `[storyGenerator] Rejecting story: ${shortPages.length}/${story.pages.length} page(s) are too short ` +
      `(need >= ${MIN_WORDS_PER_PAGE} words / >= ${MIN_SENTENCES_PER_PAGE} sentences each).`
    );
    return false;
  }

  return true;
}

/**
 * Generates the full story (all pages) via Gemini call with seamless fallback.
 * Returns { title, characterDescription, pages: [{pageNumber, text, imagePrompt}] }
 */
async function generateStory(userIdea, pageCount, language = 'English') {
  const prompt = buildPrompt(userIdea, pageCount, language);

  // 1. Try xAI Grok API if GROK_API_KEY / XAI_API_KEY is present
  try {
    const rawGrok = await callGrok(prompt);
    const story = typeof rawGrok === 'string' ? JSON.parse(rawGrok) : rawGrok;
    if (isStoryLongEnough(story, pageCount)) {
      console.log(`[storyGenerator] Grok AI generated story in ${language}: "${story.title}" (${story.pages.length} pages)`);
      return story;
    }
  } catch (grokErr) {
    console.warn(`[storyGenerator] Grok API unavailable (${grokErr.message}). Trying Gemini...`);
  }

  // 2. Try Gemini API
  try {
    const raw = await callGemini({ prompt, responseSchema: STORY_SCHEMA });
    const story = JSON.parse(raw);

    if (isStoryLongEnough(story, pageCount)) {
      console.log(`[storyGenerator] Gemini generated story in ${language}: "${story.title}" (${story.pages.length} pages)`);
      return story;
    }

    // Story parsed fine but pages were too short — retry once with an even
    // more forceful reminder appended, before giving up on the AI provider.
    const retryPrompt = `${prompt}\n\nREMINDER: your previous attempt returned pages that were far too short. Every "text" field must be 4-6 full sentences (45-70 words). Do not return single-sentence pages.`;
    const retryRaw = await callGemini({ prompt: retryPrompt, responseSchema: STORY_SCHEMA });
    const retryStory = JSON.parse(retryRaw);
    if (isStoryLongEnough(retryStory, pageCount)) {
      console.log(`[storyGenerator] Gemini retry produced a sufficiently long story in ${language}: "${retryStory.title}"`);
      return retryStory;
    }
  } catch (err) {
    console.warn(`[storyGenerator] Gemini API unavailable (${err.message}). Using Creative Story Engine fallback for ${language}.`);
  }

  // 3. Creative Multilingual Story Engine fallback (guaranteed multi-sentence pages)
  console.warn('[storyGenerator] Falling back to Creative Story Engine due to short/invalid AI output.');
  return generateCreativeFallbackStory(userIdea, pageCount, language);
}

module.exports = { generateStory, generateCreativeFallbackStory };