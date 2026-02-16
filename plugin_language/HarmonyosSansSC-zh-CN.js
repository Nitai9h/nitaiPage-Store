// ==Npplication==
// @name    HarmonyosSansSC - 简体中文
// @version    1.0.0
// @id    1771227201664_bf290a24-235e-4a75-b909-cb7a529762ba
// @updateUrl    https://nfdb.nitai.us.kg/HarmonyosSansSC-zh-CN.js
// @description    HarmonyosSansSC 插件的简体中文翻译
// @author    Nitai
// @translates    zh-CN
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@HarmonyosSansSC:license-agreement": "许可协议",
        "@HarmonyosSansSC:notice": "声明",
        "@HarmonyosSansSC:notice-title": "您正在使用 HarmonyOS Sans SC 字体",
        "@HarmonyosSansSC:notice-content-1": "根据 HarmonyOS Sans 字体使用许可协议：",
        "@HarmonyosSansSC:notice-content-2": "1. 您已成功加载了使用该字体的插件",
        "@HarmonyosSansSC:notice-content-3": "2. 字体文件未经修改且未单独分发",
        "@HarmonyosSansSC:notice-content-4": "更多授权详情请查看 NPP 设置页面",
        "@HarmonyosSansSC:notice-content-5": "该字体版权归华为终端有限公司所有。",
        "@HarmonyosSansSC:notice-button": "继续"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
