// ==Npplication==
// @name    搜索建议-谷歌源
// @id    1754203071843_e1f70c36-10ee-441c-80e8-3eb0c3d918e3
// @version    1.0.7
// @description    用于展示搜索建议
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/keywordReminder.svg
// @setting    true
// @translates    [`https://nfdb.nitai.us.kg/keywordReminderGoogle-zh-CN.js`, `https://nfdb.nitai.us.kg/keywordReminderGoogle-zh-TW.js`, `https://nfdb.nitai.us.kg/keywordReminderGoogle-en-US.js`]
// ==/Npplication==

(function () {
    'use strict';

    // 接口
    const SUGGEST_URL = 'https://suggestqueries.google.com/complete/search?client=youtube&q=';
    const CALLBACK_PARAM = 'callback';
    const TRANSLATE_URL = 'https://translate.google.com/?sl=auto&tl=zh-CN&text=';

    // 截断
    const MAX_KEYWORD_LENGTH = 500;

    // 避免闪屏
    const INPUT_DEBOUNCE = 250;

    let jsonpSeq = 0;
    let debounceTimer = null;

    // 检查搜索建议是否启用
    function isKeywordReminderEnabled() {
        return localStorage.getItem('keywordReminder') !== 'off';
    }

    // 检查快捷翻译是否启用
    function isQuickTranslationEnabled() {
        return localStorage.getItem('quickTranslation') !== 'off' && isKeywordReminderEnabled();
    }

    // 数据结构：[关键词, [ [ 建议, ... ], ... ]]
    function extractSuggestions(data) {
        const list = Array.isArray(data) && Array.isArray(data[1]) ? data[1] : [];
        return list
            .map(function (item, index) {
                const text = Array.isArray(item) ? item[0] : item;
                return { id: String(index + 1), text: String(text == null ? '' : text) };
            })
            .filter(function (item) { return item.text; });
    }

    // 请求建议，用完回收
    function fetchSuggestions(keyword) {
        return new Promise(function (resolve, reject) {
            const callbackName = '__nppKeywordReminder_' + (++jsonpSeq) + '_' + Date.now();
            const script = document.createElement('script');
            let settled = false;

            function cleanup() {
                try { delete window[callbackName]; } catch (error) { window[callbackName] = undefined; }
                script.remove();
            }

            window[callbackName] = function (data) {
                settled = true;
                cleanup();
                resolve(data);
            };

            script.src = SUGGEST_URL + encodeURIComponent(keyword) +
                '&' + CALLBACK_PARAM + '=' + callbackName;
            script.onerror = function () {
                if (settled) return;
                cleanup();
                reject(new Error('搜索建议请求失败'));
            };

            document.head.appendChild(script);
        });
    }

    function getContainer() {
        return document.getElementById('keywords');
    }

    function hideContainer() {
        const container = getContainer();
        if (!container) return;
        container.innerHTML = '';
        container.style.display = 'none';
    }

    // 清空并显示容器，宽度对齐搜索框
    function showContainer() {
        const container = getContainer();
        if (!container) return null;

        const sou = document.querySelector('.sou');
        container.innerHTML = '';
        if (sou) container.style.width = sou.getBoundingClientRect().width + 'px';
        container.style.display = 'block';
        return container;
    }

    // 单条建议；文本用 createTextNode，不拼接 HTML
    function createKeywordItem(text, id, iconClass) {
        const item = document.createElement('div');
        item.className = 'keyword';
        item.dataset.id = id;
        item.dataset.value = text;
        item.innerHTML = '<i class="iconfont ' + iconClass + '"></i>';
        item.appendChild(document.createTextNode(text));
        return item;
    }

    function keywordReminder() {
        // 检查搜索建议是否启用
        if (!isKeywordReminderEnabled()) return;

        const input = document.querySelector('.wd');
        if (!input) return;

        const keyword = String(input.value || '').trim();
        if (!keyword || keyword.length > MAX_KEYWORD_LENGTH) {
            hideContainer();
            return;
        }

        if (!getContainer()) return;

        fetchSuggestions(keyword)
            .then(function (data) {
                const suggestions = extractSuggestions(data);
                const container = showContainer();
                if (!container) return;

                // 快捷翻译项
                if (isQuickTranslationEnabled()) {
                    container.appendChild(createKeywordItem(keyword, 'translate', 'icon-fanyi'));
                }

                suggestions.forEach(function (suggestion) {
                    container.appendChild(createKeywordItem(suggestion.text, suggestion.id, 'icon-sousuo'));
                });

                container.dataset.length = String(suggestions.length);
            })
            .catch(function () {
                hideContainer();
            });
    }

    // 点击建议：容器内容会重建，所以用事件委托绑在容器上
    function onContainerClick(event) {
        const item = event.target && event.target.closest ? event.target.closest('.keyword') : null;
        if (!item || !item.dataset) return;

        const input = document.querySelector('.wd');
        const currentValue = input ? input.value : '';

        if (item.dataset.id === 'translate') {
            window.open(TRANSLATE_URL + encodeURIComponent(currentValue), '_blank');
            return;
        }

        if (!input) return;
        input.value = item.dataset.value || item.textContent;

        const submit = document.getElementById('search-submit');
        if (submit) submit.click();
    }

    // 空输入收起
    function onInput() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = null;
        }

        const input = document.querySelector('.wd');
        const keyword = input ? String(input.value || '').trim() : '';
        if (!keyword) {
            hideContainer();
            return;
        }

        debounceTimer = setTimeout(function () {
            debounceTimer = null;
            keywordReminder();
        }, INPUT_DEBOUNCE);
    }

    // 设置
    function createKeywordReminderSetting() {
        const pluginId = '1754203071843_e1f70c36-10ee-441c-80e8-3eb0c3d918e3';
        const mainConts = document.querySelector(`.mainConts[data-value="${pluginId}"]`);
        if (!mainConts) return;

        const settingDiv = document.createElement('div');
        settingDiv.id = 'keywordReminder_setting';
        settingDiv.className = 'set_tip';
        settingDiv.innerHTML = `
                <style>
                .keywordReminder_switch-container {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                </style>
                <div class="keywordReminder_switch-container">
                    <div>
                        <span class="set_text"><big>@keywordReminderGoogle:suggest-switch</big><br></span>
                        <span class="set_text" style="color: gray;"><small>@keywordReminderGoogle:suggest-switch-desc</small></span>
                    </div>
                    <div class="switch" id="toggleKeywordReminder"></div>
                </div>
                <div class="keywordReminder_switch-container" style="margin-bottom: 0px;">
                    <div>
                        <span class="set_text"><big>@keywordReminderGoogle:translate-switch</big><br></span>
                        <span class="set_text" style="color: gray;"><small>@keywordReminderGoogle:translate-switch-desc</small></span>
                    </div>
                    <div class="switch" id="toggleQuickTranslation"></div>
                </div>
            `;
        mainConts.appendChild(settingDiv);

        // 初始化开关状态
        const toggleKeywordReminder = document.getElementById('toggleKeywordReminder');
        const toggleQuickTranslation = document.getElementById('toggleQuickTranslation');
        if (!toggleKeywordReminder || !toggleQuickTranslation) return;

        const keywordReminderState = localStorage.getItem('keywordReminder') || 'on';
        const quickTranslationState = localStorage.getItem('quickTranslation') || 'on';

        if (keywordReminderState === 'on') {
            toggleKeywordReminder.classList.add('on');
        }

        if (quickTranslationState === 'on' && keywordReminderState === 'on') {
            toggleQuickTranslation.classList.add('on');
        } else if (keywordReminderState === 'off') {
            // 搜索建议未开启时，快捷翻译自动关闭且不可用
            toggleQuickTranslation.classList.add('disabled');
        }

        // 搜索建议开关点击事件
        toggleKeywordReminder.addEventListener('click', function () {
            const isOn = toggleKeywordReminder.classList.contains('on');
            if (isOn) {
                toggleKeywordReminder.classList.remove('on');
                localStorage.setItem('keywordReminder', 'off');
                // 搜索建议关闭时，快捷翻译也自动关闭
                toggleQuickTranslation.classList.remove('on');
                toggleQuickTranslation.classList.add('disabled');
                localStorage.setItem('quickTranslation', 'off');
            } else {
                toggleKeywordReminder.classList.add('on');
                localStorage.setItem('keywordReminder', 'on');
                // 搜索建议开启时，快捷翻译恢复可用
                toggleQuickTranslation.classList.remove('disabled');
            }
        });

        // 快捷翻译开关点击事件
        toggleQuickTranslation.addEventListener('click', function () {
            // 检查是否被禁用
            if (toggleQuickTranslation.classList.contains('disabled')) return;

            const isOn = toggleQuickTranslation.classList.contains('on');
            if (isOn) {
                toggleQuickTranslation.classList.remove('on');
                localStorage.setItem('quickTranslation', 'off');
            } else {
                toggleQuickTranslation.classList.add('on');
                localStorage.setItem('quickTranslation', 'on');
            }
        });
    }

    document.addEventListener('pluginSettingsTemplateReady', function () {
        createKeywordReminderSetting();
    });

    function initKeywordReminder() {
        const input = document.querySelector('.wd');
        const sou = document.querySelector('.sou');
        if (!input || !sou || document.getElementById('keywords')) return;

        const style = document.createElement('style');
        style.textContent = [
            '#keywords {',
            '    position: absolute;',
            '    left: 0;',
            '    right: 0;',
            '    top: calc(100% + 8px);',
            '    font-size: small;',
            '    color: var(--main-text-color);',
            '    background-color: var(--main-background-color);',
            '    box-shadow: var(--main-search-shadow);',
            '    border-radius: 8px;',
            '    display: none;',
            '    z-index: 999;',
            '    -webkit-backdrop-filter: var(--main-box-gauss-plus);',
            '    backdrop-filter: var(--main-box-gauss-plus);',
            '}',
            '.keyword {',
            '    padding: 6px 12px;',
            '    border-radius: 8px;',
            '    transition: 0.3s;',
            '}',
            '.keyword i {',
            '    margin-right: 6px;',
            '    font-size: small;',
            '}',
            '.keyword:hover {',
            '    cursor: pointer;',
            '    transition: 0.3s;',
            '    text-indent: 10px;',
            '    background-color: var(--main-background-hover-color);',
            '}'
        ].join('\n');
        document.head.appendChild(style);

        // 容器挂在搜索框内，相对搜索框定位
        sou.style.position = 'relative';
        const container = document.createElement('div');
        container.id = 'keywords';
        container.addEventListener('click', onContainerClick);
        sou.appendChild(container);

        input.addEventListener('input', onInput);
    }

    // 等待搜索框渲染
    (function waitForSearchBar(attempts) {
        if (document.querySelector('.wd')) return initKeywordReminder();
        if (attempts <= 0) return;
        setTimeout(function () { waitForSearchBar(attempts - 1); }, 300);
    })(40);
})();
