// Elements
///////////////////////////////////////

// Modal window
const modal = <HTMLDivElement>document.querySelector('.modal');
const overlay = <HTMLDivElement>document.querySelector('.overlay');
const btnCloseModal = <HTMLButtonElement>(
	document.querySelector('.btn--close-modal')
);
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Scroll to section
const btnScrollTo = <HTMLButtonElement>(
	document.querySelector('.btn--scroll-to')
);
const section1 = <HTMLElement>document.querySelector('#section--1');

// Tapped component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = <HTMLDivElement>(
	document.querySelector('.operations__tab-container')
);
const tabsContent = document.querySelectorAll('.operations__content');

// Fading links
const nav = <HTMLElement>document.querySelector('.nav');

// Sticky navigation
const header = <HTMLHeadingElement>document.querySelector('.header');

// Reveal sections
const allSections = document.querySelectorAll('.section');
///////////////////////////////////////
///////////////////////////////////////
// Modal window Functions
const openModal = function (e: Event): void {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function (): void {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

///////////////////////////////////////
///////////////////////////////////////
// Event handlers
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e): void {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});

//////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (): void {
	section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////
// Page navigation using event propagation:
//  1. Add event listener to common parent element
//  2. Determine what element originated the event

// 1. Select a parent elemen
const navLinksList = <HTMLUListElement>document.querySelector('.nav__links');
navLinksList.addEventListener('click', function (e: Event): void {
	e.preventDefault();
	// 2. Determine a matching startegy (pattern)
	if (
		(e.target as HTMLAnchorElement).classList.contains('nav__link') &&
		!(e.target as HTMLAnchorElement).classList.contains('nav__link--btn')
	) {
		const id = <string>(e.target as HTMLAnchorElement).getAttribute('href');
		document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
	}
});

/////////////////////////////////////
// Tapped Component
tabsContainer.addEventListener('click', function (e: Event): void {
	const clicked = (e.target as HTMLButtonElement).closest('.operations__tab');

	// Gaurd Clause - Return if NO button is clicked
	if (!clicked) return;

	// Remove active class from buttons
	tabs.forEach(t => t.classList.remove('operations__tab--active'));

	// Remove active class from tabs content
	tabsContent.forEach(c => c.classList.remove('operations__content--active'));

	// Activate tab
	clicked.classList.add('operations__tab--active');

	// Activate content area
	const operationsContentArea = <
		HTMLDivElement // @ts-expect-error
	>document.querySelector(`.operations__content--${clicked.dataset.tab}`);
	operationsContentArea.classList.add('operations__content--active');
});

/////////////////////////////////////
// Menu Fade Animition
const handleHover = function (this: string, e: Event): void {
	if (!e.target) return;
	if ((e.target as HTMLAnchorElement).classList.contains('nav__link')) {
		const link = e.target as HTMLAnchorElement;

		const siblings = link
			.closest('.nav')
			?.querySelectorAll('.nav__link') as NodeListOf<HTMLAnchorElement>;
		const logo = link.closest('.nav')?.querySelector('img') as HTMLImageElement;

		siblings.forEach(el => {
			if (el !== link) el.style.opacity = this;
		});
		logo.style.opacity = this;
	}
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind('0.5'));
nav.addEventListener('mouseout', handleHover.bind('1'));

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const navHeight: number = nav.getBoundingClientRect().height;

const stickyNav = function (entries: IntersectionObserverEntry[]): void {
	const [entry] = entries;

	if (!entry.isIntersecting) nav.classList.add('sticky');
	else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections

const revealSection = function (
	entries: IntersectionObserverEntry[],
	observer: IntersectionObserver
): void {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	entry.target.classList.remove('section--hidden');
	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

allSections.forEach(function (section) {
	sectionObserver.observe(section);
	section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (
	entries: IntersectionObserverEntry[],
	observer: IntersectionObserver
): void {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	// Replace src with data-src
	// @ts-expect-error
	(entry.target as HTMLImageElement).src = entry.target.dataset.src;

	entry.target.addEventListener('load', function (): void {
		entry.target.classList.remove('lazy-img');
	});

	observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
	rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function (): void {
	const slides = <NodeListOf<HTMLDivElement>>(
		document.querySelectorAll('.slide')
	);
	const btnLeft = <HTMLButtonElement>(
		document.querySelector('.slider__btn--left')
	);
	const btnRight = <HTMLButtonElement>(
		document.querySelector('.slider__btn--right')
	);
	const dotContainer = <HTMLDivElement>document.querySelector('.dots');

	let curSlide = 0;
	const maxSlide = slides.length;

	// Functions
	const createDots = function (): void {
		slides.forEach(function (_, i): void {
			dotContainer.insertAdjacentHTML(
				'beforeend',
				`<button class="dots__dot" data-slide="${i}"></button>`
			);
		});
	};

	const activateDot = function (slide: any): void {
		document
			.querySelectorAll('.dots__dot')
			.forEach(dot => dot.classList.remove('dots__dot--active'));

		document
			.querySelector(`.dots__dot[data-slide="${slide}"]`)
			?.classList.add('dots__dot--active');
	};

	const goToSlide = function (slide: any): void {
		slides.forEach(
			(s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
		);
	};

	// Next slide
	const nextSlide = function (): void {
		if (curSlide === maxSlide - 1) {
			curSlide = 0;
		} else {
			curSlide++;
		}

		goToSlide(curSlide);
		activateDot(curSlide);
	};

	const prevSlide = function (): void {
		if (curSlide === 0) {
			curSlide = maxSlide - 1;
		} else {
			curSlide--;
		}
		goToSlide(curSlide);
		activateDot(curSlide);
	};

	const init = function (): void {
		goToSlide(0);
		createDots();

		activateDot(0);
	};
	init();

	// Event handlers
	btnRight.addEventListener('click', nextSlide);
	btnLeft.addEventListener('click', prevSlide);

	document.addEventListener('keydown', function (e): void {
		if (e.key === 'ArrowLeft') prevSlide();
		e.key === 'ArrowRight' && nextSlide();
	});

	dotContainer.addEventListener('click', function (e: Event): void {
		if ((e.target as HTMLElement).classList.contains('dots__dot')) {
			// @ts-expect-error
			const { slide } = e.target?.dataset;
			goToSlide(slide);
			activateDot(slide);
		}
	});
};
slider();
