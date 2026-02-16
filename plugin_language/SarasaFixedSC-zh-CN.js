// ==Npplication==
// @name    更纱黑体 - 简体中文
// @version    1.0.0
// @id    1771229024170_fa5a801c-4f24-44a7-811e-5a27c7ab3052
// @updateUrl    https://nfdb.nitai.us.kg/SarasaFixedSC-zh-CN.js
// @description    更纱黑体 插件的简体中文翻译
// @author    Nitai
// @translates    zh-CN
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@SarasaFixedSC:license-agreement": "许可协议",
        "@SarasaFixedSC:notice": "声明",
        "@SarasaFixedSC:notice-title": "您正在使用 SarasaFixedSC (更纱黑体)字体",
        "@SarasaFixedSC:notice-content-1": "根据 SarasaFixedSC 字体使用许可协议：",
        "@SarasaFixedSC:notice-content-2": "1. 该字体根据 SIL Open Font License 1.1 授权许可",
        "@SarasaFixedSC:notice-content-3": "2. 字体文件未经修改且未单独分发",
        "@SarasaFixedSC:notice-content-4": "完整许可协议请查看 NPP 设置页面",
        "@SarasaFixedSC:continue": "继续"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
