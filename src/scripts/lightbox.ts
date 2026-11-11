/**
 * Diagram viewer: a linked diagram (`[![alt](/img/system-design/…png)](same png)`) opens in a floating glass
 * dialog where the reader can zoom (wheel, pinch, buttons, keys) and pan (drag, arrow keys).
 * Without JavaScript the link simply opens the image.
 */

const LINK_SELECTOR = '.sl-markdown-content a:has(> img[src*="/img/system-design/"])';
const MIN_FACTOR = 0.5; // of the fitted scale
const MAX_SCALE = 2; // of the image's natural pixels: beyond this a PNG turns soft
const STEP = 1.25;
const PAN_STEP = 80;

let dialog: HTMLDialogElement | null = null;
let stage: HTMLDivElement;
let image: HTMLImageElement;
let zoomLabel: HTMLOutputElement;
let titleEl: HTMLParagraphElement;
let openLink: HTMLAnchorElement;
let opener: HTMLElement | null = null;

let scale = 1;
let fitScale = 1;
let x = 0;
let y = 0;

const pointers = new Map<number, { x: number; y: number }>();
let pinchDistance = 0;
let dragged = false;

function button(label: string, text: string, onClick: () => void): HTMLButtonElement {
	const b = document.createElement('button');
	b.type = 'button';
	b.className = 'cp-lightbox__btn';
	b.setAttribute('aria-label', label);
	b.title = label;
	b.textContent = text;
	b.addEventListener('click', onClick);
	return b;
}

function build(): HTMLDialogElement {
	const d = document.createElement('dialog');
	d.className = 'cp-lightbox not-content';
	d.setAttribute('aria-labelledby', 'cp-lightbox-title');

	const bar = document.createElement('div');
	bar.className = 'cp-lightbox__bar';

	titleEl = document.createElement('p');
	titleEl.className = 'cp-lightbox__title';
	titleEl.id = 'cp-lightbox-title';

	const hint = document.createElement('p');
	hint.className = 'cp-lightbox__hint';
	hint.textContent = 'Scroll or pinch to zoom, drag to move';

	const controls = document.createElement('div');
	controls.className = 'cp-lightbox__controls';
	zoomLabel = document.createElement('output');
	zoomLabel.className = 'cp-lightbox__zoom';
	zoomLabel.setAttribute('aria-live', 'polite');

	openLink = document.createElement('a');
	openLink.className = 'cp-lightbox__btn cp-lightbox__open';
	openLink.target = '_blank';
	openLink.rel = 'noopener noreferrer';
	openLink.textContent = 'Open image';

	controls.append(
		button('Zoom out', '−', () => zoomBy(1 / STEP)),
		zoomLabel,
		button('Zoom in', '+', () => zoomBy(STEP)),
		button('Fit to window', 'Fit', fit),
		openLink,
		button('Close', '✕', () => d.close()),
	);
	bar.append(titleEl, hint, controls);

	stage = document.createElement('div');
	stage.className = 'cp-lightbox__stage';
	image = document.createElement('img');
	image.className = 'cp-lightbox__img';
	image.draggable = false;
	image.decoding = 'async';
	stage.append(image);

	d.append(bar, stage);
	document.body.append(d);

	stage.addEventListener('wheel', onWheel, { passive: false });
	stage.addEventListener('pointerdown', onPointerDown);
	stage.addEventListener('pointermove', onPointerMove);
	stage.addEventListener('pointerup', onPointerUp);
	stage.addEventListener('pointercancel', onPointerUp);
	stage.addEventListener('dblclick', (e) => {
		const r = stage.getBoundingClientRect();
		if (scale > fitScale * 1.05) fit();
		else zoomAt(fitScale * 2.5, e.clientX - r.left, e.clientY - r.top);
	});
	d.addEventListener('keydown', onKey);
	// A click on the dim area outside the panel closes it.
	d.addEventListener('click', (e) => {
		if (e.target === d) d.close();
	});
	d.addEventListener('close', () => {
		document.documentElement.classList.remove('cp-lightbox-open');
		image.removeAttribute('src');
		opener?.focus();
	});
	window.addEventListener('resize', () => {
		if (d.open) fit();
	});
	return d;
}

function apply(): void {
	image.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
	zoomLabel.textContent = `${Math.round((scale / fitScale) * 100)}%`;
	stage.classList.toggle('is-zoomed', scale > fitScale * 1.01);
}

function clamp(): void {
	const r = stage.getBoundingClientRect();
	const w = image.naturalWidth * scale;
	const h = image.naturalHeight * scale;
	// Keep the image on screen: centred when it is smaller than the stage, edge-bounded when larger.
	x = w <= r.width ? (r.width - w) / 2 : Math.min(0, Math.max(r.width - w, x));
	y = h <= r.height ? (r.height - h) / 2 : Math.min(0, Math.max(r.height - h, y));
}

