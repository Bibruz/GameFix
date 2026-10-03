/* =========================================================
   GAMEFIX
   Main JavaScript (Финальная версия)
========================================================= */

/* ================= MOBILE MENU ================= */
const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

if (menuButton) {
    menuButton.addEventListener("click", () => {
        nav.classList.toggle("open");
    });
}

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        if (nav) nav.classList.remove("open");
    });
});

/* ================= SMOOTH SCROLL ================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (target) {
            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

function scrollToScanner() {
    const scanner = document.getElementById("scanner");
    if (scanner) {
        scanner.scrollIntoView({ behavior: "smooth" });
    }
}

/* ================= SCROLL REVEAL ================= */
const revealElements = document.querySelectorAll(
    ".problem-card, .feature-card, .step, .price-card, .scanner-card"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

revealElements.forEach(element => revealObserver.observe(element));

/* ================= ДИНАМИЧЕСКИЙ СКАНЕР ================= */
const gameDatabase = {
    "S.T.A.L.K.E.R.": {
        compat: "62%",
        fps: "45 FPS → 120+ FPS",
        logs: [
            "Анализ движка X-Ray Engine...",
            "ОШИБКА: Ограничение памяти 2GB (Out of Memory)",
            "Проверка рендера DirectX 9 / 10...",
            "Обнаружены статтеры при загрузке локаций"
        ],
        issues: "Вылеты по памяти (X-Ray Engine), сбой рендера DirectX 9, лаги при спавне объектов."
    },
    "GTA San Andreas": {
        compat: "50%",
        fps: "25 FPS → 144 FPS",
        logs: [
            "Сканирование gta_sa.exe...",
            "ОШИБКА: Некорректная работа мыши в Windows 10/11",
            "Предупреждение: Лимит кадровой частоты 25 FPS",
            "Проверка скриптового движка DirectInput..."
        ],
        issues: "Зависание мыши, баги физики плавания и авто при >30 FPS, отсутствие поддержки 1080p/4K."
    },
    "Need for Speed: Most Wanted": {
        compat: "78%",
        fps: "60 FPS → 165 FPS",
        logs: [
            "Анализ конф. файла speed.exe...",
            "ОШИБКА: Отсутствует поддержка экранов 16:9 / 16:10",
            "Картинка растянута, HUD деформирован",
            "Проверка работы V-Sync и текстурного кэша..."
        ],
        issues: "Растянутый HUD, отсутствие поддержки современных разрешений, мерцание текстур."
    },
    "Fallout: New Vegas": {
        compat: "41%",
        fps: "35 FPS → 90+ FPS",
        logs: [
            "Сканирование FalloutNV.exe...",
            "КРИТИЧЕСКАЯ ОШИБКА: Утечка памяти Havok Physics",
            "Обнаружены сбои при переходах между локациями",
            "Проверка совместимости с Windows 11..."
        ],
        issues: "Спонтанные вылеты на рабочий стол, микрофризы при ходьбе, баги рендера теней."
    }
};

const scanButton = document.getElementById("scanButton");
const gameSelect = document.getElementById("gameSelect");
const consoleContent = document.getElementById("consoleContent");
const scanResults = document.getElementById("scanResults");

const resultGame = document.getElementById("resultGame");
const resultCompat = document.getElementById("resultCompat");
const resultFps = document.getElementById("resultFps");
const resultIssues = document.getElementById("resultIssues");

const fixButton = document.getElementById("fixButton");
const fixSuccess = document.getElementById("fixSuccess");

let scanRunning = false;

function addConsoleLine(text, type = "normal") {
    if (!consoleContent) return;

    const line = document.createElement("div");
    line.className = "console-line";
    line.style.marginBottom = "4px";

    if (type === "blue") {
        line.innerHTML = `<span style="color:#0070f3;">[GAMEFIX]</span> ${text}`;
    } else if (type === "system") {
        line.innerHTML = `<span style="color:#00ff88;">[SYSTEM]</span> ${text}`;
    } else if (type === "error") {
        line.innerHTML = `<span style="color:#ff4d4d; font-weight:bold;">[ERROR]</span> ${text}`;
    } else {
        line.textContent = text;
    }

    consoleContent.appendChild(line);
    consoleContent.scrollTop = consoleContent.scrollHeight;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startScan() {
    if (scanRunning) return;

    scanRunning = true;
    const selectedKey = gameSelect ? gameSelect.value : "GTA San Andreas";
    const gameData = gameDatabase[selectedKey] || gameDatabase["GTA San Andreas"];

    if (scanResults) {
        scanResults.style.display = "none";
        scanResults.classList.remove("show");
    }
    if (fixSuccess) {
        fixSuccess.style.display = "none";
        fixSuccess.classList.remove("show");
    }
    if (consoleContent) consoleContent.innerHTML = "";

    if (scanButton) {
        scanButton.disabled = true;
        scanButton.textContent = "Сканирование...";
    }

    addConsoleLine(`Запуск диагностики: ${selectedKey}`, "system");
    await wait(400);

    for (const logText of gameData.logs) {
        const isError = logText.includes("ОШИБКА") || logText.includes("КРИТИЧЕСКАЯ");
        addConsoleLine(logText, isError ? "error" : "blue");
        await wait(600);
    }

    addConsoleLine("Диагностика завершена.", "system");
    await wait(300);

    // Подстановка данных
    if (resultGame) resultGame.textContent = selectedKey;
    if (resultCompat) resultCompat.textContent = gameData.compat;
    if (resultFps) resultFps.textContent = gameData.fps;
    if (resultIssues) resultIssues.textContent = gameData.issues;

    if (scanResults) {
        scanResults.style.display = "block";
        scanResults.classList.add("show");
    }

    if (scanButton) {
        scanButton.disabled = false;
        scanButton.textContent = "Запустить диагностику";
    }

    scanRunning = false;
    if (scanResults) {
        scanResults.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

if (scanButton) {
    scanButton.addEventListener("click", startScan);
}

if (fixButton) {
    fixButton.addEventListener("click", () => {
        fixButton.disabled = true;
        fixButton.textContent = "Применение исправлений...";
        setTimeout(() => {
            fixButton.textContent = "Готово ✓";
            if (fixSuccess) {
                fixSuccess.style.display = "block";
                fixSuccess.classList.add("show");
            }
        }, 1200);
    });
}

/* ================= HEADER EFFECT ================= */
const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    if (!header) return;
    // Используем классы для совместимости со светлой темой
    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* ================= THEME TOGGLE ================= */
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    if (themeToggle) themeToggle.textContent = "🌙";
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";

        if (isLight) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️";
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙";
        }
    });
}