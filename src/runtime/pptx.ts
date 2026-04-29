// Frontend PPTX export. Parses an HTML artifact in the browser, slices it
// into slides, and asks pptxgenjs to produce a real .pptx the user can
// open in PowerPoint / Keynote / WPS. This replaces the older path that
// asked the agent to invoke python-pptx server-side — that path was
// unreliable because it depended on the agent's Write tool support and on
// it correctly interpreting "one slide per section".
//
// pptxgenjs is loaded with a dynamic import so its ~1.5 MB ships in its
// own chunk and only fetches when the user actually clicks "Export PPTX".

function safeFilename(name: string, fallback: string): string {
  const slug = (name || fallback)
    .replace(/[^\w.\-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || fallback;
}

// Selectors tried in order for deck mode. The first one that matches at
// least one element wins — matches Open Design's own slide markers plus a
// few other common conventions.
const DECK_SLIDE_SELECTORS = [
  'section.slide',
  '.slide',
  '.deck-slide',
  '.ppt-slide',
  '[data-screen-label]',
];

interface SlideContent {
  title: string;
  bullets: string[];
  images: string[]; // data URLs or same-origin URLs
}

function textOf(el: Element | null): string {
  if (!el) return '';
  return (el.textContent || '').replace(/\s+/g, ' ').trim();
}

function extractFromContainer(container: Element): SlideContent {
  // Title: first non-empty h1/h2/h3 inside the container.
  let title = '';
  for (const sel of ['h1', 'h2', 'h3']) {
    const found = container.querySelector(sel);
    const txt = textOf(found);
    if (txt) {
      title = txt;
      break;
    }
  }

  // Bullets: every block-level text element except the chosen title and
  // its descendants. We walk in document order so bullets keep their
  // visual sequence.
  const seen = new Set<Element>();
  const bullets: string[] = [];
  const blockSel = 'p, li, blockquote, h4, h5, h6, dt, dd';
  container.querySelectorAll(blockSel).forEach((el) => {
    if (seen.has(el)) return;
    // Skip elements nested inside another bullet we already captured —
    // avoids duplicating <p> contents inside <blockquote>, etc.
    let p: Element | null = el.parentElement;
    while (p && p !== container) {
      if (seen.has(p)) return;
      p = p.parentElement;
    }
    const t = textOf(el);
    if (!t) return;
    // Skip the title text if it appears verbatim as a paragraph.
    if (title && t === title) return;
    seen.add(el);
    bullets.push(t);
  });

  // Images: only same-origin or data URLs. Cross-origin ones would need
  // a fetch + CORS, which we skip silently to keep the export reliable.
  const images: string[] = [];
  container.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (!src) return;
    if (src.startsWith('data:')) {
      images.push(src);
      return;
    }
    try {
      const u = new URL(src, window.location.href);
      if (u.origin === window.location.origin) {
        images.push(u.toString());
      }
    } catch {
      // Ignore malformed src.
    }
  });

  return { title, bullets, images };
}

function sliceSlides(doc: Document, deck: boolean): Element[] {
  const root = doc.body || doc.documentElement;
  if (!root) return [];

  if (deck) {
    for (const sel of DECK_SLIDE_SELECTORS) {
      const matched = Array.from(root.querySelectorAll(sel));
      if (matched.length > 0) return matched;
    }
  }

  // Fall back to top-level <section>s if any look section-like.
  const sections = Array.from(root.querySelectorAll('section'));
  if (sections.length >= 2) return sections;

  // Otherwise the whole body is one slide.
  return [root];
}