function fit(): void {
	const r = stage.getBoundingClientRect();
	if (!image.naturalWidth || !r.width) return;
	fitScale = Math.min(r.width / image.naturalWidth, r.height / image.naturalHeight);
	scale = fitScale;
	x = 0;
	y = 0;
	clamp();
	apply();
}

function zoomAt(next: number, cx: number, cy: number): void {
	const target = Math.min(Math.max(next, fitScale * MIN_FACTOR), Math.max(MAX_SCALE, fitScale));
	// Keep the point under the cursor fixed.
	x = cx - ((cx - x) * target) / scale;
	y = cy - ((cy - y) * target) / scale;
	scale = target;
	clamp();
	apply();
}

function zoomBy(factor: number): void {
	const r = stage.getBoundingClientRect();
	zoomAt(scale * factor, r.width / 2, r.height / 2);
}

function onWheel(e: WheelEvent): void {
	e.preventDefault();
	const r = stage.getBoundingClientRect();
	// Trackpad pinch arrives as a wheel event with ctrlKey and small deltas.
	const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
	const factor = Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.0015));
	zoomAt(scale * factor, e.clientX - r.left, e.clientY - r.top);
}

function onPointerDown(e: PointerEvent): void {
	if (e.button !== 0) return;
	stage.setPointerCapture(e.pointerId);
	pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
	dragged = false;
	if (pointers.size === 2) {
		const [a, b] = [...pointers.values()];
		pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
	}
	stage.classList.add('is-dragging');
}

function onPointerMove(e: PointerEvent): void {
	const prev = pointers.get(e.pointerId);
	if (!prev) return;
	const now = { x: e.clientX, y: e.clientY };
	pointers.set(e.pointerId, now);
	if (pointers.size === 2) {
		const [a, b] = [...pointers.values()];
		const dist = Math.hypot(a.x - b.x, a.y - b.y);
		const r = stage.getBoundingClientRect();
		if (pinchDistance) zoomAt((scale * dist) / pinchDistance, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
		pinchDistance = dist;
		return;
	}
	x += now.x - prev.x;
	y += now.y - prev.y;
	if (Math.abs(now.x - prev.x) + Math.abs(now.y - prev.y) > 0) dragged = true;
	clamp();
	apply();
}

function onPointerUp(e: PointerEvent): void {
	pointers.delete(e.pointerId);
	if (pointers.size < 2) pinchDistance = 0;
	if (pointers.size === 0) stage.classList.remove('is-dragging');
}

function onKey(e: KeyboardEvent): void {
	if (e.target instanceof HTMLButtonElement && (e.key === 'Enter' || e.key === ' ')) return;
	const pan: Record<string, [number, number]> = {
		ArrowLeft: [PAN_STEP, 0],
		ArrowRight: [-PAN_STEP, 0],
		ArrowUp: [0, PAN_STEP],
		ArrowDown: [0, -PAN_STEP],
	};
	if (e.key in pan) {
		const [dx, dy] = pan[e.key];
		x += dx;
		y += dy;
		clamp();
		apply();
	} else if (e.key === '+' || e.key === '=') zoomBy(STEP);
	else if (e.key === '-' || e.key === '_') zoomBy(1 / STEP);
	else if (e.key === '0') fit();
	else return;
	e.preventDefault();
}

function open(link: HTMLAnchorElement, img: HTMLImageElement): void {
	dialog ??= build();
	opener = link;
	const section = link.closest('section, .sl-markdown-content');
	let heading: Element | null = null;
	for (const h of section?.querySelectorAll('h2, h3') ?? []) {
		if (h.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING) heading = h;
	}
	titleEl.textContent = heading?.textContent?.trim() || 'Diagram';
	openLink.href = link.href;
	image.alt = img.alt;
	image.style.transform = '';
	document.documentElement.classList.add('cp-lightbox-open');
	dialog.showModal();
	image.onload = fit;
	image.src = img.currentSrc || img.src;
	if (image.complete) fit();
}

document.addEventListener('click', (e) => {
	if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
	const link = (e.target as Element | null)?.closest<HTMLAnchorElement>(LINK_SELECTOR);
	const img = link?.querySelector<HTMLImageElement>(':scope > img');
	if (!link || !img || typeof HTMLDialogElement !== 'function') return;
	e.preventDefault();
	open(link, img);
});

// Ignore the click that ends a drag, so releasing over the backdrop does not close the viewer.
document.addEventListener(
	'click',
	(e) => {
		if (dragged && dialog?.open && e.target === dialog) {
			e.stopImmediatePropagation();
			dragged = false;
		}
	},
	true,
);

export {};
