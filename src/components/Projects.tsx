import { useState, useRef, useEffect } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle,
  Eye,
  X,
  GraduationCap,
  Gamepad2,
  Calendar,
  BookOpen,
  Award,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ThemeConfig } from '../types';

interface ProjectsProps {
  theme?: ThemeConfig;
}

export default function Projects({ theme }: ProjectsProps) {
  const { projects: PROJECTS } = usePortfolio();

  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [activeTabMode, setActiveTabMode] = useState<Record<string, 'image' | 'interactive'>>({
    'school-website': 'image',
    'ai-built-game': 'interactive',
  });

  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameHighScore, setGameHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Canvas game ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const gameStateRef = useRef({
    playerY: 100,
    playerVy: 0,
    obstacles: [] as { x: number; y: number; width: number; height: number; passed: boolean }[],
    score: 0,
    frame: 0,
  });

  // Mini canvas arcade game logic
  const startGame = () => {
    setIsGameRunning(true);
    setGameOver(false);
    setGameScore(0);
    gameStateRef.current = {
      playerY: 80,
      playerVy: 0,
      obstacles: [{ x: 300, y: 70, width: 20, height: 60, passed: false }],
      score: 0,
      frame: 0,
    };
  };

  const jump = () => {
    if (!isGameRunning) {
      startGame();
      return;
    }
    gameStateRef.current.playerVy = -5.5;
  };

  useEffect(() => {
    if (!isGameRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.28;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const loop = () => {
      const state = gameStateRef.current;
      state.frame++;

      // Physics
      state.playerVy += gravity;
      state.playerY += state.playerVy;

      // Floor & ceiling bound
      if (state.playerY > canvasHeight - 20) {
        state.playerY = canvasHeight - 20;
        state.playerVy = 0;
      }
      if (state.playerY < 10) {
        state.playerY = 10;
        state.playerVy = 0;
      }

      // Spawn obstacles every 100 frames
      if (state.frame % 100 === 0) {
        const gapHeight = 55;
        const obstacleHeight = Math.floor(Math.random() * (canvasHeight - gapHeight - 40)) + 20;
        state.obstacles.push({
          x: canvasWidth,
          y: 0,
          width: 22,
          height: obstacleHeight,
          passed: false,
        });
        state.obstacles.push({
          x: canvasWidth,
          y: obstacleHeight + gapHeight,
          width: 22,
          height: canvasHeight - (obstacleHeight + gapHeight),
          passed: false,
        });
      }

      // Move obstacles & collision
      const playerBox = { x: 40, y: state.playerY - 8, width: 16, height: 16 };
      let collision = false;

      for (let i = 0; i < state.obstacles.length; i++) {
        const obs = state.obstacles[i];
        obs.x -= 2.6;

        // Collision check
        if (
          playerBox.x < obs.x + obs.width &&
          playerBox.x + playerBox.width > obs.x &&
          playerBox.y < obs.y + obs.height &&
          playerBox.y + playerBox.height > obs.y
        ) {
          collision = true;
        }

        // Score update
        if (!obs.passed && obs.x + obs.width < playerBox.x) {
          obs.passed = true;
          if (obs.y === 0) {
            state.score += 1;
            setGameScore(state.score);
            setGameHighScore((prev) => Math.max(prev, state.score));
          }
        }
      }

      // Clean off-screen obstacles
      state.obstacles = state.obstacles.filter((obs) => obs.x > -30);

      // Render
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Background grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvasWidth; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }

      // Obstacles
      for (const obs of state.obstacles) {
        ctx.fillStyle = '#06b6d4'; // Cyan
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = '#22d3ee';
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      }

      // Player (Neon glowing orb)
      ctx.fillStyle = '#a855f7'; // Violet
      ctx.beginPath();
      ctx.arc(playerBox.x + 8, state.playerY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f3e8ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Thruster trail
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(playerBox.x - 4, state.playerY, 4, 0, Math.PI * 2);
      ctx.fill();

      if (collision) {
        setIsGameRunning(false);
        setGameOver(true);
        return;
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isGameRunning]);

  const accentGradient = theme?.accentGradient || 'from-violet-400 via-fuchsia-400 to-cyan-300';
  const buttonGradient = theme?.buttonGradient || 'from-violet-600 via-indigo-600 to-cyan-500';

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-[#0a0d16]">
      {/* Background ambience */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-violet-300 text-xs font-semibold mb-3">
            <FolderGit2 className="w-3.5 h-3.5 text-violet-400" />
            <span>Featured Case Studies</span>
          </div>
          <h2
            id="projects-section-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
          >
            AI Projects & Games
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Production-grade prototypes built using generative AI prompts, code synthesis, and interactive web mechanics.
          </p>
        </div>

        {/* 2 Featured Projects Grid (as requested) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PROJECTS.map((project, index) => {
            const isSchool = project.previewType === 'school';
            const currentMode = activeTabMode[project.id] || (isSchool ? 'image' : 'interactive');

            return (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                className="group relative rounded-3xl bg-[#0c101c]/90 border border-white/[0.08] hover:border-violet-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-2xl hover:shadow-[0_0_35px_-5px_rgba(139,92,246,0.25)]"
              >
                {/* Visual Header / Mockup Banner */}
                <div className="relative h-64 sm:h-72 bg-slate-950 p-4 flex flex-col justify-between overflow-hidden border-b border-white/[0.08]">
                  {/* Subtle Grid Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Top Bar inside banner */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#07090e]/85 text-violet-300 border border-white/[0.12] backdrop-blur-md">
                      {isSchool ? <GraduationCap className="w-3.5 h-3.5 text-violet-400" /> : <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />}
                      {project.badge}
                    </span>

                    {/* Mode Toggle (Image Mockup vs Live Mini-Demo) */}
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/60 border border-white/[0.1] backdrop-blur-md">
                      <button
                        type="button"
                        onClick={() => setActiveTabMode(prev => ({ ...prev, [project.id]: 'image' }))}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          currentMode === 'image'
                            ? 'bg-violet-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Visual
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTabMode(prev => ({ ...prev, [project.id]: 'interactive' }))}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                          currentMode === 'interactive'
                            ? 'bg-cyan-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSchool ? 'Interactive UI' : 'Play Arcade'}
                      </button>
                    </div>
                  </div>

                  {/* Interactive UI Mockup Representation or Image Visual */}
                  <div className="relative z-10 my-auto py-1 flex items-center justify-center">
                    {currentMode === 'image' && project.imageUrl ? (
                      /* High-Resolution Generated Image Showcase */
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/[0.1] shadow-xl group/img">
                        <img
                          src={project.imageUrl}
                          alt={`${project.title} - ${project.badge} project showcase`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-300 bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs">
                          High-Fidelity AI Mockup
                        </span>
                      </div>
                    ) : isSchool ? (
                      /* School Portal Mockup Preview */
                      <div className="w-full max-w-sm mx-auto bg-slate-950/90 border border-violet-500/30 rounded-xl p-3.5 backdrop-blur-md shadow-xl space-y-2">
                        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                            <span className="text-[10px] text-slate-400 ml-1.5 font-mono">school-portal.edu</span>
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold">
                            AI Powered
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center">
                          <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.06] text-[10px] text-slate-300">
                            <BookOpen className="w-3.5 h-3.5 mx-auto text-violet-400 mb-0.5" />
                            Curriculum
                          </div>
                          <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.06] text-[10px] text-slate-300">
                            <Calendar className="w-3.5 h-3.5 mx-auto text-cyan-400 mb-0.5" />
                            Events
                          </div>
                          <div className="p-2 bg-white/[0.03] rounded-lg border border-white/[0.06] text-[10px] text-slate-300">
                            <Award className="w-3.5 h-3.5 mx-auto text-amber-400 mb-0.5" />
                            Admissions
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* AI-Built Game Interactive Canvas Mini-Player */
                      <div className="w-full max-w-sm mx-auto bg-slate-950/95 border border-cyan-500/40 rounded-xl p-2.5 backdrop-blur-md shadow-xl flex flex-col items-center">
                        <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-300 mb-1 px-1">
                          <span className="text-cyan-400 flex items-center gap-1">
                            <Gamepad2 className="w-3 h-3" /> Playable Mini-Game
                          </span>
                          <span>Score: {gameScore} (Best: {gameHighScore})</span>
                        </div>
                        <canvas
                          ref={canvasRef}
                          width={320}
                          height={110}
                          onClick={jump}
                          className="w-full h-24 bg-[#050811] rounded-lg border border-white/[0.1] cursor-pointer touch-none"
                        />
                        <div className="flex items-center justify-between w-full mt-1.5 px-1">
                          <button
                            type="button"
                            onClick={isGameRunning ? jump : startGame}
                            className="text-[10px] font-semibold px-2.5 py-0.5 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {isGameRunning ? 'Tap to Jump' : gameOver ? 'Play Again' : 'Start Play'}
                          </button>
                          <span className="text-[10px] text-slate-400">Click or tap canvas to jump</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom tagline inside banner */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-medium truncate pr-2 text-slate-300">{project.tagline}</span>
                    <button
                      type="button"
                      onClick={() => setActiveModalProject(project)}
                      className="inline-flex items-center gap-1 text-[11px] text-violet-300 hover:text-white bg-[#07090e]/90 px-2.5 py-1 rounded-lg border border-white/[0.12] hover:border-violet-400 transition-colors shrink-0 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                        {project.category}
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Feature Bullets */}
                    <ul className="space-y-1.5 pt-1">
                      {project.features.slice(0, 3).map((feat, fIdx) => (
                        <li key={fIdx} className="text-xs text-slate-400 flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack & Action Links */}
                  <div className="space-y-4 pt-3 border-t border-white/[0.08]">
                    {/* Tech Used */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Tech Used:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.04] text-slate-300 border border-white/[0.08]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Links: GitHub & Live Demo */}
                    <div className="flex items-center gap-3 pt-2">
                      <a
                        id={`project-${project.id}-live-link`}
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveModalProject(project);
                        }}
                        className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r ${buttonGradient} hover:brightness-110 text-white shadow-lg shadow-violet-900/40 transition-all cursor-pointer active:scale-95`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>

                      <a
                        id={`project-${project.id}-github-link`}
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveModalProject(project);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] hover:border-violet-500/50 transition-all cursor-pointer active:scale-95"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    </div>

                    <div className="text-[11px] text-slate-400 italic text-center">
                      * Placeholders ready for live repo & deployment links
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Future Project Placeholder Banner */}
        <div className="mt-12 p-6 sm:p-7 rounded-3xl bg-white/[0.02] border border-dashed border-white/[0.12] text-center backdrop-blur-sm">
          <Sparkles className="w-5 h-5 text-violet-400 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-200">More AI Projects in Active Development</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
            Currently prototyping AI-automated video ad scripts, social media reels pipelines, and multi-agent marketing campaign workflows.
          </p>
        </div>
      </div>

      {/* Interactive Project Details Modal */}
      {activeModalProject && (
        <div
          id="project-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-[#0c101c] border border-white/[0.15] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {activeModalProject.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2.5">
                {activeModalProject.title}
              </h3>
              <p className="text-sm text-cyan-300 font-medium mt-1">
                {activeModalProject.tagline}
              </p>
            </div>

            {/* Project Image Banner inside Modal */}
            {activeModalProject.imageUrl && (
              <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-white/[0.1] relative">
                <img
                  src={activeModalProject.imageUrl}
                  alt={`${activeModalProject.title} - ${activeModalProject.badge} project showcase`}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c101c] via-transparent to-transparent opacity-60" />
              </div>
            )}

            {/* Modal Body */}
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Overview & Concept
                </h4>
                <p>{activeModalProject.longDescription}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Implemented Capabilities
                </h4>
                <ul className="space-y-2">
                  {activeModalProject.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Technologies & AI Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/[0.05] border border-white/[0.1] text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/30 text-xs text-violet-200">
                <strong>Customization Note for Sakshi:</strong> You can quickly replace the GitHub URL and live deployment domain in <code>portfolioData.ts</code> whenever your live repository or production link is ready!
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setActiveModalProject(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.06] text-slate-300 hover:text-white cursor-pointer"
              >
                Close Preview
              </button>
              <a
                href={activeModalProject.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r ${buttonGradient} text-white shadow-md cursor-pointer`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Placeholder Live Demo</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
