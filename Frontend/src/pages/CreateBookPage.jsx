
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateBook, pingBackend } from '../services/api';
import Navbar from '../components/Navbar';
import FloatingClouds from '../components/FloatingClouds';
import StylePicker from '../components/StylePicker';
import GeneratingLoader from '../components/GeneratingLoader';
import Button from '../components/Button';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Mic,
  MicOff,
  Globe,
} from 'lucide-react';

export default function CreateBookPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Protect route & pre-warm Render backend free-tier instance
  useEffect(() => {
    pingBackend();
    const storedToken = localStorage.getItem('storyverse_token');

    if (!token && !storedToken) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Form state
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('comic_color');
  const [pageCount, setPageCount] = useState(3);
  const [language, setLanguage] = useState('English');

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap = {
        English: 'en-US',
        Spanish: 'es-ES',
        French: 'fr-FR',
        German: 'de-DE',
        Hindi: 'hi-IN',
        Bengali: 'bn-IN',
        Japanese: 'ja-JP',
        Italian: 'it-IT',
        Portuguese: 'pt-PT',
      };
      recognition.lang = langMap[language] || 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const spokenText = event.results[0][0].transcript.trim();
          if (spokenText) {
            setPrompt((prev) => (prev ? `${prev} ${spokenText}` : spokenText));
          }
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Starter ideas
  const sampleIdeas = [
    'A city where gravity works sideways and streets climb the sky',
    'A lighthouse keeper who collects fallen stars in glass mason jars',
    'A cozy teashop at the edge of time where memories are brewed',
    'A young cartographer mapping islands that move with the ocean tide',
  ];

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setValidationError('');
    setGenerationError(null);

    // Validate prompt
    if (!prompt.trim()) {
      setValidationError(
        'Please type an idea or dream for your storybook.'
      );
      return;
    }

    if (prompt.trim().length < 8) {
      setValidationError(
        'Please describe your idea with a few more words.'
      );
      return;
    }

    // Validate authentication
    const currentToken =
      token || localStorage.getItem('storyverse_token');

    if (!currentToken) {
      navigate('/login');
      return;
    }

    setIsGenerating(true);

    try {
      console.log('Generating StoryVerse book...');

      const newBook = await generateBook({
        prompt: prompt.trim(),
        pageCount: Number(pageCount),
        style: style || 'comic_color',
        language,
      });

      console.log('Book generated successfully:', newBook);

      /*
       * Backend may return:
       *
       * {
       *   book: {...}
       * }
       *
       * or directly:
       *
       * {
       *   id: "...",
       *   title: "...",
       *   pages: [...]
       * }
       */

      const bookId =
        newBook?.id ||
        newBook?._id ||
        newBook?.book?.id ||
        newBook?.book?._id;

      if (bookId) {
        navigate(`/books/${bookId}`);
        return;
      }

      // If backend succeeded but didn't return an ID
      navigate('/dashboard');
    } catch (err) {
      console.error('Book generation failed:', err);

      setIsGenerating(false);

      setGenerationError({
        message:
          err?.message ||
          'Book generation failed.',
        details:
          err?.details ||
          'The backend could not finish generating your storybook. Please try again.',
      });
    }
  };

  // Generation screen
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#D4E8FA] flex flex-col justify-between overflow-hidden">
        <Navbar />

        <GeneratingLoader
          prompt={prompt}
          pageCount={pageCount}
          style={style}
        />

        <footer className="relative z-20 py-4 text-center text-xs text-stone-500">
          Storyverse &bull; Illustrated storybooks
        </footer>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#D4E8FA] flex flex-col justify-between overflow-x-hidden">

      {/* Floating clouds */}
      <FloatingClouds variant="default" />

      {/* Navbar */}
      <Navbar />

      {/* Main */}
      <main className="relative z-20 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 pt-6 pb-16">

        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-black bg-white/75 backdrop-blur-xs px-4 py-2 rounded-full border border-white/90 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to bookshelf</span>
          </Link>
        </div>

        {/* Main card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-[32px] border-2 border-white/95 shadow-[0_24px_54px_rgba(20,45,75,0.1)] p-6 sm:p-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-craft-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-stone-900 tracking-tight leading-tight">
              Create a new storybook
            </h1>

            <p className="text-stone-600 text-sm sm:text-base mt-1.5 font-normal">
              Type your idea, select an art style, and generate a full book with illustrations on every page.
            </p>
          </div>

          {/* Generation error */}
          {generationError && (
            <div className="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 animate-in fade-in duration-200">

              <div className="flex items-start space-x-3">

                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />

                <div className="flex-1">

                  <h4 className="font-semibold text-sm text-rose-900">
                    {generationError.message}
                  </h4>

                  {generationError.details && (
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                      {generationError.details}
                    </p>
                  )}

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 px-3.5 py-1.5 rounded-full shadow-2xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />

                      <span>
                        Try again with current idea
                      </span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            {/* Language Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-600" />
                  <span>Story Language</span>
                </label>
                <span className="text-xs text-stone-400">
                  Multilingual output & voice recognition
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {[
                  { name: 'English', flag: '🇬🇧' },
                  { name: 'Spanish', flag: '🇪🇸' },
                  { name: 'French', flag: '🇫🇷' },
                  { name: 'German', flag: '🇩🇪' },
                  { name: 'Hindi', flag: '🇮🇳' },
                  { name: 'Bengali', flag: '🇧🇩' },
                  { name: 'Japanese', flag: '🇯🇵' },
                  { name: 'Italian', flag: '🇮🇹' },
                  { name: 'Portuguese', flag: '🇵🇹' },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setLanguage(item.name)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      language === item.name
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Story prompt */}
            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <label
                  htmlFor="story-prompt"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-600"
                >
                  Your story idea or dream{' '}
                  <span className="text-rose-500">
                    *
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    title={isListening ? 'Stop recording voice' : 'Speak your prompt'}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse shadow-sm'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-rose-500" />
                        <span>Voice Prompt</span>
                      </>
                    )}
                  </button>
                  <span className="text-xs text-stone-400 hidden sm:inline">
                    Speak or type
                  </span>
                </div>

              </div>

              <textarea
                id="story-prompt"
                rows={4}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);

                  if (validationError) {
                    setValidationError('');
                  }
                }}
                placeholder="in my dreams i was captured by terrorists in a plane and became the hero who saved everyone"
                className={`w-full bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-stone-900 placeholder-stone-400 text-sm sm:text-base transition-all duration-150 outline-none leading-relaxed resize-y ${
                  validationError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200/50 bg-rose-50/10'
                    : 'border-[#E2DDD3] focus:border-stone-800 focus:ring-2 focus:ring-stone-400/20'
                }`}
              />

              {/* Validation error */}
              {validationError && (
                <p className="text-xs text-rose-600 pt-1 flex items-center space-x-1">
                  <span>{validationError}</span>
                </p>
              )}

              {/* Starter ideas */}
              <div className="pt-2">

                <p className="text-xs text-stone-500 mb-2 font-medium">
                  Or choose a starter idea:
                </p>

                <div className="flex flex-wrap gap-2">

                  {sampleIdeas.map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrompt(idea);

                        if (validationError) {
                          setValidationError('');
                        }
                      }}
                      className="text-xs bg-stone-100 hover:bg-stone-200/80 text-stone-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer text-left"
                    >
                      &ldquo;{idea}&rdquo;
                    </button>
                  ))}

                </div>
              </div>
            </div>

            {/* Style picker */}
            <StylePicker
              selectedStyle={style}
              onSelectStyle={setStyle}
            />

            {/* Page count */}
            <div className="space-y-2.5">

              <div className="flex items-center justify-between">

                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Page count:{' '}
                  <span className="text-stone-900 font-bold">
                    {pageCount} pages
                  </span>
                </label>

                <span className="text-xs text-stone-400">
                  3 to 12 illustrated pages
                </span>

              </div>

              <div className="flex items-center space-x-2">

                {[3, 4, 6, 8, 10, 12].map(
                  (count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() =>
                        setPageCount(count)
                      }
                      className={`flex-1 py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                        pageCount === count
                          ? 'bg-[#0D1116] text-white border-[#0D1116] shadow-xs'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {count} pages
                    </button>
                  )
                )}

              </div>
            </div>

            {/* Action bar */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div className="text-xs text-stone-500">
                Generates full narrative text + continuous character art
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4" />

                <span>
                  Generate book
                </span>
              </Button>

            </div>

          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 text-center text-xs text-stone-500">
        Storyverse &bull; Illustrated storybooks
      </footer>

    </div>
  );
}

