// ==Npplication==
// @name    MiSans - 简体中文
// @version    1.0.0
// @id    1771228642952_adec3fe1-1599-48a7-b890-d4a12002d680
// @updateUrl    https://nfdb.nitai.us.kg/misans-zh-CN.js
// @description    MiSans 插件的简体中文翻译
// @author    Nitai
// @translates    zh-CN
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@misans:license-agreement": "许可协议",
        "@misans:notice": "声明",
        "@misans:notice-title": "您正在使用 MiSans 字体",
        "@misans:notice-content-1": "根据 MiSans 字体使用许可协议（以下简称'协议'）：",
        "@misans:notice-content-2": "1. 本 NPP 使用的字体基于协议授权",
        "@misans:notice-content-3": "2. 字体文件未经修改且未单独分发",
        "@misans:notice-content-4": "更多授权详情请查看 NPP 设置页面",
        "@misans:copyright": "版权信息：",
        "@misans:notice-continue": "继续"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
