// ==Npplication==
// @name    MiSans
// @id    1753962851002_c604f558-58b3-4ec6-ba71-04b3d0f40c03
// @version    1.0.3
// @updateUrl    https://nfdb.nitai.us.kg/misans.js
// @description    加载 MiSans
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/font.svg
// @setting   true
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
    createMiSansFontSetting()
    setTimeout(() => {
        const MiSansLicenseAgreement = localStorage.getItem('MiSansLicenseAgreement') || false;
        if (MiSansLicenseAgreement === false) {
            // 显示字体授权协议窗口
            showAnnouncement(
                '声明',
                `您正在使用 MiSans 字体\n
根据 MiSans 字体使用许可协议（以下简称“协议”）：\n
1. 本 NPP 使用的字体基于协议授权\n
2. 字体文件未经修改且未单独分发\n
\n
更多授权详情请查看 NPP 设置页面\n
\n
版权信息：\n
Copyright (c), Beijing Xiaomi Mobile Software Co., Ltd.`,
                '继续'
            );
            localStorage.setItem('MiSansLicenseAgreement', true);
        }
    }, 2000)
});