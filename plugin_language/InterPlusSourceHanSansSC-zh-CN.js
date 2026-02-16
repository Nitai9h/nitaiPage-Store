// ==Npplication==
// @name    Inter + 思源黑体 - 简体中文
// @version    1.0.0
// @id    1771227557302_99ffe94e-503e-4ddb-8322-6224e5479e09
// @updateUrl    https://nfdb.nitai.us.kg/InterPlusSourceHanSansSC-zh-CN.js
// @description    Inter + 思源黑体 插件的简体中文翻译
// @author    Nitai
// @translates    zh-CN
// @type    translate
// @setting    false
// ==/Npplication==

$(function () {
    const translateEntries = {
        "@InterPlusSourceHanSansSC:license-agreement-1": "Inter 许可协议",
        "@InterPlusSourceHanSansSC:license-agreement-2": "SourceHanSansSC 许可协议",
        "@InterPlusSourceHanSansSC:notice": "声明",
        "@InterPlusSourceHanSansSC:notice-title": "您正在使用 Inter 与 SourceHanSansSC 字体",
        "@InterPlusSourceHanSansSC:notice-content-1": "根据 Inter 与 SourceHanSansSC 字体开源许可协议：",
        "@InterPlusSourceHanSansSC:notice-content-2": "1. 两款字体皆根据 SIL Open Font License 1.1 授权许可",
        "@InterPlusSourceHanSansSC:notice-content-3": "2. 字体文件未经修改且未单独分发",
        "@InterPlusSourceHanSansSC:notice-content-4": "更多授权详情请查看 NPP 设置页面",
        "@InterPlusSourceHanSansSC:notice-button": "继续"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
});
