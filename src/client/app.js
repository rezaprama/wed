const $ = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];
const id = document.documentElement.lang === 'id';
const parameters = new URL(location.href).searchParams;
const guest = (parameters.get('to') || parameters.get('dear') || parameters.get('kepada') || '').trim().slice(0, 80);
if (guest) {
  all('.namatamu').forEach(node => { node.textContent = guest; });
  if ($('#wish-name')) $('#wish-name').value = guest;
}
all('.city-nav a').forEach(link => {
  const url = new URL(link.href);
  for (const key of ['to', 'dear', 'kepada']) if (parameters.has(key)) url.searchParams.set(key, parameters.get(key));
  link.href = url.href;
});
const audio = $('#background-music');
const musicButton = $('#music-button');
const musicStatus = $('#music-status');
function renderMusic() {
  const playing = !audio.paused;
  musicButton.textContent = playing ? id ? 'Jeda musik' : 'Pause music' : id ? 'Putar musik' : 'Play music';
  musicButton.setAttribute('aria-pressed', String(playing));
  musicStatus.textContent = musicButton.textContent;
}
async function startMusic() {
  if (!audio) return;
  try { await audio.play(); } catch { musicStatus.textContent = id ? 'Pilih Putar musik untuk mendengarkan.' : 'Select Play music to listen.'; }
}
if (audio) {
  audio.addEventListener('play', renderMusic); audio.addEventListener('pause', renderMusic);
  audio.addEventListener('error', () => { musicStatus.textContent = id ? 'Musik tidak tersedia.' : 'Music is unavailable.'; });
  musicButton.addEventListener('click', () => { if (audio.paused) void startMusic(); else audio.pause(); });
}
const cover = $('#invitation-cover');
if (cover.open) cover.close();
  cover.showModal();
$('#open-invitation').addEventListener('click', () => { void startMusic(); cover.close(); $('#invitation').focus({ preventScroll: true }); });
cover.addEventListener('cancel', () => { void startMusic(); }, { once: true });
const dialog = $('#media-dialog');
all('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
dialog.addEventListener('close', () => $('#media-content').replaceChildren());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
all('.gallery-photo').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const image = document.createElement('img'); image.src = link.href; image.alt = link.querySelector('img').alt;
  $('#media-content').replaceChildren(image); dialog.showModal();
}));
all('[data-gallery]').forEach(button => button.addEventListener('click', () => {
  const track = button.closest('.memory-gallery').querySelector('.gallery-track');
  const direction = Number(button.dataset.gallery);
  const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
  const left = direction > 0 && end ? 0 : direction < 0 && track.scrollLeft < 5 ? track.scrollWidth : track.scrollLeft + direction * track.clientWidth;
  track.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}));
all('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const status = $('#copy-status');
  try { await navigator.clipboard.writeText(button.dataset.copy); status.textContent = id ? 'Tersalin.' : 'Copied.'; }
  catch { status.textContent = id ? 'Clipboard tidak tersedia. Salin detail di atas secara manual.' : 'Clipboard is unavailable. Copy the details above manually.'; }
}));
async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || (id ? 'Coba lagi nanti.' : 'Please try again later.'));
  return data;
}
const list = $('#wish-list');
let cursor = null;
async function wishes(more = false) {
  try {
    const data = await request(`/api/wishes?city=${document.body.dataset.city}${more && cursor ? `&cursor=${cursor}` : ''}`);
    if (!more) list.replaceChildren();
    if (!more && !data.items.length) list.textContent = id ? 'Jadilah yang pertama menitipkan doa.' : 'Be the first to leave a little love.';
    for (const item of data.items) {
      const article = document.createElement('article'); article.className = 'wish';
      const name = document.createElement('strong'); name.textContent = item.name;
      const message = document.createElement('p'); message.textContent = item.message;
      const time = document.createElement('time'); time.dateTime = item.created_at;
      time.textContent = new Intl.DateTimeFormat(id ? 'id-ID' : 'en-GB', { dateStyle: 'long' }).format(new Date(item.created_at));
      article.append(name, message, time); list.append(article);
    }
    cursor = data.nextCursor; $('#more-wishes').hidden = !cursor;
  } catch (error) {
    if (!more) list.textContent = error.message;
    const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = id ? 'Coba lagi' : 'Try again';
    retry.addEventListener('click', () => { retry.remove(); void wishes(more); }); list.append(retry);
  }
}
if (list) {
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void wishes(); }
  }, { rootMargin: '150px' });
  observer.observe(list);
  $('#more-wishes').addEventListener('click', async event => { event.currentTarget.disabled = true; await wishes(true); $('#more-wishes').disabled = false; });
}
let requestId = crypto.randomUUID();
$('#wish-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget; const submit = form.querySelector('button[type=submit]'); const status = $('#wish-status');
  submit.disabled = true;
  try {
    const fields = new FormData(form);
    await request('/api/wishes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ city: document.body.dataset.city, name: fields.get('name'), message: fields.get('message'), website: fields.get('website'), requestId }) });
    status.textContent = id ? 'Terima kasih. Ucapan menunggu persetujuan pengelola.' : 'Thank you. Your wish is waiting for approval.';
    $('#wish-message').value = ''; requestId = crypto.randomUUID();
  } catch (error) { status.textContent = error.message; }
  finally { submit.disabled = false; }
});
