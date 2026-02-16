// ==Npplication==
// @name    MiSans
// @id    1753962851002_c604f558-58b3-4ec6-ba71-04b3d0f40c03
// @version    1.0.5
// @updateUrl    https://nfdb.nitai.us.kg/misans.js
// @description    加载 MiSans
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/font.svg
// @setting   true
// @translates    [`https://nfdb.nitai.us.kg/misans-zh-CN.js`, `https://nfdb.nitai.us.kg/misans-zh-TW.js`, `https://nfdb.nitai.us.kg/misans-en-US.js`]
// ==/Npplication==

$(function () {
    document.documentElement.style.setProperty(`--font-family`, `'MiSans','sans-serif'`);

    const fontStylesheets = [
        'https://font.nitai.us.kg/MiSans/MiSans-Bold.css',
        'https://font.nitai.us.kg/MiSans/MiSans-Demibold.css',
        'https://font.nitai.us.kg/MiSans/MiSans-ExtraLight.css',
        'https://font.nitai.us.kg/MiSans/MiSans-Heavy.css',
        'https://font.nitai.us.kg/MiSans/MiSans-Light.css',
        'https://font.nitai.us.kg/MiSans/MiSans-Medium.css',
        'https://font.nitai.us.kg/MiSans/MiSans-Normal.css',
        'https://font.nitai.us.kg/MiSans/MiSans-Regular.css',
        'https://font.nitai.us.kg/MiSans/MiSans-Semibold.css',
        'https://font.nitai.us.kg/MiSans/MiSans-Thin.css'
    ];

    fontStylesheets.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });
});

// 创建设置
function createMiSansFontSetting() {
    const pluginId = '1753962851002_c604f558-58b3-4ec6-ba71-04b3d0f40c03';
    const mainConts = document.querySelector(`.mainConts[data-value="${pluginId}"]`);

    if (mainConts) {
        const ContentDiv = document.createElement('div');
        ContentDiv.style = 'width: 100%';
        ContentDiv.innerHTML = `
                <div class="MiSans-container">
                    <div class="set_tip_about">
                        <a class="text_hover about-link" href="https://font.nitai.us.kg/MiSans/MiSans%E5%AD%97%E4%BD%93%E7%9F%A5%E8%AF%86%E4%BA%A7%E6%9D%83%E8%AE%B8%E5%8F%AF%E5%8D%8F%E8%AE%AE.pdf" target="_blank" class="about-link">
                            <span class="set_text">@misans:license-agreement (copy)</span>
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
        createMiSansFontSetting()
    });

    setTimeout(() => {
        const MiSansLicenseAgreement = localStorage.getItem('MiSansLicenseAgreement') || false;
        if (MiSansLicenseAgreement === false) {
            // 显示字体授权协议窗口
            showAnnouncement(
                '@misans:notice',
                `@misans:notice-title\n
@misans:notice-content-1\n
@misans:notice-content-2\n
@misans:notice-content-3\n
\n
@misans:notice-content-4\n
\n
@misans:copyright\n
Copyright (c), Beijing Xiaomi Mobile Software Co., Ltd.`,
                '@misans:notice-continue'
            );
            localStorage.setItem('MiSansLicenseAgreement', true);
        }
    }, 2000)
});