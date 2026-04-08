import React, { useEffect, useState } from "react";
import { fetchLatestCommits, GitHubCommit } from "@/services/github";
import { motion, AnimatePresence } from "framer-motion";

const ActivityLog: React.FC = () => {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActivity = async () => {
    setLoading(true);
    const data = await fetchLatestCommits();
    setCommits(data);
    setLoading(false);
  };

  useEffect(() => {
    loadActivity();
    const interval = setInterval(loadActivity, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hud-glass tactical-border p-5 h-full flex flex-col shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline font-black uppercase text-[10px] text-primary tracking-[0.3em] flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-primary animate-pulse">settings_input_antenna</span>
            COLLABORATION FEED
        </h3>
        <button 
          onClick={loadActivity}
          className="material-symbols-outlined text-sm text-primary/40 hover:text-primary transition-all cursor-pointer"
        >
          sync
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
        {loading && commits.length === 0 ? (
          <div className="space-y-4 opacity-20">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-white/10 tactical-border"></div>)}
          </div>
        ) : (
          <AnimatePresence>
            {commits.map((commit, idx) => (
              <motion.div 
                key={commit.sha}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 p-4 border-l-2 border-primary/50 group hover:bg-white/10 transition-all cursor-default"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <img 
                      src={commit.author.avatar_url} 
                      alt={commit.author.login} 
                      className="w-6 h-6 rounded-none grayscale group-hover:grayscale-0 transition-all border border-white/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-tertiary border border-background"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{commit.author.login}</span>
                    <span className="text-[8px] font-mono text-primary/60 font-bold uppercase">{new Date(commit.commit.author.date).toLocaleTimeString()}</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/70 leading-relaxed font-body italic mb-2 border-l border-white/10 pl-3">
                  "{commit.commit.message}"
                </p>
                <div className="flex justify-between items-center px-1">
                   <span className="text-[7px] font-mono text-primary/40 font-bold">SHA: {commit.sha.slice(0, 10).toUpperCase()}</span>
                   <span className="text-[7px] font-mono text-tertiary/40 font-bold uppercase">Synced</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 text-center flex flex-col items-center gap-2">
         <span className="w-1 h-1 rounded-full bg-primary animate-ping"></span>
         <p className="text-[8px] font-black uppercase text-primary/30 tracking-[0.4em]">GitHub Network Pulse Active</p>
      </div>
    </div>
  );
};

export default ActivityLog;
