// ==Npplication==
// @name    霞鹜文楷等宽版
// @id    1754216597364_244b74a2-f81b-4016-b0cb-326385f59bd7
// @version    1.0.3
// @updateUrl    https://nfdb.nitai.us.kg/LXGWWenKaiMono.js
// @description    加载霞鹜文楷等宽版
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/font.svg
// @setting   true
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
    createLXGWWenKaiMonoSetting()
    setTimeout(() => {
        const LXGWWenKaiMonoLicenseAgreement = localStorage.getItem('LXGWWenKaiMonoLicenseAgreement') || false;
        if (LXGWWenKaiMonoLicenseAgreement === false) {
            // 显示字体授权协议窗口
            showAnnouncement(
                '声明',
                `您正在使用 LXGWWenKaiMono (霞鹜文楷)字体\n
根据 LXGWWenKaiMono 字体使用许可协议：\n
1. 该字体根据 SIL Open Font License 1.1 授权许可\n
2. 字体文件未经修改且未单独分发\n
\n
完整许可协议请查看 NPP 设置页面`,
                '继续'
            );
            localStorage.setItem('LXGWWenKaiMonoLicenseAgreement', true);
        }
    }, 2000)
});