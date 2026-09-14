import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBookById, getImageUrl, createCraftStorySVG, fetchStoryAudio } from '../services/api';
import Navbar from '../components/Navbar';
import FloatingClouds from '../components/FloatingClouds';
import Button from '../components/Button';
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Share2, Sparkles, ImageOff, Volume2, Play, Pause, Square, Loader2, Globe } from 'lucide-react';

export default function BookReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrorMap, setImageErrorMap] = useState({});

  // Audio narration state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1.0); // 1.0 keeps ElevenLabs sounding human (slowing audio makes it robotic)
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const audioRef = useRef(null);

  // Load available Web Speech API voices asynchronously (handles Chrome/Edge onvoiceschanged)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    function loadVoices() {
      const voices = window.speechSynthesis.getVoices() || [];
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleSpeedChange = (newSpeed) => {
    setSpeechSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsAudioLoading(false);
  };

  // Stop audio whenever page index changes
  useEffect(() => {
    stopAudio();
  }, [currentPageIndex]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const found = await getBookById(id);
        setBook(found);
      } catch (err) {
        console.error('Failed to load book:', err);
        setBook(null);
      } finally {
        setIsLoading(false);
      }
    }
    load();
    return () => stopAudio();
  }, [id]);

  // Auto-select initial priority voice when voices load.
  // MUST stay above any early `return` below — React requires every hook to run
  // in the same order on every render, and this effect used to sit after the
  // isLoading/!book returns, which caused "Rendered fewer hooks than expected"
  // (React error #310) the moment `book` finished loading.
  useEffect(() => {
    if (!selectedVoiceURI) {
      // Default to ElevenLabs Rachel or first available voice
      setSelectedVoiceURI('eleven_jessica');
    }
  }, [selectedVoiceURI]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#D4E8FA] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-800 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#D4E8FA] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="font-craft-serif text-3xl font-normal text-stone-900 mb-2">
            Storybook not found
          </h2>
          <p className="text-stone-500 text-sm mb-4">
            This volume may have drifted away or been removed from your shelf.
          </p>
          <Link to="/dashboard">
            <Button variant="primary" size="md">
              Return to bookshelf
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const pages = book.pages || [];
  const totalPages = pages.length;
  const currentPage = pages[currentPageIndex] || {
    pageNumber: currentPageIndex + 1,
    title: book.title,
    text: book.prompt,
    image: book.coverImage,
    caption: 'Story illustration',
  };

  const dynamicCraftArt = createCraftStorySVG({
    title: currentPage.title || book.title,
    pageNumber: currentPage.pageNumber || currentPageIndex + 1,
    style: book.style,
    promptText: currentPage.text || currentPage.imagePrompt || book.prompt,
  });

  const currentImageSrc = imageErrorMap[currentPageIndex]
    ? dynamicCraftArt
    : (getImageUrl(currentPage.image) || getImageUrl(book.coverImage) || dynamicCraftArt);

  const hasPrev = currentPageIndex > 0;
  const hasNext = currentPageIndex < totalPages - 1;

  const styleLabels = {
    comic: 'Color Comic',
    comic_color: 'Color Comic',
    comic_bw: 'Black & White Ink',
    ink: 'Black & White Ink',
    storybook: 'Storybook Watercolor',
    watercolor: 'Storybook Watercolor',
  };

  // Modern ElevenLabs voices that sound like a real narrator (not old robotic premades)
  const elevenLabsVoices = [
    { voiceURI: 'eleven_jessica', voiceId: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica — natural storyteller' },
    { voiceURI: 'eleven_chris', voiceId: 'iP95p4xoKVk53GoZ742B', name: 'Chris — natural male' },
    { voiceURI: 'eleven_george', voiceId: 'JBFqnCBsd6RMkjVDRZzb', name: 'George — warm British' },
    { voiceURI: 'eleven_lily', voiceId: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily — soft British' },
    { voiceURI: 'eleven_matilda', voiceId: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda — gentle bedtime' },
    { voiceURI: 'eleven_sarah', voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah — clear female' },
  ];

  // Filter browser voices matching current story language
  const langCodeMap = {
    English: 'en',
    Spanish: 'es',
    French: 'fr',
    German: 'de',
    Hindi: 'hi',
    Bengali: 'bn',
    Japanese: 'ja',
    Italian: 'it',
    Portuguese: 'pt',
  };
  const targetBaseLang = (book?.language && langCodeMap[book.language]) ? langCodeMap[book.language] : 'en';

  const matchingLangVoices = availableVoices.filter((v) =>
    v && typeof v.lang === 'string' && v.lang.toLowerCase().startsWith(targetBaseLang.toLowerCase())
  );
  const displayBrowserVoices = matchingLangVoices.length > 0 ? matchingLangVoices : availableVoices;

  // Unified voice list containing ElevenLabs real voices + browser natural voices
  const allVoiceOptions = [...elevenLabsVoices, ...displayBrowserVoices];

  const handleSetApiKeyPrompt = () => {
    const current = localStorage.getItem('elevenlabs_api_key') || '';
    const input = window.prompt('Enter your ElevenLabs API Key (from elevenlabs.io):', current);
    if (input !== null) {
      localStorage.setItem('elevenlabs_api_key', input.trim());
      alert(input.trim() ? 'ElevenLabs API key saved!' : 'ElevenLabs API key cleared.');
    }
  };

  const handleToggleNarration = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    if (!currentPage || !currentPage.text) return;

    setIsAudioLoading(true);

    const customKey = localStorage.getItem('elevenlabs_api_key') || '';
    const selectedElevenOption = elevenLabsVoices.find((v) => v.voiceURI === selectedVoiceURI);
    const targetVoiceId = selectedElevenOption ? selectedElevenOption.voiceId : null;

    try {
      // 1. Try ElevenLabs / Google Natural server TTS endpoint
      const result = await fetchStoryAudio(currentPage.text, book?.language, targetVoiceId, customKey);

      if (result && result.audioUrl) {
        const audio = new Audio(result.audioUrl);
        audio.playbackRate = speechSpeed;
        audioRef.current = audio;
        audio.onended = () => {
          setIsPlaying(false);
          setIsAudioLoading(false);
        };
        audio.onerror = () => {
          fallbackWebSpeech();
        };
        await audio.play();
        setIsPlaying(true);
        setIsAudioLoading(false);
        return;
      }
    } catch (err) {
      console.warn('[Narration] Server TTS failed, falling back to Web Speech:', err);
    }

    fallbackWebSpeech();
  };

  const fallbackWebSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      setIsAudioLoading(false);
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(currentPage.text);
    
    // Target language mapping
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
    const targetLang = (book?.language && langMap[book.language]) ? langMap[book.language] : 'en-US';
    utterance.lang = targetLang;

    // Apply user selected voice or best available voice
    const voices = availableVoices.length > 0 ? availableVoices : (window.speechSynthesis.getVoices() || []);
    if (voices.length > 0) {
      const chosenVoice = voices.find((v) => v.voiceURI === selectedVoiceURI);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      } else if (displayBrowserVoices.length > 0) {
        const natural = displayBrowserVoices.find((v) =>
          /google|aria|jenny|samantha|natural|neural/i.test(v.name)
        );
        utterance.voice = natural || displayBrowserVoices[0];
      }
    }

    // Gentle, warm human storyteller pace and lower warm pitch
    utterance.rate = speechSpeed;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsAudioLoading(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsAudioLoading(false);
    };

    utterance.onerror = (err) => {
      console.warn('[TTS] Speech synthesis error:', err);
      // Fallback retry without specific voice object if custom voice failed
      if (utterance.voice) {
        const retryUtterance = new SpeechSynthesisUtterance(currentPage.text);
        retryUtterance.lang = targetLang;
        retryUtterance.rate = speechSpeed;
        retryUtterance.pitch = 1.0;
        retryUtterance.onstart = () => { setIsPlaying(true); setIsAudioLoading(false); };
        retryUtterance.onend = () => { setIsPlaying(false); setIsAudioLoading(false); };
        retryUtterance.onerror = () => { setIsPlaying(false); setIsAudioLoading(false); };
        window.speechSynthesis.speak(retryUtterance);
      } else {
        setIsPlaying(false);
        setIsAudioLoading(false);
      }
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsAudioLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[#D4E8FA] flex flex-col justify-between overflow-x-hidden">
      <FloatingClouds variant="subtle" />
      <Navbar />

      <main className="relative z-20 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 pt-6 pb-16">
        {/* Navigation & Book Info bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-black bg-white/80 backdrop-blur-xs px-4 py-2 rounded-full border border-white/90 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Bookshelf</span>
          </Link>

          <div className="flex items-center space-x-2">
            {book.language && (
              <span className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-full font-semibold flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>{book.language}</span>
              </span>
            )}
            <span className="text-xs bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/90 text-stone-700 font-medium">
              {styleLabels[book.style] || book.style}
            </span>
            <span className="text-xs bg-[#0D1116] text-white px-3 py-1.5 rounded-full font-medium">
              Page {currentPageIndex + 1} of {totalPages}
            </span>
          </div>
        </div>

        {/* Reader Book Spread Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl sm:rounded-[36px] border-2 border-white/95 shadow-[0_28px_60px_rgba(20,45,75,0.12)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
            {/* Left Column: Illustrated Art */}
            <div className="md:col-span-6 bg-stone-100 relative min-h-[320px] md:min-h-[520px] overflow-hidden flex items-center justify-center">
              <img
                src={currentImageSrc}
                alt={currentPage.title || book.title}
                onError={() => {
                  setImageErrorMap((prev) => ({ ...prev, [currentPageIndex]: true }));
                }}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
              {currentPage.caption && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-xs text-white/90 text-xs px-3 py-1.5 rounded-xl text-center">
                  {currentPage.caption}
                </div>
              )}
            </div>

            {/* Right Column: Narrative Storybook Prose */}
            <div className="md:col-span-6 p-6 sm:p-10 flex flex-col justify-between bg-white">
              <div>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Chapter {currentPage.pageNumber || currentPageIndex + 1}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Voice Selector Dropdown */}
                    <select
                      value={selectedVoiceURI}
                      onChange={(e) => {
                        setSelectedVoiceURI(e.target.value);
                        if (isPlaying) {
                          stopAudio();
                        }
                      }}
                      className="text-xs bg-stone-100 border border-stone-200 text-stone-800 font-semibold px-2.5 py-1.5 rounded-full outline-none focus:ring-1 focus:ring-amber-500 max-w-[150px] sm:max-w-[190px] truncate cursor-pointer shadow-2xs"
                      title="Choose narrator voice"
                    >
                      <optgroup label="Real narration voices">
                        {elevenLabsVoices.map((voice) => (
                          <option key={voice.voiceURI} value={voice.voiceURI}>
                            {voice.name}
                          </option>
                        ))}
                      </optgroup>
                      {displayBrowserVoices.length > 0 && (
                        <optgroup label="Browser Speech Voices">
                          {displayBrowserVoices.map((voice) => (
                            <option key={voice.voiceURI} value={voice.voiceURI}>
                              🎙️ {voice.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>

                    {/* ElevenLabs API Key Config Button */}
                    <button
                      type="button"
                      onClick={handleSetApiKeyPrompt}
                      className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-2 py-1.5 rounded-full transition-colors cursor-pointer border border-stone-200"
                      title="Configure ElevenLabs API Key"
                    >
                      🔑 Key
                    </button>

                    {/* Speed Selector */}
                    <div className="inline-flex bg-stone-100 p-0.5 rounded-full text-[10px] font-semibold text-stone-600">
                      {[
                        { speed: 0.9, label: 'Slow' },
                        { speed: 1.0, label: 'Natural' },
                        { speed: 1.1, label: 'Lively' },
                      ].map((item) => (
                        <button
                          key={item.speed}
                          type="button"
                          onClick={() => handleSpeedChange(item.speed)}
                          className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                            speechSpeed === item.speed
                              ? 'bg-amber-500 text-white shadow-2xs font-bold'
                              : 'hover:text-stone-900'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Voice Narration Button */}
                    <button
                      type="button"
                      onClick={handleToggleNarration}
                      disabled={isAudioLoading}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                        isPlaying
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                    >
                      {isAudioLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Loading voice...</span>
                        </>
                      ) : isPlaying ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Read Out Loud</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <h2 className="font-craft-serif text-2xl sm:text-3xl font-normal text-stone-900 mb-6 leading-tight">
                  {currentPage.title || book.title}
                </h2>
                <div className="prose prose-stone text-stone-700 text-base sm:text-lg leading-relaxed font-serif">
                  <p>{currentPage.text}</p>
                </div>
              </div>

              {/* Spread Controls */}
              <div className="pt-8 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={!hasPrev}
                  onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-700 hover:text-black disabled:opacity-30 disabled:hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-1">
                  {pages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPageIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        currentPageIndex === idx
                          ? 'bg-[#0D1116] w-6'
                          : 'bg-stone-200 hover:bg-stone-300'
                      }`}
                      aria-label={`Go to page ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!hasNext}
                  onClick={() => setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-[#0D1116] hover:bg-[#252A34] disabled:opacity-30 px-4 py-2 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-20 py-4 text-center text-xs text-stone-500">
        Storyverse &bull; Illustrated storybooks
      </footer>
    </div>
  );
}
