// ==Npplication==
// @name    HarmonyosSansSC
// @id    1753976979051_7433f494-d5ea-47aa-a3bf-f7bda52d14ba
// @version    1.0.5
// @updateUrl    https://nfdb.nitai.us.kg/HarmonyosSansSC.js
// @description    加载 HarmonyosSansSC
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/font.svg
// @setting   true
// @translates    [`https://nfdb.nitai.us.kg/HarmonyosSansSC-zh-CN.js`, `https://nfdb.nitai.us.kg/HarmonyosSansSC-zh-TW.js`, `https://nfdb.nitai.us.kg/HarmonyosSansSC-en-US.js`]
// ==/Npplication==

$(function () {
    document.documentElement.style.setProperty(`--font-family`, `'HarmonyOS_Sans_SC','sans-serif'`);

    const fontStylesheets = [
        'https://font.nitai.us.kg/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_black.css',
        'https://font.nitai.us.kg/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_bold.css',
        'https://font.nitai.us.kg/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_light.css',
        'https://font.nitai.us.kg/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_medium.css',
        'https://font.nitai.us.kg/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_regular.css',
        'https://font.nitai.us.kg/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_thin.css'
    ];

    fontStylesheets.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });
});

// 创建设置
function createHarmonyosSansSCFontSetting() {
    const pluginId = '1753976979051_7433f494-d5ea-47aa-a3bf-f7bda52d14ba';
    const mainConts = document.querySelector(`.mainConts[data-value="${pluginId}"]`);

    if (mainConts) {
        const ContentDiv = document.createElement('div');
        ContentDiv.style = 'width: 100%';
        ContentDiv.innerHTML = `
                <div class="HarmonyosSansSC-container">
                    <div class="set_tip_about">
                        <a class="text_hover about-link" href="https://font.nitai.us.kg/HarmonyOS_Sans_SC/LICENSE.txt" target="_blank" class="about-link">
                            <span class="set_text">@HarmonyosSansSC:license-agreement (copy)</span>
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
        createHarmonyosSansSCFontSetting()
    });

    setTimeout(() => {
        const harmonyosSansSCLicenseAgreement = localStorage.getItem('harmonyosSansSCLicenseAgreement') || false;
        if (harmonyosSansSCLicenseAgreement === false) {
            // 显示字体授权协议窗口
            showAnnouncement(
                '@HarmonyosSansSC:notice',
                `@HarmonyosSansSC:notice-title\n
@HarmonyosSansSC:notice-content-1\n
@HarmonyosSansSC:notice-content-2\n
@HarmonyosSansSC:notice-content-3\n
\n
@HarmonyosSansSC:notice-content-4\n
\n
@HarmonyosSansSC:notice-content-5`,
                '@HarmonyosSansSC:notice-button'
            );
            localStorage.setItem('harmonyosSansSCLicenseAgreement', true)
        }
    }, 2000)
});