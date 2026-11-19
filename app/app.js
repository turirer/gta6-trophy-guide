// Leonida Trophy Guide: checklist, filters, spoiler mode and progress saving.
// Everything runs offline: the only file it fetches is its own data/trophies.json.
const KEY = 'gta6-trophy-guide-v1';
const rowsEl = document.getElementById('rows');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilerEl = document.getElementById('spoiler');
const hideEarnedEl = document.getElementById('hideEarned');
const resultCountEl = document.getElementById('resultCount');
const emptyStateEl = document.getElementById('emptyState');
const params = new URLSearchParams(location.search);

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const sourceUrls = new Map((doc.sources || []).map((s) => [s.name, s.url]));

// Deep links, used by the guide's own screenshots and by readers sharing a view:
// ?filter=story|missable|collectibles|activities|online, ?spoiler=1, ?open=<id>,
// ?demo=1 seeds a sample of earned trophies when no progress is saved yet.
const DEMO_EARNED = [2, 3, 8, 15, 16, 20, 21, 28, 33, 35, 42, 52];
let stored = null;
try { stored = JSON.parse(localStorage.getItem(KEY) ?? 'null'); } catch { stored = null; }
let earned = new Set(Array.isArray(stored) ? stored.filter((n) => trophies.some((t) => t.name === n)) : []);
if (params.get('demo') === '1' && earned.size === 0) {
  earned = new Set(DEMO_EARNED.map((id) => trophies.find((t) => t.id === id).name));
}

let kind = params.get('filter') || 'all';
if (!['all', 'story', 'missable', 'collectibles', 'activities', 'online'].includes(kind)) kind = 'all';
if (params.get('spoiler') === '1') spoilerEl.checked = true;

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

function gradeLabel(t) {
  return t.grade.charAt(0).toUpperCase() + t.grade.slice(1);
}

function kindLabels(t) {
  return t.kind.map((k) => (k === 'missable' ? 'Missable' : k.charAt(0).toUpperCase() + k.slice(1)));
}

function isHiddenFromSpoilers(t) {
  return spoilerEl.checked && t.hidden && !earned.has(t.name);
}

function matches(t) {
  if (kind !== 'all' && !t.kind.includes(kind)) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (hideEarnedEl.checked && earned.has(t.name)) return false;
  const q = searchEl.value.trim().toLowerCase();
  if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
  return true;
}

function renderProgress() {
  const total = trophies.length;
  const n = earned.size;
  document.getElementById('earnedCount').textContent = String(n);
  document.getElementById('barFill').style.width = `${Math.round((n / total) * 100)}%`;
  document.getElementById('progressText').textContent = `${n} of ${total} earned — ${Math.round((n / total) * 100)}%`;
  const byGrade = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => `${earnedCount(g)} / ${trophies.filter((t) => t.grade === g).length} ${g}`)
    .join(' · ');
  document.getElementById('gradeLine').textContent = byGrade;
  function earnedCount(g) {
    return trophies.filter((t) => t.grade === g && earned.has(t.name)).length;
  }
}

function renderSources(t, parent) {
  const p = document.createElement('p');
  p.className = 'sources';
  p.append(document.createTextNode('Sources: '));
  t.sources.forEach((name, i) => {
    const a = document.createElement('a');
    a.textContent = name;
    a.href = sourceUrls.get(name) || '#sources';
    a.target = '_blank';
    a.rel = 'noopener';
    p.append(a);
    if (i < t.sources.length - 1) p.append(document.createTextNode(' · '));
  });
  parent.append(p);
}

