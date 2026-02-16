// ==Npplication==
// @name    更紗黑體 - 繁體中文
// @version    1.0.0
// @id    1771229000731_af86621f-4b6a-4fd9-bf54-ef96b8da37d8
// @updateUrl    https://nfdb.nitai.us.kg/SarasaFixedSC-zh-TW.js
// @description    更紗黑體 插件的繁體中文翻譯
// @author    Nitai
// @translates    zh-TW
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@SarasaFixedSC:license-agreement": "許可協議",
        "@SarasaFixedSC:notice": "聲明",
        "@SarasaFixedSC:notice-title": "您正在使用 SarasaFixedSC (更紗黑體)字體",
        "@SarasaFixedSC:notice-content-1": "根據 SarasaFixedSC 字體使用許可協議：",
        "@SarasaFixedSC:notice-content-2": "1. 該字體根據 SIL Open Font License 1.1 授權許可",
        "@SarasaFixedSC:notice-content-3": "2. 字體文件未經修改且未單獨分發",
        "@SarasaFixedSC:notice-content-4": "完整許可協議請查看 NPP 設置頁面",
        "@SarasaFixedSC:continue": "繼續"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
