// ==Npplication==
// @name    年份顯示 - 繁體中文
// @id    1771226936034_67638fc6-5bf7-4fed-b2db-ad2a626f987f
// @version    1.0.0
// @updateUrl    https://nfdb.nitai.us.kg/dateYear-zh-TW.js
// @description    年份顯示 插件的繁體中文翻譯
// @author    Nitai
// @translates    zh-TW
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
