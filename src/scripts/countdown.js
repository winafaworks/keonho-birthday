// src/scripts/countdown.js

// Set to true for D-Day (Hari H / Ulang tahun sudah tiba atau sudah lewat)
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
    const countdownContainer = document.getElementById('countdown-container');

    if (isDDayMode && countdownContainer) {
        const cdContent = document.getElementById('countdown-content');

        if (cdContent) {
            cdContent.className = 'dday-greeting-text';
            cdContent.innerHTML = 'Waktu yang ditunggu telah tiba!!';
        }

        if (blowIndicator) {
            blowIndicator.classList.remove('hidden');
        }
        return;
    }

    const updateCountdown = () => {
        const now = new Date();
        const target = getNextBirthdayDate();
        const diff = target - now;

        if ((now.getMonth() === targetMonth && now.getDate() === targetDate) || diff <= 0) {
            const cdContent = document.getElementById('countdown-content');
            if (cdContent) {
                cdContent.className = 'dday-greeting-text';
                cdContent.innerHTML = 'Waktu yang ditunggu telah tiba!!';
            }
            if (blowIndicator) blowIndicator.classList.remove('hidden');
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
