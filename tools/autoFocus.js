// ==Npplication==
// @name    快速使用
// @id    1753891006224_fc7c6194-79c8-455f-b6e7-2347bdc8caad
// @version    1.0.0
// @updateUrl    https://nfdb.nitai.us.kg/autoFocus.js
// @description    打开页面自动聚焦到搜索框
// @author    Nitai
// @time    body
// @icon    https://nitai-images.pages.dev/nitaiPage/autoFocus.svg
// @screen    [`https://nitai-images.pages.dev/nitaiPage/store/autoFocus_screen.webp`]
// ==/Npplication==

function initAutoFocus() {
    // 自动聚焦到搜索框
    if ($(".wd").length) {
        $(".wd").focus();
        if (typeof focusWd === 'function') {
            focusWd();
        }
    }
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoFocus);
} else {
    initAutoFocus();
}