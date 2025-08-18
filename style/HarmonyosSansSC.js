// ==Npplication==
// @name    HarmonyosSansSC
// @id    1753976979051_7433f494-d5ea-47aa-a3bf-f7bda52d14ba
// @version    1.0.3
// @updateUrl    https://nfdb.nitai.us.kg/HarmonyosSansSC.js
// @description    加载 HarmonyosSansSC
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/font.svg
// @setting   true
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
                            <span class="set_text">License Agreement (copy)</span>
                            <span class="iconfont icon-link"></span>
                        </a>
                    </div>
                </div>
            `;
        mainConts.appendChild(ContentDiv);
    }
}

$(function () {
    createHarmonyosSansSCFontSetting()
    setTimeout(() => {
        const harmonyosSansSCLicenseAgreement = localStorage.getItem('harmonyosSansSCLicenseAgreement') || false;
        if (harmonyosSansSCLicenseAgreement === false) {
            // 显示字体授权协议窗口
            showAnnouncement(
                '声明',
                `您正在使用 HarmonyOS Sans SC 字体\n
根据 HarmonyOS Sans 字体使用许可协议：\n
1. 您已成功加载了使用该字体的插件\n
2. 字体文件未经修改且未单独分发\n
\n
更多授权详情请查看 NPP 设置页面\n
\n
该字体版权归华为终端有限公司所有。`,
                '继续'
            );
            localStorage.setItem('harmonyosSansSCLicenseAgreement', true)
        }
    }, 2000)
});