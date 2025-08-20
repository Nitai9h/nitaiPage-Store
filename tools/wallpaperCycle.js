// ==Npplication==
// @name    壁纸切换器
// @id    1755684063321_c66b7dc7-375f-4ab0-a32d-d1eb9c406bdb
// @version    1.0.1
// @updateUrl    https://nfdb.nitai.us.kg/wallpaperCycle.js
// @description    每隔一段时间自动切换下一张壁纸
// @author    Nitai
// @time   body
// @icon    https://nitai-images.pages.dev/nitaiPage/wallpaperCycle.svg
// @setting    true
// ==/Npplication==

// 默认间隔时间
const WALLPAPER_INTERVAL = 300000; // 5分钟

// 检查自动切换壁纸是否启用
function isWallpaperCycleEnabled() {
    return localStorage.getItem('WallpaperCycleEnabled') === 'on';
}

// 获取自动切换壁纸间隔时间
function getWallpaperCycleInterval() {
    return parseInt(localStorage.getItem('WallpaperCycleInterval')) || WALLPAPER_INTERVAL;
}

// 自动切换壁纸定时器
let WallpaperCycleTimer = null;

function autoChangeWallpaper() {
    // 检查是否启用自动切换
    if (!isWallpaperCycleEnabled()) {
        return;
    }

    // 获取当前壁纸类型
    const bg_img = getBgImg();
    const currentType = parseInt(bg_img["type"]) || 0;

    // 纯色背景，不自动切换
    if (currentType === 2) {
        return;
    }

    const bg = new BroadcastChannel("bgLoad");

    // 监听壁纸加载完成事件
    bg.onmessage = function (event) {
        if (event.data === "bgImgLoadinged") {
            setTimeout(() => {
                $('#bg-video').css({ 'opacity': '1', 'transform': 'scale(1.08)', 'filter': 'var(--main-box-gauss-plus)', 'transition': 'ease 0.7s' });
                $('#bg').css({ 'opacity': '1', 'transform': 'scale(1.08)', 'filter': 'var(--main-box-gauss-plus)', 'transition': 'ease 0.7s' });
                bg.close();
            }, 200);
        }
    };

    // 淡出效果
    $('#bg').css("cssText", "opacity: 0;transform: scale(1);filter: blur(var(--main-box-gauss));transition: ease 0.3s;");
    $('#bg-video').css("cssText", "opacity: 0;transform: scale(1);filter: blur(var(--main-box-gauss));transition: ease 0.3s;");

    setTimeout(() => {
        // 移除 onerror 事件处理器
        $('#bg').removeAttr('onerror');
        $('#bg').attr('src', '');
        $('#bg').removeClass('error');

        // 重置视频
        const videoElement = $('#bg-video');
        if (videoElement.length > 0) {
            videoElement[0].pause();
            videoElement.attr('src', '');
            videoElement.hide();
        }

        $('#bg').show();

        // 开始加载
        bg.postMessage("bgImgLoadingStart");

        // 初始化壁纸
        setBgImgInit();
    }, 300);
}

function startWallpaperCycle() {
    if (WallpaperCycleTimer) {
        clearInterval(WallpaperCycleTimer);
    }

    const interval = getWallpaperCycleInterval();
    WallpaperCycleTimer = setInterval(autoChangeWallpaper, interval);
}

function stopWallpaperCycle() {
    if (WallpaperCycleTimer) {
        clearInterval(WallpaperCycleTimer);
        WallpaperCycleTimer = null;
    }
}

