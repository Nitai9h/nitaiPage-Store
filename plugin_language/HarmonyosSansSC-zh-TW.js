// ==Npplication==
// @name    HarmonyosSansSC - 繁體中文
// @version    1.0.0
// @id    1771227214805_40707bac-7307-457d-81f9-5970129a1778
// @updateUrl    https://nfdb.nitai.us.kg/HarmonyosSansSC-zh-TW.js
// @description    HarmonyosSansSC 插件的繁體中文翻譯
// @author    Nitai
// @translates    zh-TW
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@HarmonyosSansSC:license-agreement": "許可協議",
        "@HarmonyosSansSC:notice": "聲明",
        "@HarmonyosSansSC:notice-title": "您正在使用 HarmonyOS Sans SC 字體",
        "@HarmonyosSansSC:notice-content-1": "根據 HarmonyOS Sans 字體使用許可協議：",
        "@HarmonyosSansSC:notice-content-2": "1. 您已成功加載了使用該字體的插件",
        "@HarmonyosSansSC:notice-content-3": "2. 字體文件未經修改且未單獨分發",
        "@HarmonyosSansSC:notice-content-4": "更多授權詳情請查看 NPP 設置頁面",
        "@HarmonyosSansSC:notice-content-5": "該字體版權歸華為終端有限公司所有。",
        "@HarmonyosSansSC:notice-button": "繼續"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
