// ==Npplication==
// @name    搜索建议-必应源 - 简体中文
// @version    1.0.0
// @id    1771228045680_8511a182-f853-4496-869f-2d1385ff392b
// @updateUrl    https://nfdb.nitai.us.kg/keywordReminderBing-zh-CN.js
// @description    搜索建议-必应源 插件的简体中文翻译
// @author    Nitai
// @translates    zh-CN
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@keywordReminderBing:suggest-switch": "开启搜索建议",
        "@keywordReminderBing:suggest-switch-desc": "启用搜索建议功能",
        "@keywordReminderBing:translate-switch": "开启快捷翻译",
        "@keywordReminderBing:translate-switch-desc": "在搜索建议中显示翻译选项"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
