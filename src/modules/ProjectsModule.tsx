import { motion } from 'framer-motion';
import { FolderGit2, Code, Terminal } from 'lucide-react';

export function ProjectsModule({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  const projects = [
    { name: 'NEXUS OS', tech: 'React / Three.js', status: 'Active' },
    { name: 'SYNTHESIS', tech: 'Rust / Wasm', status: 'Compiling' },
    { name: 'AURA', tech: 'Python / PyTorch', status: 'Training' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full p-6 flex flex-col text-white font-sans bg-black/20 rounded-xl backdrop-blur-md border border-white/10"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600 uppercase">Dev Space</h2>
        <FolderGit2 className="text-cyan-500" />
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {projects.map((p, i) => (
          <motion.div 
            key={p.name}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-gradient-to-br from-white/5 to-transparent rounded-lg border border-white/10 hover:border-cyan-500/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-bold tracking-widest text-lg">{p.name}</div>
              <div className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${p.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {p.status}
              </div>
            </div>
            <div className="flex items-center text-gray-400 text-sm gap-2">
              <Code size={14} />
              <span>{p.tech}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-black/40 rounded-lg border border-white/5 font-mono text-xs text-green-400">
        <div className="flex items-center gap-2 mb-2 text-gray-500">
          <Terminal size={12} />
          <span>Build Logs</span>
        </div>
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          &gt; Compiling WebGL shaders...
          <br/>&gt; Linking dependencies...
          <br/>&gt; Awaiting user input
        </motion.div>
      </div>
    </motion.div>
  );
}
