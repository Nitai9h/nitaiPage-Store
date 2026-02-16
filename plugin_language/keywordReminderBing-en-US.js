// ==Npplication==
// @name    Search Suggestions - Bing Source - English
// @version    1.0.0
// @id    1771228055711_ad2972ac-ffbe-4d38-a969-e3352a40243e
// @updateUrl    https://nfdb.nitai.us.kg/keywordReminderBing-en-US.js
// @description    English translation for Search Suggestions - Bing Source plugin
// @author    Nitai
// @translates    en-US
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@keywordReminderBing:suggest-switch": "Enable Search Suggestions",
        "@keywordReminderBing:suggest-switch-desc": "Enable search suggestions feature",
        "@keywordReminderBing:translate-switch": "Enable Quick Translation",
        "@keywordReminderBing:translate-switch-desc": "Show translation option in search suggestions"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
