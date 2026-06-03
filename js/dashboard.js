import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Auth guard
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = 'login.html';
});

document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
  e.preventDefault();
  await signOut(auth);
  window.location.href = 'login.html';
});

// ====================================
// SENSOR DATA - Real-time Update
// ====================================
const sensorRef = ref(db, 'sensor');

onValue(sensorRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) {
    loadDummy();
    return;
  }
  updateStats(data);
  window.__sensorData = data;
  if (window.renderChart) window.renderChart(data.chart);
}, (error) => {
  console.error('Error loading sensor data:', error);
  loadDummy();
});

function updateStats(data) {
  // Update temperature
  const temperature = data.suhu ?? data.temperature ?? '--';
  if (document.getElementById('temperature')) {
    document.getElementById('temperature').textContent = 
      temperature === '--' ? '--' : temperature + '°C';
  }

  // Update humidity
  const humidity = data.kelembapan ?? data.humidity ?? '--';
  if (document.getElementById('humidity')) {
    document.getElementById('humidity').textContent = 
      humidity === '--' ? '--' : humidity + '%';
  }

  // Update soil moisture
  const soil = data.soil ?? data.kelembapan_tanah ?? '--';
  if (document.getElementById('soil')) {
    document.getElementById('soil').textContent = 
      soil === '--' ? '--' : soil + '%';
  }

  // Update light intensity
  const light = data.cahaya ?? data.light ?? '--';
  if (document.getElementById('light')) {
    document.getElementById('light').textContent = 
      light === '--' ? '--' : light + ' lx';
  }
}

// Fallback ke dummy.json
async function loadDummy() {
  try {
    const res = await fetch('data/dummy.json');
    const data = await res.json();
    updateStats(data);
    window.__sensorData = data;
    if (window.renderChart) window.renderChart(data.chart);
    console.log('Loaded dummy data:', data);
  } catch (e) {
    console.warn('Tidak bisa memuat data dummy:', e);
  }
}

// ====================================
// RELAY CONTROL
// ====================================
const relayLamp = document.getElementById('relayLamp');
const relayPump = document.getElementById('relayPump');

if (relayLamp) {
  // Listen to lamp relay
  onValue(ref(db, 'relay/lamp'), (snapshot) => {
    const val = snapshot.val();
    const isOn = val === 1 || val === true || val === '1';
    relayLamp.checked = isOn;
  });

  // Control lamp relay
  relayLamp.addEventListener('change', async (e) => {
    const newVal = e.target.checked ? 1 : 0;
    try {
      await set(ref(db, 'relay/lamp'), newVal);
    } catch (err) {
      console.error('Error setting lamp relay:', err);
    }
  });
}

if (relayPump) {
  // Listen to pump relay
  onValue(ref(db, 'relay/pump'), (snapshot) => {
    const val = snapshot.val();
    const isOn = val === 1 || val === true || val === '1';
    relayPump.checked = isOn;
  });

  // Control pump relay
  relayPump.addEventListener('change', async (e) => {
    const newVal = e.target.checked ? 1 : 0;
    try {
      await set(ref(db, 'relay/pump'), newVal);
    } catch (err) {
      console.error('Error setting pump relay:', err);
    }
  });
}

// Ketika toggle diklik → tulis ke Firebase & simpan ke riwayat
if (relayToggle) {
  relayToggle.addEventListener('change', async () => {
    const newState = relayToggle.checked ? 1 : 0;
    const labelState = newState === 1 ? 'ON' : 'OFF';
    try {
      // 1. Update status relay
      await set(relayRef, newState);
      console.log('Relay 1 set to:', newState);

      // 2. Tambahkan log ke history sensor di Firebase
      const historyRef = ref(db, 'sensor/history');
      const historySnapshot = await get(historyRef);
      let history = historySnapshot.val() || [];
      if (!Array.isArray(history)) {
        history = history ? Object.values(history) : [];
      }

      const now = new Date();
      // Format jam: menit: detik lokal
      const timeStr = now.toTimeString().split(' ')[0];
      // Format tanggal: YYYY-MM-DD
      const dateStr = now.toISOString().split('T')[0];

      history.push({
        waktu: timeStr,
        tanggal: dateStr,
        sensor: 'Relay 1',
        nilai: labelState,
        status: 'OK'
      });

      // Batasi history maksimal 50 baris
      if (history.length > 50) {
        history = history.slice(-50);
      }

      await set(historyRef, history);

    } catch (err) {
      console.error('Gagal mengubah relay atau mencatat riwayat:', err);
      // Kembalikan toggle jika gagal
      relayToggle.checked = !relayToggle.checked;
    }
  });
}
