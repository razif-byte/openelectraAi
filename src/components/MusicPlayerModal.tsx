import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, 
  Repeat, Repeat1, ListMusic, Music, ExternalLink, ChevronUp, 
  ChevronDown, Sparkles, Check, Disc3
} from 'lucide-react';
import { AUDIO_TRACKS } from '../data/appsData';
import { globalAudioController } from '../utils/audioPlayer';

export const MusicPlayerModal: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loopMode, setLoopMode] = useState<'all' | 'one'>('all');
  const [autoNext, setAutoNext] = useState(true);
  const [volume, setVolume] = useState(0.45);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false);
  const [autoHideSeconds, setAutoHideSeconds] = useState<number | null>(null);
  const [isAutoHidden, setIsAutoHidden] = useState(false);
  const [keepYtOpen, setKeepYtOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrackIndexRef = useRef(currentTrackIndex);
  currentTrackIndexRef.current = currentTrackIndex;

  const autoNextRef = useRef(autoNext);
  autoNextRef.current = autoNext;

  const loopModeRef = useRef(loopMode);
  loopModeRef.current = loopMode;

  const currentTrack = AUDIO_TRACKS[currentTrackIndex] || AUDIO_TRACKS[0];

  // Auto-hide YouTube player once music has started playing
  useEffect(() => {
    let interval: any = null;
    if (showYouTubePlayer && !keepYtOpen) {
      setAutoHideSeconds(6);
      interval = setInterval(() => {
        setAutoHideSeconds((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setShowYouTubePlayer(false);
            setIsAutoHidden(true);
            // Ensure audio continues smoothly
            const track = AUDIO_TRACKS[currentTrackIndexRef.current];
            globalAudioController.playStream(track.streamUrl);
            setIsPlaying(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setAutoHideSeconds(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showYouTubePlayer, keepYtOpen]);

  // Listen to postMessage from YouTube iframe to detect playback start
  useEffect(() => {
    const handleYtMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          // YouTube API onStateChange: 1 means PLAYING
          if (data.event === 'onStateChange' && data.info === 1 && !keepYtOpen) {
            // Once playback begins, trigger auto-hide after 3 seconds
            setTimeout(() => {
              setShowYouTubePlayer(false);
              setIsAutoHidden(true);
              const track = AUDIO_TRACKS[currentTrackIndexRef.current];
              globalAudioController.playStream(track.streamUrl);
              setIsPlaying(true);
            }, 3000);
          }
        }
      } catch {}
    };
    window.addEventListener('message', handleYtMessage);
    return () => window.removeEventListener('message', handleYtMessage);
  }, [keepYtOpen]);

  // Auto-play on mount + Auto-Next song setup
  useEffect(() => {
    // 1. Configure audio controller callbacks
    globalAudioController.setOnEnded(() => {
      if (loopModeRef.current === 'one') {
        // replay same track
        const track = AUDIO_TRACKS[currentTrackIndexRef.current];
        globalAudioController.playStream(track.streamUrl);
      } else if (autoNextRef.current) {
        // Auto Next Song in Loop List
        const nextIndex = (currentTrackIndexRef.current + 1) % AUDIO_TRACKS.length;
        setCurrentTrackIndex(nextIndex);
        const nextTrack = AUDIO_TRACKS[nextIndex];
        globalAudioController.playStream(nextTrack.streamUrl);
        setIsPlaying(true);
      }
    });

    globalAudioController.setOnTimeUpdate((curr, dur) => {
      setCurrentTime(curr);
      if (dur && !isNaN(dur)) setDuration(dur);
    });

    globalAudioController.setVolume(volume);
    globalAudioController.setLoopMode(loopMode === 'one' ? 'one' : 'all');

    // 2. Auto-play the first song automatically
    const startAutoPlay = () => {
      globalAudioController.playStream(AUDIO_TRACKS[0].streamUrl)
        .then((started) => {
          if (started) {
            setIsPlaying(true);
          }
        })
        .catch(() => {});
    };

    // Immediate attempt
    startAutoPlay();

    // In case the browser enforces user gesture autoplay policy, unlock on first interaction
    const unlockOnGesture = () => {
      globalAudioController.playStream(AUDIO_TRACKS[currentTrackIndexRef.current].streamUrl)
        .then(() => setIsPlaying(true))
        .catch(() => {});
      ['click', 'touchstart', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, unlockOnGesture);
      });
    };

    ['click', 'touchstart', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlockOnGesture, { once: true, passive: true });
    });

    return () => {
      ['click', 'touchstart', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, unlockOnGesture);
      });
    };
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      globalAudioController.pause();
      setIsPlaying(false);
    } else {
      globalAudioController.playStream(currentTrack.streamUrl);
      setIsPlaying(true);
    }
  };

  const playTrackAtIndex = (index: number) => {
    const validIdx = (index + AUDIO_TRACKS.length) % AUDIO_TRACKS.length;
    setCurrentTrackIndex(validIdx);
    const nextTrack = AUDIO_TRACKS[validIdx];
    if (showYouTubePlayer) {
      if (!nextTrack.youtubeId) {
        setShowYouTubePlayer(false);
        globalAudioController.playStream(nextTrack.streamUrl);
        setIsPlaying(true);
      }
    } else {
      globalAudioController.playStream(nextTrack.streamUrl);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    playTrackAtIndex(currentTrackIndex + 1);
  };

  const handlePrevTrack = () => {
    playTrackAtIndex(currentTrackIndex - 1);
  };

  const toggleLoopMode = () => {
    const nextMode = loopMode === 'all' ? 'one' : 'all';
    setLoopMode(nextMode);
    globalAudioController.setLoopMode(nextMode);
  };

  const toggleAutoNext = () => {
    setAutoNext(!autoNext);
  };

  const toggleMute = () => {
    const muted = globalAudioController.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    globalAudioController.setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    setCurrentTime(seekTo);
    globalAudioController.seek(seekTo);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden">
        
        {/* Minimized Pill View */}
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-100 text-xs font-semibold"
          >
            <div className="relative flex items-center justify-center">
              <Disc3 className={`w-5 h-5 text-blue-600 dark:text-blue-400 ${isPlaying ? 'animate-spin' : ''}`} />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-ping" />
              )}
            </div>
            <div className="text-left max-w-[130px] sm:max-w-[160px]">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentTrack.title}
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 truncate">
                {isPlaying ? 'Auto-Play Aktif' : 'Dijeda'} • Loop List
              </p>
            </div>
            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        ) : (
          /* Expanded Player Panel */
          <div className="p-4 w-[310px] sm:w-[350px] space-y-3">
            
            {/* Header: Title & Player Badges */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md shadow-blue-500/20 shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">
                      Muzik Latar Loop
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold rounded-md">
                      Auto-Play
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                    Lagu {currentTrackIndex + 1} daripada {AUDIO_TRACKS.length} (Auto Next)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                {/* YouTube Link Button (if available) */}
                {currentTrack.youtubeUrl && (
                  <a
                    href={currentTrack.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors rounded-lg flex items-center"
                    title="Tonton / Buka di YouTube (FL02h4nRfvw)"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}

                {/* Playlist Toggle */}
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    showPlaylist
                      ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="Senarai Lagu (Loop List)"
                >
                  <ListMusic className="w-4 h-4" />
                </button>

                {currentTrack.driveLink && (
                  <a
                    href={currentTrack.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg"
                    title="Akses Fail Google Drive"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg"
                  title="Kecilkan Pemain"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Current Playing Track Info & Visualizer */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
              {/* YouTube Video / Audio Player if track has youtubeId */}
              {currentTrack.youtubeId && (
                <div className="mb-2.5">
                  {showYouTubePlayer ? (
                    <div className="space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
                      <div className="relative rounded-xl overflow-hidden aspect-video w-full bg-black shadow-md border border-slate-700">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtubeId}?autoplay=1&enablejsapi=1`}
                          title={currentTrack.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                      
                      {/* Auto-hide countdown bar & control actions */}
                      <div className="flex items-center justify-between px-2 py-1.5 bg-red-50 dark:bg-red-950/40 rounded-xl text-[10px] border border-red-100 dark:border-red-900/50">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                          <span className="text-red-700 dark:text-red-300 font-bold truncate">
                            {autoHideSeconds !== null
                              ? `Auto-sembunyi video dalam ${autoHideSeconds}s (muzik latar diteruskan)`
                              : 'Video YouTube Aktif'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1.5 shrink-0 ml-1">
                          {autoHideSeconds !== null && (
                            <button
                              onClick={() => {
                                setKeepYtOpen(true);
                                setAutoHideSeconds(null);
                              }}
                              className="px-2 py-0.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-[9px] font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
                              title="Jangan sembunyikan video automatik"
                            >
                              Kekalkan
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setShowYouTubePlayer(false);
                              setIsAutoHidden(true);
                              globalAudioController.playStream(currentTrack.streamUrl);
                              setIsPlaying(true);
                            }}
                            className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-bold transition-colors shadow-sm"
                            title="Sembunyikan video sekarang & teruskan muzik di latar belakang"
                          >
                            Sembunyi Sekarang
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {isAutoHidden && (
                        <div className="px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between text-[10px] animate-in fade-in duration-200">
                          <div className="flex items-center space-x-1.5 min-w-0 text-emerald-800 dark:text-emerald-300 font-semibold truncate">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">Video auto-sembunyi • Muzik latar diteruskan</span>
                          </div>
                          <button
                            onClick={() => {
                              setShowYouTubePlayer(true);
                              setIsAutoHidden(false);
                              setKeepYtOpen(true);
                            }}
                            className="text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0 ml-1.5"
                          >
                            Papar Video
                          </button>
                        </div>
                      )}
                      
                      <div className="rounded-xl overflow-hidden relative group">
                        <img
                          src={`https://img.youtube.com/vi/${currentTrack.youtubeId}/mqdefault.jpg`}
                          alt={currentTrack.title}
                          className="w-full h-24 object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-2.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-black rounded uppercase tracking-wider flex items-center gap-1">
                              <Disc3 className="w-2.5 h-2.5 animate-spin" />
                              Audio Asal Sebenar
                            </span>
                            <span className="text-[10px] text-white/90 font-mono font-bold">
                              {currentTrack.duration || '04:18'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-white text-xs font-bold leading-tight drop-shadow truncate max-w-[170px]">
                              {currentTrack.title}
                            </p>
                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => {
                                  globalAudioController.pause();
                                  setIsPlaying(false);
                                  setShowYouTubePlayer(true);
                                  setKeepYtOpen(false);
                                }}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg shadow transition-colors flex items-center space-x-1"
                                title="Tonton / Dengar Video Asal YouTube secara terus"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Tonton (Auto-Hide)</span>
                              </button>
                              <a
                                href={currentTrack.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                                title="Buka Tab YouTube Rasmi"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Google Drive Source Badge for tracks from Drive */}
              {currentTrack.driveLink && !currentTrack.youtubeId && (
                <div className="mb-2 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 rounded-xl flex items-center justify-between text-[10px]">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-700 dark:text-slate-300 truncate">
                      Audio Sebenar Asal (Google Drive Master)
                    </span>
                  </div>
                  <a
                    href={currentTrack.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0 flex items-center space-x-0.5 ml-2"
                  >
                    <span>Fail Asal</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentTrack.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {currentTrack.artist}
                  </p>
                </div>
                {currentTrack.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                    currentTrack.youtubeId
                      ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                      : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                  }`}>
                    {currentTrack.badge}
                  </span>
                )}
              </div>

              {/* Lyrics Excerpt */}
              {currentTrack.lyrics && (
                <p className="text-[10px] text-slate-600 dark:text-slate-300 italic mt-2 line-clamp-1 border-l-2 border-blue-500 pl-2">
                  "{currentTrack.lyrics}"
                </p>
              )}

              {/* Live Audio Visualizer Bars */}
              <div className="flex items-end space-x-1 h-3.5 mt-2.5">
                {[40, 75, 30, 95, 55, 85, 45, 100, 60, 70, 35, 90, 65, 80].map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full bg-gradient-to-t from-blue-600 to-indigo-400 transition-all duration-300 ${
                      isPlaying ? 'opacity-100' : 'opacity-25'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(20, (h * (0.35 + ((i + currentTrackIndex) % 4) * 0.22)))}%` : '20%'
                    }}
                  />
                ))}
              </div>

              {/* Progress Slider */}
              <div className="mt-2.5 space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{currentTrack.duration || formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* Playlist Drawer (When opened) */}
            {showPlaylist && (
              <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl p-2 max-h-48 overflow-y-auto space-y-1.5 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <span>Senarai Lagu (Loop List)</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400">Pilih Untuk Main</span>
                </div>
                {AUDIO_TRACKS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => playTrackAtIndex(idx)}
                    className={`w-full text-left p-2 rounded-xl flex items-center justify-between transition-colors ${
                      idx === currentTrackIndex
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="truncate text-xs leading-tight">{t.title}</p>
                      <p className={`text-[10px] truncate ${idx === currentTrackIndex ? 'text-blue-100' : 'text-slate-400'}`}>
                        {t.artist}
                      </p>
                    </div>
                    {idx === currentTrackIndex && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-white/20 rounded-md shrink-0">
                        Aktif
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between pt-1">
              
              {/* Loop Mode Toggle */}
              <button
                onClick={toggleLoopMode}
                className={`p-2 rounded-xl transition-all ${
                  loopMode === 'one'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold'
                    : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-bold'
                }`}
                title={loopMode === 'one' ? 'Loop Lagu Ini Sahaja (Repeat 1)' : 'Loop Semua Lagu (Loop Playlist)'}
              >
                {loopMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>

              {/* Prev Track */}
              <button
                onClick={handlePrevTrack}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Lagu Sebelum"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Play / Pause Main Button */}
              <button
                onClick={togglePlayPause}
                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Jeda Muzik' : 'Mainkan Muzik'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              {/* Next Track */}
              <button
                onClick={handleNextTrack}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Lagu Seterusnya"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Auto-Next Song Indicator / Toggle */}
              <button
                onClick={toggleAutoNext}
                className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                  autoNext
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title={autoNext ? 'Auto-Next Song: AKTIF (Akan automatik main lagu seterusnya)' : 'Auto-Next Song: DIMATIKAN'}
              >
                Auto-Next
              </button>
            </div>

            {/* Bottom Row: Volume Slider & Watermark */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title={isMuted ? 'Batal Bisu' : 'Senyapkan'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  title={`Kelantangan: ${Math.round(volume * 100)}%`}
                />
              </div>

              {/* Watermark with Link */}
              <a
                href="https://nasadef.com.my"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
              >
                <span>RazifApps@nasadef®</span>
              </a>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