// Fetch a same-origin image and turn it into a data URL so pptxgenjs can
// embed it. Returns null if the fetch or read fails — the caller skips
// that image rather than aborting the whole export.
async function urlToDataUrl(url: string): Promise<string | null> {
  if (url.startsWith('data:')) return url;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function exportAsPptx(
  html: string,
  title: string,
  opts?: { deck?: boolean },
): Promise<void> {
  const deck = Boolean(opts?.deck);
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const containers = sliceSlides(doc, deck);
  const slides: SlideContent[] = containers.map(extractFromContainer);

  // If the document had no extractable text or images at all, fall back
  // to a single placeholder slide so the user still gets a valid .pptx.
  if (slides.length === 0 || slides.every((s) => !s.title && s.bullets.length === 0 && s.images.length === 0)) {
    slides.length = 0;
    slides.push({
      title: title || 'Untitled',
      bullets: ['(No extractable text content was found in the source HTML.)'],
      images: [],
    });
  }

  const PptxGenJSModule = await import('pptxgenjs');
  const PptxGenJS = (PptxGenJSModule as { default: new () => unknown }).default
    ?? (PptxGenJSModule as unknown as new () => unknown);
  const pptx = new (PptxGenJS as new () => {
    layout: string;
    addSlide: () => {
      addText: (text: string, opts: Record<string, unknown>) => unknown;
      addImage: (opts: Record<string, unknown>) => unknown;
    };
    writeFile: (opts: { fileName: string }) => Promise<string>;
  })();

  // 16:9 widescreen at 13.333" × 7.5" — matches the pptxgenjs preset.
  pptx.layout = 'LAYOUT_WIDE';
  const SLIDE_W = 13.333;
  const SLIDE_H = 7.5;

  for (const content of slides) {
    const slide = pptx.addSlide();

    if (content.title) {
      slide.addText(content.title, {
        x: 0.5,
        y: 0.4,
        w: SLIDE_W - 1,
        h: 1,
        fontSize: 32,
        bold: true,
        fontFace: 'Calibri',
        color: '111111',
        valign: 'top',
      });
    }

    // Lay out images on the right half (or below the title if no body
    // text). We deliberately keep this simple — full visual fidelity is
    // out of scope; the goal is editable text + a sensible visual.
    const dataUrls: string[] = [];
    for (const url of content.images.slice(0, 4)) {
      const data = await urlToDataUrl(url);
      if (data) dataUrls.push(data);
    }

    const hasImages = dataUrls.length > 0;
    const bodyX = 0.5;
    const bodyY = content.title ? 1.6 : 0.5;
    const bodyW = hasImages ? (SLIDE_W / 2) - 0.6 : SLIDE_W - 1;
    const bodyH = SLIDE_H - bodyY - 0.4;

    if (content.bullets.length > 0) {
      const text = content.bullets.slice(0, 12).join('\n');
      slide.addText(text, {
        x: bodyX,
        y: bodyY,
        w: bodyW,
        h: bodyH,
        fontSize: 16,
        fontFace: 'Calibri',
        color: '333333',
        valign: 'top',
        bullet: { type: 'bullet' },
        paraSpaceAfter: 6,
      });
    }

    if (hasImages) {
      const imgX = SLIDE_W / 2 + 0.1;
      const imgY = bodyY;
      const imgW = SLIDE_W / 2 - 0.6;
      const imgH = bodyH;
      // Single big image vs grid for multiples.
      if (dataUrls.length === 1) {
        slide.addImage({ data: dataUrls[0], x: imgX, y: imgY, w: imgW, h: imgH, sizing: { type: 'contain', w: imgW, h: imgH } });
      } else {
        const cols = 2;
        const rows = Math.ceil(dataUrls.length / cols);
        const cellW = imgW / cols - 0.1;
        const cellH = imgH / rows - 0.1;
        dataUrls.forEach((data, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          slide.addImage({
            data,
            x: imgX + c * (cellW + 0.1),
            y: imgY + r * (cellH + 0.1),
            w: cellW,
            h: cellH,
            sizing: { type: 'contain', w: cellW, h: cellH },
          });
        });
      }
    }
  }

  await pptx.writeFile({ fileName: `${safeFilename(title, 'artifact')}.pptx` });
}
