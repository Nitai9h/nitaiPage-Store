// ==Npplication==
// @name    Inter + 思源黑体 - 繁體中文
// @version    1.0.0
// @id    1771227568183_a53f45aa-31c3-4764-8962-6677acce2a5a
// @updateUrl    https://nfdb.nitai.us.kg/InterPlusSourceHanSansSC-zh-TW.js
// @description    Inter + 思源黑體 插件的繁體中文翻譯
// @author    Nitai
// @translates    zh-TW
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@InterPlusSourceHanSansSC:license-agreement-1": "Inter 許可協議",
        "@InterPlusSourceHanSansSC:license-agreement-2": "SourceHanSansSC 許可協議",
        "@InterPlusSourceHanSansSC:notice": "聲明",
        "@InterPlusSourceHanSansSC:notice-title": "您正在使用 Inter 與 SourceHanSansSC 字體",
        "@InterPlusSourceHanSansSC:notice-content-1": "根據 Inter 與 SourceHanSansSC 字體開源許可協議：",
        "@InterPlusSourceHanSansSC:notice-content-2": "1. 兩款字體皆根據 SIL Open Font License 1.1 授權許可",
        "@InterPlusSourceHanSansSC:notice-content-3": "2. 字體檔案未經修改且未單獨分發",
        "@InterPlusSourceHanSansSC:notice-content-4": "更多授權詳情請查看 NPP 設定頁面",
        "@InterPlusSourceHanSansSC:notice-button": "繼續"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
