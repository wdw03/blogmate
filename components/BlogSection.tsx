
import React, { useState, useEffect, useRef } from 'react';
import { BLOG_POSTS } from '../constants';
import { ArrowRight, Calendar, User, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const BlogSection: React.FC = () => {
  const N = BLOG_POSTS.length;
  // Extended array with 3 copies for seamless infinite sliding in both directions
  const extendedPosts = [...BLOG_POSTS, ...BLOG_POSTS, ...BLOG_POSTS];

  const [displayIndex, setDisplayIndex] = useState(N); // Start at middle block
  const [cardsToShow, setCardsToShow] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive cards setup
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Snap back seamlessly without animation when reaching cloned boundaries
  const handleTransitionEnd = () => {
    if (displayIndex >= N * 2) {
      setIsTransitioning(false);
      setDisplayIndex((prev) => prev - N);
    } else if (displayIndex < N) {
      setIsTransitioning(false);
      setDisplayIndex((prev) => prev + N);
    }
  };

  // Re-enable transitions after snapping back
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleNext = () => {
    if (!isTransitioning) return;
    setDisplayIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isTransitioning) return;
    setDisplayIndex((prev) => prev - 1);
  };

  // 3 Second Auto-Slide Timer (always moves forward continuously)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDisplayIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Touch handlers for swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeDot = ((displayIndex % N) + N) % N;

  return (
    <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-md">
                Intelligence Engine
              </span>
              <button 
                onClick={() => setIsPaused(!isPaused)} 
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[9px] font-bold text-slate-500 uppercase tracking-wider hover:text-blue-600 transition-colors"
                title={isPaused ? "Resume Auto-Slide" : "Pause Auto-Slide"}
              >
                {isPaused ? <Play size={10} className="text-emerald-500 fill-emerald-500" /> : <Pause size={10} className="text-amber-500" />}
                <span>{isPaused ? "Paused" : "Auto 3s"}</span>
              </button>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Intelligence & Insights.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-medium">
              Stay ahead of the curve with our expert analysis on domain trends, SEO strategies, and marketplace forensics.
            </p>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            <a 
              href="#/blog" 
              className="inline-flex items-center px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all shadow-sm"
            >
              Explore the Blog
              <ArrowRight size={16} className="ml-2" />
            </a>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel sm:px-6">
          {/* Left Navigation Button (Desktop/Tablet) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-2xl items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 transition-all duration-300 active:scale-90 group/left"
          >
            <ChevronLeft size={24} className="group-hover/left:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Navigation Button (Desktop/Tablet) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-2xl items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 transition-all duration-300 active:scale-90 group/right"
          >
            <ChevronRight size={24} className="group-hover/right:translate-x-0.5 transition-transform" />
          </button>

          {/* Sliding Track Viewport */}
          <div 
            className="overflow-hidden -mx-2 sm:-mx-4 py-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-out' : 'transition-none'}`}
              style={{ transform: `translateX(-${displayIndex * (100 / cardsToShow)}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedPosts.map((post, idx) => (
                <div 
                  key={`${post.id}-${idx}`} 
                  className="shrink-0 px-2 sm:px-4 transition-all duration-500"
                  style={{ width: `${100 / cardsToShow}%` }}
                >
                  <article className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-500 group">
                    <div className="relative h-48 sm:h-60 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 shadow-sm">
                        {post.category}
                      </div>
                    </div>
                    
                    <div className="p-5 sm:p-8 flex flex-col flex-1">
                      <div className="flex items-center space-x-4 text-slate-400 dark:text-slate-500 text-xs font-bold mb-3 sm:mb-4">
                        <div className="flex items-center space-x-1.5">
                          <Calendar size={14} className="text-blue-500" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <User size={14} className="text-emerald-500" />
                          <span>{post.author}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2 sm:mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      
                      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8 line-clamp-3 leading-relaxed font-medium">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                        <a 
                          href={`#/post/${post.id}`} 
                          className="inline-flex items-center font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white group/link hover:text-blue-600 transition-colors"
                        >
                          <span>Read Article</span>
                          <div className="ml-2 sm:ml-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:text-white transition-all shadow-sm">
                            <ArrowRight size={14} />
                          </div>
                        </a>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">5 Min Read</span>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Bottom Pagination & Mobile Navigation Row */}
        <div className="flex items-center justify-between sm:justify-center gap-4 mt-8 sm:mt-10 px-4">
          {/* Mobile Prev Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="sm:hidden w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center active:scale-90 hover:bg-blue-600 hover:text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-1">
            {Array.from({ length: N }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsTransitioning(true);
                  setDisplayIndex(N + idx);
                }}
                aria-label={`Jump to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  activeDot === idx
                    ? 'w-8 sm:w-10 bg-blue-600 shadow-lg shadow-blue-500/30'
                    : 'w-2.5 bg-slate-300 dark:bg-slate-800 hover:bg-slate-400 dark:hover:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Mobile Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="sm:hidden w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center active:scale-90 hover:bg-blue-600 hover:text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
