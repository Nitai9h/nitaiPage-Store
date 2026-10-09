// ==Npplication==
// @name    年份显示
// @id    1753707484255_203d0c2d-ec66-40ac-9fa9-f55d4fe86dea
// @version    1.0.2
// @description    用于显示年份
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/dateYear.svg
// @screen    [`https://nitai-images.pages.dev/nitaiPage/store/dateYear_screen.webp`]
// @translates    [`https://nppdb.nitai.cc/dateYear-zh-CN.js`, `https://nppdb.nitai.cc/dateYear-zh-TW.js`, `https://nppdb.nitai.cc/dateYear-en-US.js`]
// ==/Npplication==

function getYearHTML() {
    const dt = new Date();
    let year = dt.getFullYear();
    return wrapDayDigits(year.toString()) + "&nbsp; @dateYear:year &nbsp;" + '<span id="point"></span>';
}

function initYearInjection() {
    const dayElement = document.getElementById('day');
    if (!dayElement) return;

    function ensureYear() {
        // 用结构判断已注入的年份
        // 避免直接读 innerHTML 造成序列化
        if (dayElement.querySelectorAll('#point').length >= 3) return;
        dayElement.insertAdjacentHTML('afterbegin', getYearHTML());
    }

    const observer = new MutationObserver(ensureYear);
    observer.observe(dayElement, { childList: true });

    ensureYear();
}

initYearInjection();