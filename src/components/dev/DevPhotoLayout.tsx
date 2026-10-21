import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpToLine, EyeOff, RotateCcw, Undo2, X } from 'lucide-react';

// Dev-only inline layout editing for the photography gallery: drag tiles to
// reorder, hover for move-to-top and remove. The dev server (devPhotoLayout in
// vite.config.ts) saves the layout to dev-photo-layout.json. Production builds get
// a pass-through instead (bottom of this file), so none of the editor is bundled.

export interface LayoutPhoto {
  filename: string;
  thumbnailUrl: string;
}

export interface PhotoLayout {
  order: string[];
  hidden: string[];
}

const ENDPOINT = '/__dev/photo-layout';

export const applyPhotoLayout = <T extends LayoutPhoto>(photos: T[], layout: PhotoLayout | null): T[] => {
  if (!layout) return photos;
  const hidden = new Set(layout.hidden);
  const rank = new Map(layout.order.map((name, i) => [name, i]));
  // Photos the layout doesn't know about yet keep their default order, after the ranked ones.
  return photos
    .map((photo, i) => ({ photo, key: rank.get(photo.filename) ?? layout.order.length + i }))
    .filter(({ photo }) => !hidden.has(photo.filename))
    .sort((a, b) => a.key - b.key)
    .map(({ photo }) => photo);
};

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const ToolbarButton = ({ title, disabled, onClick, children }: {
  title: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    title={title}
    disabled={disabled}
    onClick={onClick}
    className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs text-white transition-colors hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent"
  >
    {children}
  </button>
);

const useLayoutEditor = <T extends LayoutPhoto>(photos: T[]) => {
  const [layout, setLayout] = useState<PhotoLayout | null>(null);
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [history, setHistory] = useState<(PhotoLayout | null)[]>([]);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [dragName, setDragName] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ name: string; after: boolean } | null>(null);
  const [trayOpen, setTrayOpen] = useState(false);
  const saveTimer = useRef<number>();

  useEffect(() => {
    fetch(ENDPOINT)
      .then(res => res.json())
      .then(data => {
        setLayout(data.layout ?? null);
        setNewPhotos(data.newPhotos ?? []);
      })
      .catch(() => {});
  }, []);

  const shown = useMemo(() => applyPhotoLayout(photos, layout), [photos, layout]);
  const fresh = useMemo(() => new Set(newPhotos), [newPhotos]);

  const save = (next: PhotoLayout | null, fromUndo = false) => {
    if (!fromUndo) setHistory(h => [...h.slice(-49), layout]);
    setLayout(next);
    setSaveState('saving');
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
        });
        setSaveState(res.ok ? 'saved' : 'error');
      } catch {
        setSaveState('error');
      }
    }, 300);
  };

  const undo = () => {
    if (!history.length) return;
    setHistory(h => h.slice(0, -1));
    save(history[history.length - 1], true);
  };

  // Cmd/Ctrl+Z undoes the last edit.
  const undoRef = useRef(undo);
  undoRef.current = undo;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undoRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hiddenNames = layout?.hidden ?? [];
  const hidden = photos.filter(photo => hiddenNames.includes(photo.filename));

  const commitOrder = (order: T[], nextHidden = hiddenNames) =>
    save({ order: order.map(photo => photo.filename), hidden: nextHidden });

  const moveToTop = (photo: T) => commitOrder([photo, ...shown.filter(p => p !== photo)]);

  const remove = (photo: T) =>
    commitOrder(shown.filter(p => p !== photo), [...hiddenNames, photo.filename]);

  // Put a restored photo back where it sits in the default (filename) order.
  const restore = (photo: T) => {
    const defaultIndex = new Map(photos.map((p, i) => [p.filename, i]));
    const at = shown.findIndex(p => defaultIndex.get(p.filename)! > defaultIndex.get(photo.filename)!);
    const next = [...shown];
    next.splice(at === -1 ? next.length : at, 0, photo);
    commitOrder(next, hiddenNames.filter(name => name !== photo.filename));
    if (hidden.length === 1) setTrayOpen(false);
  };

  const endDrag = () => {
    setDragName(null);
    setDropTarget(null);
  };

  const drop = () => {
    if (dragName && dropTarget && dragName !== dropTarget.name) {
      const dragged = shown.find(p => p.filename === dragName)!;
      const rest = shown.filter(p => p !== dragged);
      const at = rest.findIndex(p => p.filename === dropTarget.name) + (dropTarget.after ? 1 : 0);
      rest.splice(at, 0, dragged);
      commitOrder(rest);
    }
    endDrag();
  };

  const tileProps = (photo: T) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', photo.filename);
      setDragName(photo.filename);
    },
    onDragOver: (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      // Photos fill rows left to right, so the left or right half decides before or after.
      const rect = e.currentTarget.getBoundingClientRect();
      const after = e.clientX > rect.left + rect.width / 2;
      if (dropTarget?.name !== photo.filename || dropTarget.after !== after) {
        setDropTarget({ name: photo.filename, after });
      }
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      drop();
    },
    onDragEnd: endDrag,
    style: dragName === photo.filename ? { opacity: 0.3 } : undefined,
  });

  const tileControls = (photo: T) => (
    <>
      {dragName && dragName !== photo.filename && dropTarget?.name === photo.filename && (
        <span
          className={`pointer-events-none absolute inset-y-0 z-20 w-1.5 bg-black shadow-[0_0_0_2px_white] ${dropTarget.after ? 'right-0' : 'left-0'}`}
        />
      )}
      {fresh.has(photo.filename) && (
        <span className="absolute left-3 top-3 z-20 rounded-md bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-black opacity-0 shadow transition-opacity group-hover:opacity-100">
          NEW
        </span>
      )}
      <div
        className="absolute right-3 top-3 z-20 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={e => e.stopPropagation()}
      >
        {shown[0] !== photo && (
          <button
            title="Move to top"
            onClick={() => moveToTop(photo)}
            className="rounded-lg bg-white/90 p-1.5 text-black shadow backdrop-blur-sm hover:bg-white"
          >
            <ArrowUpToLine className="h-4 w-4" />
          </button>
        )}
        <button
          title="Remove"
          onClick={() => remove(photo)}
          className="rounded-lg bg-white/90 p-1.5 text-red-600 shadow backdrop-blur-sm hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );

  const status = { idle: layout ? 'Saved' : 'Default order', saving: 'Saving…', saved: 'Saved', error: 'Save failed' }[saveState];

  const toolbar = (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 font-mono">
      {trayOpen && hidden.length > 0 && (
        <div data-lenis-prevent className="max-h-80 w-80 overflow-y-auto rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-black/5">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">Removed · click to restore</p>
          <div className="grid grid-cols-4 gap-2">
            {hidden.map(photo => (
              <button
                key={photo.filename}
                onClick={() => restore(photo)}
                title={`Restore ${photo.filename.replace(/[-_]/g, ' ')}`}
                className="group/restore relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-200"
              >
                <img
                  src={photo.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover opacity-50 grayscale transition group-hover/restore:opacity-100 group-hover/restore:grayscale-0"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-0.5 rounded-2xl bg-black p-1.5 text-white shadow-2xl">
        <span className="ml-1 rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] tracking-wider">DEV</span>
        <span className="px-2 text-xs text-white/70" title="Drag photos to reorder. Hover a photo to move it to the top or remove it.">
          {shown.length} shown ·{' '}
          <span className={saveState === 'error' ? 'font-semibold text-red-400' : ''}>{status}</span>
        </span>
        <ToolbarButton title="Undo (⌘Z)" disabled={!history.length} onClick={undo}>
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Removed photos" disabled={!hidden.length} onClick={() => setTrayOpen(open => !open)}>
          <EyeOff className="h-4 w-4" /> {hidden.length}
        </ToolbarButton>
        <ToolbarButton title="Reset to default order" disabled={!layout} onClick={() => save(null)}>
          <RotateCcw className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );

  return { shown, tileProps, tileControls, toolbar };
};

const passThrough = <T extends LayoutPhoto>(photos: T[]) => ({
  shown: photos,
  tileProps: (_photo: T) => ({}),
  tileControls: (_photo: T): React.ReactNode => null,
  toolbar: null as React.ReactNode,
});

export const useDevPhotoLayout: typeof useLayoutEditor = import.meta.env.DEV
  ? useLayoutEditor
  : (passThrough as unknown as typeof useLayoutEditor);
