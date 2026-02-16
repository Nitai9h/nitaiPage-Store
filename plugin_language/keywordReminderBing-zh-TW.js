// ==Npplication==
// @name    搜索建議-必應源 - 繁體中文
// @version    1.0.0
// @id    1771228073364_f0670aa5-be3e-4255-af0f-7f51bc576575
// @updateUrl    https://nfdb.nitai.us.kg/keywordReminderBing-zh-TW.js
// @description    搜索建議-必應源 插件的繁體中文翻譯
// @author    Nitai
// @translates    zh-TW
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@keywordReminderBing:suggest-switch": "開啟搜索建議",
        "@keywordReminderBing:suggest-switch-desc": "啟用搜索建議功能",
        "@keywordReminderBing:translate-switch": "開啟快捷翻譯",
        "@keywordReminderBing:translate-switch-desc": "在搜索建議中顯示翻譯選項"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
