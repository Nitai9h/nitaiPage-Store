// ==Npplication==
// @name    秒数显示
// @id    1753629993099_c29f24d8-3308-4367-a961-dc53a92272ae
// @version    1.3
// @description    用于显示秒数
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/timeSeconds.svg
// @screen    [`https://nitai-images.pages.dev/nitaiPage/store/timeSeconds_screen.webp`]
// ==/Npplication==

function getSecondsHTML() {
    const dt = new Date();
    let s = dt.getSeconds();
    s = s < 10 ? "0" + s : s;
    return '<span id="point">:</span>' + wrapTimeDigits(s.toString());
}

function initSecondsInjection() {
    const timeText = document.getElementById('time_text');
    if (!timeText) return;

    function ensureSeconds() {
        // 用结构判断已注入的秒数
        // 避免直接读 innerHTML 造成序列化
        if (timeText.querySelectorAll('#point').length >= 2) return;
        timeText.insertAdjacentHTML('beforeend', getSecondsHTML());
    }

    const observer = new MutationObserver(ensureSeconds);
    observer.observe(timeText, { childList: true });

    ensureSeconds();
}

// 初始化
initSecondsInjection();