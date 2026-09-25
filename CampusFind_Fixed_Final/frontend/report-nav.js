const reportNav = document.querySelector('.actions');
if (reportNav) {
  const required = [
    ['Home', 'index.html'],
    ['How It Works', 'index.html#how-it-works'],
    ['Campuses', 'index.html#campuses'],
    ['Lost & Found', 'lost-found.html'],
    ['Reviews', 'index.html#reviews']
  ];
  const actions = [...reportNav.children].filter((child) => !child.matches('a[href="index.html"], a[href="lost-found.html"], a[href="index.html#how-it-works"], a[href="index.html#campuses"], a[href="index.html#reviews"]'));
  reportNav.replaceChildren(...required.map(([label, href]) => { const link = document.createElement('a'); link.href = href; link.textContent = label; return link; }), ...actions);
}
