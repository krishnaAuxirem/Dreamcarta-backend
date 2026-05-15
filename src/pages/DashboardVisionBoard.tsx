import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Sparkles, Edit3, Trash2, BarChart3, Lightbulb } from 'lucide-react';
const BOARD_STORAGE_KEY = 'dc_vision_board_metadata';

interface BoardMetadata {
  name: string;
  description: string;
  createdAt: string;
}

const loadBoardMetadata = (): BoardMetadata => {
  try {
    const raw = localStorage.getItem(BOARD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { name: 'My Dream Life', description: '', createdAt: new Date().toISOString() };
  } catch {
    return { name: 'My Dream Life', description: '', createdAt: new Date().toISOString() };
  }
};

const saveBoardMetadata = (metadata: BoardMetadata) => {
  localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(metadata));
};
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  createVisionBoardItemApi,
  deleteVisionBoardItemApi,
  getVisionBoardItemsApi,
  updateVisionBoardItemApi,
} from '@/lib/api/visionBoardApi';
import { VisionBoardItem } from '@/types';
import { toast } from '@/components/ui/sonner';

const CATEGORIES = ['All', 'Career', 'Money', 'Health', 'Travel', 'Love', 'Lifestyle', 'Education'];

const SAMPLE_IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=250&fit=crop', category: 'Career', label: 'Dream Startup' },
  { id: 2, src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&h=250&fit=crop', category: 'Lifestyle', label: 'Dream Car' },
  { id: 3, src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=250&fit=crop', category: 'Lifestyle', label: 'Dream House' },
  { id: 4, src: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=300&h=250&fit=crop', category: 'Travel', label: 'World Travel' },
  { id: 5, src: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=250&fit=crop', category: 'Money', label: 'Financial Freedom' },
  { id: 6, src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=250&fit=crop', category: 'Health', label: 'Fitness Goals' },
  { id: 7, src: 'https://images.unsplash.com/photo-1481026469463-66327c86e544?w=300&h=250&fit=crop', category: 'Education', label: 'Top University' },
  { id: 8, src: 'https://images.unsplash.com/photo-1511632436-cbf8dd35adfa?w=300&h=250&fit=crop', category: 'Love', label: 'Happy Family' },
  { id: 9, src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=300&h=250&fit=crop', category: 'Travel', label: 'Japan Dream' },
  { id: 10, src: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300&h=250&fit=crop', category: 'Career', label: 'Dream Office' },
  { id: 11, src: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300&h=250&fit=crop', category: 'Travel', label: 'Beach Life' },
  { id: 12, src: 'https://images.unsplash.com/photo-1583394293214-41e15e25ef9c?w=300&h=250&fit=crop', category: 'Health', label: 'Mental Peace' },
];

export default function DashboardVisionBoardPage() {
  const [board, setBoard] = useState<Array<{ id: string; src: string; category: string; label: string }>>([]);
  const [visionItems, setVisionItems] = useState<VisionBoardItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [affirmation, setAffirmation] = useState('');
  const [affirmations, setAffirmations] = useState<Array<{ id: string; text: string }>>([]);
  const [boardMetadata, setBoardMetadata] = useState<BoardMetadata>(loadBoardMetadata());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingAffirmationId, setEditingAffirmationId] = useState<string | null>(null);
  const [editingAffirmationText, setEditingAffirmationText] = useState('');
  const [showBoardInfo, setShowBoardInfo] = useState(false);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    board.forEach(item => {
      stats[item.category] = (stats[item.category] || 0) + 1;
    });
    return stats;
  }, [board]);

  const dailyFeaturedAffirmation = useMemo(() => {
    if (affirmations.length === 0) return null;
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const idx = seed % affirmations.length;
    return affirmations[idx];
  }, [affirmations]);

  const filtered = useMemo(
    () => (activeCategory === 'All' ? SAMPLE_IMAGES : SAMPLE_IMAGES.filter((i) => i.category === activeCategory)),
    [activeCategory]
  );

  const toBoardEntry = (item: VisionBoardItem) => {
    const matchedSample = SAMPLE_IMAGES.find((img) => img.src === item.content);
    return {
      id: item.id,
      src: item.content,
      category: item.category || matchedSample?.category || 'Lifestyle',
      label: matchedSample?.label || 'Vision Item',
    };
  };

  const loadVisionBoard = async () => {
    try {
      setLoading(true);
      setError('');
      const items = await getVisionBoardItemsApi();
      setVisionItems(items);
      setBoard(items.filter((item) => item.type === 'image').map(toBoardEntry));
      setAffirmations(items.filter((item) => item.type === 'text').map((item) => ({ id: item.id, text: item.content })));
    } catch {
      setError('Failed to load vision board. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVisionBoard();
  }, []);

  const addToBoard = async (img: typeof SAMPLE_IMAGES[0]) => {
    if (board.find((b) => b.src === img.src)) {
      return;
    }

    try {
      setSubmitting(true);
      const created = await createVisionBoardItemApi({
        type: 'image',
        content: img.src,
        category: img.category,
        x: 0,
        y: 0,
        width: 4,
        height: 3,
      });
      setVisionItems((prev) => [created, ...prev]);
      setBoard((prev) => [{ id: created.id, src: img.src, category: img.category, label: img.label }, ...prev]);
      toast.success('Image added to board');
    } catch {
      toast.error('Failed to add image');
    } finally {
      setSubmitting(false);
    }
  };

  const removeFromBoard = async (id: string) => {
    const deletedVisionItem = visionItems.find((item) => item.id === id);
    const visionIndex = visionItems.findIndex((item) => item.id === id);
    const deletedBoardEntry = board.find((item) => item.id === id);
    const boardIndex = board.findIndex((item) => item.id === id);
    const deletedAffirmation = affirmations.find((item) => item.id === id);
    const affirmationIndex = affirmations.findIndex((item) => item.id === id);

    setVisionItems((prev) => prev.filter((item) => item.id !== id));
    setBoard((prev) => prev.filter((b) => b.id !== id));
    setAffirmations((prev) => prev.filter((a) => a.id !== id));

    try {
      await deleteVisionBoardItemApi(id);
      toast.success('Item removed from board');
    } catch {
      if (deletedVisionItem && visionIndex >= 0) {
        setVisionItems((prev) => {
          if (prev.some((item) => item.id === id)) {
            return prev;
          }

          const next = [...prev];
          next.splice(Math.min(visionIndex, next.length), 0, deletedVisionItem);
          return next;
        });
      }

      if (deletedBoardEntry && boardIndex >= 0) {
        setBoard((prev) => {
          if (prev.some((item) => item.id === id)) {
            return prev;
          }

          const next = [...prev];
          next.splice(Math.min(boardIndex, next.length), 0, deletedBoardEntry);
          return next;
        });
      }

      if (deletedAffirmation && affirmationIndex >= 0) {
        setAffirmations((prev) => {
          if (prev.some((item) => item.id === id)) {
            return prev;
          }

          const next = [...prev];
          next.splice(Math.min(affirmationIndex, next.length), 0, deletedAffirmation);
          return next;
        });
      }

      toast.error('Failed to remove item');
    }
  };

  const addAffirmation = async () => {
    if (!affirmation.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const created = await createVisionBoardItemApi({
        type: 'text',
        content: affirmation.trim(),
        category: 'Affirmation',
        x: 0,
        y: 0,
        width: 4,
        height: 1,
      });
      setVisionItems((prev) => [created, ...prev]);
      setAffirmations((prev) => [...prev, { id: created.id, text: created.content }]);
      setAffirmation('');
      toast.success('Affirmation added');
    } catch {
      toast.error('Failed to add affirmation');
    } finally {
      setSubmitting(false);
    }
  };

  const saveBoard = async () => {
    if (visionItems.length === 0) {
      return;
    }

    try {
      setSubmitting(true);
      await Promise.all(
        visionItems.map((item) =>
          updateVisionBoardItemApi(item.id, {
            type: item.type,
            content: item.content,
            category: item.category,
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height,
          })
        )
      );
      toast.success('Vision board saved');
    } catch {
      toast.error('Failed to save vision board');
    } finally {
      setSubmitting(false);
    }
  };

  const editAffirmation = async (id: string) => {
    if (!editingAffirmationText.trim()) {
      return;
    }
    
    try {
      setSubmitting(true);
      const affirmationToUpdate = affirmations.find(a => a.id === id);
      if (!affirmationToUpdate) return;
      
      const visionItem = visionItems.find(v => v.id === id);
      if (visionItem) {
        await updateVisionBoardItemApi(id, {
          type: 'text',
          content: editingAffirmationText.trim(),
          category: 'Affirmation',
          x: visionItem.x,
          y: visionItem.y,
          width: visionItem.width,
          height: visionItem.height,
        });
      }
      setAffirmations(prev => prev.map(a => a.id === id ? { ...a, text: editingAffirmationText } : a));
      setEditingAffirmationId(null);
      setEditingAffirmationText('');
      toast.success('Affirmation updated');
    } catch {
      toast.error('Failed to update affirmation');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditAffirmation = (id: string, text: string) => {
    setEditingAffirmationId(id);
    setEditingAffirmationText(text);
  };

  const updateBoardMetadata = (metadata: Partial<BoardMetadata>) => {
    const updated = { ...boardMetadata, ...metadata };
    setBoardMetadata(updated);
    saveBoardMetadata(updated);
  };

  return (
    <DashboardLayout title="Vision Board">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input value={boardMetadata.name} onChange={(e) => updateBoardMetadata({ name: e.target.value })} className="font-display text-2xl font-bold bg-transparent border-b-2 border-dashed border-border focus:border-primary outline-none w-full" />
            {boardMetadata.description && <p className="text-xs text-muted-foreground mt-1">{boardMetadata.description}</p>}
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setShowBoardInfo(!showBoardInfo)} className="flex items-center gap-1 text-sm px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              <BarChart3 className="w-4 h-4" /> Info
            </button>
            <button onClick={() => void saveBoard()} className="btn-primary text-sm px-4 py-2" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
          </div>
        </div>

        {showBoardInfo && (
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <textarea value={boardMetadata.description} onChange={(e) => updateBoardMetadata({ description: e.target.value })} placeholder="Board description..." className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" rows={2} />
            {Object.keys(categoryStats).length > 0 && <div className="pt-2 border-t border-border space-y-1"><p className="text-xs font-semibold text-muted-foreground">Vision Distribution:</p><div className="grid grid-cols-2 gap-2">{Object.entries(categoryStats).map(([cat, count]) => <div key={cat} className="text-xs flex justify-between px-2 py-1 bg-muted/50 rounded"><span>{cat}</span><span className="font-bold text-primary">{count}</span></div>)}</div></div>}
          </div>
        )}

        {loading && <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">Loading vision board...</div>}
        {!loading && error && (
          <div className="bg-card border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center">
            <p className="text-sm text-red-500 mb-3">{error}</p>
            <button onClick={() => void loadVisionBoard()} className="btn-primary text-sm px-4 py-2">Retry</button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">Image Library</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10'}`}>{cat}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filtered.map((img) => (
                  <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="group relative cursor-pointer rounded-xl overflow-hidden aspect-[4/3]"
                    onClick={() => void addToBoard(img)}
                  >
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs bg-primary/80 px-2 py-1 rounded-md">+ Add</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs font-medium">{img.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm">Your Board</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{board.length} items</span>
                </div>
                {board.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <Image className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                    Click images to add them
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <AnimatePresence>
                      {board.map((img) => (
                        <motion.div key={img.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                          className="relative group rounded-lg overflow-hidden aspect-[4/3]"
                        >
                          <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                          <button onClick={() => void removeFromBoard(img.id)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Affirmations
                </h3>
                <div className="space-y-2 mb-3">
                  {dailyFeaturedAffirmation && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg mb-2">
                      <p className="text-xs text-muted-foreground mb-1"><Lightbulb className="w-3 h-3 inline mr-1" />Today's Focus</p>
                      <p className="text-sm italic text-foreground font-medium">"{dailyFeaturedAffirmation.text}"</p>
                    </motion.div>
                  )}
                  {affirmations.map((a) => (
                    <div key={a.id} className="flex items-start gap-2 p-2 bg-muted/40 rounded-lg group">
                      <span className="text-primary text-xs mt-0.5">★</span>
                       {editingAffirmationId === a.id ? (
                         <div className="flex-1 flex gap-1">
                           <input value={editingAffirmationText} onChange={(e) => setEditingAffirmationText(e.target.value)} className="flex-1 text-xs px-2 py-1 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                           <button onClick={() => void editAffirmation(a.id)} className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600" disabled={submitting}>✓</button>
                           <button onClick={() => setEditingAffirmationId(null)} className="text-xs px-2 py-1 border border-border rounded hover:bg-muted">✕</button>
                         </div>
                       ) : (
                         <>
                           <p className="text-xs italic flex-1">{a.text}</p>
                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => startEditAffirmation(a.id, a.text)} className="text-xs text-muted-foreground hover:text-primary"><Edit3 className="w-3 h-3" /></button>
                             <button onClick={() => void removeFromBoard(a.id)} className="text-xs text-muted-foreground hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                           </div>
                         </>
                       )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={affirmation} onChange={(e) => setAffirmation(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && void addAffirmation()} placeholder="Add affirmation..." className="flex-1 text-xs px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary" />
                  <button onClick={() => void addAffirmation()} className="btn-primary text-sm px-3 py-2" disabled={submitting}>+</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
