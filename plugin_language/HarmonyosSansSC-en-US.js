// ==Npplication==
// @name    HarmonyosSansSC - English
// @version    1.0.0
// @id    1771227191937_ef1b4473-1d5d-4c9c-b120-ec095b40baf9
// @updateUrl    https://nfdb.nitai.us.kg/HarmonyosSansSC-en-US.js
// @description    English translation for HarmonyosSansSC plugin
// @author    Nitai
// @translates    en-US
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@HarmonyosSansSC:license-agreement": "License Agreement",
        "@HarmonyosSansSC:notice": "Notice",
        "@HarmonyosSansSC:notice-title": "You are using HarmonyOS Sans SC font",
        "@HarmonyosSansSC:notice-content-1": "According to the HarmonyOS Sans font license agreement:",
        "@HarmonyosSansSC:notice-content-2": "1. You have successfully loaded the plugin that uses this font",
        "@HarmonyosSansSC:notice-content-3": "2. The font file has not been modified and is not distributed separately",
        "@HarmonyosSansSC:notice-content-4": "For more authorization details, please check the NPP settings page",
        "@HarmonyosSansSC:notice-content-5": "The font copyright belongs to Huawei Terminal Co., Ltd.",
        "@HarmonyosSansSC:notice-button": "Continue"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
