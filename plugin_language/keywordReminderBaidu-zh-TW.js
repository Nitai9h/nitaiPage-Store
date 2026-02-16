// ==Npplication==
// @name    搜索建議-百度源 - 繁體中文
// @version    1.0.0
// @id    1771227872972_12a990ec-ac02-42bd-a8bf-f188a9e62635
// @updateUrl    https://nfdb.nitai.us.kg/keywordReminderBaidu-zh-TW.js
// @description    搜索建議-百度源 插件的繁體中文翻譯
// @author    Nitai
// @translates    zh-TW
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@keywordReminderBaidu:suggest-switch": "開啟搜索建議",
        "@keywordReminderBaidu:suggest-switch-desc": "啟用搜索建議功能",
        "@keywordReminderBaidu:translate-switch": "開啟快捷翻譯",
        "@keywordReminderBaidu:translate-switch-desc": "在搜索建議中顯示翻譯選項"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
