// ==Npplication==
// @name    年份显示
// @id    1753707484255_203d0c2d-ec66-40ac-9fa9-f55d4fe86dea
// @version    1.0.0
// @updateUrl    https://nfdb.nitai.us.kg/dateYear.js
// @description    用于显示年份
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/dateYear.svg
// @screen    [`https://nitai-images.pages.dev/nitaiPage/store/dateYear_screen.webp`]
// ==/Npplication==

function getYearHTML() {
    const dt = new Date();
    let year = dt.getFullYear();
    return wrapDayDigits(year.toString()) + "&nbsp;年&nbsp;" + '<span id="point"></span>';
}

function initYearInjection() {
    const dayElement = document.getElementById('day');
    if (!dayElement) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                const hasYear = dayElement.innerHTML.includes('id="point"') && dayElement.innerHTML.split('id="point"').length > 3;
                if (!hasYear) {
                    dayElement.innerHTML = getYearHTML() + dayElement.innerHTML;
                }
            }
        });
    });

    observer.observe(dayElement, { childList: true, subtree: true });
    dayElement.innerHTML = getYearHTML() + dayElement.innerHTML;
}

initYearInjection();