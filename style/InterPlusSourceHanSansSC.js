// ==Npplication==
// @name    Inter + 思源黑体
// @id    1754849409807_31e69e43-7593-4348-bdcb-6f2ffb31a29f
// @version    1.0.3
// @updateUrl    https://nfdb.nitai.us.kg/InterPlusSourceHanSansSC.js
// @description    西文为 Inter，中文部分 Fallback 回思源黑体
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/font.svg
// @setting   true
// @translates    [`https://nfdb.nitai.us.kg/InterPlusSourceHanSansSC-zh-CN.js`, `https://nfdb.nitai.us.kg/InterPlusSourceHanSansSC-zh-TW.js`, `https://nfdb.nitai.us.kg/InterPlusSourceHanSansSC-en-US.js`]
// ==/Npplication==

$(function () {
    document.documentElement.style.setProperty(`--font-family`, `'Inter','SourceHanSansSC','sans-serif'`);

    const fontStylesheets = [
        'https://font.nitai.us.kg/Inter/Inter_Black.css',
        'https://font.nitai.us.kg/Inter/Inter_BlackItalic.css',
        'https://font.nitai.us.kg/Inter/Inter_Bold.css',
        'https://font.nitai.us.kg/Inter/Inter_BoldItalic.css',
        'https://font.nitai.us.kg/Inter/Inter_ExtraBold.css',
        'https://font.nitai.us.kg/Inter/Inter_ExtraBoldItalic.css',
        'https://font.nitai.us.kg/Inter/Inter_ExtraLight.css',
        'https://font.nitai.us.kg/Inter/Inter_ExtraLightItalic.css',
        'https://font.nitai.us.kg/Inter/Inter_Italic.css',
        'https://font.nitai.us.kg/Inter/Inter_Light.css',
        'https://font.nitai.us.kg/Inter/Inter_LightItalic.css',
        'https://font.nitai.us.kg/Inter/Inter_Medium.css',
        'https://font.nitai.us.kg/Inter/Inter_MediumItalic.css',
        'https://font.nitai.us.kg/Inter/Inter_Regular.css',
        'https://font.nitai.us.kg/Inter/Inter_SemiBold.css',
        'https://font.nitai.us.kg/Inter/Inter_SemiBoldItalic.css',
        'https://font.nitai.us.kg/Inter/Inter_Thin.css',
        'https://font.nitai.us.kg/Inter/Inter_ThinItalic.css',
        'https://font.nitai.us.kg/SourceHanSansSC/SourceHanSansSC_Bold.css',
        'https://font.nitai.us.kg/SourceHanSansSC/SourceHanSansSC_ExtraLight.css',
        'https://font.nitai.us.kg/SourceHanSansSC/SourceHanSansSC_Heavy.css',
        'https://font.nitai.us.kg/SourceHanSansSC/SourceHanSansSC_Light.css',
        'https://font.nitai.us.kg/SourceHanSansSC/SourceHanSansSC_Medium.css',
        'https://font.nitai.us.kg/SourceHanSansSC/SourceHanSansSC_Normal.css',
        'https://font.nitai.us.kg/SourceHanSansSC/SourceHanSansSC_Regular.css'
    ];

    fontStylesheets.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });
});

// 创建设置
function createInterPlusSourceHanSansSCFontSetting() {
    const pluginId = '1754849409807_31e69e43-7593-4348-bdcb-6f2ffb31a29f';
    const mainConts = document.querySelector(`.mainConts[data-value="${pluginId}"]`);

    if (mainConts) {
        const ContentDiv = document.createElement('div');
        ContentDiv.style = 'width: 100%';
        ContentDiv.innerHTML = `
                <div class="HarmonyosSansSC-container">
                    <div class="set_tip_about">
                        <a class="text_hover about-link" href="https://font.nitai.us.kg/Inter/LICENSE.txt" target="_blank" class="about-link">
                            <span class="set_text">@InterPlusSourceHanSansSC:license-agreement-1 (copy)</span>
                            <span class="iconfont icon-link"></span>
                        </a>
                        <a class="text_hover about-link" href="https://font.nitai.us.kg/SourceHanSansSC/LICENSE.txt" target="_blank" class="about-link">
                            <span class="set_text">@InterPlusSourceHanSansSC:license-agreement-2 (copy)</span>
                            <span class="iconfont icon-link"></span>
                        </a>
                    </div>
                </div>
            `;
        mainConts.appendChild(ContentDiv);
    }
}

$(function () {
    // 等待插件设置创建完成后再初始化设置
    document.addEventListener('pluginSettingsTemplateReady', function () {
        createInterPlusSourceHanSansSCFontSetting()
    });

    setTimeout(() => {
        const InterPlusSourceHanSansSCLicenseAgreement = localStorage.getItem('InterPlusSourceHanSansSCLicenseAgreement') || false;
        if (InterPlusSourceHanSansSCLicenseAgreement === false) {
            // 显示字体授权协议窗口
            showAnnouncement(
                '@InterPlusSourceHanSansSC:notice',
                `@InterPlusSourceHanSansSC:notice-title\n
@InterPlusSourceHanSansSC:notice-content-1\n
@InterPlusSourceHanSansSC:notice-content-2\n
@InterPlusSourceHanSansSC:notice-content-3\n
\n
@InterPlusSourceHanSansSC:notice-content-4`,
                '@InterPlusSourceHanSansSC:notice-button'
            );
            localStorage.setItem('InterPlusSourceHanSansSCLicenseAgreement', true)
        }
    }, 2000)
});