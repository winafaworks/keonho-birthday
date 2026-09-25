// src/scripts/countdown.js

// Set to false for pre-D-Day mode (Hitung mundur menuju ulang tahun)
// Set to true for D-Day mode (Hari H / Ulang tahun sudah tiba)
const isDDayMode = true;

const targetMonth = 11; // 0-indexed, 11 = December
const targetDate = 14;

function getNextBirthdayDate() {
    const now = new Date();
    let year = now.getFullYear();
    let birthday = new Date(year, targetMonth, targetDate, 0, 0, 0, 0);
    
    if (now > birthday && now.getDate() !== targetDate && now.getMonth() !== targetMonth) {
        birthday = new Date(year + 1, targetMonth, targetDate, 0, 0, 0, 0);
    }
    return birthday;
}

function initCountdown() {
    const blowIndicator = document.getElementById('blow-indicator');
    const btnBlowCandles = document.getElementById('btn-blow-candles');
    const countdownContainer = document.getElementById('countdown-container');
    const cdContent = document.getElementById('countdown-content');

    if (isDDayMode && countdownContainer) {
        if (cdContent) {
            cdContent.className = 'dday-greeting-text';
            cdContent.innerHTML = 'Waktu yang ditunggu telah tiba!!';
        }

        if (blowIndicator) {
            blowIndicator.classList.remove('hidden');
        }
        if (btnBlowCandles) {
            btnBlowCandles.classList.remove('hidden');
        }
        return;
    }

    // Set up countdown elements for pre-D-Day mode
    if (cdContent) {
        cdContent.className = 'countdown-boxes-wrapper';
        cdContent.innerHTML = `
            <h3 class="countdown-title">Hitung Mundur Ulang Tahun</h3>
            <div class="countdown-boxes">
                <div class="cd-box"><span id="cd-days">00</span><small>Hari</small></div>
                <div class="cd-box"><span id="cd-hours">00</span><small>Jam</small></div>
                <div class="cd-box"><span id="cd-minutes">00</span><small>Menit</small></div>
                <div class="cd-box"><span id="cd-seconds">00</span><small>Detik</small></div>
            </div>
        `;
    }

    if (blowIndicator) blowIndicator.classList.add('hidden');
    if (btnBlowCandles) btnBlowCandles.classList.add('hidden');

    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');

    const updateCountdown = () => {
        const now = new Date();
        const target = getNextBirthdayDate();
        const diff = target - now;

        if ((now.getMonth() === targetMonth && now.getDate() === targetDate) || diff <= 0) {
            if (cdContent) {
                cdContent.className = 'dday-greeting-text';
                cdContent.innerHTML = 'Waktu yang ditunggu telah tiba!!';
            }
            if (blowIndicator) blowIndicator.classList.remove('hidden');
            if (btnBlowCandles) btnBlowCandles.classList.remove('hidden');
            return true;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (cdDays) cdDays.innerText = days.toString().padStart(2, '0');
        if (cdHours) cdHours.innerText = hours.toString().padStart(2, '0');
        if (cdMinutes) cdMinutes.innerText = minutes.toString().padStart(2, '0');
        if (cdSeconds) cdSeconds.innerText = seconds.toString().padStart(2, '0');

        return false;
    };

    const isBirthday = updateCountdown();
    if (!isBirthday) {
        setInterval(updateCountdown, 1000);
    }
}

document.addEventListener('DOMContentLoaded', initCountdown);

