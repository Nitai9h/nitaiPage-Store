// ==Npplication==
// @name    快速使用
// @id    1753891006224_fc7c6194-79c8-455f-b6e7-2347bdc8caad
// @version    1.0.1
// @description    打开页面自动聚焦到搜索框
// @author    Nitai
// @time    body
// @icon    https://nitai-images.pages.dev/nitaiPage/autoFocus.svg
// @screen    [`https://nitai-images.pages.dev/nitaiPage/store/autoFocus_screen.webp`]
// ==/Npplication==

function initAutoFocus() {
    const input = document.querySelector('.wd');
    if (!input) return;
    // 先进入聚焦状态，再锁定光标
    const searchArea = document.querySelector('.sou');
    if (searchArea) searchArea.click();
    input.focus();
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoFocus);
} else {
    initAutoFocus();
}