function render() {
  renderProgress();
  rowsEl.replaceChildren();
  const shown = trophies.filter(matches);
  resultCountEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies`;
  emptyStateEl.hidden = shown.length !== 0;
  if (shown.length === 0) {
    emptyStateEl.textContent = kind === 'online'
      ? 'No online trophies — all 55 are single-player, so there is nothing to track here.'
      : 'No trophies match these filters. Clear the search or pick another kind.';
    return;
  }
  for (const t of shown) {
    const li = document.createElement('li');
    li.className = 'card' + (earned.has(t.name) ? ' earned' : '') + (t.missable ? ' missable-flag' : '');
    li.id = `trophy-${t.id}`;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      save();
      render();
    });
    const body = document.createElement('div');
    const head = document.createElement('div');
    head.className = 'card-head';
    const h = document.createElement('h3');
    h.textContent = isHiddenFromSpoilers(t) ? 'Hidden trophy' : t.name;
    head.append(h);
    const grade = document.createElement('span');
    grade.className = `grade ${t.grade}`;
    grade.textContent = gradeLabel(t);
    head.append(grade);
    for (const label of kindLabels(t)) {
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = label;
      head.append(tag);
    }
    if (t.hidden) {
      const tag = document.createElement('span');
      tag.className = 'tag hidden-tag';
      tag.textContent = 'Hidden on PSN';
      head.append(tag);
    }
    if (t.missable) {
      const tag = document.createElement('span');
      tag.className = 'tag missable-tag';
      tag.textContent = 'Possibly missable';
      head.append(tag);
    } else {
      const tag = document.createElement('span');
      tag.className = 'tag safe-tag';
      tag.textContent = 'Can’t be missed';
      head.append(tag);
    }
    if (t.count) {
      const tag = document.createElement('span');
      tag.className = 'tag count-tag';
      tag.textContent = `Target: ${t.count.toLocaleString('en-US')} ${t.countLabel}`;
      head.append(tag);
    }
    body.append(head);
    if (isHiddenFromSpoilers(t)) {
      const mask = document.createElement('p');
      mask.className = 'spoiler-mask';
      mask.textContent = 'Hidden on PlayStation until earned. Turn spoiler-safe mode off, or tick this trophy once you have earned it, to reveal its name, description and guide.';
      body.append(mask);
    } else {
      const official = document.createElement('p');
      official.className = 'official';
      const label = document.createElement('span');
      label.className = 'official-label';
      label.textContent = 'Official — ';
      official.append(label, document.createTextNode(`“${t.description}”`));
      body.append(official);
      const guide = document.createElement('p');
      guide.className = 'guide';
      guide.textContent = t.guide;
      body.append(guide);
      renderSources(t, body);
    }
    li.append(box, body);
    rowsEl.append(li);
  }
  const openId = Number(params.get('open') || 0);
  if (openId) {
    const target = document.getElementById(`trophy-${openId}`);
    if (target) target.scrollIntoView({ block: 'center' });
  }
}

document.querySelectorAll('#kindChips .chip').forEach((chip) => {
  if (chip.dataset.kind === kind) chip.classList.add('active');
  else chip.classList.remove('active');
  chip.addEventListener('click', () => {
    kind = chip.dataset.kind;
    document.querySelectorAll('#kindChips .chip').forEach((c) => c.classList.toggle('active', c === chip));
    render();
  });
});

searchEl.addEventListener('input', render);
gradeEl.addEventListener('change', render);
spoilerEl.addEventListener('change', render);
hideEarnedEl.addEventListener('change', render);

document.getElementById('export').addEventListener('click', () => {
  const payload = {
    game: 'Grand Theft Auto VI',
    platform: 'PlayStation 5',
    exportedAt: new Date().toISOString(),
    earned: [...earned],
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('bad file');
    earned = new Set(names.filter((n) => trophies.some((t) => t.name === n)));
    save();
    render();
  } catch {
    emptyStateEl.hidden = false;
    emptyStateEl.textContent = 'That file could not be imported: it is not a progress file this guide exported.';
  }
  e.target.value = '';
});

// Footer: the guide's sources, with links, from the data file.
const sourceList = document.getElementById('sourceList');
for (const s of doc.sources || []) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.textContent = s.name;
  a.href = s.url;
  a.target = '_blank';
  a.rel = 'noopener';
  li.append(a);
  sourceList.append(li);
}

render();
