// ==Npplication==
// @name    搜索建議-谷歌源 - 繁體中文
// @version    1.0.0
// @id    1771228280886_fc1389bb-2507-4c60-a983-096e1b5a44e7
// @updateUrl    https://nfdb.nitai.us.kg/keywordReminderGoogle-zh-TW.js
// @description    搜索建議-谷歌源 插件的繁體中文翻譯
// @author    Nitai
// @translates    zh-TW
// @type    translate
// @icon    https://nitai-images.pages.dev/nitaiPage/keywordReminder.svg
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@keywordReminderGoogle:suggest-switch": "開啟搜索建議",
        "@keywordReminderGoogle:suggest-switch-desc": "啟用搜索建議功能",
        "@keywordReminderGoogle:translate-switch": "開啟快捷翻譯",
        "@keywordReminderGoogle:translate-switch-desc": "在搜索建議中顯示翻譯選項"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
