import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PageHeader } from '@/components/PageHeader';

type GenerationMode = 'photo' | 'scratch';

const styles = ['scandinavian', 'industrial', 'minimalist', 'classic', 'boho', 'modern'] as const;
const palettes = ['light', 'dark', 'warm', 'cool', 'pastel'] as const;
const roomTypes = ['livingRoom', 'bedroom', 'kitchen', 'bathroom', 'office'] as const;

interface Iteration {
  id: string;
  label: string;
  isOriginal?: boolean;
}

export default function WorkspacePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectId, visualizationId } = useParams();

  const isNew = visualizationId === 'new';
  const [mode, setMode] = useState<GenerationMode>('photo');
  const [style, setStyle] = useState('');
  const [palette, setPalette] = useState('');
  const [roomType, setRoomType] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResult, setHasResult] = useState(!isNew);
  const [isEditMode, setIsEditMode] = useState(!isNew);
  const [roomPhotoPreview, setRoomPhotoPreview] = useState<string | null>(null);
  const creditBalance = 12;

  const [iterations] = useState<Iteration[]>(
    isNew ? [] : [
      { id: 'orig', label: t('workspace.original'), isOriginal: true },
      { id: 'it1', label: `${t('workspace.iteration')} 1` },
      { id: 'it2', label: `${t('workspace.iteration')} 2` },
      { id: 'it3', label: `${t('workspace.iteration')} 3` },
    ]
  );
  const [activeIteration, setActiveIteration] = useState(iterations.length > 0 ? iterations[iterations.length - 1].id : '');

  const handleRoomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRoomPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasResult(true);
      setIsEditMode(true);
    }, 3000);
  };

  const canGenerate = creditBalance >= 1 &&
    style && roomType &&
    (mode === 'photo' ? !!roomPhotoPreview : !!prompt.trim());

  return (
    <DashboardLayout subtitle="Wizualizacja">
      <div className="p-4 md:p-6 lg:p-8 space-y-5">
        <PageHeader
          title={isEditMode ? t('workspace.editTitle') : 'Nowa wizualizacja'}
          backTo={`/project/${projectId}`}
          backLabel={t('common.back')}
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Panel — Form */}
          <div className="w-full space-y-5 lg:w-[400px] lg:shrink-0">
            <div className="rounded-xl border bg-card p-5 shadow-card">
              {!isEditMode && (
                <div className="mb-5">
                  <Tabs value={mode} onValueChange={v => setMode(v as GenerationMode)}>
                    <TabsList className="w-full">
                      <TabsTrigger value="photo" className="flex-1">{t('workspace.modeFromPhoto')}</TabsTrigger>
                      <TabsTrigger value="scratch" className="flex-1">{t('workspace.modeFromScratch')}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}

              <div className="space-y-4">
                {/* Room photo upload — only in creation + photo mode */}
                {!isEditMode && mode === 'photo' && (
                  <div className="space-y-2">
                    <Label>{t('workspace.roomPhoto')} *</Label>
                    {roomPhotoPreview ? (
                      <div className="relative">
                        <img src={roomPhotoPreview} alt="Room" className="h-40 w-full rounded-lg object-cover" />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-2 top-2 h-7 w-7"
                          onClick={() => setRoomPhotoPreview(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-accent/50">
                        <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{t('workspace.roomPhotoHint')}</span>
                        <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp,.avif,.heic" onChange={handleRoomPhotoUpload} />
                      </label>
                    )}
                  </div>
                )}

                {/* Style */}
                <div className="space-y-2">
                  <Label>{t('workspace.style')} *</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger><SelectValue placeholder={t('workspace.stylePlaceholder')} /></SelectTrigger>
                    <SelectContent>
                      {styles.map(s => (
                        <SelectItem key={s} value={s}>{t(`styles.${s}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color palette */}
                <div className="space-y-2">
                  <Label>{t('workspace.colorPalette')}</Label>
                  <Select value={palette} onValueChange={setPalette}>
                    <SelectTrigger><SelectValue placeholder={t('workspace.colorPalettePlaceholder')} /></SelectTrigger>
                    <SelectContent>
                      {palettes.map(p => (
                        <SelectItem key={p} value={p}>{t(`palettes.${p}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Room type */}
                <div className="space-y-2">
                  <Label>{t('workspace.roomType')} *</Label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger><SelectValue placeholder={t('workspace.roomTypePlaceholder')} /></SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(r => (
                        <SelectItem key={r} value={r}>{t(`roomTypes.${r}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prompt */}
                <div className="space-y-2">
                  <Label>
                    {isEditMode ? t('workspace.editPrompt') : t('workspace.prompt')}
                    {(!isEditMode && mode === 'scratch') && ' *'}
                  </Label>
                  <Textarea
                    placeholder={isEditMode ? t('workspace.editPromptPlaceholder') : t('workspace.promptPlaceholder')}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    maxLength={1000}
                    rows={3}
                  />
                </div>

                {/* Furniture photos */}
                <div className="space-y-2">
                  <Label>{t('workspace.furniturePhotos')}</Label>
                  <label className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-primary hover:bg-accent/50">
                    <Upload className="mb-1 h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{t('workspace.furniturePhotosHint')}</span>
                    <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp,.avif,.heic" multiple />
                  </label>
                </div>

                {/* Generate button */}
                {creditBalance < 1 ? (
                  <div className="rounded-lg bg-accent p-3 text-center text-sm">
                    <p className="mb-2 text-accent-foreground">{t('workspace.noCredits')}</p>
                    <Button size="sm" onClick={() => navigate('/credits')} className="gradient-warm text-primary-foreground border-0">
                      {t('workspace.buyCredits')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="w-full gradient-warm text-primary-foreground border-0"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('workspace.generating')}
                      </>
                    ) : (
                      t('workspace.generate')
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel — Visualization */}
          <div className="flex-1 space-y-4">
            <div className="rounded-xl border bg-card shadow-card overflow-hidden">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex aspect-video flex-col items-center justify-center gap-4"
                  >
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">{t('workspace.generatingMessage')}</p>
                  </motion.div>
                ) : hasResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="aspect-video bg-muted flex items-center justify-center"
                  >
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-2 h-16 w-16 text-muted-foreground/20" />
                      <p className="text-sm text-muted-foreground">Wygenerowana wizualizacja</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex aspect-video flex-col items-center justify-center gap-2"
                  >
                    <ImageIcon className="h-16 w-16 text-muted-foreground/20" />
                    <p className="text-sm text-muted-foreground">{t('workspace.emptyVisualization')}</p>
                    <p className="text-xs text-muted-foreground/70">{t('workspace.emptyVisualizationHint')}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Thumbnail strip */}
            {iterations.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {iterations.map(it => (
                  <button
                    key={it.id}
                    onClick={() => setActiveIteration(it.id)}
                    className={`flex-shrink-0 rounded-lg border-2 p-1 transition-all ${
                      activeIteration === it.id
                        ? 'border-primary shadow-card'
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    <div className="flex h-16 w-24 items-center justify-center rounded bg-muted">
                      <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                    <p className="mt-1 text-center text-[10px] text-muted-foreground">{it.label}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
