// =============================================================
// UNDER THE MANGO TREE - Game Data
// =============================================================
// Genres available in this version (Guyana / Berbice MVP).
// =============================================================

const GUYANESE_GENRES = [
  {
    id: 'folk',
    name: 'Guyanese Folk',
    era: '1800s-present',
    color: 0xc4a878,
    treePos: { x: -130, y: -180 },
    journalNote: "The oldest layer — Indo-Guyanese and Afro-Guyanese folk songs sung at weddings, harvests, and gatherings. The music your great-grandparents knew.",
    grandpaDialog: "Long before any of this, before chutney, before soca — we had these songs. My mother sang them in the kitchen. Your great-grandmother knew them too.",
  },
  {
    id: 'calypso',
    name: 'Guyanese Calypso',
    era: '1930s-50s',
    color: 0xff9050,
    treePos: { x: 100, y: -200 },
    journalNote: "Guyana had its own calypsonians who worked the Caribbean circuit — King Fighter, Lord Canary. The same wit and storytelling as Trinidad, with a Guyanese flavor.",
    grandpaDialog: "Calypso. You think it is only Trinidad, but we had our own. Lord Canary, King Fighter — these were our kaisomen too.",
  },
  {
    id: 'chutney',
    name: 'Chutney',
    era: '1970s-present',
    color: 0xff5078,
    treePos: { x: -80, y: -240 },
    journalNote: "The music carried across an ocean from India and made into something new — tassa drums, dholak, harmonium, sung at every wedding in Berbice.",
    grandpaDialog: "Chutney! When your grandmother and I married, they played all night. The tassa, the dholak — even the old people got up to dance.",
  },
  {
    id: 'chutney_soca',
    name: 'Chutney Soca',
    era: '1980s-90s',
    color: 0xff7040,
    treePos: { x: 130, y: -150 },
    journalNote: "The fusion that brought Indo-Caribbean music to Carnival — Drupatee, Sundar Popo, Anand Yankaran. Sung from Trinidad to Berbice to Brooklyn.",
    grandpaDialog: "Sundar Popo, Anand Yankaran — our boys. When chutney met soca, the whole Caribbean had to listen.",
  },
  {
    id: 'soca',
    name: 'Soca',
    era: '1970s-present',
    color: 0xffb04a,
    treePos: { x: -180, y: -130 },
    journalNote: "Born in Trinidad, adopted by Guyana — soca rules Mashramani every February. The road march sound, brought home to the Demerara.",
    grandpaDialog: "Soca came from Trinidad, but we made it ours. Mashramani morning — you could hear it down every street.",
  },
  {
    id: 'reggae',
    name: 'Reggae',
    era: '1970s-present',
    color: 0x9cb060,
    treePos: { x: 170, y: -130 },
    journalNote: "Jamaica's music, but loved everywhere. In Berbice, in the bottom-house, on the radio — Bob Marley's voice belonged to all of us.",
    grandpaDialog: "Bob Marley. The whole Caribbean listened. The whole world listened. The man spoke for all of us.",
  },
];

// Grandpa's idle lines - things he says when granddaughter is just nearby
const GRANDPA_IDLE_LINES = [
  "Take your time, child. The mangos will wait.",
  "Every fruit holds a story. Pick one.",
  "Press the space bar near a mango. You'll see.",
  "The cane fields used to stretch all the way to the river.",
  "Your grandmother loved when the music played.",
  "I sat under this tree before you were born.",
  "Mashramani was something. The whole village in the street.",
];

// First-time visitor dialog (intro)
const INTRO_DIALOG = [
  { speaker: "GRANDPA", text: "Welcome, child. Come, sit. Or walk around — see the place." },
  { speaker: "GRANDPA", text: "Each mango on the tree holds a song. Walk close to one and press space — you'll hear its story." },
  { speaker: "GRANDPA", text: "The boat by the river? Not yet. There's more to discover here first." },
];

const PLAYER_NAME = "Granddaughter";

const SAVE_KEY = "under_the_mango_tree_save";

function loadSave() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return {
    discovered: [],
    suggestions: [],
    firstVisit: true,
    introStep: 0,
  };
}

function saveProgress(data) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) {}
}

let gameState = loadSave();
