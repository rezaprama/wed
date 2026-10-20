const id = document.documentElement.lang === 'id';
let token = '';
let cursor = null;
const $ = selector => document.querySelector(selector);
const status = $('#admin-status');
async function api(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || id ? 'Permintaan gagal.' : 'Request failed.');
  return data;
}
async function load(more = false) {
  try {
    const data = await api(`/api/admin/wishes${more && cursor ? `?cursor=${cursor}` : ''}`);
    if (!more) $('#pending-wishes').replaceChildren();
    for (const item of data.items) {
      const article = document.createElement('article'); article.className = 'moderation-item';
      const heading = document.createElement('h2'); heading.textContent = item.name;
      const city = document.createElement('p'); city.textContent = `${item.city === 'tgr' ? 'Tangerang' : 'Ponorogo'} Â· ${item.audience === 'parents' ? 'Undangan orang tua' : 'Undangan teman'} Â· ${new Date(item.created_at).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' })}`;
      const message = document.createElement('p'); message.textContent = item.message;
      const actions = document.createElement('div'); actions.className = 'action-row';
      for (const [value, label] of [['approved', id ? 'Setujui' : 'Approve'], ['rejected', id ? 'Tolak' : 'Reject']]) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
        if (value === 'rejected') button.className = 'secondary';
        button.addEventListener('click', async () => {
          actions.querySelectorAll('button').forEach(control => { control.disabled = true; });
          try {
            await api(`/api/admin/wishes/${item.id}`, { method: 'POST', body: JSON.stringify({ status: value }) });
            article.remove(); status.textContent = id ? `Ucapan ${value === 'approved' ? 'disetujui' : 'ditolak'}.` : `Wish ${value}.`;
          } catch (error) { status.textContent = error.message; actions.querySelectorAll('button').forEach(control => { control.disabled = false; }); }
        });
        actions.append(button);
      }
      article.append(heading, city, message, actions); $('#pending-wishes').append(article);
    }
    cursor = data.nextCursor; $('#admin-more').hidden = !cursor;
    $('#admin-login').hidden = true; $('#admin-controls').hidden = false;
    status.textContent = data.items.length ? id ? 'Antrean ucapan siap ditinjau.' : 'Wishes are ready to review.' : id ? 'Tidak ada ucapan yang menunggu.' : 'No wishes are waiting.';
  } catch (error) { status.textContent = error.message; }
}
$('#admin-login').addEventListener('submit', event => {
  event.preventDefault(); token = $('#admin-token').value; $('#admin-token').value = ''; void load();
});
$('#admin-refresh').addEventListener('click', () => { void load(); });
$('#admin-more').addEventListener('click', () => { void load(true); });
$('#admin-logout').addEventListener('click', () => {
  token = ''; cursor = null; $('#pending-wishes').replaceChildren(); $('#admin-controls').hidden = true; $('#admin-more').hidden = true; $('#admin-login').hidden = false; status.textContent = id ? 'Sesi pengelola ditutup.' : 'Signed out.';
});
