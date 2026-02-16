// ==Npplication==
// @name    搜索建议-谷歌源 - 简体中文
// @version    1.0.0
// @id     1771228290486_1f9aee9c-d661-47a7-b849-e6c20f138ccf
// @updateUrl    https://nfdb.nitai.us.kg/keywordReminderGoogle-zh-CN.js
// @description    搜索建议-谷歌源 插件的简体中文翻译
// @author    Nitai
// @translates    zh-CN
// @type    translate
// @icon    https://nitai-images.pages.dev/nitaiPage/keywordReminder.svg
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@keywordReminderGoogle:suggest-switch": "开启搜索建议",
        "@keywordReminderGoogle:suggest-switch-desc": "启用搜索建议功能",
        "@keywordReminderGoogle:translate-switch": "开启快捷翻译",
        "@keywordReminderGoogle:translate-switch-desc": "在搜索建议中显示翻译选项"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
