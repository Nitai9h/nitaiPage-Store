// ==Npplication==
// @name    更纱黑体
// @id    1754217199372_507b8683-e1fe-40a5-8ca3-bf27d536e3a7
// @version    1.0.3
// @updateUrl    https://nfdb.nitai.us.kg/SarasaFixedSC.js
// @description    加载更纱黑体
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/font.svg
// @setting   true
// ==/Npplication==

$(function () {
    document.documentElement.style.setProperty(`--font-family`, `'SarasaFixedSC','sans-serif'`);

    const fontStylesheets = [
        'https://font.nitai.us.kg/SarasaFixedSC/SarasaFixedSC-Bold.css',
        'https://font.nitai.us.kg/SarasaFixedSC/SarasaFixedSC-BoldItalic.css',
        'https://font.nitai.us.kg/SarasaFixedSC/SarasaFixedSC-ExtraLight.css',
        'https://font.nitai.us.kg/SarasaFixedSC/SarasaFixedSC-ExtraLightItalic.css',
        'https://font.nitai.us.kg/SarasaFixedSC/SarasaFixedSC-Italic.css',
        'https://font.nitai.us.kg/SarasaFixedSC/SarasaFixedSC-Light.css',
        'https://font.nitai.us.kg/SarasaFixedSC/SarasaFixedSC-LightItalic.css',
        'https://font.nitai.us.kg/SarasaFixedSC/SarasaFixedSC-Regular.css',
        'https://font.nitai.us.kg/SarasaFixedSC/SarasaFixedSC-SemiBold.css',
        'https://font.nitai.us.kg/SarasaFixedSC/SarasaFixedSC-SemiBoldItalic.css'
    ];
    fontStylesheets.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });
});

function createSarasaFixedSCSetting() {
    const pluginId = '1754217199372_507b8683-e1fe-40a5-8ca3-bf27d536e3a7';
    const mainConts = document.querySelector(`.mainConts[data-value="${pluginId}"]`);

    if (mainConts) {
        const ContentDiv = document.createElement('div');
        ContentDiv.style = 'width: 100%';
        ContentDiv.innerHTML = `
                <div class="SarasaFixedSC-container">
                    <div class="set_tip_about">
                        <a class="text_hover about-link" href="https://font.nitai.us.kg/SarasaFixedSC/LICENSE.txt" target="_blank" class="about-link">
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
    createSarasaFixedSCSetting()
    setTimeout(() => {
        const SarasaFixedSCLicenseAgreement = localStorage.getItem('SarasaFixedSCLicenseAgreement') || false;
        if (SarasaFixedSCLicenseAgreement === false) {
            // 显示字体授权协议窗口
            showAnnouncement(
                '声明',
                `您正在使用 SarasaFixedSC (更纱黑体)字体\n
根据 SarasaFixedSC 字体使用许可协议：\n
1. 该字体根据 SIL Open Font License 1.1 授权许可\n
2. 字体文件未经修改且未单独分发\n
\n
完整许可协议请查看 NPP 设置页面`,
                '继续'
            );
            localStorage.setItem('SarasaFixedSCLicenseAgreement', true);
        }
    }, 2000)
});