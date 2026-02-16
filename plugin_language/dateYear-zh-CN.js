// ==Npplication==
// @name    年份显示 - 简体中文
// @id    1771226925192_039b725a-e100-4c5e-a6a8-09f5c03d006b
// @version    1.0.0
// @updateUrl    https://nfdb.nitai.us.kg/dateYear-zh-CN.js
// @description    年份显示 插件的简体中文翻译
// @author    Nitai
// @translates    zh-CN
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@dateYear:year": "年"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
