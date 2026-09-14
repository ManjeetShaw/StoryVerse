import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Play,
  Search,
  X,
  Check,
  BookOpen,
  Sparkles,
  Wand2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Layers,
  Palette,
  Feather,
  Clock,
  Users,
  Image,
  Brush
} from 'lucide-react';

const ART_STYLES = [
  {
    id: 'watercolor',
    title: 'Storybook Watercolor',
    description: 'Soft washes, gentle paper bleed, and luminous dreamlike tones',
    badge: 'Classic',
    previewColor: 'from-amber-100 to-sky-100 border-amber-200'
  },
  {
    id: 'comic',
    title: 'Color Comic',
    description: 'Crisp line art, dynamic panels, and rich saturated pigments',
    badge: 'Vibrant',
    previewColor: 'from-rose-100 to-indigo-100 border-rose-200'
  },
  {
    id: 'ink',
    title: 'Black & White Ink',
    description: 'Atmospheric cross-hatching, deep shadows, and archival texture',
    badge: 'Timeless',
    previewColor: 'from-stone-100 to-stone-200 border-stone-300'
  }
];

const LOADING_MESSAGES = [
  'Sketching page 1 of 8...',
  'Weaving the narrative...',
  'Painting watercolor skies...',
  'Sketching page 3 of 8...',
  'Lettering the dialogue...',
  'Detailing character expressions...',
  'Sketching page 7 of 8...',
  'Binding your hardcover edition...'
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Modal & Screen states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [isBookshelfOpen, setIsBookshelfOpen] = useState(false);
  const [bookshelfEmpty, setBookshelfEmpty] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Story creation state
  const [promptText, setPromptText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('watercolor');
  const [readerPage, setReaderPage] = useState(0);

  const handleStartBook = () => {
    if (isAuthenticated || localStorage.getItem('storyverse_token')) {
      navigate('/create');
    } else {
      navigate('/login');
    }
  };

  const handleGoToBookshelf = () => {
    if (isAuthenticated || localStorage.getItem('storyverse_token')) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  // Rotate generating status lines
  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= LOADING_MESSAGES.length - 1) {
            clearInterval(interval);
            setIsGenerating(false);
            setIsReaderOpen(true);
            return 0;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleStartGeneration = (e) => {
    if (e) e.preventDefault();
    setIsCreateOpen(false);
    setIsGenerating(true);
    setLoadingStep(0);
  };

  const sampleBookPages = [
    {
      pageNumber: 1,
      title: "The Horizon Tilts",
      text: "Oliver first noticed the change when his teacup slid horizontally across the kitchen table. Outside, the cobblestones curved upward into the sky, where trams glided along vertical facades without spilling a single passenger.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbn674iMCijkvfkMueFK3ptfVbZgk9v5RzgPBs4SHXD5UVEoUatrtZzYZfDFVDVoNMED9vdDACnKRgnF6zBfwOfNj_533Gp3TJSSPbhgrsFeEZ6U1zGuJKKQZaq10julQWuh8mc9z3AyqHH93eMbe5RMuzxZ0Jq2OFbuqvSY-mpAV9-KbFB2LCl1TB8y3cnxhgzTNwJUi22ZRA6Yq7B4Laiugzmu7rc0rEaAPnnxAGStSa41u8tmh7",
      caption: "Streets built sideways against the dawn"
    },
    {
      pageNumber: 2,
      title: "Steps Along the Wall",
      text: "Stepping off his front porch, he did not fall downward. He stepped directly onto the brick wall of the clocktower. Rain fell toward the west, like silver threads carried by an invisible hand through the sleepy avenue.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDezYQgC1FdbbgwZrsQe6JKal1KvTBhsZ_SExmStBeH1cusjuJRHm1G-zDxm4jtD22YLXOqwTdHEbaxrBHSfuWbtPJ6Xm75stvvrCzHAu9yfJoXouRZOd6aJrGD0Grw51ABpb4XuZHbJfceECyi2EVhNpSlWbgvXfENFtJcd6psl4WOjWrM81cFpu3FEDaCZh_Q9FOdYCnJzFc33Xt4OXoj45UWycsinyfuMh32YNNaeq-2xYbgedlJ",
      caption: "Oliver tests the sideways gravity with a copper key"
    },
    {
      pageNumber: 3,
      title: "The Floating Cartographer",
      text: "High above the rooftop garden, an elderly woman in velvet spectacles was rolling up a map of the city. 'Do not fight the lean,' she advised gently. 'In Storyverse, directions answer to whichever dream you speak aloud.'",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH9Oo-jkhLoQ7bqQOdPL7ROrQr64fFp0mcoVw-wxFVgAA2XSp1OlYNRj4EfUpHQtLDncJLmyImjTxSxTOJcsf89f0ki3EMfolUWK0wRZ1LCL8XtkOxjPDQhRqeccvuB-us9tqEslcmbYesKw5psVsMSFOJ1iAGTlwMF621Wgc7Hy95ELUD379oZq9jHaWSVCNbT4M7Z626cOCuaL-34WiC2LMbjFP6Lnsu4W1osNfmILRmyfF-XPYB",
      caption: "The evening bells ringing sideways across the clouds"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-[#94c5ec] via-[#89bfeb] to-[#7db4e4] text-[#111317] font-sans antialiased selection:bg-[#F8E7A2] selection:text-black overflow-x-hidden relative min-h-screen">

      {/* BEGIN: FloatingSkyBackground */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" data-purpose="background-collage">
        {/* Halftone Texture Overlay */}
        <div className="absolute inset-0 halftone-dots"></div>
        {/* Soft Authentic Clouds */}
        <div className="absolute -top-10 -left-20 w-[480px] h-[360px] rounded-full bg-white/55 blur-3xl"></div>
        <div className="absolute top-20 right-[-100px] w-[620px] h-[580px] rounded-full bg-white/50 blur-3xl"></div>
        <div className="absolute top-72 left-1/4 w-[750px] h-[400px] rounded-full bg-white/40 blur-2xl"></div>
        <div className="absolute bottom-40 right-1/4 w-[500px] h-[300px] rounded-full bg-[#E5F1FC]/60 blur-2xl"></div>
        {/* Subtle Architectural Orbit / Draft Curves */}
        <svg
          className="absolute top-4 left-6 w-[1250px] h-[850px] opacity-60 pointer-events-none"
          fill="none"
          stroke="#F75A00"
          style={{ stroke: '#F75A00' }}
          strokeWidth="1.6"
          viewBox="0 0 1250 850"
        >
          <path d="M 40,320 C 200,160 360,420 540,240 C 720,80 880,260 1040,180 C 1140,140 1200,190 1240,170" stroke="#F75A00" strokeDasharray="3 3"></path>
          <path d="M 90,440 C 280,310 440,510 630,370 C 810,250 960,400 1140,300" stroke="#F75A00"></path>
          <circle cx="230" cy="180" opacity="0.7" r="130" stroke="#F75A00" strokeDasharray="4 4"></circle>
          <circle cx="890" cy="200" opacity="0.4" r="180" stroke="#F75A00" strokeDasharray="5 5"></circle>
          <circle cx="110" cy="560" opacity="0.7" r="70" stroke="#F75A00" strokeDasharray="3 3"></circle>
        </svg>
      </div>
      {/* END: FloatingSkyBackground */}

      {/* BEGIN: MainHeader (Floating pill navbar matching Craft style) */}
      <header className="relative z-50 pt-6 px-4 sm:px-8 max-w-7xl mx-auto" data-purpose="global-navigation">
        <nav className="bg-white/90 backdrop-blur-md border border-white/80 rounded-full px-6 py-2.5 flex items-center justify-between shadow-[0_8px_25px_rgba(20,40,65,0.07)]">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-2.5 group cursor-pointer focus:outline-hidden"
          >
            <div className="flex items-center text-[#111317]">
              {/* Storyverse Geometric Glyph */}
              <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105 duration-200">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-black ml-1.5 font-sans">STORYVERSE</span>
            </div>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-7 text-[14.5px] font-medium text-[#232933]">
            <a
              href="#how-it-works"
              className="hover:text-black transition-colors cursor-pointer"
            >
              How it works
            </a>
            <button
              type="button"
              onClick={handleStartBook}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Art styles
            </button>
            <button
              type="button"
              onClick={handleGoToBookshelf}
              className="hover:text-black transition-colors cursor-pointer"
            >
              Bookshelf
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleGoToBookshelf}
                className="bg-[#101318] hover:bg-[#252A34] text-white text-[14px] font-medium px-5 py-2.5 rounded-full transition-all duration-150 transform hover:scale-[1.02] active:scale-98 craft-btn-shadow inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <span>My Bookshelf</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[14.5px] font-medium text-[#232933] hover:text-black transition-colors px-2 py-1 cursor-pointer"
                >
                  Log in
                </Link>
                <button
                  type="button"
                  onClick={handleStartBook}
                  className="bg-[#101318] hover:bg-[#252A34] text-white text-[14px] font-medium px-5 py-2.5 rounded-full transition-all duration-150 transform hover:scale-[1.02] active:scale-98 craft-btn-shadow inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Start your book</span>
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: Hero Section with Filmstrip Movie Reel Gallery */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 pt-8 lg:pt-14 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">

          {/* LEFT COLUMN: Editorial Headline, Subheading & CTAs (~52% width) */}
          <section className="lg:col-span-6 xl:col-span-6 flex flex-col items-start pr-0 lg:pr-4" data-purpose="hero-copywriting">
            {/* Badge Pill */}
            <div className="inline-flex items-center space-x-2.5 bg-white/80 border border-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wide text-[#1E2E3E] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="uppercase tracking-wider text-[11px] font-bold">STORYVERSE 1.0</span>
              <span className="text-gray-300">|</span>
              <span className="font-normal text-stone-700">The illustrated storybook studio</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-craft-serif text-5xl sm:text-6xl xl:text-[68px] font-normal leading-[1.07] tracking-[-0.025em] text-[#0A0E13] mb-6">
              Turn your dream into a <span className="italic font-normal bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                storybook
              </span>
            </h1>

            {/* Subheading - explains idea -> pick style -> get illustrated book in one line */}
            <p className="text-lg sm:text-[20px] text-[#243547] font-normal leading-relaxed max-w-xl mb-8">
              Describe any idea, choose an art style, and receive an illustrated book with story prose and AI art for every page.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                type="button"
                onClick={handleStartBook}
                className="bg-[#0D1116] hover:bg-[#222832] text-white text-[15px] font-medium px-7 py-3.5 rounded-full craft-btn-shadow transition-all duration-200 transform hover:-translate-y-0.5 inline-flex items-center space-x-2 group cursor-pointer"
              >
                <span>Start your book</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(true)}
                className="bg-white/85 hover:bg-white text-[#1A232D] border border-white/90 text-[15px] font-medium px-6 py-3.5 rounded-full transition-all duration-150 inline-flex items-center space-x-2 shadow-xs hover:shadow-sm cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 text-emerald-600 fill-current ml-0.5" />
                </div>
                <span>See how it works</span>
              </button>
            </div>

            {/* Social Proof / Community Endorsement */}
            <div className="flex items-center space-x-3 pt-2 border-t border-[#76A6CB]/40 w-full max-w-md">
              <div className="flex -space-x-2 overflow-hidden py-1">
                <img
                  alt="Storyteller member"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1fZv0rJFi2j_CpnuOxSkBS_554liY-gfwYG0rqAbmfCqclAc23cs_VKLm-XqvOi5-XHI_5vHich3aWzgTteXDAmpFhIFypEnc5KyHtyH34YiwE9_wSB0AG7jLPlh0Qx107cubZq21uITORokn_44RsrBdUrVXFnr84hYAlLNkZH4iuLpTELBZ2qprq6O-9TuthZuK2Ah_Sq8xlgqYlzQpGkPn2bkktHac0orM_LCllOpDUSh0tk-O"
                />
                <img
                  alt="Storyteller member"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9trjNr2iCMHC4y12tRtCMIVZC6F59p_LxPeGGFz3rpJnngvEYKR5kFZBkkWQplRBm5nhRthyyUxv1q-F4a4eO8XSSF6o8JArbENTfntfPzwfdgLHwe1icwpl69yXDRI07mysJbPBUnjd8b9KLIt1z7n38Syx_0q1vFXoCnGuw8mq6hX3VrATC6yZPXVO5dJt61oHgsPB5NIf5tzGnlhmRjSDYFbTda6eUeezwfNTCwpCJSKlmUAqL"
                />
                <img
                  alt="Storyteller member"
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBNa-GqPozBPFvPptnY78Nc_kgTLorfTuSmbelt9yDlUb1zF4OIkDle9djX6wHKyGLM6aGfi-HDFafsvz-AjhfC_0kT2sqPvXU956gJkkTUcTwgK6U1j-5PizfCerxDoZhDJzwe7z42OK-KPmkyIvW9iO4MTCBvlu9wiaNeISQZcPkaAfB0jQkttSbMK4aiLj11-FfIo6O9Ir8shV50f_46z7bsltTg0-bLmmfmZgCtPha52eE5hO-"
                />
                <div className="h-8 w-8 rounded-full bg-[#1A2530] text-white flex items-center justify-center text-[11px] font-semibold ring-2 ring-white">2M+</div>
              </div>
              <p className="text-xs sm:text-[13px] text-[#1E3347] font-medium leading-snug">
                Loved by over <strong className="font-semibold text-black">2,000,000</strong> dreamers, writers &amp; storytellers worldwide.
              </p>
            </div>
          </section>

          {/* RIGHT COLUMN: Animated Dual Movie Reel / Filmstrip Gallery (~48% width) */}
          <section className="lg:col-span-6 xl:col-span-6 relative pause-on-hover" data-purpose="movie-reel-gallery">
            {/* Collage Accents: Hand-crafted Washi Tape & Notes */}
            <div className="absolute -top-6 right-12 z-30 w-28 h-7 bg-[#F7EECE]/90 rotate-[-7deg] shadow-xs backdrop-blur-xs border-t border-b border-[#E3D49B]/70 rounded-xs pointer-events-none"></div>
            <div className="absolute -bottom-5 left-1/4 z-30 w-32 h-6 bg-[#FFFFFF]/85 rotate-[4deg] shadow-xs pointer-events-none border-l-2 border-r-2 border-dashed border-gray-400/50"></div>
            <div className="absolute bottom-8 right-4 z-30 p-3 bg-[#FFFEEA] border border-[#EBE3A8] rounded-xl shadow-lg rotate-1 flex items-center space-x-2.5 max-w-[230px] pointer-events-none">
              <span className="text-lg">✨</span>
              <span className="text-xs font-serif italic text-stone-800">"The most magical way to bring bedtime stories to life."</span>
            </div>

            {/* Movie Reel Mask Container (Fade top & bottom gradients) */}
            <div className="relative h-[620px] overflow-hidden rounded-3xl p-1.5 border border-white/60 bg-white/20 backdrop-blur-xs shadow-[0_20px_50px_rgba(20,50,80,0.12)]">
              {/* Top & Bottom Gradient Fades for continuous roll illusion */}
              <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#8ebfe8] to-transparent z-20 pointer-events-none"></div>
              <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#82b7e5] to-transparent z-20 pointer-events-none"></div>

              {/* Dual Filmstrip Columns */}
              <div className="grid grid-cols-2 gap-4 h-full">

                {/* REEL 1: Upward scrolling filmstrip */}
                <div className="overflow-hidden relative h-full">
                  <div className="animate-reel-up space-y-4">
                    {/* Card 1: Story & Drafts */}
                    <div
                      onClick={() => setIsCreateOpen(true)}
                      className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90 cursor-pointer"
                    >
                      <div className="h-52 w-full overflow-hidden">
                        <img
                          alt="Journal and sketches with handwritten drafts"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src="/images/1003w-GM1wXo5InOY.webp"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">Story &amp; Drafts</span>
                        <p className="text-xs text-stone-200 mt-1 font-craft-serif">Tactile reflections &amp; sketches</p>
                      </div>
                    </div>

                    {/* Card 2: Architecture of ideas (Tall) */}
                    <div
                      onClick={() => setIsCreateOpen(true)}
                      className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90 cursor-pointer"
                    >
                      <div className="h-64 w-full overflow-hidden">
                        <img
                          alt="Storyteller planning world lore"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src="/images/1003w-PBwcHocJab8.webp"
                        />
                      </div>
                      <div className="absolute top-3 left-3 bg-[#FBF9F5]/95 backdrop-blur-sm rounded-md px-2.5 py-1 shadow-xs border border-[#E5DFD4]">
                        <p className="text-[11px] font-semibold text-stone-800">Visual Boards</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="font-craft-serif text-base font-normal leading-tight">Architecture of ideas</p>
                        <p className="text-[11px] text-gray-200 mt-0.5">Collect references with care</p>
                      </div>
                    </div>

                    {/* Card 3: Studio notes */}
                    <div
                      onClick={() => setIsCreateOpen(true)}
                      className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90 cursor-pointer"
                    >
                      <div className="h-40 w-full overflow-hidden">
                        <img
                          alt="Desk with fountain pen, open storybook and warm tea"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src="/images/images (4).jfif"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2.5 left-3 text-white">
                        <span className="text-[10px] font-medium tracking-wide uppercase bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">Studio Notes</span>
                      </div>
                    </div>

                    {/* Card 4: Typography Study */}
                    <div
                      onClick={() => setIsCreateOpen(true)}
                      className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90 cursor-pointer"
                    >
                      <div className="h-56 w-full overflow-hidden">
                        <img
                          alt="Typography swatches and illustrated storybook prints"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src="/images/images (5).jfif"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/80 px-2 py-0.5 rounded-full">Story Typography</span>
                        <p className="font-craft-serif text-sm font-medium mt-1">Refined storybook layouts</p>
                      </div>
                    </div>

                    {/* Reel 1 - Duplicate Set for infinite loop */}
                    <div className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90">
                      <div className="h-52 w-full overflow-hidden">
                        <img
                          alt="Journal and sketches with handwritten drafts"
                          className="w-full h-full object-cover"
                          src="/images/images (6).jfif"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">Story &amp; Drafts</span>
                        <p className="text-xs text-stone-200 mt-1 font-craft-serif">Tactile reflections &amp; sketches</p>
                      </div>
                    </div>

                    <div className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90">
                      <div className="h-64 w-full overflow-hidden">
                        <img
                          alt="Storyteller reading lore books"
                          className="w-full h-full object-cover"
                          src="/images/images (8).jfif"
                        />
                      </div>
                      <div className="absolute top-3 left-3 bg-[#FBF9F5]/95 backdrop-blur-sm rounded-md px-2.5 py-1 shadow-xs border border-[#E5DFD4]">
                        <p className="text-[11px] font-semibold text-stone-800">Visual Boards</p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="font-craft-serif text-base font-normal leading-tight">Architecture of ideas</p>
                        <p className="text-[11px] text-gray-200 mt-0.5">Collect references with care</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* REEL 2: Downward scrolling filmstrip */}
                <div className="overflow-hidden relative h-full">
                  <div className="animate-reel-down space-y-4">
                    {/* Card 5: Daily Focus (Sunlit desk) */}
                    <div
                      onClick={() => setIsCreateOpen(true)}
                      className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90 cursor-pointer"
                    >
                      <div className="h-56 w-full overflow-hidden">
                        <img
                          alt="Sunny creative desk with story notes and laptop"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src="/images/images (8).jfif"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-full">Daily Chapter</span>
                        <p className="font-craft-serif text-base font-medium mt-1">Deep, quiet writing</p>
                      </div>
                    </div>

                    {/* Card 6: Sticky Notes & Brainstorming Board */}
                    <div
                      onClick={() => setIsCreateOpen(true)}
                      className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90 cursor-pointer"
                    >
                      <div className="h-60 w-full overflow-hidden">
                        <img
                          alt="Arranging plot cards and story chapters on board"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src="/images/images.jfif"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="flex items-center space-x-1.5 text-xs text-amber-200">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="font-medium">Curated Thinking</span>
                        </div>
                        <p className="text-xs text-gray-200 mt-1 font-craft-serif">Connect story threads</p>
                      </div>
                    </div>

                    {/* Card 7: Creative Direction / Art Direction */}
                    <div
                      onClick={() => setIsCreateOpen(true)}
                      className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90 cursor-pointer"
                    >
                      <div className="h-44 w-full overflow-hidden">
                        <img
                          alt="Minimal creative layout with camera and storybooks"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src="/images/images (3).jfif"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2.5 left-3 text-white">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-full">Art Direction</span>
                      </div>
                    </div>

                    {/* Card 8: Design Systems / Art Styles */}
                    <div
                      onClick={() => setIsCreateOpen(true)}
                      className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90 cursor-pointer"
                    >
                      <div className="h-52 w-full overflow-hidden">
                        <img
                          alt="Desk with watercolor palettes and illustrations"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src="/images/97f1740c3b4e5a9b02984e10afddf608.jpg"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/80 px-2 py-0.5 rounded-full">Art Styles</span>
                        <p className="text-xs text-gray-200 mt-1">Harmonious story world</p>
                      </div>
                    </div>

                    {/* Reel 2 - Duplicate Set for infinite loop */}
                    <div className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90">
                      <div className="h-56 w-full overflow-hidden">
                        <img
                          alt="Sunny creative desk with story notes and laptop"
                          className="w-full h-full object-cover"
                          src="/images/1003w-GM1wXo5InOY.webp"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-full">Daily Chapter</span>
                        <p className="font-craft-serif text-base font-medium mt-1">Deep, quiet writing</p>
                      </div>
                    </div>

                    <div className="group relative rounded-2xl overflow-hidden craft-card-shadow bg-white border-2 border-white/90">
                      <div className="h-60 w-full overflow-hidden">
                        <img
                          alt="Arranging plot cards and story chapters on board"
                          className="w-full h-full object-cover"
                          src="/images/1003w-PBwcHocJab8.webp"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="flex items-center space-x-1.5 text-xs text-amber-200">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          <span className="font-medium">Curated Thinking</span>
                        </div>
                        <p className="text-xs text-gray-200 mt-1 font-craft-serif">Connect story threads</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </main>
      {/* END: Hero Section */}

      {/* BEGIN: BelowHeroAppTeaser (Craft Signature Torn Paper & App Window) */}
      <section className="relative z-30 mt-4 sm:mt-10 overflow-hidden" data-purpose="craft-app-preview-teaser">
        <div className="relative w-full">
          {/* Top Paper Tear layer (Soft Lavender / Violet deckle edge) */}
          <div className="w-full h-16 bg-[#DDD6EC]/85 torn-paper-edge-top transform translate-y-3.5"></div>

          {/* Middle torn deckle layer (Warm white paper canvas) */}
          <div className="w-full bg-[#FAF8F5] pt-8 px-4 sm:px-10 pb-4 border-t border-[#ECE5DA] shadow-[0_-24px_55px_rgba(20,40,65,0.08)]">
            {/* Mac Window Preview Container */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.18)] border border-[#E5DFD4] overflow-hidden">

              {/* macOS Window Titlebar */}
              <div className="bg-[#F8F7F4] px-5 py-3.5 border-b border-[#ECE7DE] flex items-center justify-between">
                {/* Window traffic lights */}
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#ED6A5E] border border-[#D14F44]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#F5BF4F] border border-[#D7A233]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#62C655] border border-[#48A73C]"></div>
                  <div
                    onClick={() => {
                      setBookshelfEmpty(false);
                      setIsBookshelfOpen(true);
                    }}
                    className="ml-4 text-stone-400 hover:text-stone-700 cursor-pointer"
                    title="View Bookshelf"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6h16M4 12h16M4 18h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                </div>

                {/* Window Center Breadcrumb / Tab */}
                <div className="flex items-center bg-white border border-[#E2DDD3] rounded-full px-4 py-1 text-xs font-medium text-stone-700 shadow-2xs">
                  <span className="text-amber-500 mr-1.5">📚</span> Bookshelf
                </div>

                {/* Search & User Avatar */}
                <div className="flex items-center space-x-3 text-stone-400 text-xs">
                  <div
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center space-x-1.5 bg-white border border-stone-200 rounded-md px-2.5 py-1 text-stone-500 shadow-2xs cursor-pointer hover:border-stone-400 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search stories</span>
                    <kbd className="text-[10px] bg-stone-100 px-1 rounded text-stone-400 border border-stone-200">⌘K</kbd>
                  </div>
                  <div
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthOpen(true);
                    }}
                    className="w-6 h-6 rounded-full bg-[#FCE5D8] flex items-center justify-center text-[10px] text-[#A64A17] font-bold ring-1 ring-[#F4C9B3] cursor-pointer"
                    title="User account"
                  >
                    J
                  </div>
                </div>
              </div>

              {/* Document Workspace Mockup Grid */}
              <div className="p-6 sm:p-8 bg-[#FAF9F7] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                {/* Card 1: Story in Progress (Warm Pink) */}
                <div
                  onClick={() => setIsReaderOpen(true)}
                  className="bg-[#FFF3F3] border border-[#FCDCDC] rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-[#8B3A3A] group-hover:underline">The Sideways City</h4>
                    <span className="text-xs bg-[#FFE5E5] text-[#C44343] px-2 py-0.5 rounded-full font-medium">8 pages</span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                    A quiet journey through streets where gravity tilts westward and lamplight paints the rooftops.
                  </p>
                  <div className="h-1.5 w-full bg-[#F5D5D5] rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-[#D9534F] rounded-full"></div>
                  </div>
                </div>

                {/* Card 2: Art Style Picker (Clean White) */}
                <div
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-white border border-[#EAE5DC] rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-stone-800">Art style picker</h4>
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">Styles</span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-stone-500">
                    <li className="flex items-center"><span className="text-emerald-500 mr-1.5 font-bold">✓</span> Color Comic</li>
                    <li className="flex items-center"><span className="text-emerald-500 mr-1.5 font-bold">✓</span> Black &amp; White Ink</li>
                    <li className="flex items-center"><span className="text-stone-400 mr-1.5">○</span> Storybook Watercolor</li>
                  </ul>
                </div>

                {/* Card 3: Generating/Loading Preview Card (Pastel Yellow) */}
                <div
                  onClick={() => {
                    setIsGenerating(true);
                    setLoadingStep(3); // Shows "Sketching page 3 of 8..."
                  }}
                  className="bg-[#FFFDE8] border border-[#F2EA9F] rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-[#7A6A12]">Generating story</h4>
                    <span className="text-[11px] bg-[#F7EEA9] text-[#7A6A12] px-2 py-0.5 rounded-full font-medium">In progress</span>
                  </div>
                  <p className="text-xs text-stone-600 mb-2 font-mono text-[11px]">
                    Sketching page 3 of 8...
                  </p>
                  <span className="text-[11px] font-medium text-amber-700 underline">View progress →</span>
                </div>

                {/* Card 4: Bookshelf Empty State (Pastel Green) */}
                <div
                  onClick={() => {
                    setBookshelfEmpty(true);
                    setIsBookshelfOpen(true);
                  }}
                  className="bg-[#ECF7EF] border border-[#C6E8CE] rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-[#256838]">Your bookshelf</h4>
                    <span className="text-[11px] bg-[#D3EED9] text-[#256838] px-2 py-0.5 rounded-full font-medium">Empty state</span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 mb-2">
                    Your bookshelf is empty — write your first story
                  </p>
                  <span className="text-[11px] text-[#256838] font-medium underline">Start a story →</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: BelowHeroAppTeaser */}

      {/* BEGIN: Homepage Sections Continuation (Airy Sky Canvas & Floating Clouds) */}
      <div className="relative z-30 overflow-hidden">
        {/* Subtly continuing floating clouds as the user scrolls */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-12 -left-20 w-[540px] h-[360px] rounded-full bg-white/55 blur-3xl"></div>
          <div className="absolute top-1/4 -right-20 w-[620px] h-[460px] rounded-full bg-white/45 blur-3xl"></div>
          <div className="absolute top-1/2 left-8 w-[580px] h-[390px] rounded-full bg-white/40 blur-3xl"></div>
          <div className="absolute top-3/4 -right-16 w-[560px] h-[400px] rounded-full bg-[#E3F0FB]/60 blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-[600px] h-[350px] rounded-full bg-white/50 blur-3xl"></div>

          {/* Subtle architectural orbit / draft curve continuation */}
          <svg className="absolute top-16 right-0 w-[1100px] h-[800px] opacity-20 stroke-[#13436B]" fill="none" strokeWidth="1.2" viewBox="0 0 1100 800">
            <path d="M 80 450 C 380 120, 780 700, 1060 320" strokeDasharray="6,6" />
            <circle cx="720" cy="460" r="190" />
            <circle cx="720" cy="460" r="3.5" fill="#13436B" />
          </svg>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 1. HOW IT WORKS                                              */}
        {/* ------------------------------------------------------------ */}
        <section id="how-it-works" className="pt-20 sm:pt-28 pb-16 sm:pb-24 max-w-6xl mx-auto px-5 sm:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[#13436B] text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs border border-white/90">
              <Sparkles className="w-3.5 h-3.5 text-[#24639B]" />
              <span>How it works</span>
            </div>
            <h2 className="font-craft-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-[#0A0E13] tracking-tight leading-tight mb-4">
              From an inkling of an idea to a finished book
            </h2>
            <p className="text-sm sm:text-base text-[#1E3A52] leading-relaxed">
              Three simple steps to transform an imaginative thought, bedtime tale, or visual world into an illustrated hardcover book.
            </p>
          </div>

          {/* 3-Step Horizontal Row - Clean cards, no numbers-in-circles cliché */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1: Type your idea */}
            <div className="group bg-white/85 backdrop-blur-md rounded-3xl p-7 sm:p-8 border border-white/90 shadow-[0_12px_32px_rgba(20,45,75,0.08)] hover:shadow-[0_20px_42px_rgba(20,45,75,0.12)] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 mb-6 group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                  <Feather className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-craft-serif text-2xl font-normal text-stone-900 mb-2">
                  Type your idea
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Describe a dream, genre, or scene.
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setPromptText("A quiet city where gravity tilts westward and lamplight paints the rooftops");
                    setIsCreateOpen(true);
                  }}
                  className="w-full text-left text-xs bg-[#FAF8F5] hover:bg-[#F3EFE9] border border-[#E7DFD4] rounded-xl p-3 text-stone-600 transition-colors flex items-center justify-between group/prompt cursor-pointer"
                >
                  <span className="truncate italic pr-2">&ldquo;A quiet city where gravity tilts westward...&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover/prompt:text-stone-800 transition-colors shrink-0" />
                </button>
              </div>
            </div>

            {/* Step 2: Pick a style */}
            <div className="group bg-white/85 backdrop-blur-md rounded-3xl p-7 sm:p-8 border border-white/90 shadow-[0_12px_32px_rgba(20,45,75,0.08)] hover:shadow-[0_20px_42px_rgba(20,45,75,0.12)] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-[#1B6CA8] mb-6 group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                  <Palette className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-craft-serif text-2xl font-normal text-stone-900 mb-2">
                  Pick a style
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Choose Color Comic, Black &amp; White Ink, or Storybook Watercolor.
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-stone-100">
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStyle('comic');
                      setIsCreateOpen(true);
                    }}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                  >
                    Color Comic
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStyle('ink');
                      setIsCreateOpen(true);
                    }}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                  >
                    Black &amp; White Ink
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStyle('watercolor');
                      setIsCreateOpen(true);
                    }}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-amber-100/70 hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer"
                  >
                    Storybook Watercolor
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Get your book */}
            <div className="group bg-white/85 backdrop-blur-md rounded-3xl p-7 sm:p-8 border border-white/90 shadow-[0_12px_32px_rgba(20,45,75,0.08)] hover:shadow-[0_20px_42px_rgba(20,45,75,0.12)] transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 mb-6 group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                  <BookOpen className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="font-craft-serif text-2xl font-normal text-stone-900 mb-2">
                  Get your book
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  A fully illustrated storybook generated page by page.
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  8 pages with prose &amp; art
                </span>
                <button
                  type="button"
                  onClick={() => setIsReaderOpen(true)}
                  className="text-xs font-semibold text-black hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <span>Sample book</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 2. STYLE SHOWCASE                                            */}
        {/* ------------------------------------------------------------ */}
        <section id="styles" className="py-16 sm:py-24 max-w-6xl mx-auto px-5 sm:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[#13436B] text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs border border-white/90">
              <Brush className="w-3.5 h-3.5 text-[#24639B]" />
              <span>Style showcase</span>
            </div>
            <h2 className="font-craft-serif text-3xl sm:text-4xl lg:text-[44px] font-normal text-[#0A0E13] tracking-tight leading-tight mb-4">
              Explore our art styles
            </h2>
            <p className="text-sm sm:text-base text-[#1E3A52] leading-relaxed">
              Experience each visual medium before committing. Every style brings a unique atmospheric voice to your narrative.
            </p>
          </div>

          {/* Three cards side by side, one per art style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Style 1: Color Comic */}
            <div
              onClick={() => {
                setSelectedStyle('comic');
                setIsCreateOpen(true);
              }}
              className="group bg-white rounded-3xl p-4 border-2 border-white/90 shadow-[0_16px_36px_rgba(20,45,75,0.09)] hover:shadow-[0_24px_50px_rgba(20,45,75,0.15)] transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-stone-100">
                <img
                  alt="Color Comic illustration style sample"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="/images/Tradd-Moore-Doctor-Strange.avif"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-stone-800 shadow-2xs border border-white">
                  Dynamic &amp; Graphic
                </div>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-craft-serif text-2xl font-normal text-stone-900 mb-1.5 group-hover:text-black transition-colors">
                    Color Comic
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Crisp line art, dynamic panels, and rich saturated pigments.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#13436B] group-hover:text-black">
                  <span>Create in Color Comic</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Style 2: Black & White Ink */}
            <div
              onClick={() => {
                setSelectedStyle('ink');
                setIsCreateOpen(true);
              }}
              className="group bg-white rounded-3xl p-4 border-2 border-white/90 shadow-[0_16px_36px_rgba(20,45,75,0.09)] hover:shadow-[0_24px_50px_rgba(20,45,75,0.15)] transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-stone-100">
                <img
                  alt="Black & White Ink illustration style sample"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="/images/maxresdefault.jpg"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-stone-800 shadow-2xs border border-white">
                  Archival &amp; Moody
                </div>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-craft-serif text-2xl font-normal text-stone-900 mb-1.5 group-hover:text-black transition-colors">
                    Black &amp; White Ink
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Atmospheric cross-hatching, deep shadows, and archival texture.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#13436B] group-hover:text-black">
                  <span>Create in B&amp;W Ink</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Style 3: Storybook Watercolor */}
            <div
              onClick={() => {
                setSelectedStyle('watercolor');
                setIsCreateOpen(true);
              }}
              className="group bg-white rounded-3xl p-4 border-2 border-white/90 shadow-[0_16px_36px_rgba(20,45,75,0.09)] hover:shadow-[0_24px_50px_rgba(20,45,75,0.15)] transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-stone-100">
                <img
                  alt="Storybook Watercolor illustration style sample"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="/images/images (2).jpg"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-amber-800 shadow-2xs border border-white">
                  Luminous &amp; Soft
                </div>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-craft-serif text-2xl font-normal text-stone-900 mb-1.5 group-hover:text-black transition-colors">
                    Storybook Watercolor
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Soft washes, gentle paper bleed, and luminous dreamlike tones.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#13436B] group-hover:text-black">
                  <span>Create in Watercolor</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 3. WHY STORYVERSE / FEATURES                                 */}
        {/* ------------------------------------------------------------ */}
        <section className="py-16 sm:py-20 max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[#13436B] text-xs font-semibold uppercase tracking-wider mb-3 shadow-2xs border border-white/90">
              <Check className="w-3.5 h-3.5 text-[#24639B]" />
              <span>Why Storyverse</span>
            </div>
            <h2 className="font-craft-serif text-3xl sm:text-4xl font-normal text-[#0A0E13] tracking-tight leading-tight">
              Thoughtfully built for real storytelling
            </h2>
          </div>

          {/* Feature Highlights Row: Simple icon + short label each, no long paragraphs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-white/90 shadow-[0_8px_24px_rgba(20,45,75,0.06)] flex items-center space-x-4">
              <div className="w-11 h-11 rounded-xl bg-[#EAF2FB] border border-[#D0E2F6] flex items-center justify-center text-[#1B6CA8] shrink-0">
                <Users className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <p className="font-medium text-stone-900 text-sm sm:text-base leading-snug">
                  One consistent character across every page
                </p>
              </div>
            </div>

            <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-white/90 shadow-[0_8px_24px_rgba(20,45,75,0.06)] flex items-center space-x-4">
              <div className="w-11 h-11 rounded-xl bg-[#FFF6E9] border border-[#FDE1B8] flex items-center justify-center text-[#A65B0A] shrink-0">
                <Clock className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <p className="font-medium text-stone-900 text-sm sm:text-base leading-snug">
                  Full book in under two minutes
                </p>
              </div>
            </div>

            <div className="bg-white/85 backdrop-blur-md rounded-2xl p-6 border border-white/90 shadow-[0_8px_24px_rgba(20,45,75,0.06)] flex items-center space-x-4">
              <div className="w-11 h-11 rounded-xl bg-[#ECF8F0] border border-[#CCEBD7] flex items-center justify-center text-[#1B7940] shrink-0">
                <Image className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <p className="font-medium text-stone-900 text-sm sm:text-base leading-snug">
                  Every page fully illustrated, not just the cover
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 4. FINAL CTA BANNER                                          */}
        {/* ------------------------------------------------------------ */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 my-16 sm:my-24">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#85b9e4] via-[#93c4ec] to-[#7bb3e2] p-8 sm:p-14 lg:p-16 border-2 border-white/85 shadow-[0_24px_60px_rgba(18,48,80,0.18)] text-center">
            {/* Halftone texture inside banner */}
            <div className="absolute inset-0 halftone-dots pointer-events-none opacity-25"></div>

            {/* Subtle internal clouds */}
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/40 blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white/35 blur-2xl pointer-events-none"></div>

            {/* Washi tape accent on top edge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-white/40 backdrop-blur-xs border-x border-white/60 transform -rotate-1 rounded-b-xs"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-craft-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0A0E13] tracking-tight leading-tight mb-4">
                Your story is one idea away
              </h2>
              <p className="text-sm sm:text-base text-[#1A3850] max-w-lg mx-auto mb-8 leading-relaxed">
                Describe a fleeting dream or an epic adventure. Watch full-page illustrations and narrative prose come together in minutes.
              </p>

              {/* Get started button, echoing the hero's CTA style */}
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center space-x-2.5 bg-[#0D1116] hover:bg-[#202733] text-white text-[15px] font-medium px-8 py-4 rounded-full craft-btn-shadow transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer group"
              >
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* 5. FOOTER                                                    */}
        {/* ------------------------------------------------------------ */}
        <footer className="bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E8DFD3] py-8 text-xs text-stone-600 relative z-30">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Storyverse wordmark on the left & small copyright line */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 text-center sm:text-left gap-1 sm:gap-0">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-sm bg-[#0D1116] flex items-center justify-center text-[9px] text-white font-serif font-bold">
                  S
                </div>
                <span className="font-craft-serif font-bold text-stone-900 text-sm tracking-tight">
                  Storyverse
                </span>
              </div>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="text-stone-500">
                &copy; 2026 Storyverse. All rights reserved.
              </span>
            </div>

            {/* Simple links: How it works, Styles, Log in */}
            <div className="flex items-center space-x-6 text-stone-600">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setIsHowItWorksOpen(true);
                }}
                className="hover:text-black transition-colors cursor-pointer"
              >
                How it works
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('styles');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setIsCreateOpen(true);
                }}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Styles
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Log in
              </button>
            </div>
          </div>
        </footer>
      </div>
      {/* END: Homepage Sections Continuation */}

      {/* ============================================================ */}
      {/* MODAL 1: CREATE SCREEN PROMPT & STYLE PICKER                 */}
      {/* ============================================================ */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full border border-[#E5DFD4] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-[#ECE5DA] flex items-center justify-between bg-white">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
                  <Feather className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900 font-craft-serif">Write your story</h3>
                  <p className="text-xs text-stone-500">Turn an idea or dream into an illustrated book</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartGeneration} className="p-6 space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Story idea or dream prompt
                </label>
                <textarea
                  rows="3"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="a city where gravity works sideways"
                  className="w-full px-4 py-3 bg-white border border-[#E0D9CD] rounded-2xl text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-black/10 focus:border-stone-500 text-sm leading-relaxed"
                ></textarea>
                <div className="flex items-center justify-between mt-2 text-xs text-stone-400">
                  <span>Try: &quot;a lighthouse keeper whose lamp guides lost stars&quot;</span>
                  <button
                    type="button"
                    onClick={() => setPromptText("a city where gravity works sideways")}
                    className="text-stone-600 hover:underline cursor-pointer"
                  >
                    Insert example
                  </button>
                </div>
              </div>

              {/* Art Style Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                  Select art style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ART_STYLES.map((style) => {
                    const isSelected = selectedStyle === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${isSelected
                          ? 'bg-white border-black ring-1 ring-black shadow-xs'
                          : 'bg-white/70 border-[#E2DDD3] hover:border-stone-400'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-stone-800">{style.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug">{style.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-[#ECE5DA]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-xs font-medium text-stone-600 hover:text-black px-4 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#101318] hover:bg-[#252A34] text-white text-sm font-medium px-6 py-2.5 rounded-full craft-btn-shadow transition-all inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Create storybook</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: GENERATING / LOADING SCREEN WITH ROTATING STATUS    */}
      {/* ============================================================ */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-md w-full border border-[#E5DFD4] shadow-2xl p-8 text-center animate-in fade-in duration-200">
            {/* Animated book / drawing glyph */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white border border-[#E5DFD4] shadow-sm flex items-center justify-center relative">
              <Sparkles className="w-7 h-7 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"></div>
            </div>

            <h3 className="font-craft-serif text-2xl text-stone-900 mb-2">
              Crafting your storybook
            </h3>

            {/* Rotating short status line */}
            <p className="text-sm font-medium text-stone-700 min-h-[24px] mb-6 font-mono text-[13px]">
              {LOADING_MESSAGES[loadingStep]}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[#ECE7DE] h-2 rounded-full overflow-hidden mb-4">
              <div
                className="bg-[#101318] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((loadingStep + 1) / LOADING_MESSAGES.length) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-stone-400">
              Generating narrative text and illustration for each page
            </p>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: ILLUSTRATED STORYBOOK READER                        */}
      {/* ============================================================ */}
      {isReaderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full border border-[#E5DFD4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Reader Header */}
            <div className="px-6 py-4 border-b border-[#ECE5DA] flex items-center justify-between bg-white">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  Page {sampleBookPages[readerPage].pageNumber} of {sampleBookPages.length}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-600 font-medium">The Sideways City</span>
              </div>
              <button
                type="button"
                onClick={() => setIsReaderOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reader Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Illustrated Art Page */}
              <div className="rounded-2xl overflow-hidden border border-[#E0D9CD] shadow-md bg-white">
                <img
                  src={sampleBookPages[readerPage].image}
                  alt={sampleBookPages[readerPage].caption}
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <div className="p-3 bg-[#FBF9F5] border-t border-[#ECE5DA]">
                  <p className="text-[11px] font-craft-serif italic text-stone-600 text-center">
                    &ldquo;{sampleBookPages[readerPage].caption}&rdquo;
                  </p>
                </div>
              </div>

              {/* Narrative Text Page */}
              <div className="flex flex-col justify-between h-full py-2">
                <div>
                  <span className="text-xs text-amber-700 font-medium tracking-wide uppercase">Chapter {sampleBookPages[readerPage].pageNumber}</span>
                  <h3 className="font-craft-serif text-2xl sm:text-3xl text-stone-900 mt-1 mb-4 leading-tight">
                    {sampleBookPages[readerPage].title}
                  </h3>
                  <p className="text-stone-700 text-sm sm:text-base font-serif leading-relaxed">
                    {sampleBookPages[readerPage].text}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#ECE5DA] flex items-center justify-between text-xs text-stone-500">
                  <span>Art Style: Storybook Watercolor</span>
                  <div className="flex items-center space-x-1">
                    <Bookmark className="w-3.5 h-3.5 text-stone-400" />
                    <span>Saved to bookshelf</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reader Navigation Footer */}
            <div className="px-6 py-4 border-t border-[#ECE5DA] bg-white flex items-center justify-between">
              <button
                type="button"
                disabled={readerPage === 0}
                onClick={() => setReaderPage(p => Math.max(0, p - 1))}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-medium border border-stone-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous page</span>
              </button>

              <div className="flex space-x-1.5">
                {sampleBookPages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReaderPage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${readerPage === i ? 'bg-black w-6' : 'bg-stone-200'
                      }`}
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={readerPage === sampleBookPages.length - 1}
                onClick={() => setReaderPage(p => Math.min(sampleBookPages.length - 1, p + 1))}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-medium border border-stone-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 cursor-pointer"
              >
                <span>Next page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: BOOKSHELF SCREEN (WITH TOGGLEABLE EMPTY STATE)      */}
      {/* ============================================================ */}
      {isBookshelfOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full border border-[#E5DFD4] shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="px-6 py-5 border-b border-[#ECE5DA] flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center font-bold">
                  📚
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900 font-craft-serif">Your Bookshelf</h3>
                  <p className="text-xs text-stone-500">All your personal generated illustrated books</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setBookshelfEmpty(!bookshelfEmpty)}
                  className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1 rounded-full cursor-pointer transition-colors"
                >
                  {bookshelfEmpty ? 'Show sample books' : 'Simulate empty state'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsBookshelfOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8">
              {bookshelfEmpty ? (
                /* Specific empty state requirement: "Your bookshelf is empty — write your first story" */
                <div className="py-12 text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-[#E5DFD4] shadow-xs flex items-center justify-center text-stone-400 text-2xl">
                    📖
                  </div>
                  <h4 className="text-base font-semibold text-stone-800 font-craft-serif mb-2">
                    Your bookshelf is empty — write your first story
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed mb-6">
                    Every storybook starts with a single prompt. Choose any dream or fable, pick an art style, and we will sketch every page.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBookshelfOpen(false);
                      setIsCreateOpen(true);
                    }}
                    className="bg-[#101318] hover:bg-[#252A34] text-white text-xs font-medium px-5 py-2.5 rounded-full craft-btn-shadow transition-all inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Start your book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      setIsBookshelfOpen(false);
                      setIsReaderOpen(true);
                    }}
                    className="bg-white border border-[#E5DFD4] rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="h-36 w-full rounded-xl overflow-hidden mb-3">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbn674iMCijkvfkMueFK3ptfVbZgk9v5RzgPBs4SHXD5UVEoUatrtZzYZfDFVDVoNMED9vdDACnKRgnF6zBfwOfNj_533Gp3TJSSPbhgrsFeEZ6U1zGuJKKQZaq10julQWuh8mc9z3AyqHH93eMbe5RMuzxZ0Jq2OFbuqvSY-mpAV9-KbFB2LCl1TB8y3cnxhgzTNwJUi22ZRA6Yq7B4Laiugzmu7rc0rEaAPnnxAGStSa41u8tmh7"
                        alt="The Sideways City cover"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-stone-900 group-hover:underline">The Sideways City</h4>
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">Watercolor</span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2">A boy discovers that gravity follows whoever is singing loudest.</p>
                  </div>

                  <div
                    onClick={() => {
                      setIsBookshelfOpen(false);
                      setIsCreateOpen(true);
                    }}
                    className="bg-stone-50/70 border-2 border-dashed border-[#E2DDD3] rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 mb-2">
                      +
                    </div>
                    <p className="text-xs font-medium text-stone-700">Add another book</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Prompt, style &amp; illustrations</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: AUTH SCREENS (STANDARD FRIENDLY LOGIN / SIGNUP)     */}
      {/* ============================================================ */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-md w-full border border-[#E5DFD4] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-[#ECE5DA] flex items-center justify-between bg-white">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-stone-900 font-craft-serif">
                    {authMode === 'login' ? 'Welcome back to Storyverse' : 'Create your Storyverse account'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {authMode === 'login'
                      ? 'Enter your email to open your bookshelf'
                      : 'Save your illustrated stories across all devices'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsAuthOpen(false); }} className="p-6 space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                    Your name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Miller"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E0D9CD] rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-black/10 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E0D9CD] rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-black/10 text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Password
                  </label>
                  {authMode === 'login' && (
                    <a href="#forgot" className="text-xs text-stone-500 hover:text-black hover:underline">
                      Forgot password?
                    </a>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E0D9CD] rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-black/10 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#101318] hover:bg-[#252A34] text-white text-sm font-medium py-3 rounded-full craft-btn-shadow transition-all cursor-pointer"
              >
                {authMode === 'login' ? 'Open bookshelf' : 'Create account'}
              </button>

              <div className="text-center pt-3 border-t border-[#ECE5DA]">
                {authMode === 'login' ? (
                  <p className="text-xs text-stone-600">
                    Don&apos;t have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="font-semibold text-black hover:underline cursor-pointer"
                    >
                      Sign up free
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-stone-600">
                    Already have a Storyverse account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="font-semibold text-black hover:underline cursor-pointer"
                    >
                      Log in
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: "SEE HOW IT WORKS" EXPLANATION                      */}
      {/* ============================================================ */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full border border-[#E5DFD4] shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="px-6 py-5 border-b border-[#ECE5DA] flex items-center justify-between bg-white">
              <h3 className="text-base font-semibold text-stone-900 font-craft-serif">How Storyverse works</h3>
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Type any idea or dream</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Provide a prompt like &quot;a city where gravity works sideways&quot; or a childhood bedtime thought.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Pick an art style</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Select from Storybook Watercolor, Color Comic, or archival Black &amp; White Ink to match your story&apos;s tone.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">Read and share your book</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Every page is automatically generated with rich narrative prose and AI illustration. Flip pages, download, or keep them on your bookshelf.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsHowItWorksOpen(false);
                  setIsCreateOpen(true);
                }}
                className="w-full bg-[#101318] hover:bg-[#252A34] text-white text-sm font-medium py-3 rounded-full craft-btn-shadow transition-all cursor-pointer"
              >
                Start your book
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
