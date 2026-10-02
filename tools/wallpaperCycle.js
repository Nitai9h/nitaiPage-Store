// ==Npplication==
// @name    壁纸切换器
// @id    1755684063321_c66b7dc7-375f-4ab0-a32d-d1eb9c406bdb
// @version    1.0.3
// @description    每隔一段时间自动切换下一张壁纸
// @author    Nitai
// @time   body
// @icon    https://nitai-images.pages.dev/nitaiPage/wallpaperCycle.svg
// @setting    true
// ==/Npplication==

(function () {
    'use strict';

    // 默认间隔时间
    const WALLPAPER_INTERVAL = 300000; // 5分钟

    // 定时器
    let wallpaperCycleTimer = null;

    // 检查是否启用
    function isWallpaperCycleEnabled() {
        return localStorage.getItem('WallpaperCycleEnabled') === 'on';
    }

    // 获取间隔时间
    function getWallpaperCycleInterval() {
        return parseInt(localStorage.getItem('WallpaperCycleInterval')) || WALLPAPER_INTERVAL;
    }

    function autoChangeWallpaper() {
        // 检查是否启用自动切换
        if (!isWallpaperCycleEnabled()) {
            return;
        }

        // 获取当前壁纸类型
        const bgImg = getBgImg();
        const currentType = parseInt(bgImg['type']) || 0;

        // 纯色背景，不自动切换
        if (currentType === 2) {
            return;
        }

        const bgElement = document.getElementById('bg');
        const videoElement = document.getElementById('bg-video');

        const bg = new BroadcastChannel('bgLoad');

        // 监听壁纸加载完成事件
        bg.onmessage = function (event) {
            if (event.data !== 'bgImgLoadinged') return;
            setTimeout(function () {
                const revealed = 'opacity:1;transform:scale(1.08);filter:var(--main-box-gauss-plus);transition:ease 0.7s;';
                if (bgElement) bgElement.style.cssText = revealed;
                if (videoElement) videoElement.style.cssText = revealed;
                bg.close();
            }, 200);
        };

        // 淡出效果
        const fading = 'opacity:0;transform:scale(1);filter:blur(var(--main-box-gauss));transition:ease 0.3s;';
        if (bgElement) bgElement.style.cssText = fading;
        if (videoElement) videoElement.style.cssText = fading;

        setTimeout(function () {
            if (bgElement) {
                // 移除 onerror 事件处理器
                bgElement.removeAttribute('onerror');
                bgElement.setAttribute('src', '');
                bgElement.classList.remove('error');
                bgElement.style.display = '';
            }

            // 重置视频
            if (videoElement) {
                try { videoElement.pause(); } catch (error) { /* 忽略 */ }
                videoElement.setAttribute('src', '');
                videoElement.style.display = 'none';
            }

            // 开始加载
            bg.postMessage('bgImgLoadingStart');

            // 初始化壁纸
            setBgImgInit();
        }, 300);
    }

    function startWallpaperCycle() {
        if (wallpaperCycleTimer) {
            clearInterval(wallpaperCycleTimer);
        }

        wallpaperCycleTimer = setInterval(autoChangeWallpaper, getWallpaperCycleInterval());
    }

    function stopWallpaperCycle() {
        if (!wallpaperCycleTimer) return;
        clearInterval(wallpaperCycleTimer);
        wallpaperCycleTimer = null;
    }

    // 设置
    function createWallpaperCycleSetting() {
        const pluginId = '1755684063321_c66b7dc7-375f-4ab0-a32d-d1eb9c406bdb';
        const mainConts = document.querySelector(`.mainConts[data-value="${pluginId}"]`);
        if (!mainConts) return;

        const settingDiv = document.createElement('div');
        settingDiv.className = 'set_tip';
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

    // 初始化
    function initWallpaperCycle() {
        const toggleSwitch = document.getElementById('toggleWallpaperCycle');
        const intervalContainer = document.getElementById('WallpaperCycleIntervalContainer');
        const intervalInput = document.getElementById('WallpaperCycleInterval');
        if (!toggleSwitch || !intervalContainer || !intervalInput) return;

        const savedState = localStorage.getItem('WallpaperCycleEnabled') || 'off';
        const savedInterval = getWallpaperCycleInterval();

        // 初始状态
        if (savedState === 'on') {
            toggleSwitch.classList.add('on');
            intervalContainer.classList.remove('hide');
            startWallpaperCycle();
        }

        // 间隔时间
        intervalInput.value = savedInterval / 60000;

        toggleSwitch.addEventListener('click', function () {
            const isOn = toggleSwitch.classList.contains('on');
            if (isOn) {
                toggleSwitch.classList.remove('on');
                localStorage.setItem('WallpaperCycleEnabled', 'off');
                intervalContainer.classList.add('hide');
                stopWallpaperCycle();
            } else {
                toggleSwitch.classList.add('on');
                localStorage.setItem('WallpaperCycleEnabled', 'on');
                intervalContainer.classList.remove('hide');
                startWallpaperCycle();
            }
        });

        const saveBtn = document.getElementById('WallpaperCycleSaveBtn');
        if (!saveBtn) return;

        saveBtn.addEventListener('click', function () {
            const minutes = parseInt(intervalInput.value);

            if (minutes <= 4) {
                iziToast.show({
                    message: '间隔必须大于或等于 5 分钟',
                    timeout: 2000
                });
                return;
            }

            if (minutes <= 1440) {
                const intervalMs = minutes * 60000;
                localStorage.setItem('WallpaperCycleInterval', intervalMs.toString());

                // 如果已经开启则重启定时器
                if (isWallpaperCycleEnabled()) {
                    stopWallpaperCycle();
                    startWallpaperCycle();
                }

                iziToast.show({
                    message: '设置成功',
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

    // 注册设置
    document.addEventListener('pluginSettingsTemplateReady', function () {
        createWallpaperCycleSetting();
        initWallpaperCycle();
    });

    window.addEventListener('load', function () {
        if (!isWallpaperCycleEnabled()) return;
        // 等待壁纸初始化完成
        setTimeout(startWallpaperCycle, 2000);
    });
})();
