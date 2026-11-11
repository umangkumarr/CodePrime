/**
 * Step carousels (built by src/plugins/rehype-step-carousel.mjs): adds previous/next buttons, a step counter,
 * a progress indicator, a Play button and arrow-key control on top of the scroll-snap track. Without
 * JavaScript the track still scrolls one step at a time.
 */

const PLAY_MS = 1600;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text = ''): HTMLElementTagNameMap[K] {
	const e = document.createElement(tag);
	e.className = cls;
	if (text) e.textContent = text;
	return e;
}

function setup(fig: HTMLElement): void {
	const track = fig.querySelector<HTMLOListElement>('.cp-steps__track');
	const caption = fig.querySelector('.cp-steps__caption');
	if (!track || !caption) return;
	const slides = [...track.children] as HTMLElement[];
	const count = slides.length;
	if (count < 2) return;

	const prev = el('button', 'cp-steps__btn', '‹');
	const next = el('button', 'cp-steps__btn', '›');
	const play = el('button', 'cp-steps__btn cp-steps__play', 'Play');
	const counter = el('output', 'cp-steps__count');
	const progress = el('span', 'cp-steps__progress');
	const bar = el('span', 'cp-steps__progress-bar');
	progress.append(bar);
	progress.setAttribute('aria-hidden', 'true');
	for (const [b, label] of [
		[prev, 'Previous step'],
		[next, 'Next step'],
	] as const) {
		b.type = 'button';
		b.setAttribute('aria-label', label);
		b.title = label;
	}
	play.type = 'button';
	play.setAttribute('aria-pressed', 'false');
	counter.setAttribute('aria-live', 'polite');

	const controls = el('div', 'cp-steps__controls');
	controls.append(prev, counter, next, progress, play);
	caption.replaceChildren(controls);
	fig.classList.add('is-enhanced');

	let index = 0;
	let timer = 0;

	const render = () => {
		counter.textContent = `Step ${index + 1} of ${count}`;
		bar.style.transform = `scaleX(${(index + 1) / count})`;
		prev.disabled = index === 0;
		next.disabled = index === count - 1 && !timer;
	};

	const go = (i: number, smooth = true) => {
		index = Math.max(0, Math.min(count - 1, i));
		track.scrollTo({left: index * track.clientWidth, behavior: smooth && !reduceMotion() ? 'smooth' : 'auto'});
		render();
	};

	const stop = () => {
		clearInterval(timer);
		timer = 0;
		play.textContent = 'Play';
		play.setAttribute('aria-pressed', 'false');
		render();
	};

	const start = () => {
		if (index === count - 1) go(0, false);
		play.textContent = 'Pause';
		play.setAttribute('aria-pressed', 'true');
		timer = window.setInterval(() => {
			if (index >= count - 1) stop();
			else go(index + 1);
		}, PLAY_MS);
		render();
	};

	prev.addEventListener('click', () => {
		stop();
		go(index - 1);
	});
	next.addEventListener('click', () => {
		stop();
		go(index + 1);
	});
	play.addEventListener('click', () => (timer ? stop() : start()));

	track.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
			e.preventDefault();
			stop();
			go(index + (e.key === 'ArrowRight' ? 1 : -1));
		} else if (e.key === 'Home' || e.key === 'End') {
			e.preventDefault();
			stop();
			go(e.key === 'Home' ? 0 : count - 1);
		}
	});

	// Swiping or scrolling the track by hand: follow it once the scroll settles (a smooth programmatic
	// scroll passes over intermediate steps, which must not flash in the counter).
	let settle = 0;
	track.addEventListener(
		'scroll',
		() => {
			clearTimeout(settle);
			settle = window.setTimeout(() => {
				const i = Math.round(track.scrollLeft / track.clientWidth);
				if (i !== index) {
					index = Math.max(0, Math.min(count - 1, i));
					render();
				}
			}, 120);
		},
		{passive: true},
	);
	track.addEventListener('pointerdown', () => timer && stop(), {passive: true});

	// Stop playing when the carousel leaves the screen.
	new IntersectionObserver(([entry]) => {
		if (!entry.isIntersecting && timer) stop();
	}).observe(fig);

	render();
}

document.querySelectorAll<HTMLElement>('.cp-steps').forEach(setup);

export {};
