// ==Npplication==
// @name    Year Display - English
// @id    1771226894765_8095f535-6700-41cd-8ee3-42e3e6cd5eb5
// @version    1.0.0
// @updateUrl    https://nfdb.nitai.us.kg/dateYear-en-US.js
// @description    English translation for Year Display plugin
// @author    Nitai
// @translates    en-US
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@dateYear:year": "/"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
