// ==Npplication==
// @name    Search Suggestions - Baidu Source - English
// @version    1.0.0
// @id    1771227849533_8a54e3ec-3649-4880-a78e-67512d5fb965
// @updateUrl    https://nfdb.nitai.us.kg/keywordReminderBaidu-en-US.js
// @description    English translation for Search Suggestions - Baidu Source plugin
// @author    Nitai
// @translates    en-US
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@keywordReminderBaidu:suggest-switch": "Enable Search Suggestions",
        "@keywordReminderBaidu:suggest-switch-desc": "Enable search suggestions feature",
        "@keywordReminderBaidu:translate-switch": "Enable Quick Translation",
        "@keywordReminderBaidu:translate-switch-desc": "Show translation option in search suggestions"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
