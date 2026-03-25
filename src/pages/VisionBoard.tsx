import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Image, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';

const CATEGORIES = ['All', 'Career', 'Money', 'Health', 'Travel', 'Education', 'Love', 'Lifestyle'];

const SAMPLE_IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=250&fit=crop', category: 'Career', label: 'Dream Job' },
  { id: 2, src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&h=250&fit=crop', category: 'Lifestyle', label: 'Dream Car' },
  { id: 3, src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=250&fit=crop', category: 'Lifestyle', label: 'Dream House' },
  { id: 4, src: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=300&h=250&fit=crop', category: 'Travel', label: 'World Travel' },
  { id: 5, src: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=250&fit=crop', category: 'Money', label: 'Financial Freedom' },
  { id: 6, src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=250&fit=crop', category: 'Health', label: 'Fitness Goals' },
  { id: 7, src: 'https://images.unsplash.com/photo-1481026469463-66327c86e544?w=300&h=250&fit=crop', category: 'Education', label: 'Top University' },
  { id: 8, src: 'https://images.unsplash.com/photo-1583394293214-41e15e25ef9c?w=300&h=250&fit=crop', category: 'Health', label: 'Mental Peace' },
  { id: 9, src: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300&h=250&fit=crop', category: 'Career', label: 'Own Business' },
  { id: 10, src: 'https://images.unsplash.com/photo-1511632436-cbf8dd35adfa?w=300&h=250&fit=crop', category: 'Love', label: 'Happy Family' },
  { id: 11, src: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300&h=250&fit=crop', category: 'Travel', label: 'Beach Paradise' },
  { id: 12, src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=250&fit=crop', category: 'Career', label: 'Startup Success' },
];

export default function VisionBoardPage() {
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [board, setBoard] = useState<typeof SAMPLE_IMAGES>([]);
  const [affirmation, setAffirmation] = useState('');
  const [affirmations, setAffirmations] = useState<string[]>([
    'I am worthy of all my dreams',
    'Success comes naturally to me',
    'I attract abundance and prosperity',
  ]);

  const filtered = activeCategory === 'All' ? SAMPLE_IMAGES : SAMPLE_IMAGES.filter((img) => img.category === activeCategory);

  const addToBoard = (img: typeof SAMPLE_IMAGES[0]) => {
    if (!board.find((b) => b.id === img.id)) {
      setBoard([...board, img]);
    }
  };

  const removeFromBoard = (id: number) => setBoard(board.filter((b) => b.id !== id));

  const addAffirmation = () => {
    if (affirmation.trim()) {
      setAffirmations([...affirmations, affirmation.trim()]);
      setAffirmation('');
    }
  };

  return (
    <div>
      <Navbar />
      <section className="pt-24 pb-8 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-5xl font-bold mb-3">
              Your <span className="text-gradient">Vision Board</span>
            </h1>
            <p className="text-muted-foreground text-lg">Visualize your dreams. Manifest your reality.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Image Library */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-4">Image Library</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filtered.map((img) => (
                  <motion.div
                    key={img.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative cursor-pointer rounded-xl overflow-hidden aspect-[4/3]"
                    onClick={() => isAuthenticated ? addToBoard(img) : null}
                  >
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-md transition-all">
                        {isAuthenticated ? '+ Add to Board' : 'Login to Add'}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs font-medium">{img.label}</p>
                      <p className="text-white/60 text-xs">{img.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Board & Affirmations */}
          <div className="space-y-6">
            {/* My Board */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">My Vision Board</h2>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{board.length} items</span>
              </div>
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <Lock className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">Login to create your personal vision board</p>
                  <Link to="/login" className="btn-primary text-sm">Login to Start</Link>
                </div>
              ) : board.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <div className="mb-2"><Image className="w-10 h-10 mx-auto text-muted-foreground" /></div>
                  Click images to add them to your board
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <AnimatePresence>
                    {board.map((img) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group rounded-lg overflow-hidden aspect-[4/3]"
                      >
                        <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFromBoard(img.id)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >×</button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              {isAuthenticated && board.length > 0 && (
                <button className="w-full mt-4 btn-primary text-sm">Save Board</button>
              )}
            </div>

            {/* Affirmations */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Text Affirmations</h2>
              <div className="space-y-2 mb-4">
                {affirmations.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-muted/50 rounded-lg">
                    <span className="text-primary text-xs mt-0.5">★</span>
                    <p className="text-sm italic">{a}</p>
                  </div>
                ))}
              </div>
              {isAuthenticated && (
                <div className="flex gap-2">
                  <input
                    value={affirmation}
                    onChange={(e) => setAffirmation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addAffirmation()}
                    placeholder="Add your affirmation..."
                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button onClick={addAffirmation} className="btn-primary text-sm px-4 py-2">+</button>
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white text-center">
                <h3 className="font-display font-bold text-xl mb-2">Create Your Vision Board</h3>
                <p className="text-white/80 text-sm mb-4">Sign up free to save your board and access all features</p>
                <Link to="/register" className="block w-full bg-white text-primary font-semibold py-2.5 rounded-lg hover:bg-white/90 transition-all">
                  Get Started Free <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
