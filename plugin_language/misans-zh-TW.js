// ==Npplication==
// @name    MiSans - 繁體中文
// @version    1.0.0
// @id    1771228656647_c203e4db-806b-4eea-88fa-96fb5855da7f
// @updateUrl    https://nfdb.nitai.us.kg/misans-zh-TW.js
// @description    MiSans 插件的繁體中文翻譯
// @author    Nitai
// @translates    zh-TW
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@misans:license-agreement": "許可協議（複製）",
        "@misans:notice": "聲明",
        "@misans:notice-title": "您正在使用 MiSans 字體",
        "@misans:notice-content-1": "根據 MiSans 字體使用許可協議（以下簡稱'協議'）：",
        "@misans:notice-content-2": "1. 本 NPP 使用的字體基於協議授權",
        "@misans:notice-content-3": "2. 字體文件未經修改且未單獨分發",
        "@misans:notice-content-4": "更多授權詳情請查看 NPP 設置頁面",
        "@misans:copyright": "版權資訊：",
        "@misans:notice-continue": "繼續"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
