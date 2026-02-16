// ==Npplication==
// @name    霞鹜文楷等寬版 - 繁體中文
// @version    1.0.0
// @id     1771228390351_74080f13-8f7b-4deb-8cb4-b704e9d5e13f
// @updateUrl    https://nfdb.nitai.us.kg/LXGWWenKaiMono-zh-TW.js
// @description    霞鹜文楷等寬版 插件的繁體中文翻譯
// @author    Nitai
// @translates    zh-TW
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@LXGWWenKaiMono:license-agreement": "許可協議（複製）",
        "@LXGWWenKaiMono:notice": "聲明",
        "@LXGWWenKaiMono:notice-title": "您正在使用 LXGWWenKaiMono (霞鶩文楷)字體",
        "@LXGWWenKaiMono:notice-content-1": "根據 LXGWWenKaiMono 字體使用許可協議：",
        "@LXGWWenKaiMono:notice-content-2": "1. 該字體根據 SIL Open Font License 1.1 授權許可",
        "@LXGWWenKaiMono:notice-content-3": "2. 字體文件未經修改且未單獨分發",
        "@LXGWWenKaiMono:notice-content-4": "完整許可協議請查看 NPP 設置頁面",
        "@LXGWWenKaiMono:notice-continue": "繼續"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
