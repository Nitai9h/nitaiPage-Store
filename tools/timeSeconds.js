// ==Npplication==
// @name    秒数显示
// @id    1753629993099_c29f24d8-3308-4367-a961-dc53a92272ae
// @version    1.2
// @updateUrl    https://nfdb.nitai.us.kg/timeSeconds.js
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

    // 监听时间变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                // 检查是否已存在秒数节点
                const hasSeconds = timeText.innerHTML.includes('id="point"') && timeText.innerHTML.split('id="point"').length > 2;
                if (!hasSeconds) {
                    timeText.innerHTML += getSecondsHTML();
                }
            }
        });
    });

    observer.observe(timeText, { childList: true, subtree: true });

    // 初始注入
    timeText.innerHTML += getSecondsHTML();
}

// 初始化
initSecondsInjection();