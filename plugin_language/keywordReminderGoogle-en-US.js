// ==Npplication==
// @name    Search Suggestions - Google Source - English
// @version    1.0.0
// @id    1771228268304_1ee4f01e-e13e-4bd2-a1ed-fea28ceba3bc
// @updateUrl    https://nfdb.nitai.us.kg/keywordReminderGoogle-en-US.js
// @description    English translation for Search Suggestions - Google Source plugin
// @author    Nitai
// @translates    en-US
// @type    translate
// @icon    https://nitai-images.pages.dev/nitaiPage/keywordReminder.svg
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@keywordReminderGoogle:suggest-switch": "Enable Search Suggestions",
        "@keywordReminderGoogle:suggest-switch-desc": "Enable search suggestions feature",
        "@keywordReminderGoogle:translate-switch": "Enable Quick Translation",
        "@keywordReminderGoogle:translate-switch-desc": "Show translation option in search suggestions"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
