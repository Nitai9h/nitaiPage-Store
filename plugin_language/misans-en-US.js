// ==Npplication==
// @name    MiSans - English
// @version    1.0.0
// @id    1771228634699_159e2d46-6aaf-416a-831c-10476c33ce84
// @updateUrl    https://nfdb.nitai.us.kg/misans-en-US.js
// @description    English translation for MiSans plugin
// @author    Nitai
// @translates    en-US
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@misans:license-agreement": "License Agreement (copy)",
        "@misans:notice": "Notice",
        "@misans:notice-title": "You are using MiSans font",
        "@misans:notice-content-1": "According to MiSans Font License Agreement (hereinafter referred to as the 'Agreement'):",
        "@misans:notice-content-2": "1. The font used by this NPP is licensed under the Agreement",
        "@misans:notice-content-3": "2. Font files are unmodified and not distributed separately",
        "@misans:notice-content-4": "For more license details, please check the NPP settings page",
        "@misans:copyright": "Copyright Information:",
        "@misans:notice-continue": "Continue"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
