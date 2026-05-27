// =============================================================
// UI - journal, dialog box, suggestion modal
// =============================================================

// ===== Dialog box =====
let dialogTimeout = null;

function showDialog(speaker, text, durationMs = 4000) {
  const box = document.getElementById('dialog-box');
  const speakerEl = document.getElementById('dialog-speaker');
  const textEl = document.getElementById('dialog-text');

  speakerEl.textContent = speaker;
  textEl.textContent = text;
  box.classList.add('visible');

  if (dialogTimeout) clearTimeout(dialogTimeout);
  dialogTimeout = setTimeout(() => {
    box.classList.remove('visible');
  }, durationMs);
}

// ===== Journal =====
function renderJournal() {
  const container = document.getElementById('journal-entries');
  container.innerHTML = '';

  GUYANESE_GENRES.forEach(genre => {
    const isDiscovered = gameState.discovered.includes(genre.id);
    const entry = document.createElement('div');
    entry.className = 'journal-entry';

    if (isDiscovered) {
      entry.innerHTML = `
        <h3>✦ ${genre.name}</h3>
        <div class="meta">Jamaica · ${genre.era}</div>
        <div class="note">${genre.journalNote}</div>
      `;
    } else {
      entry.innerHTML = `
        <h3 class="undiscovered">? Undiscovered</h3>
        <div class="meta undiscovered">Visit a mango to learn its story</div>
      `;
    }

    container.appendChild(entry);
  });

  // Add suggestions section if any exist
  if (gameState.suggestions && gameState.suggestions.length > 0) {
    const sugHeader = document.createElement('h2');
    sugHeader.style.marginTop = '20px';
    sugHeader.textContent = 'Your Suggestions';
    container.appendChild(sugHeader);

    gameState.suggestions.forEach(s => {
      const entry = document.createElement('div');
      entry.className = 'journal-entry';
      entry.innerHTML = `
        <h3>"${s.song}"</h3>
        <div class="meta">${s.name ? `from ${s.name}` : 'anonymous'}</div>
        <div class="note">${s.notes || ''}</div>
      `;
      container.appendChild(entry);
    });
  }
}

function toggleJournal() {
  const panel = document.getElementById('journal-panel');
  if (panel.classList.contains('visible')) {
    panel.classList.remove('visible');
  } else {
    renderJournal();
    panel.classList.add('visible');
  }
}

// ===== Suggest a song modal =====
function openSuggestModal() {
  document.getElementById('suggest-modal').classList.add('visible');
}

function closeSuggest() {
  document.getElementById('suggest-modal').classList.remove('visible');
  document.getElementById('suggest-name').value = '';
  document.getElementById('suggest-song').value = '';
  document.getElementById('suggest-notes').value = '';
}

function submitSuggestion() {
  const name = document.getElementById('suggest-name').value.trim();
  const song = document.getElementById('suggest-song').value.trim();
  const notes = document.getElementById('suggest-notes').value.trim();

  if (!song) {
    alert("Please enter a song or genre name.");
    return;
  }

  // Save locally
  if (!gameState.suggestions) gameState.suggestions = [];
  gameState.suggestions.push({
    name: name || 'anonymous',
    song,
    notes,
    timestamp: Date.now(),
  });
  saveProgress(gameState);

  // TODO: in production, also POST to a form endpoint (Google Form, Airtable, etc.)
  // For now just save locally

  showDialog("GRANDDAUGHTER", "Thank you! Your suggestion has been written down.", 3500);
  closeSuggest();
}

// ===== Setup =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('journal-btn').addEventListener('click', toggleJournal);
  document.getElementById('exit-scene-btn').addEventListener('click', exitMangoP5Scene);
});
