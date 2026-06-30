// ============================================================
//  ✏️  EDIT YOUR DATA HERE
// ============================================================

// FORMAT: "YYYY-MM-DD"

// 🟥 Public holidays of Bhutan
const holidays = [
  "2025-01-01",
  "2025-02-25",   // Losar
  "2025-05-02",   // Third King Birthday
  "2025-06-02",   // Coronation Day
  "2025-08-11",   // Blessed Rainy Day
  "2025-09-22",   // Autumn Druk Gyalpo
  "2025-11-01",   // HM Birthday
  "2025-11-11",   // Descending of Buddha
  "2025-12-17",   // National Day
  "2026-01-01",
  "2026-02-21",   // Losar
  "2026-04-14",
  "2026-05-02",
  "2026-06-02",   // Coronation Day
  "2026-08-11",   // Blessed Rainy Day
  "2026-11-01",   // HM Birthday
  "2026-11-11",
  "2026-12-17",   // National Day
];

// Name of each holiday (shown in popup)
const holidayNames = {
  "2025-01-01": "New Year's Day",
  "2025-02-25": "Losar – Bhutanese New Year",
  "2025-05-02": "Third King's Birth Anniversary",
  "2025-06-02": "Coronation Day",
  "2025-08-11": "Blessed Rainy Day",
  "2025-09-22": "Autumn Druk Gyalpo",
  "2025-11-01": "His Majesty's Birthday",
  "2025-11-11": "Descending of Lord Buddha",
  "2025-12-17": "National Day",
  "2026-01-01": "New Year's Day",
  "2026-02-21": "Losar – Bhutanese New Year",
  "2026-04-14": "Third King's Birth Anniversary",
  "2026-05-02": "Wesak Day",
  "2026-06-02": "Coronation Day",
  "2026-08-11": "Blessed Rainy Day",
  "2026-11-01": "His Majesty's Birthday",
  "2026-11-11": "Descending of Lord Buddha",
  "2026-12-17": "National Day",
};

// 🟡 Days the COMPANY is closed (but NOT a public holiday)
const companyClosed = [
  "2025-12-31",   // Office closed last day of year
  "2026-01-02",   // Office closed first week
];

// Is the company ALSO closed on public holidays?
// true = yes (most common), false = no
const companyClosedOnHolidays = true;

// ============================================================
//  ✏️  END OF DATA — don't edit below this line
// ============================================================

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const today = new Date();
let cur = { y: today.getFullYear(), m: today.getMonth() };

// Build "YYYY-MM-DD" key from year, month index, day
function key(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// Draw the calendar for the current month
function render() {
  document.getElementById('month-title').textContent = `${months[cur.m]} ${cur.y}`;

  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  const startDay  = new Date(cur.y, cur.m, 1).getDay();   // 0=Sun
  const totalDays = new Date(cur.y, cur.m + 1, 0).getDate();

  // Blank cells before the 1st
  for (let i = 0; i < startDay; i++) {
    const el = document.createElement('div');
    el.className = 'day empty';
    grid.appendChild(el);
  }

  // Day cells
  for (let d = 1; d <= totalDays; d++) {
    const k      = key(cur.y, cur.m, d);
    const isHol  = holidays.includes(k);
    const isClo  = companyClosed.includes(k);
    const isTod  = today.getFullYear() === cur.y
                && today.getMonth()    === cur.m
                && today.getDate()     === d;

    const cell = document.createElement('div');
    cell.className = 'day';
    if (isHol)         cell.classList.add('holiday');
    if (isClo && !isHol) cell.classList.add('closed');
    if (isTod)         cell.classList.add('today');

    cell.innerHTML = `${d}<span class="dot"></span>`;
    cell.addEventListener('click', () => openPopup(cur.y, cur.m, d, k, isHol, isClo));
    grid.appendChild(cell);
  }
}

// Open the popup for a clicked date
function openPopup(y, m, d, k, isHol, isClo) {
  const dateStr = new Date(y, m, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById('popup-date').textContent = dateStr;

  // Title
  let name = 'Normal working day';
  if (isHol) name = holidayNames[k] || 'Public Holiday';
  document.getElementById('popup-name').textContent = name;

  const body = document.getElementById('popup-body');
  body.innerHTML = '';

  const companyOpen = !isHol && !isClo;

  // Holiday row
  if (isHol) {
    addRow(body, '🎉', 'This is a Bhutan public holiday.');
  } else {
    addRow(body, '📅', 'Not a public holiday.');
  }

  // Company status row
  if ((isHol && companyClosedOnHolidays) || isClo) {
    addRow(body, '🏢', 'Our company is closed today.');
  } else {
    addRow(body, '✅', 'Our company is open – tours are available.');
  }

  // Open / Closed badge
  const badge = document.createElement('span');
  badge.className = 'badge ' + (companyOpen ? 'open-badge' : 'closed-badge');
  badge.textContent = companyOpen ? 'Open for tours' : 'Closed';
  body.appendChild(badge);

  document.getElementById('overlay').classList.add('open');
}

// Add a row inside the popup
function addRow(container, icon, text) {
  const row = document.createElement('div');
  row.className = 'popup-row';
  row.innerHTML = `<span class="icon">${icon}</span><span>${text}</span>`;
  container.appendChild(row);
}

// Close popup
function closePopup() {
  document.getElementById('overlay').classList.remove('open');
}
document.getElementById('close-btn').addEventListener('click', closePopup);
document.getElementById('overlay').addEventListener('click', function(e) {
  if (e.target === this) closePopup();
});

// Month navigation
document.getElementById('prev').addEventListener('click', () => {
  cur.m--;
  if (cur.m < 0) { cur.m = 11; cur.y--; }
  render();
});
document.getElementById('next').addEventListener('click', () => {
  cur.m++;
  if (cur.m > 11) { cur.m = 0; cur.y++; }
  render();
});

// First render
render();
