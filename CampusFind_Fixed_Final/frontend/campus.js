const nav = document.querySelector('.nav nav');
if (nav) {
	const existingActions = [...nav.children].filter((child) => !child.matches('a[href="index.html"], a[href="index.html#how-it-works"], a[href="index.html#campuses"], a[href="lost-found.html"], a[href="index.html#reviews"]'));
	const links = [
		['Home', 'index.html'],
		['How It Works', 'index.html#how-it-works'],
		['Campuses', 'index.html#campuses'],
		['Lost & Found', 'lost-found.html'],
		['Reviews', 'index.html#reviews']
	];
	nav.replaceChildren(...links.map(([label, href]) => {
		const link = document.createElement('a');
		link.href = href;
		link.textContent = label;
		link.style.display = 'inline-flex';
		return link;
	}), ...existingActions);
	existingActions.forEach((action) => {
		if (action.tagName === 'A') action.style.display = 'inline-flex';
	});
}

const themeToggle = document.querySelector('.theme-toggle');
if (localStorage.getItem('campusFindTheme') === 'dark') document.body.classList.add('dark');
function syncThemeIcon() { const icon = themeToggle?.querySelector('svg'); if (!icon) return; icon.setAttribute('data-lucide', document.body.classList.contains('dark') ? 'moon' : 'sun-medium'); lucide.createIcons(); }
themeToggle?.addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('campusFindTheme', document.body.classList.contains('dark') ? 'dark' : 'light'); syncThemeIcon(); });
lucide.createIcons(); syncThemeIcon();
