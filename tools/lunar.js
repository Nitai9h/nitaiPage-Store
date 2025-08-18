// ==Npplication==
// @name    农历显示
// @id    1753891006224_a75c053a-e545-4679-9316-cee02e3fc2e9
// @version    1.2.5
// @updateUrl    https://nfdb.nitai.us.kg/lunar.js
// @description    显示农历日期
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/lunar.svg
// @setting    true
// @screen    [`https://nitai-images.pages.dev/nitaiPage/store/lunar_screen.webp`]
// ==/Npplication==

let lunarLoaded = false;
let lunarFontSizeSlider, lunarFontThickSlider, lunarOpacitySlider;

// 加载 lunar 库
const lunarScript = document.createElement('script');
lunarScript.src = 'https://nfdb.nitai.us.kg/lunar.min.js';
lunarScript.onload = () => {
    lunarLoaded = true;
    genereateLunarSettings();
    addLunarStyles();
    initLunarDisplay();
    initLunarSliders();
    setupSliderListeners();
};

document.head.appendChild(lunarScript);

// 添加农历日期样式
function addLunarStyles() {
    // 检查样式是否已存在
    if (!document.getElementById('lunar_styles')) {
        const style = document.createElement('style');
        style.id = 'lunar_styles';
        style.textContent = `
            #lunar_date {
                margin: 4px 0px;
                text-shadow: var(--main-text-shadow);
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-content: center;
                justify-content: center;
                align-items: center;
                white-space: nowrap;
            }
            .tool-all {
                padding-bottom: 0px !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// 初始化农历显示
function initLunarDisplay() {
    if (!lunarLoaded) return;

    const timeElement = document.querySelector('.time');
    if (!timeElement) return;

    const dayElement = document.getElementById('day');
    const timeTextElement = document.getElementById('time_text');

    if (dayElement && timeTextElement) {
        let lunarElement = document.getElementById('lunar_date');
        if (!lunarElement) {
            lunarElement = document.createElement('div');
            lunarElement.id = 'lunar_date';
            lunarElement.className = 'lunar-date';
            // 插入
            timeTextElement.parentNode.insertBefore(lunarElement, timeTextElement.nextSibling);
        }

        // 更新日期
        updateLunarDate();
        // 定时更新
        setInterval(updateLunarDate, 60000);
    }
}

// 更新日期
function updateLunarDate() {
    if (!lunarLoaded) return;

    try {
        const lunarD = Lunar.fromDate(new Date());
        const ganZhiYear = lunarD.getYearInGanZhiByLiChun();
        const shengXiao = lunarD.getYearShengXiao();
        const lunarMonth = lunarD.getMonthInChinese();
        const lunarDay = lunarD.getDayInChinese();

        const lunarElement = document.getElementById('lunar_date');
        if (lunarElement) {
            lunarElement.innerHTML = `<span translate='none'>` + ganZhiYear + shengXiao + '年 ' + lunarMonth + '月' + lunarDay + `</span>`;
        }
    } catch (error) {
        console.error('更新日期(Lunar)时出错:', error);
    }
}

// 转换日期
function convertToLunar(date) {
    if (!lunarLoaded) return '';

    try {
        const lunar = Lunar.fromDate(date);
        return lunar.getYearInGanZhiByLiChun() + lunar.getYearShengXiao() + '年 ' +
            lunar.getMonthInChinese() + '月 ' +
            lunar.getDayInChinese() + '日';
    } catch (error) {
        console.error('转换日期到农历出错:', error);
        return '';
    }
}

// 初始化滑块
function initLunarSliders() {
    lunarFontSizeSlider = document.getElementById('font-size-lunar');
    lunarFontThickSlider = document.getElementById('font-thick-lunar');
    lunarOpacitySlider = document.getElementById('font-opacity-lunar');

    if (!lunarFontSizeSlider || !lunarFontThickSlider || !lunarOpacitySlider) {
        console.error('找不到滑块 (Lunar)');
        return;
    }

    const size = parseInt(localStorage.getItem('lunarFontSize') || '0', 10);
    const weight = parseInt(localStorage.getItem('lunarFontThick') || '50', 10);
    const opacity = parseInt(localStorage.getItem('lunarOpacity') || '100', 10);

    lunarFontSizeSlider.value = size;
    lunarFontThickSlider.value = weight;
    lunarOpacitySlider.value = opacity;

    // 设置 Value 初始值
    document.getElementById('font-size-lunar-value').textContent = size;
    document.getElementById('font-thick-lunar-value').textContent = weight;
    document.getElementById('font-opacity-lunar-value').textContent = opacity;

    initSliderProgress(lunarFontSizeSlider);
    initSliderProgress(lunarFontThickSlider);
    initSliderProgress(lunarOpacitySlider);

    updateLunarStyle(size, weight, opacity);
}

// 设置事件监听器
function setupSliderListeners() {
    if (!lunarFontSizeSlider || !lunarFontThickSlider || !lunarOpacitySlider) {
        // 失败重试
        setTimeout(() => {
            initLunarSliders();
            setupSliderListeners();
        }, 100);
        return;
    }

    lunarFontSizeSlider.addEventListener('input', function () {
        const size = parseInt(this.value);
        const weight = parseInt(lunarFontThickSlider.value);
        const opacity = parseInt(lunarOpacitySlider.value);
        updateLunarStyle(size, weight, opacity);
        localStorage.setItem('lunarFontSize', size);
        // 更新 Value
        const valueElement = document.getElementById('font-size-lunar-value');
        valueElement.textContent = size;
        const progress = ((size - this.min) / (this.max - this.min)) * 100;
        this.style.setProperty('--slider-progress', progress + '%');
    });

    lunarFontThickSlider.addEventListener('input', function () {
        const size = parseInt(lunarFontSizeSlider.value);
        const weight = parseInt(this.value);
        const opacity = parseInt(lunarOpacitySlider.value);
        updateLunarStyle(size, weight, opacity);
        localStorage.setItem('lunarFontThick', weight);
        // 更新 Value
        const valueElement = document.getElementById('font-thick-lunar-value');
        valueElement.textContent = weight;
        const progress = ((weight - this.min) / (this.max - this.min)) * 100;
        this.style.setProperty('--slider-progress', progress + '%');
    });

    lunarOpacitySlider.addEventListener('input', function () {
        const size = parseInt(lunarFontSizeSlider.value);
        const weight = parseInt(lunarFontThickSlider.value);
        const opacity = parseInt(this.value);
        updateLunarStyle(size, weight, opacity);
        localStorage.setItem('lunarOpacity', opacity);
        // 更新 Value
        const valueElement = document.getElementById('font-opacity-lunar-value');
        valueElement.textContent = opacity;
        const progress = ((opacity - this.min) / (this.max - this.min)) * 100;
        this.style.setProperty('--slider-progress', progress + '%');
    });

    // 添加滑块数值显示监听器
    addLunarSliderValueListeners();
}

// 初始化滑块 Value 显示
function initSliderProgress(slider) {
    const value = parseInt(slider.value);
    const progress = ((value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--slider-progress', progress + '%');
}

// 添加农历滑块数值显示监听器
function addLunarSliderValueListeners() {
    const sliders = [
        document.getElementById('font-size-lunar'),
        document.getElementById('font-thick-lunar'),
        document.getElementById('font-opacity-lunar')
    ];

    sliders.forEach(slider => {
        if (!slider) return;

        // 鼠标按下时显示
        slider.addEventListener('mousedown', function () {
            const valueElementId = this.id;
            const valueElement = document.querySelector(`[data-slider="${valueElementId}"]`);
            if (valueElement) {
                valueElement.classList.add('show');
            }
        });

        // 鼠标释放时隐藏
        slider.addEventListener('mouseup', function () {
            const valueElementId = this.id;
            const valueElement = document.querySelector(`[data-slider="${valueElementId}"]`);
            if (valueElement) {
                valueElement.classList.remove('show');
            }
        });

        // 鼠标离开滑块也隐藏
        slider.addEventListener('mouseleave', function () {
            const valueElementId = this.id;
            const valueElement = document.querySelector(`[data-slider="${valueElementId}"]`);
            if (valueElement) {
                valueElement.classList.remove('show');
            }
        });

        // 触摸开始时显示
        slider.addEventListener('touchstart', function (e) {
            const valueElementId = this.id;
            const valueElement = document.querySelector(`[data-slider="${valueElementId}"]`);
            if (valueElement) {
                valueElement.classList.add('show');
            }
        });

        // 触摸结束时隐藏
        slider.addEventListener('touchend', function (e) {
            const valueElementId = this.id;
            const valueElement = document.querySelector(`[data-slider="${valueElementId}"]`);
            if (valueElement) {
                valueElement.classList.remove('show');
            }
        });

        // 触摸取消时隐藏
        slider.addEventListener('touchcancel', function (e) {
            const valueElementId = this.id;
            const valueElement = document.querySelector(`[data-slider="${valueElementId}"]`);
            if (valueElement) {
                valueElement.classList.remove('show');
            }
        });
    });
}

// 更新样式
function updateLunarStyle(size, weight, opacity) {
    const lunarElement = document.getElementById('lunar_date');
    if (!lunarElement) return;

    const baseFontSize = 0.8; // 基础字体大小
    const maxIncrease = 2.5; // 最大增加
    const fontSize = baseFontSize + (size / 100) * maxIncrease;
    const fontWeight = 100 + (weight / 100) * 800; // 100-900
    const opacityValue = opacity / 100; // 0-1

    // 应用样式
    lunarElement.style.fontSize = `${fontSize}rem`;
    lunarElement.style.fontWeight = fontWeight;
    lunarElement.style.opacity = opacityValue;
}

// 生成设置
function genereateLunarSettings() {
    const pluginId = '1753891006224_a75c053a-e545-4679-9316-cee02e3fc2e9';
    const mainConts = document.querySelector(`.mainConts[data-value="${pluginId}"]`);

    if (mainConts) {
        const lunarSettingDiv = document.createElement('div');
        lunarSettingDiv.id = 'lunar_settings';
        lunarSettingDiv.className = 'set_tip';
        lunarSettingDiv.style = 'width: 100%';
        lunarSettingDiv.innerHTML = `
                <div class="tip_new_both advancedSetting">
                    <div>
                        <span class="set_text"><big>农历大小&nbsp;</big><br></span>
                        <span class="set_text" style="color: gray;"><small>最左侧为默认大小</small></span>
                    </div>
                    <div class="slider-container">
                        <input type="range" class="slider" min="0" max="100" value="0" id="font-size-lunar">
                        <span class="slider-value" data-slider="font-size-lunar" id="font-size-lunar-value">0</span>
                    </div>
                </div>
                <div class="tip_new_both">
                    <div>
                        <span class="set_text"><big>农历粗细&nbsp;</big><br></span>
                        <span class="set_text" style="color: gray;"><small>正中间为默认大小</small></span>
                    </div>
                    <div class="slider-container">
                        <input type="range" class="slider" min="0" max="100" value="50" id="font-thick-lunar">
                        <span class="slider-value" data-slider="font-thick-lunar" id="font-thick-lunar-value">50</span>
                    </div>
                </div>
                <div class="tip_new_both">
                    <div>
                        <span class="set_text"><big>农历透明度&nbsp;</big><br></span>
                        <span class="set_text" style="color: gray;"><small>最右侧为默认大小</small></span>
                    </div>
                    <div class="slider-container">
                        <input type="range" class="slider" min="0" max="100" value="100" id="font-opacity-lunar">
                        <span class="slider-value" data-slider="font-opacity-lunar" id="font-opacity-lunar-value">100</span>
                    </div>
                </div>
        `;
        mainConts.appendChild(lunarSettingDiv);
    }
}