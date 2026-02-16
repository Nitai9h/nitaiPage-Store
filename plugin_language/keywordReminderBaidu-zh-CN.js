// ==Npplication==
// @name    搜索建议-百度源 - 简体中文
// @version    1.0.0
// @id    1771227862964_83e608b9-88f1-4d65-90f5-07664b19520f
// @updateUrl    https://nfdb.nitai.us.kg/keywordReminderBaidu-zh-CN.js
// @description    搜索建议-百度源 插件的简体中文翻译
// @author    Nitai
// @translates    zh-CN
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@keywordReminderBaidu:suggest-switch": "开启搜索建议",
        "@keywordReminderBaidu:suggest-switch-desc": "启用搜索建议功能",
        "@keywordReminderBaidu:translate-switch": "开启快捷翻译",
        "@keywordReminderBaidu:translate-switch-desc": "在搜索建议中显示翻译选项"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
