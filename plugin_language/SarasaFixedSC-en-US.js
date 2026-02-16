// ==Npplication==
// @name    SarasaFixedSC - English
// @version    1.0.0
// @id    1771229013383_0c94e349-77f4-454f-b942-941201f4380c
// @updateUrl    https://nfdb.nitai.us.kg/SarasaFixedSC-en-US.js
// @description    English translation for SarasaFixedSC plugin
// @author    Nitai
// @translates    en-US
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@SarasaFixedSC:license-agreement": "License Agreement",
        "@SarasaFixedSC:notice": "Notice",
        "@SarasaFixedSC:notice-title": "You are using SarasaFixedSC font",
        "@SarasaFixedSC:notice-content-1": "According to SarasaFixedSC Font License Agreement:",
        "@SarasaFixedSC:notice-content-2": "1. This font is licensed under SIL Open Font License 1.1",
        "@SarasaFixedSC:notice-content-3": "2. Font files are unmodified and not distributed separately",
        "@SarasaFixedSC:notice-content-4": "For the complete license agreement, please check the NPP settings page",
        "@SarasaFixedSC:continue": "Continue"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
