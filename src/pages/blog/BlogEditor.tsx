import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import BlogLayout from '@/components/BlogLayout';
import Head from '@/components/Head';
import { toast } from 'sonner';

const STORAGE_KEY = 'blog-editor-draft-v1';

const STARTER_BODY = `Start writing here. This editor renders GitHub-flavored markdown exactly like the live blog.

## A section heading

Write a paragraph, add a [link](https://example.com), or drop in an image:

![alt text](/some-image.webp "medium")

- Bullet points work
- So do **bold** and *italic*

> And blockquotes, tables, and code blocks all render.
`;

interface Draft {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string;
  body: string;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const emptyDraft = (): Draft => ({
  title: '',
  slug: '',
  date: todayISO(),
  description: '',
  tags: '',
  body: STARTER_BODY,
});

// Mirrors the markdown image renderer used in BlogPost.tsx so the preview matches the live post.
const imgRenderer = ({ node, alt, src, title, ...props }: any) => {
  const sizeClasses: Record<string, string> = {
    small: 'max-w-full sm:max-w-xs',
    medium: 'max-w-full sm:max-w-md',
    large: 'max-w-full sm:max-w-2xl',
    full: 'w-full',
  };

  let className = 'mx-auto my-4 max-w-full h-auto';
  const style: React.CSSProperties = {};
  let actualTitle = title;
  let sizeSpec: string | undefined;
  let isInline = false;

  if (title?.includes('|')) {
    const parts = title.split('|');
    const lastPart = parts[parts.length - 1].trim();
    if (lastPart.toLowerCase() === 'inline') {
      isInline = true;
      actualTitle = parts.slice(0, -1).join('|').trim() || undefined;
    } else {
      const isValidSize = sizeClasses[lastPart.toLowerCase()] || lastPart.match(/^\d+(%|px|rem|em)$/);
      if (isValidSize) {
        sizeSpec = lastPart;
        actualTitle = parts.slice(0, -1).join('|').trim() || undefined;
      }
    }
  } else if (title?.toLowerCase() === 'inline') {
    isInline = true;
    actualTitle = undefined;
  } else {
    const isValidSize = title && (sizeClasses[title.toLowerCase()] || title.match(/^\d+(%|px|rem|em)$/));
    if (isValidSize) {
      sizeSpec = title;
      actualTitle = undefined;
    }
  }

  if (isInline) {
    className = 'block sm:inline-block mx-auto sm:m-2 my-3 sm:my-0 align-top max-w-full sm:max-w-[45%] h-auto';
  } else if (sizeSpec) {
    if (sizeClasses[sizeSpec.toLowerCase()]) {
      className += ` ${sizeClasses[sizeSpec.toLowerCase()]}`;
    } else if (sizeSpec.match(/^\d+(%|px|rem|em)$/)) {
      style.maxWidth = sizeSpec;
      className += ' max-w-full';
    }
  }

  return <img src={src} alt={alt || ''} title={actualTitle} className={className} style={style} {...props} />;
};

const proseClasses =
  'prose prose-sm sm:prose-base lg:prose-lg max-w-none [&>p]:leading-loose [&>p]:mb-4 [&>h1]:mb-4 [&>h1]:mt-8 [&>h1]:font-mono [&>h1]:text-xl [&>h1]:sm:text-2xl [&>h2]:mt-6 [&>h2]:sm:mt-8 [&>h2]:mb-3 [&>h2]:sm:mb-4 [&>h2]:text-lg [&>h2]:sm:text-xl [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:sm:ml-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:sm:ml-6 [&>ol]:mb-4 [&>li]:mb-2 [&>a]:text-gray-800 [&>a]:underline [&>a]:decoration-2 [&>a]:underline-offset-2 [&>a]:hover:text-black [&>a]:hover:decoration-gray-400 [&>a]:transition-all [&>a]:!font-bold [&>a]:break-words [&>pre]:overflow-x-auto [&>pre]:max-w-full [&>code]:break-words';

const BlogEditor = () => {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [slugTouched, setSlugTouched] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Load any saved draft on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Draft;
        setDraft({ ...emptyDraft(), ...parsed });
        if (parsed.slug) setSlugTouched(true);
      }
    } catch {
      /* ignore malformed drafts */
    }
  }, []);

  // Autosave (debounced) to localStorage.
  useEffect(() => {
    const id = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSavedAt(new Date().toLocaleTimeString());
    }, 600);
    return () => window.clearTimeout(id);
  }, [draft]);

  const update = (patch: Partial<Draft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const effectiveSlug = slugTouched && draft.slug ? draft.slug : slugify(draft.title) || 'untitled';

  const tagsArray = useMemo(
    () =>
      draft.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    [draft.tags],
  );

  const frontmatter = useMemo(() => {
    const tagsYaml = `[${tagsArray.map((t) => `"${t}"`).join(', ')}]`;
    return [
      '---',
      `title: "${draft.title.replace(/"/g, '\\"')}"`,
      `date: "${draft.date}"`,
      `description: "${draft.description.replace(/"/g, '\\"')}"`,
      `tags: ${tagsYaml}`,
      '---',
    ].join('\n');
  }, [draft.title, draft.date, draft.description, tagsArray]);

  const fullMarkdown = `${frontmatter}\n\n${draft.body}\n`;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error('Copy failed — your browser blocked clipboard access');
    }
  };

  const download = () => {
    const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${effectiveSlug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${effectiveSlug}.md`);
  };

  const resetDraft = () => {
    if (!window.confirm('Clear the current draft? This cannot be undone.')) return;
    setDraft(emptyDraft());
    setSlugTouched(false);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Draft cleared');
  };

  // Wrap or insert markdown around the current textarea selection.
  const applyFormat = (before: string, after = before, placeholder = '') => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = draft.body;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    update({ body: next });
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + before.length;
      el.setSelectionRange(cursor, cursor + selected.length);
    });
  };

  // Paste a URL while text is selected -> wrap it as a markdown link.
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === end) return; // no selection: let the browser paste normally
    const pasted = e.clipboardData.getData('text').trim();
    const isUrl = /^(https?:\/\/|mailto:)\S+$/i.test(pasted);
    if (!isUrl) return; // not a link: normal paste
    e.preventDefault();
    const value = draft.body;
    const selected = value.slice(start, end);
    const link = `[${selected}](${pasted})`;
    update({ body: value.slice(0, start) + link + value.slice(end) });
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + link.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  // Typing an opening bracket/quote while text is selected wraps the selection in the pair.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '<': '>',
      '"': '"',
      "'": "'",
      '`': '`',
    };
    const close = pairs[e.key];
    if (!close) return;
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === end) return; // no selection: type the character normally
    e.preventDefault();
    const value = draft.body;
    const selected = value.slice(start, end);
    update({ body: value.slice(0, start) + e.key + selected + close + value.slice(end) });
    requestAnimationFrame(() => {
      el.focus();
      // keep the original text selected, now between the new pair
      el.setSelectionRange(start + 1, start + 1 + selected.length);
    });
  };

  const toolbar: { label: string; title: string; action: () => void }[] = [
    { label: 'H2', title: 'Heading', action: () => applyFormat('## ', '', 'Section title') },
    { label: 'B', title: 'Bold', action: () => applyFormat('**', '**', 'bold text') },
    { label: 'I', title: 'Italic', action: () => applyFormat('*', '*', 'italic text') },
    { label: 'Link', title: 'Link', action: () => applyFormat('[', '](https://)', 'link text') },
    { label: 'Img', title: 'Image', action: () => applyFormat('![', '](/image.webp "medium")', 'alt text') },
    { label: 'List', title: 'Bullet list', action: () => applyFormat('- ', '', 'list item') },
    { label: 'Quote', title: 'Blockquote', action: () => applyFormat('> ', '', 'quote') },
    { label: 'Code', title: 'Inline code', action: () => applyFormat('`', '`', 'code') },
  ];

  const inputClass =
    'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900';

  return (
    <BlogLayout>
      <Head title="Blog Editor | Yash Thapliyal" description="Draft blog posts in a doc-style editor with live preview." />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Blog Editor</h1>
            {savedAt && <p className="text-sm text-gray-500">Saved {savedAt}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copy(fullMarkdown, 'Markdown')}
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Copy markdown
            </button>
            <button
              onClick={download}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              Download .md
            </button>
            <button
              onClick={resetDraft}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Editor column */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-medium text-gray-700">
                Title
                <input
                  className={`mt-1 ${inputClass}`}
                  value={draft.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="How I Did The Thing"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Slug
                <input
                  className={`mt-1 ${inputClass} font-mono`}
                  value={slugTouched ? draft.slug : effectiveSlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update({ slug: slugify(e.target.value) });
                  }}
                  placeholder="how-i-did-the-thing"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Date
                <input
                  type="date"
                  className={`mt-1 ${inputClass}`}
                  value={draft.date}
                  onChange={(e) => update({ date: e.target.value })}
                />
              </label>
              <label className="sm:col-span-2 text-sm font-medium text-gray-700">
                Description
                <input
                  className={`mt-1 ${inputClass}`}
                  value={draft.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="One-sentence summary shown in previews and link cards."
                />
              </label>
              <label className="sm:col-span-2 text-sm font-medium text-gray-700">
                Tags <span className="font-normal text-gray-400">(comma separated)</span>
                <input
                  className={`mt-1 ${inputClass}`}
                  value={draft.tags}
                  onChange={(e) => update({ tags: e.target.value })}
                  placeholder="engineering, life, notes"
                />
              </label>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 border-gray-300 bg-gray-100 px-2 py-1.5">
                {toolbar.map((t) => (
                  <button
                    key={t.label}
                    title={t.title}
                    onClick={t.action}
                    className="rounded px-2 py-1 text-xs font-medium text-gray-700 hover:bg-white"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <textarea
                ref={bodyRef}
                data-lenis-prevent
                value={draft.body}
                onChange={(e) => update({ body: e.target.value })}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                spellCheck
                className="h-[60vh] w-full resize-y rounded-b-md border border-gray-300 bg-white p-4 font-mono text-sm leading-relaxed focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="Write your post in markdown..."
              />
            </div>
          </div>

          {/* Preview column */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Live preview</div>
            <div
              data-lenis-prevent
              className="rounded-md border border-gray-200 bg-white p-5 sm:p-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
            >
              <article>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 break-words">
                  {draft.title || 'Untitled post'}
                </h1>
                <div className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8 break-words">
                  {draft.date ? new Date(draft.date).toLocaleDateString() : 'No date'}
                  {tagsArray.length > 0 && ` • ${tagsArray.join(', ')}`}
                </div>
                <div className={proseClasses}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{ img: imgRenderer }}>
                    {draft.body}
                  </ReactMarkdown>
                </div>
              </article>
            </div>
          </div>
        </div>

      </div>
    </BlogLayout>
  );
};

export default BlogEditor;
