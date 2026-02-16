// ==Npplication==
// @name    霞鹜文楷等宽版 - 简体中文
// @version    1.0.0
// @id     1771228356953_395bb01e-3936-435c-a6ba-4e2ccb60409b
// @updateUrl    https://nfdb.nitai.us.kg/LXGWWenKaiMono-zh-CN.js
// @description    霞鹜文楷等宽版 插件的简体中文翻译
// @author    Nitai
// @translates    zh-CN
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@LXGWWenKaiMono:license-agreement": "许可协议",
        "@LXGWWenKaiMono:notice": "声明",
        "@LXGWWenKaiMono:notice-title": "您正在使用 LXGWWenKaiMono (霞鹜文楷)字体",
        "@LXGWWenKaiMono:notice-content-1": "根据 LXGWWenKaiMono 字体使用许可协议：",
        "@LXGWWenKaiMono:notice-content-2": "1. 该字体根据 SIL Open Font License 1.1 授权许可",
        "@LXGWWenKaiMono:notice-content-3": "2. 字体文件未经修改且未单独分发",
        "@LXGWWenKaiMono:notice-content-4": "完整许可协议请查看 NPP 设置页面",
        "@LXGWWenKaiMono:notice-continue": "继续"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
