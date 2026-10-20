const id = document.documentElement.lang === 'id';
const form = document.querySelector('#generator');
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const names = [...new Set(String(data.get('names')).split(/\r?\n/).map(name => name.trim().slice(0, 80)).filter(Boolean))];
  const status = document.querySelector('#generator-status');
  if (names.length > 100) { status.textContent = id ? 'Maksimal 100 nama setiap pembuatan.' : 'Use at most 100 names at a time.'; return; }
  const container = document.querySelector('#generated-guests'); container.replaceChildren();
  for (const name of names) {
    const url = new URL(`/${data.get('city')}/`, location.origin); url.searchParams.set('to', name);
    const text = String(data.get('message')).replaceAll('[nama]', name).replaceAll('[link-undangan]', url.href);
    const article = document.createElement('article'); article.className = 'generated-guest';
    const heading = document.createElement('h2'); heading.textContent = name;
    const input = document.createElement('input'); input.value = url.href; input.readOnly = true; input.setAttribute('aria-label', `${id ? 'Tautan undangan' : 'Invitation link for'} ${name}`);
    const actions = document.createElement('div'); actions.className = 'action-row';
    const copyLink = document.createElement('button'); copyLink.type = 'button'; copyLink.textContent = id ? 'Salin tautan' : 'Copy link';
    const copyMessage = document.createElement('button'); copyMessage.type = 'button'; copyMessage.textContent = id ? 'Salin pesan' : 'Copy message'; copyMessage.className = 'secondary';
    const whatsapp = document.createElement('a'); whatsapp.href = `https://wa.me/?text=${encodeURIComponent(text)}`; whatsapp.target = '_blank'; whatsapp.rel = 'noopener noreferrer'; whatsapp.textContent = id ? 'Buka WhatsApp' : 'Open WhatsApp';
    for (const [button, value] of [[copyLink, url.href], [copyMessage, text]]) button.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(value); status.textContent = `${id ? 'Tersalin untuk' : 'Copied for'} ${name}.`; }
      catch {
        const manual = document.createElement('textarea'); manual.value = value; manual.readOnly = true; manual.setAttribute('aria-label', id ? 'Teks untuk disalin' : 'Text to copy'); article.append(manual); manual.select();
        status.textContent = id ? 'Clipboard tidak tersedia. Pilih dan salin teks secara manual.' : 'Clipboard is unavailable. Select and copy the text manually.';
      }
    });
    actions.append(copyLink, copyMessage, whatsapp); article.append(heading, input, actions); container.append(article);
  }
  status.textContent = id ? `${names.length} tautan siap. Nama tamu tidak disimpan ke server.` : `${names.length} links ready. Guest names are not stored on the server.`;
});