// 创建设置
function createWallpaperCycleSetting() {
    const pluginId = '1755684063321_c66b7dc7-375f-4ab0-a32d-d1eb9c406bdb';
    const mainConts = document.querySelector(`.mainConts[data-value="${pluginId}"]`);

    if (mainConts) {
        const settingDiv = document.createElement('div');
        settingDiv.className = 'set_tip';
        settingDiv.style = 'width: 100%';
        settingDiv.innerHTML = `
            <style>
            .WallpaperCycle_switch-container {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;
                align-items: center;
            }
            .WallpaperCycle_interval-container {
                display: flex;
                flex-direction: column;
                flex-wrap: nowrap;
                justify-content: space-between;
                margin-top: 20px;
                align-items: stretch;
                transition: all 0.3s;
            }
            .WallpaperCycle_interval-container.hide {
                opacity: 0;
                margin-top: 0px !important;
                transform: translateY(-65px) !important;
                margin-bottom: -95px;
                pointer-events: none;
            }
            .WallpaperCycle_interval-label {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
            .WallpaperCycle_interval-input-container {
                display: flex;
                flex-direction: row;
                gap: 10px;
                margin-top: 10px;
                justify-content: space-between;
            }
            .WallpaperCycle_interval-input {
                padding: 0px 5px;
                border-radius: 8px;
            }
            .WallpaperCycle_save-btn {
                width: 25%;
                display: flex;
                height: 40px;
                border-radius: 8px;
                background: var(--main-background-color);
                margin: 0 20px;
                justify-content: center;
                align-items: center;
                transition: 0.3s;
                border-style: unset;
                box-shadow: var(--main-search-shadow);
                -webkit-box-shadow: var(--main-search-shadow);
            }
            .WallpaperCycle_save-btn:hover {
                cursor: pointer;
                background: var(--main-background-hover-color);
                transition: 0.3s;
            }
            .WallpaperCycle_save-btn:active {
                transform: scale(0.90);
                background: var(--main-background-active-color);
                transition: 0.3s;
            }
            </style>
            <div class="WallpaperCycle_switch-container">
                <div>
                    <span class="set_text"><big>自动切换&nbsp;</big><br></span>
                    <span class="set_text" style="color: gray;"><small>开启后每隔一段时间自动切换下一张壁纸，不建议仅有单张图片的壁纸项开启此功能</small></span>
                </div>
                <div class="switch" id="toggleWallpaperCycle"></div>
            </div>
            <div class="WallpaperCycle_interval-container hide" id="WallpaperCycleIntervalContainer">
                <div class="WallpaperCycle_interval-label">
                    <span class="set_text"><big>切换间隔&nbsp;</big><br></span>
                    <span class="set_text" style="color: gray;"><small>设置切换间隔时间</small></span>
                </div>
                <div class="WallpaperCycle_interval-input-container">
                    <input type="number" class="WallpaperCycle_interval-input" id="WallpaperCycleInterval" min="5" max="1440" value="5">
                    <button class="WallpaperCycle_save-btn" id="WallpaperCycleSaveBtn">保存</button>
                </div>
            </div>
        `;
        mainConts.appendChild(settingDiv);
    }
}

// 初始化自动切换壁纸
function initWallpaperCycle() {
    const toggleSwitch = $('#toggleWallpaperCycle');
    const intervalContainer = $('#WallpaperCycleIntervalContainer');
    const intervalInput = $('#WallpaperCycleInterval');
    const savedState = localStorage.getItem('WallpaperCycleEnabled') || 'off';
    const savedInterval = getWallpaperCycleInterval();

    // 初始状态
    if (savedState === 'on') {
        toggleSwitch.addClass('on');
        intervalContainer.removeClass('hide');
        startWallpaperCycle();
    }

    // 间隔时间
    intervalInput.val(savedInterval / 60000);

    toggleSwitch.on('click', function () {
        const isOn = $(this).hasClass('on');
        if (isOn) {
            $(this).removeClass('on');
            localStorage.setItem('WallpaperCycleEnabled', 'off');
            intervalContainer.addClass('hide');
            stopWallpaperCycle();
        } else {
            $(this).addClass('on');
            localStorage.setItem('WallpaperCycleEnabled', 'on');
            intervalContainer.removeClass('hide');
            startWallpaperCycle();
        }
    });

    $('#WallpaperCycleSaveBtn').on('click', function () {
        const minutes = parseInt(intervalInput.val());

        if (minutes <= 4) {
            iziToast.show({
                message: '间隔必须大于或等于 5 分钟',
                timeout: 2000
            });
            return;
        }

        if (minutes > 4 && minutes <= 1440) {
            const intervalMs = minutes * 60000;
            localStorage.setItem('WallpaperCycleInterval', intervalMs.toString());

            // 如果已经开启，重新启动定时器
            if (isWallpaperCycleEnabled()) {
                stopWallpaperCycle();
                startWallpaperCycle();
            }

            iziToast.show({
                message: `设置成功`,
                timeout: 2000
            });
        } else {
            iziToast.show({
                message: '请输入有效的时间',
                timeout: 2000
            });
        }
    });
}

// 页面加载完成后初始化
$(function () {
    createWallpaperCycleSetting();
    initWallpaperCycle();

    window.addEventListener('load', function () {
        if (isWallpaperCycleEnabled()) {
            // 等待壁纸初始化完成后再启动自动切换
            setTimeout(() => {
                startWallpaperCycle();
            }, 2000);
        }
    });
});