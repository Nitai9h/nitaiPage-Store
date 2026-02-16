// ==Npplication==
// @name    LXGWWenKaiMono - English
// @version    1.0.0
// @id     1771228365768_194cea09-ea17-462a-b200-47e99488579e
// @updateUrl    https://nfdb.nitai.us.kg/LXGWWenKaiMono-en-US.js
// @description    English translation for LXGWWenKaiMono plugin
// @author    Nitai
// @translates    en-US
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@LXGWWenKaiMono:license-agreement": "License Agreement",
        "@LXGWWenKaiMono:notice": "Notice",
        "@LXGWWenKaiMono:notice-title": "You are using LXGWWenKaiMono font",
        "@LXGWWenKaiMono:notice-content-1": "According to LXGWWenKaiMono Font License Agreement:",
        "@LXGWWenKaiMono:notice-content-2": "1. This font is licensed under SIL Open Font License 1.1",
        "@LXGWWenKaiMono:notice-content-3": "2. Font files are unmodified and not distributed separately",
        "@LXGWWenKaiMono:notice-content-4": "For the complete license agreement, please check the NPP settings page",
        "@LXGWWenKaiMono:notice-continue": "Continue"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
