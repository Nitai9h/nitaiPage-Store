// ==Npplication==
// @name    霞鹜文楷等宽版
// @id    1754216597364_244b74a2-f81b-4016-b0cb-326385f59bd7
// @version    1.0.5
// @updateUrl    https://nfdb.nitai.us.kg/LXGWWenKaiMono.js
// @description    加载霞鹜文楷等宽版
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/font.svg
// @setting   true
// @translates    [`https://nfdb.nitai.us.kg/LXGWWenKaiMono-zh-CN.js`, `https://nfdb.nitai.us.kg/LXGWWenKaiMono-zh-TW.js`, `https://nfdb.nitai.us.kg/LXGWWenKaiMono-en-US.js`]
// ==/Npplication==

$(function () {
    document.documentElement.style.setProperty(`--font-family`, `'LXGWWenKaiMono','sans-serif'`);

    const fontStylesheets = [
        'https://font.nitai.us.kg/LXGWWenKaiMono/LXGWWenKaiMono-Light.css',
        'https://font.nitai.us.kg/LXGWWenKaiMono/LXGWWenKaiMono-Medium.css',
        'https://font.nitai.us.kg/LXGWWenKaiMono/LXGWWenKaiMono-Regular.css'
    ];
    fontStylesheets.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });
});

function createLXGWWenKaiMonoSetting() {
    const pluginId = '1754216597364_244b74a2-f81b-4016-b0cb-326385f59bd7';
    const mainConts = document.querySelector(`.mainConts[data-value="${pluginId}"]`);

    if (mainConts) {
        const ContentDiv = document.createElement('div');
        ContentDiv.style = 'width: 100%';
        ContentDiv.innerHTML = `
                <div class="LXGWWenKaiMono-container">
                    <div class="set_tip_about">
                        <a class="text_hover about-link" href="https://font.nitai.us.kg/LXGWWenKaiMono/OFL.txt" target="_blank" class="about-link">
                            <span class="set_text">@LXGWWenKaiMono:license-agreement (copy)</span>
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
        createLXGWWenKaiMonoSetting()
    });

    setTimeout(() => {
        const LXGWWenKaiMonoLicenseAgreement = localStorage.getItem('LXGWWenKaiMonoLicenseAgreement') || false;
        if (LXGWWenKaiMonoLicenseAgreement === false) {
            // 显示字体授权协议窗口
            showAnnouncement(
                '@LXGWWenKaiMono:notice',
                `@LXGWWenKaiMono:notice-title\n
@LXGWWenKaiMono:notice-content-1\n
@LXGWWenKaiMono:notice-content-2\n
@LXGWWenKaiMono:notice-content-3\n
\n
@LXGWWenKaiMono:notice-content-4`,
                '@LXGWWenKaiMono:notice-continue'
            );
            localStorage.setItem('LXGWWenKaiMonoLicenseAgreement', true);
        }
    }, 2000)
});