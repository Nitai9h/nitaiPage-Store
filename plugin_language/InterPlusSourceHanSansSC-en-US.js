// ==Npplication==
// @name    Inter + SourceHanSansSC - English
// @version    1.0.0
// @id    1771227546287_6db7a1d9-3eaa-4fb2-a9b3-dab9e020d4ed
// @updateUrl    https://nfdb.nitai.us.kg/InterPlusSourceHanSansSC-en-US.js
// @description    English translation for Inter + SourceHanSansSC plugin
// @author    Nitai
// @translates    en-US
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@InterPlusSourceHanSansSC:license-agreement-1": "Inter License Agreement",
        "@InterPlusSourceHanSansSC:license-agreement-2": "SourceHanSansSC License Agreement",
        "@InterPlusSourceHanSansSC:notice": "Notice",
        "@InterPlusSourceHanSansSC:notice-title": "You are using Inter and SourceHanSansSC fonts",
        "@InterPlusSourceHanSansSC:notice-content-1": "According to the Inter and SourceHanSansSC open source license agreements:",
        "@InterPlusSourceHanSansSC:notice-content-2": "1. Both fonts are licensed under SIL Open Font License 1.1",
        "@InterPlusSourceHanSansSC:notice-content-3": "2. Font files are unmodified and not distributed separately",
        "@InterPlusSourceHanSansSC:notice-content-4": "For more license details, please check the NPP settings page",
        "@InterPlusSourceHanSansSC:notice-button": "Continue"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
