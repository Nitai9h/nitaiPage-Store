// ==Npplication==
// @name    捷径坞
// @id    1791125977075_73ec46be-a4d0-4d6c-8f9f-d9d60443e8f8
// @version    1.0.0
// @description    提供完整的捷径体验
// @author    Nitai
// @time    body
// @icon    https://nitai-images.pages.dev/nitaiPage/shortcutDock.svg
// @setting    true
// @translates    [`https://nppdb.nitai.cc/shortcutDock-zh-CN.js`, `https://nppdb.nitai.cc/shortcutDock-zh-TW.js`, `https://nppdb.nitai.cc/shortcutDock-en-US.js`]
// ==/Npplication==

(function () {
    'use strict';

    if (window.__nppShortcutDockLoaded) return;
    window.__nppShortcutDockLoaded = true;

    const NID = '1791125977075_73ec46be-a4d0-4d6c-8f9f-d9d60443e8f8';
    const VERSION = '1.0.0';

    // 与起始页通信
    const SYNC_CHANNEL = 'nitaiPage/shortcutDock';
    // 起始页的捷径变更通道
    const PAGE_CHANNEL = 'nitaiPage/shortcut';

    const CONFIG_KEY = 'config';
    const ICON_INDEX_KEY = 'icons_index';
    const ICON_KEY_PREFIX = 'icons/';

    // 图标获取失败后的重试间隔
    const FAIL_TTL = 24 * 60 * 60 * 1000;
    // 图标获取并发上限
    const PROBE_LIMIT = 6;

    /* 存储 */
    const NPP_IDB = 'nppDB';
    const PAGE_IDB = 'nitaiPageDB';
    const PAGE_STORE = 'nitaiPage';
    const QUICK_LIST_KEY = 'quick_list';

    /* 工具 */

    function log() {
        console.log.apply(console, ['[shortcutDock]'].concat(Array.prototype.slice.call(arguments)));
    }

    function warn() {
        console.warn.apply(console, ['[shortcutDock]'].concat(Array.prototype.slice.call(arguments)));
    }

    function debounce(fn, wait) {
        let timer = null;
        return function () {
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () { fn.apply(null, args); }, wait);
        };
    }

    function seg(value) {
        return encodeURIComponent(String(value));
    }

    function originOf(url) {
        try {
            return new URL(url, location.href).origin;
        } catch (error) {
            return '';
        }
    }

    function firstChar(text) {
        const str = String(text || '').trim();
        if (!str) return '?';
        const chars = Array.from(str);
        return chars[0] || '?';
    }

    function iziApi() {
        return window.iziToast || (window.parent && window.parent.iziToast) || null;
    }

    function T(key) {
        try {
            const lib = window.i18n;
            if (lib && typeof lib.t === 'function' && (!lib.has || lib.has(key))) {
                const text = lib.t(key);
                if (text && text !== key) return text;
            }
        } catch (error) { /* 忽略 */ }
        return key;
    }

    function showToast(message, isError) {
        const lib = iziApi();
        if (!lib) { console.log('[shortcutDock]', message); return; }
        try {
            lib.show({
                message: String(message),
                timeout: 2200,
                position: 'topCenter',
                color: isError ? 'red' : '',
                transitionIn: 'fadeInUp',
                transitionOut: 'fadeOutDown'
            });
        } catch (error) {
            console.log('[shortcutDock]', message);
        }
    }

    // iziToast 二次确认
    function confirmToast(message, onOk) {
        const lib = iziApi();
        if (!lib || !lib.show) {
            if (window.confirm(message)) onOk();
            return;
        }
        lib.show({
            message: String(message),
            timeout: 9000,
            position: 'topCenter',
            buttons: [
                ['<button>' + T('@shortcutDock:dialog-ok') + '</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOutUp' }, toast, 'ok');
                    onOk();
                }, true],
                ['<button>' + T('@shortcutDock:dialog-cancel') + '</button>', function (instance, toast) {
                    instance.hide({ transitionOut: 'fadeOutUp' }, toast, 'cancel');
                }]
            ]
        });
    }

    /* 存储：IndexedDB / 自建 Server */

    function remoteContext() {
        let mode = '';
        let url = '';
        let token = '';
        try {
            mode = localStorage.getItem('dataSource') || '';
            url = localStorage.getItem('dataServerUrl') || '';
            token = localStorage.getItem('dataServerToken') || '';
        } catch (error) { /* 忽略 */ }

        if (mode !== 'server' || !url) return { active: false };
        let base = '';
        try {
            const parsed = new URL(url, location.href);
            let path = parsed.pathname.replace(/\/+$/, '');
            if (!/\/api$/.test(path)) path += '/api';
            base = parsed.origin + path;
        } catch (error) {
            return { active: false };
        }
        const crossOrigin = base.indexOf(location.origin) !== 0;
        return { active: true, base: base, token: token, crossOrigin: crossOrigin };
    }

    function isRemoteMode() {
        return remoteContext().active;
    }

    async function remoteRequest(path, options) {
        const ctx = remoteContext();
        if (!ctx.active) throw new Error('remote-disabled');
        const opts = options || {};
        const headers = Object.assign({}, opts.headers || {});
        if (opts.body !== undefined && opts.body !== null) headers['Content-Type'] = 'application/json';
        if (ctx.token) headers.Authorization = 'Bearer ' + ctx.token;

        const response = await fetch(ctx.base + path, Object.assign({}, opts, {
            headers: headers,
            credentials: ctx.crossOrigin ? 'omit' : 'include'
        }));
        const payload = await response.json().catch(function () { return null; });
        if (!response.ok) throw Object.assign(new Error((payload && payload.error) || ('HTTP ' + response.status)), { status: response.status });
        if (!payload || payload.ok !== true) throw new Error('not-nitai-page-api');
        return payload;
    }

    function idbOpen(name) {
        return new Promise(function (resolve, reject) {
            const request = indexedDB.open(name);
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { reject(request.error || new Error('idb open failed: ' + name)); };
        });
    }

    function idbGet(dbName, storeName, key) {
        return idbOpen(dbName).then(function (db) {
            if (!db.objectStoreNames.contains(storeName)) { db.close(); return undefined; }
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(storeName, 'readonly');
                const request = tx.objectStore(storeName).get(key);
                request.onsuccess = function () { resolve(request.result); };
                request.onerror = function () { reject(request.error || new Error('idb get failed')); };
                tx.oncomplete = function () { db.close(); };
                tx.onabort = function () { db.close(); };
            });
        });
    }

    function idbDelete(dbName, storeName, key) {
        return idbOpen(dbName).then(function (db) {
            if (!db.objectStoreNames.contains(storeName)) { db.close(); return; }
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(storeName, 'readwrite');
                const request = tx.objectStore(storeName).delete(key);
                request.onsuccess = function () { resolve(); };
                request.onerror = function () { reject(request.error || new Error('idb delete failed')); };
                tx.oncomplete = function () { db.close(); };
                tx.onabort = function () { db.close(); };
            });
        });
    }

    function idbPut(dbName, storeName, record) {
        return idbOpen(dbName).then(function (db) {
            return new Promise(function (resolve, reject) {
                const tx = db.transaction(storeName, 'readwrite');
                tx.objectStore(storeName).put(record);
                tx.oncomplete = function () { db.close(); resolve(); };
                tx.onerror = function () { db.close(); reject(tx.error || new Error('idb put failed')); };
                tx.onabort = function () { db.close(); reject(tx.error || new Error('idb put aborted')); };
            });
        });
    }

    async function ensureStore() {
        try {
            if (window.npp && typeof window.npp.init === 'function') await window.npp.init(NID);
        } catch (error) {
            warn('插件存储初始化失败（忽略）', error);
        }
    }

    async function storeDelete(key) {
        if (isRemoteMode()) {
            await remoteRequest('/db/' + seg(NPP_IDB) + '/' + seg(NID) + '/' + seg(key), { method: 'DELETE' });
            return;
        }
        await idbDelete(NPP_IDB, NID, key);
    }

    async function storeGet(key) {
        if (isRemoteMode()) {
            try {
                const payload = await remoteRequest('/db/' + seg(NPP_IDB) + '/' + seg(NID) + '/' + seg(key));
                return payload.value;
            } catch (error) {
                if (error.status === 404) return undefined;
                throw error;
            }
        }
        const record = await idbGet(NPP_IDB, NID, key);
        return record ? record.value : undefined;
    }

    async function storePut(key, value) {
        if (isRemoteMode()) {
            await remoteRequest('/db/' + seg(NPP_IDB) + '/' + seg(NID) + '/' + seg(key), {
                method: 'PUT',
                body: JSON.stringify(value)
            });
            return;
        }
        await idbPut(NPP_IDB, NID, { key: key, value: value });
    }

    async function readQuickList() {
        if (isRemoteMode()) {
            const payload = await remoteRequest('/db/' + seg(PAGE_IDB) + '/' + seg(PAGE_STORE) + '/' + seg(QUICK_LIST_KEY));
            let value = payload.value;
            if (value && typeof value === 'object' && value.value !== undefined) value = value.value;
            try { return JSON.parse(value || '{}'); } catch (error) { return {}; }
        }
        const record = await idbGet(PAGE_IDB, PAGE_STORE, QUICK_LIST_KEY);
        try { return JSON.parse((record && record.value) || '{}'); } catch (error) { return {}; }
    }

    function normalizeHotkey(raw, fallback) {
        if (!raw || typeof raw !== 'object' || typeof raw.code !== 'string') {
            return Object.assign({}, fallback);
        }
        return {
            ctrl: !!raw.ctrl,
            alt: !!raw.alt,
            shift: !!raw.shift,
            meta: !!raw.meta,
            code: raw.code
        };
    }



    /* 默认配置 */

    function defaultHotkeys() {
        return {
            open: { ctrl: false, alt: true, shift: true, meta: false, code: 'Digit4' },
            close: { ctrl: false, alt: true, shift: true, meta: false, code: 'Digit3' },
            settings: { ctrl: false, alt: true, shift: true, meta: false, code: 'Digit2' },
            up: { ctrl: false, alt: true, shift: true, meta: false, code: 'Digit1' }
        };
    }

    function defaultConfig() {
        return {
            barVisible: true,
            autoHide: false,
            autoHideInstant: false,
            takeover: true,
            appearance: { mode: 'label', iconSize: 24, height: 56, opacity: 1, hoverLabel: true },
            items: [],
            pins: [],
            barFolders: [],
            barOrder: [],
            pageFolders: [],
            pageOrder: [],
            hotkeys: defaultHotkeys()
        };
    }

    /*  items：扩展坞内的项（quick_list）
        pins：底栏上的项（引用 items，允许同一 item 多次 pin）
        barFolders/barOrder：栏内的文件夹与顺序（pinId / barFolderId）
        pageFolders/pageOrder：扩展坞的文件夹与顺序（itemId / pageFolderId） */

    function uid(prefix) {
        return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function newItemId() { return uid('i'); }
    function newPinId() { return uid('p'); }
    function newBarFolderId() { return uid('bf'); }
    function newPageFolderId() { return uid('pf'); }

    function itemById(id) {
        for (let i = 0; i < config.items.length; i++) {
            if (config.items[i] && config.items[i].id === id) return config.items[i];
        }
        return null;
    }

    function pinById(id) {
        for (let i = 0; i < config.pins.length; i++) {
            if (config.pins[i] && config.pins[i].id === id) return config.pins[i];
        }
        return null;
    }

    function barFolderById(id) {
        for (let i = 0; i < config.barFolders.length; i++) {
            if (config.barFolders[i] && config.barFolders[i].id === id) return config.barFolders[i];
        }
        return null;
    }

    function pageFolderById(id) {
        for (let i = 0; i < config.pageFolders.length; i++) {
            if (config.pageFolders[i] && config.pageFolders[i].id === id) return config.pageFolders[i];
        }
        return null;
    }

    function itemPageFolder(itemId) {
        for (let i = 0; i < config.pageFolders.length; i++) {
            const folder = config.pageFolders[i];
            if (folder && Array.isArray(folder.items) && folder.items.indexOf(itemId) >= 0) return folder;
        }
        return null;
    }

    function pinBarFolder(pinId) {
        for (let i = 0; i < config.barFolders.length; i++) {
            const folder = config.barFolders[i];
            if (folder && Array.isArray(folder.pins) && folder.pins.indexOf(pinId) >= 0) return folder;
        }
        return null;
    }

    function removePinFromBarFolders(pinId) {
        config.barFolders.forEach(function (folder) {
            if (!folder || !Array.isArray(folder.pins)) return;
            folder.pins = folder.pins.filter(function (id) { return id !== pinId; });
        });
    }

    function removeItemFromPageFolders(itemId) {
        config.pageFolders.forEach(function (folder) {
            if (!folder || !Array.isArray(folder.items)) return;
            folder.items = folder.items.filter(function (id) { return id !== itemId; });
        });
    }

    function normalizeConfig(raw) {
        const config = defaultConfig();
        if (!raw || typeof raw !== 'object') return config;

        config.barVisible = raw.barVisible !== false;
        config.autoHide = raw.autoHide === true;
        config.autoHideInstant = raw.autoHideInstant === true;
        config.takeover = raw.takeover !== false;
        const appearance = raw.appearance && typeof raw.appearance === 'object' ? raw.appearance : {};
        config.appearance = {
            mode: appearance.mode === 'icon' ? 'icon' : 'label',
            iconSize: [20, 24, 28, 32].indexOf(Number(appearance.iconSize)) >= 0 ? Number(appearance.iconSize) : 24,
            height: [48, 56, 64].indexOf(Number(appearance.height)) >= 0 ? Number(appearance.height) : 56,
            opacity: [0.7, 0.85, 1].indexOf(Number(appearance.opacity)) >= 0 ? Number(appearance.opacity) : 1,
            hoverLabel: appearance.hoverLabel !== false
        };

        if (raw.iconModes && typeof raw.iconModes === 'object') {
            config.iconModes = {};
            Object.keys(raw.iconModes).forEach(function (key) {
                const mode = raw.iconModes[key];
                if (mode === 'auto' || mode === 'custom' || mode === 'letter') config.iconModes[key] = mode;
            });
        }

        if (raw.iconOverrides && typeof raw.iconOverrides === 'object') {
            config.iconOverrides = {};
            Object.keys(raw.iconOverrides).forEach(function (key) {
                if (typeof raw.iconOverrides[key] === 'string' && raw.iconOverrides[key]) config.iconOverrides[key] = raw.iconOverrides[key];
            });
        }

        const hotkeys = raw.hotkeys && typeof raw.hotkeys === 'object' ? raw.hotkeys : {};
        const defaults = defaultHotkeys();
        config.hotkeys = {
            open: normalizeHotkey(hotkeys.open, defaults.open),
            close: normalizeHotkey(hotkeys.close, defaults.close),
            settings: normalizeHotkey(hotkeys.settings, defaults.settings),
            up: normalizeHotkey(hotkeys.up, defaults.up)
        };

        // migrateLegacy 读到 quick_list 后转换成新的配置结构
        if (Array.isArray(raw.items)) config.items = raw.items.filter(function (item) {
            return item && typeof item.id === 'string' && typeof item.url === 'string';
        });
        if (Array.isArray(raw.pins)) config.pins = raw.pins.filter(function (pin) {
            return pin && typeof pin.id === 'string' && typeof pin.itemId === 'string';
        });
        if (Array.isArray(raw.barFolders)) config.barFolders = raw.barFolders.filter(Boolean).map(function (folder) {
            return { id: String(folder.id), name: String(folder.name || '文件夹'), pins: Array.isArray(folder.pins) ? folder.pins.map(String) : [] };
        });
        if (Array.isArray(raw.barOrder)) config.barOrder = raw.barOrder.map(String);
        if (Array.isArray(raw.pageFolders)) config.pageFolders = raw.pageFolders.filter(Boolean).map(function (folder) {
            return {
                id: String(folder.id),
                name: String(folder.name || T('@shortcutDock:folder-default')),
                items: Array.isArray(folder.items) ? folder.items.map(String) : [],
                parentId: typeof folder.parentId === 'string' ? folder.parentId : 'root',
                pinned: folder.pinned === true
            };
        });
        if (Array.isArray(raw.pageOrder)) config.pageOrder = raw.pageOrder.map(String);

        return config;
    }

    let config = defaultConfig();

    async function loadConfig() {
        try {
            config = normalizeConfig(await storeGet(CONFIG_KEY));
        } catch (error) {
            warn('读取配置失败', error);
            config = defaultConfig();
        }
        return config;
    }

    let saveTimer = null;

    function saveConfig() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(function () {
            storePut(CONFIG_KEY, config).catch(function (error) {
                console.error('[shortcutDock] 配置保存失败:', error);
                showToast('@shortcutDock:save-failed');
            });
            broadcast({ type: 'config-changed' });
        }, 50);
    }

    /* 广播 */

    let channel = null;

    function getChannel() {
        if (!channel) {
            try {
                channel = new BroadcastChannel(SYNC_CHANNEL);
            } catch (error) {
                channel = null;
            }
        }
        return channel;
    }

    function broadcast(message) {
        const ch = getChannel();
        if (!ch) return;
        try {
            ch.postMessage(message);
        } catch (error) {
            /* 忽略 */
        }
    }

    /* 样式 */

    function injectStyle() {
        if (document.getElementById('nppShortcutDockStyle')) return;
        const style = document.createElement('style');
        style.id = 'nppShortcutDockStyle';
        style.textContent = `
:root {
    --npp-sd-height: 56px;
}

#nppShortcutDock {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1999;
    display: flex;
    align-items: center;
    justify-content: center;
    justify-content: safe center;
    gap: 6px;
    box-sizing: border-box;
    height: var(--npp-sd-height);
    padding: 0 14px;
    overflow-x: auto;
    transition: height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: hidden;
    background: color-mix(in srgb, var(--main-background-color) calc(var(--npp-sd-alpha, 1) * 100%), transparent);
    -webkit-backdrop-filter: var(--main-box-gauss-plus);
    backdrop-filter: var(--main-box-gauss-plus);
    border-radius: 10px 10px 0 0;
    transition: transform .32s cubic-bezier(.4, 0, .2, 1), opacity .32s cubic-bezier(.4, 0, .2, 1);
    scrollbar-width: none;
}

#nppShortcutDock::-webkit-scrollbar {
    display: none;
}

#nppShortcutDock.npp-sd-hidden {
    transform: translateY(100%);
    opacity: 0;
    pointer-events: none;
}

#nppShortcutDock .npp-sd-item {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: none;
    max-width: 176px;
    height: 40px;
    padding: 0 10px;
    border-radius: 8px;
    transition: 0.3s;
}

#nppShortcutDock .npp-sd-item:hover {
    background: var(--main-background-hover-color);
}

#nppShortcutDock .npp-sd-item:active {
    transform: scale(0.95);
    background: var(--main-background-active-color);
}

/* 文件夹 */
.npp-sd-folder {
    border: none;
    background: unset;
    appearance: none;
    -webkit-appearance: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    transition: background 0.25s ease;
}

.npp-sd-folder:hover {
    background: var(--main-background-hover-color);
}

.npp-sd-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    overflow: hidden;
    transition: 0.3s;
}

.npp-sd-icon img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.npp-sd-letter {
    font-size: 16px;
    font-weight: 600;
    line-height: 1;
    color: var(--main-text-color);
}

.npp-sd-label {
    margin-left: 8px;
    min-width: 0;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    transition: max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, margin 0.25s ease;
}

#section > .foot {
    transition: bottom .32s cubic-bezier(.4, 0, .2, 1);
}

#section.npp-sd-on > .foot {
    bottom: calc(10px + var(--npp-sd-height) + 4px);
}

#shortcutDock_setting {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
}

#shortcutDock_setting > .set_tip {
    animation: npp-sd-fade-in 0.18s ease;
}

.npp-sd-set-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.npp-sd-set-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.npp-sd-set-desc {
    font-size: 12px;
    line-height: 16px;
    opacity: 0.72;
    color: var(--main-text-color);
    white-space: normal;
    word-break: break-word;
}

.npp-sd-set-text {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.npp-sd-hotkey-btn {
    min-width: 158px;
    text-align: center;
}

/* 设置文字不换行 */
.npp-sd-set-row > .npp-sd-set-text .set_text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.npp-sd-hotkey-btn,
.npp-sd-set-row .panel_btn {
    flex: none;
    white-space: nowrap;
}

.npp-sd-hotkey-btn.recording {
    outline: 2px solid var(--main-text-color);
}

/* 文件夹内部 */
.npp-sd-collage {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 1px;
    padding: 1px;
    box-sizing: border-box;
    color: var(--main-background-color);
    background: var(--main-background-color);
    border: 1px solid var(--main-background-color);
}

.npp-sd-collage-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
}

.npp-sd-mini {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 5px;
    color: var(--main-background-color);
    font-size: 8px;
    font-weight: 600;
    color: var(--main-text-color);
    height: stretch;
}

.npp-sd-mini img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.npp-sd-mini-blank {
    background: transparent;
}

.npp-sd-foldericon {
    width: 14px;
    height: 14px;
    display: block;
    background-color: var(--main-text-color);
    -webkit-mask: url("data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzk0NDYxNzQ1OTUwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5NzUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTEyOCAzMjBBMTA2LjY2NjY2NyAxMDYuNjY2NjY3IDAgMCAxIDIzNC42NjY2NjcgMjEzLjMzMzMzM2g4NS4zMzMzMzNhMTA2LjY2NjY2NyAxMDYuNjY2NjY3IDAgMCAxIDEwNC41MzMzMzMgODUuMzMzMzM0SDgxMC42NjY2NjdhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMSA4NS4zMzMzMzMgODUuMzMzMzMzdjM0MS4zMzMzMzNhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMS04NS4zMzMzMzMgODUuMzMzMzM0SDIxMy4zMzMzMzNhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMS04NS4zMzMzMzMtODUuMzMzMzM0VjMyMHpNNDkwLjY2NjY2NyAyMTMuMzMzMzMzYTIxLjMzMzMzMyAyMS4zMzMzMzMgMCAxIDAgMCA0Mi42NjY2NjdoMjk4LjY2NjY2NmEyMS4zMzMzMzMgMjEuMzMzMzMzIDAgMSAwIDAtNDIuNjY2NjY3aC0yOTguNjY2NjY2eiIgZmlsbD0iIzJjMmMyYyIgcC1pZD0iMjk3NiI+PC9wYXRoPjwvc3ZnPg==") no-repeat center / contain;
    mask: url("data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzk0NDYxNzQ1OTUwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI5NzUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTEyOCAzMjBBMTA2LjY2NjY2NyAxMDYuNjY2NjY3IDAgMCAxIDIzNC42NjY2NjcgMjEzLjMzMzMzM2g4NS4zMzMzMzNhMTA2LjY2NjY2NyAxMDYuNjY2NjY3IDAgMCAxIDEwNC41MzMzMzMgODUuMzMzMzM0SDgxMC42NjY2NjdhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMSA4NS4zMzMzMzMgODUuMzMzMzMzdjM0MS4zMzMzMzNhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMS04NS4zMzMzMzMgODUuMzMzMzM0SDIxMy4zMzMzMzNhODUuMzMzMzMzIDg1LjMzMzMzMyAwIDAgMS04NS4zMzMzMzMtODUuMzMzMzM0VjMyMHpNNDkwLjY2NjY2NyAyMTMuMzMzMzMzYTIxLjMzMzMzMyAyMS4zMzMzMzMgMCAxIDAgMCA0Mi42NjY2NjdoMjk4LjY2NjY2NmEyMS4zMzMzMzMgMjEuMzMzMzMzIDAgMSAwIDAtNDIuNjY2NjY3aC0yOTguNjY2NjY2eiIgZmlsbD0iIzJjMmMyYyIgcC1pZD0iMjk3NiI+PC9wYXRoPjwvc3ZnPg==") no-repeat center / contain;
}

.npp-sd-collage-empty .npp-sd-foldericon {
    width: 20px;
    height: 20px;
}

/* 拖拽 */
#nppShortcutDock .npp-sd-item,
.npp-sd-overlay .npp-sd-item {
    touch-action: pan-x;
    user-select: none;
    -webkit-user-select: none;
}

.npp-sd-item img,
.npp-sd-ghost img {
    -webkit-user-drag: none;
    user-drag: none;
}

#nppShortcutDock.npp-sd-dragmode,
#nppShortcutDock.npp-sd-dragmode .npp-sd-item {
    touch-action: none;
}

.npp-sd-dragging {
    opacity: 0.4;
}

.npp-sd-ghost {
    animation: npp-sd-pop-in 0.14s ease;
    position: fixed;
    z-index: 2700;
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: 180px;
    padding: 4px 9px 4px 6px;
    border-radius: 9px;
    background: var(--main-background-color);
    box-shadow: 0 10px 28px #0006;
    pointer-events: none;
    transform: translate(-50%, -50%) scale(1.05);
    font-size: 12px;
}

.npp-sd-ghost .npp-sd-icon {
    width: 22px;
    height: 22px;
}

/* 去掉浏览器焦点圈 */
.npp-sd-folder:focus,
.npp-sd-folder:focus-visible,
.npp-sd-item:focus,
.npp-sd-item:focus-visible {
    outline: none;
}

.npp-sd-drop {
    background: var(--main-background-hover-color);
    box-shadow: inset 0 0 0 2px var(--main-text-color);
    border-radius: 10px;
    outline: none;
}

.npp-sd-folder-tile {
    cursor: pointer;
}

.npp-sd-icon.npp-sd-letterbg {
    background: var(--main-background-color);
}

/* 文件夹磁贴 */
.npp-sd-page-grid .npp-sd-folder-tile .npp-sd-icon {
    width: 40px;
    height: 40px;
    flex: none;
}

.npp-sd-folder-tile {
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
}

/* 图标加载 */
.npp-sd-icon img,
.npp-sd-mini img,
.npp-sd-ghost img,
.npp-sd-folder img {
    filter: blur(5px);
    transition: filter 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

.npp-sd-icon img.npp-sd-sharp,
.npp-sd-mini img.npp-sd-sharp,
.npp-sd-ghost img.npp-sd-sharp,
.npp-sd-folder img.npp-sd-sharp {
    filter: blur(0);
}

/* 设置按钮 */
.npp-sd-action-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
}

.npp-sd-action-row .panel_btn {
    flex: 1 1 140px;
    min-width: 0;
    width: auto;
    margin: 0 !important;
    height: 36px;
    color: var(--main-text-color);
}

@media (max-width: 720px) {
    .npp-sd-action-row {
        flex-direction: column;
        align-items: stretch;
    }

    .npp-sd-action-row .panel_btn {
        width: 100%;
    }
}

/* 平滑展开/收起 */
.npp-sd-subrow {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    margin-bottom: -8px;
    transition:
        max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1),
        margin-top 0.28s cubic-bezier(0.4, 0, 0.2, 1),
        margin-bottom 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.npp-sd-subrow.open {
    max-height: 64px;
    opacity: 1;
    margin-bottom: 0;
}

/* 外观切换过渡 */
.npp-sd-choices .panel_btn {
    transition:
        background 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 图标源 */
.npp-sd-icon-picks {
    display: flex;
    gap: 8px;
    padding: 6px 2px;
}

.npp-sd-icon-pick {
    position: relative;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: var(--main-background-color);
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
}

.npp-sd-icon-pick.selected {
    border-color: var(--main-text-color);
    box-shadow: inset 0 0 0 1px var(--main-text-color);
}

.npp-sd-icon-pick:hover {
    background: var(--main-background-hover-color);
}

.npp-sd-icon-pick:active {
    background: var(--main-background-active-color);
    transform: scale(0.94);
}

.npp-sd-icon-pick.selected:hover {
    background: var(--main-background-hover-color);
}

.npp-sd-icon-pick img {
    width: 28px;
    height: 28px;
    object-fit: contain;
    border-radius: 6px;
}

.npp-sd-icon-plus {
    font-size: 20px;
    opacity: 0.7;
    line-height: 1;
}

.npp-sd-icon-letter {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: var(--main-text-color);
}

.npp-sd-icon-clear {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--main-background-active-color);
    color: var(--main-text-color);
    font-size: 12px;
    line-height: 1;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    transition: background 0.2s ease, transform 0.15s ease;
}

.npp-sd-icon-clear:hover {
    background: var(--main-background-hover-color);
    transform: scale(1.12);
}

.npp-sd-icon-clear:active {
    background: var(--main-background-active-color);
    transform: scale(0.9);
}

/* 文件夹右键菜单 */
.npp-sd-menu {
    position: fixed;
    z-index: 2600;
    min-width: 148px;
    padding: 5px;
    border-radius: 10px;
    background: var(--main-background-color);
    box-shadow: var(--main-text-shadow);
    -webkit-backdrop-filter: var(--main-box-gauss-plus);
    backdrop-filter: var(--main-box-gauss-plus);
    animation: npp-sd-pop-in 0.16s cubic-bezier(0.4, 0, 0.2, 1);
}

.npp-sd-menu.npp-sd-closing {
    animation: npp-sd-pop-out 0.14s ease forwards;
}

.npp-sd-menu-item {
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
}

.npp-sd-menu-item:hover {
    background: var(--main-background-hover-color);
}

.npp-sd-menu-danger {
    color: var(--main-text-color);
}

.npp-sd-menu-primary {
    color: var(--main-text-color);
}

.npp-sd-menu-input {
    width: 100%;
    height: 32px;
    margin-bottom: 6px;
    box-sizing: border-box;
    font: inherit;
    font-size: 13px;
}

.npp-sd-menu-actions {
    display: flex;
    gap: 6px;
}

.npp-sd-menu-actions .npp-sd-menu-item {
    flex: 1;
    text-align: center;
}

/* 文件夹层 */
.npp-sd-overlay {
    animation: npp-sd-pop-in 0.18s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: bottom center;
    position: fixed;
    z-index: 2500;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 160px;
    max-width: min(72vw, 420px);
    padding: 10px 12px 12px;
    border-radius: 12px;
    background: var(--main-background-color);
    box-shadow: var(--main-text-shadow);
    -webkit-backdrop-filter: var(--main-box-gauss-plus);
    backdrop-filter: var(--main-box-gauss-plus);
}

.npp-sd-overlay.npp-sd-closing {
    animation: npp-sd-pop-out 0.16s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.npp-sd-overlay-name {
    font-size: 12px;
    opacity: 0.65;
}

.npp-sd-overlay-items {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.npp-sd-overlay-item {
    height: 36px;
}

.npp-sd-overlay-empty {
    font-size: 12px;
    opacity: 0.5;
}

/* 设置页 */
#shortcutDock_setting .npp-sd-set-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

#shortcutDock_setting .npp-sd-set-text .set_text,
#shortcutDock_setting .npp-sd-set-text .set_text_desc {
    position: static;
    left: auto;
    right: auto;
    top: auto;
    bottom: auto;
    margin: 0;
    max-width: none;
}

#shortcutDock_setting .npp-sd-set-text .set_text_desc {
    opacity: 0.6;
    font-size: 12px;
    line-height: 1.5;
}

#shortcutDock_setting .npp-sd-set-row {
    min-height: 34px;
    align-items: center;
    padding: 3px 0;
}

#shortcutDock_setting .npp-sd-set-group > .set_text {
    position: static;
    left: auto;
}

#shortcutDock_setting .panel_row_btn.danger span {
    color: var(--main-text-color);
}

#shortcutDock_setting .from_items.button {
    margin-top: 16px;
}

/* 图标尺寸 / 文件夹 */
#shortcutDock_setting .npp-sd-choices {
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
    justify-content: flex-start;
}

#shortcutDock_setting .npp-sd-choices .panel_btn {
    width: auto;
    min-width: 64px;
    height: 34px;
    margin: 0;
    padding: 0 16px;
}

#shortcutDock_setting .npp-sd-choice-on {
    background: var(--main-background-active-color);
    box-shadow: inset 0 0 0 2px var(--border-bottom-color-hover);
}

#shortcutDock_setting .npp-sd-wrap {
    flex-wrap: wrap;
}

/* 仅图标 / 图标尺寸 */
.npp-sd-iconmode .npp-sd-label {
    max-width: 0;
    margin: 0;
    opacity: 0;
    margin-left: -8px;
    transition:
        max-width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
        margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* hover 展开 */
#nppShortcutDock.npp-sd-hoverlabel .npp-sd-item:hover .npp-sd-label {
    max-width: 180px;
    opacity: 1;
    margin-left: 0;
}

#nppShortcutDock {
    --npp-sd-icon: 24px;
}

#nppShortcutDock .npp-sd-icon {
    width: var(--npp-sd-icon);
    height: var(--npp-sd-icon);
}

/* 动效 */
@keyframes npp-sd-pop-in {
    from { opacity: 0; transform: translateY(8px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes npp-sd-pop-out {
    to { opacity: 0; transform: translateY(6px) scale(0.97); }
}

@keyframes npp-sd-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* 捷径坞页面 */
@media (min-width: 721px) {
    .npp-sd-page.npp-sd-folded {
        margin-top: 0 !important;
        height: 480px !important;
        max-height: 480px !important;
    }
}

body.npp-sd-folded .tool-all {
    opacity: 0 !important;
    pointer-events: none !important;
}

.npp-sd-page .panel-header {
    flex: none;
}

.npp-sd-page .panel-body {
    min-height: 0;
}

.npp-sd-page .contents.productss {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
}

.npp-sd-page .mainConts.selected {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

/* 右侧内容 */
.npp-sd-page .contents.productss {
    padding-left: 10px;
    padding-right: 10px;
    margin-right: 10px;
    box-sizing: border-box;
    overflow: hidden;
}

.npp-sd-page .mainConts.set_blocks {
    flex: 1;
    min-height: 0;
    height: 100%;
    justify-content: flex-start;
}

.npp-sd-page .panelContent.npp-sd-page-content {
    flex: 1;
    min-height: 0;
    height: 100%;
    margin: 0 5px 0 10px;
    overflow-y: auto;
    overflow-x: hidden;}
    scrollbar-gutter: stable;
}

.npp-sd-page .npp-sd-page-grid {
    justify-content: flex-start;
    align-content: flex-start;
    height: auto;
    margin: 0;
    padding: 12px 10px 16px;
    overflow: visible;
}

/* 底栏左右指示器 */
.npp-sd-dock-arrows {
    position: fixed;
    z-index: 2550;
    pointer-events: none;
    display: none;
}

.npp-sd-dock-arrows .scroll-arrow-left,
.npp-sd-dock-arrows .scroll-arrow-right {
    position: absolute;
    top: 0;
    height: 100%;
    pointer-events: auto;
}

/* 小屏/触摸 */
#nppShortcutDock .npp-sd-item,
#nppShortcutDockPage .npp-sd-item,
#nppSdRail .npp-sd-rail-folder,
.npp-sd-overlay .npp-sd-item {
    touch-action: none;
}

.foot {
    z-index: 1998 !important;
}

#section > .foot {
    transition: bottom 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

html.npp-sd-foot-raised .foot {
    position: fixed !important;
    left: 0;
    right: 0;
    bottom: var(--npp-sd-height, 56px) !important;
}

.npp-sd-page .tabs {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.npp-sd-page .tabs::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
}

/* 小屏 tabs */
@media (max-width: 720px) {
    .npp-sd-page .panel-body {
        flex-direction: column;
    }

    .npp-sd-page .tabs-container {
        width: 100% !important;
        height: 40px;
        flex: none;
        overflow: hidden;
    }

    .npp-sd-page .tabs .tab-items,
    .npp-sd-page .tabs .tab-items.actives,
    .npp-sd-page .tabs .tab-items:hover {
        background: transparent !important;
    }

    .npp-sd-page .tabs .tab-items::after {
        display: block !important;
        border-radius: 4px !important;
    }

    .npp-sd-page .tabs .tab-items.actives::after {
        height: 2px !important;
        background-color: var(--main-text-color) !important;
    }

    .npp-sd-page .tabs {
        flex-direction: row !important;
        align-items: center;
        height: 40px;
        width: 100%;
        justify-content: flex-start !important;
        padding: 4px 0 0;
        transform: rotateX(180deg);
    }

    .npp-sd-page .tabs .tab-items {
        flex: 1 0 auto !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        box-sizing: border-box;
        height: 40px;
        justify-content: center;
        padding: 0 20px;
        background: transparent;
        transform: rotateX(180deg);
        border-radius: 0;
    }

    .npp-sd-page .tabs .tab-items .tab_text {
        min-width: 0 !important;
        max-width: none !important;
        padding: 0 !important;
        white-space: nowrap;
    }

    .npp-sd-page .contents.productss {
        height: calc(100% - 40px);
    }

    /* 小屏折叠按钮不可用 */
    .npp-sd-page .panel-header {
        display: none !important;
    }

    .npp-sd-page .panel-body.menu-collapsed .tabs-container {
        width: 100%;
        opacity: 1;
    }

}

/* 捷径坞布局 */
.npp-sd-page {
    width: 80%;
    max-width: 900px;
    height: 400px;
    max-height: 400px;
    margin-top: 180px;
    padding: 0;
    box-sizing: border-box;
}

.npp-sd-page .tab {
    position: relative;
    flex: none;
    margin-bottom: 8px;
    padding: 0 16px;
    box-sizing: border-box;
}

.npp-sd-page-grid {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 8px;
    height: 100%;
    padding: 4px 4px 16px;
    margin: 0px;
    box-sizing: border-box;
    overflow-y: auto;
}

.npp-sd-page-item {
    transition: background 0.25s ease, transform 0.2s ease;
    position: relative;
    flex: 0 0 var(--npp-sd-cell, 72px);
    width: var(--npp-sd-cell, 72px);
    min-width: 0;
    max-width: none;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    height: auto;
    padding: 10px 6px;
    border-radius: 8px;
    display: flex;
    align-items: center;
}

.npp-sd-page-item .npp-sd-icon {
    width: 40px;
    height: 40px;
}

.npp-sd-page-item .npp-sd-label {
    max-width: 80px;
    text-align: center;
    font-size: 12px;
}

.npp-sd-page-item:hover {
    background: var(--main-background-hover-color);
    transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
    #nppShortcutDock, #section > .foot, .npp-sd-icon, .npp-sd-label,
    .npp-sd-page-item, .npp-sd-star, .npp-sd-overlay, .npp-sd-page {
        transition: none;
        animation: none !important;
    }
}
`;
        document.head.appendChild(style);
    }

    /* 图标 */

    let iconCache = {};
    let faviconRequested = false;

    function iconCacheGet(origin) {
        const entry = origin ? iconCache[origin] : null;
        if (entry && entry.status === 'ok' && entry.icon) return entry.icon;
        return null;
    }

    function iconCacheIsLetter(origin) {
        const entry = origin ? iconCache[origin] : null;
        return !!(entry && entry.status === 'letter');
    }

    function setLetterOnly(origin) {
        if (!origin) return;
        iconCache[origin] = { status: 'letter', source: 'letter', ts: Date.now() };
        const originEnc = iconEnc(origin);
        iconIndexAdd(originEnc);
        iconRecordWrite(originEnc, iconCache[origin]);
    }

    function iconProbeAllowed(origin) {
        const entry = origin ? iconCache[origin] : null;
        if (!entry) return true;
        return Date.now() - (entry.ts || 0) > FAIL_TTL;
    }

    let iconIndexList = [];

    function iconEnc(origin) {
        return encodeURIComponent(origin);
    }

    function iconRecordKey(originEnc) {
        return ICON_KEY_PREFIX + originEnc;
    }

    function iconIndexSave() {
        storePut(ICON_INDEX_KEY, iconIndexList).catch(function (error) { warn('图标索引保存失败', error); });
    }

    function iconIndexAdd(originEnc) {
        if (iconIndexList.indexOf(originEnc) >= 0) return;
        iconIndexList.push(originEnc);
        iconIndexSave();
    }

    function iconRecordWrite(originEnc, record) {
        storePut(iconRecordKey(originEnc), record).catch(function (error) { warn('图标记录写入失败', error); });
    }

    function iconCachePut(origin, patch) {
        if (!origin) return;
        iconCache[origin] = Object.assign({}, iconCache[origin] || {}, patch, { ts: Date.now() });
        const originEnc = iconEnc(origin);
        iconIndexAdd(originEnc);
        iconRecordWrite(originEnc, iconCache[origin]);
    }

    function probeImage(src) {
        return new Promise(function (resolve) {
            const img = new Image();
            let settled = false;
            const finish = function (ok) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                resolve(ok);
            };
            const timer = setTimeout(function () { finish(false); }, 6000);
            img.onload = function () { finish(img.naturalWidth > 0); };
            img.onerror = function () { finish(false); };
            img.src = src;
        });
    }

    // 探测并发限制
    const probeQueue = [];
    let probeActive = 0;

    function runLimited(task) {
        return new Promise(function (resolve) {
            probeQueue.push({ task: task, resolve: resolve });
            pumpProbeQueue();
        });
    }

    function pumpProbeQueue() {
        while (probeActive < PROBE_LIMIT && probeQueue.length) {
            const job = probeQueue.shift();
            probeActive += 1;
            Promise.resolve()
                .then(job.task)
                .then(function (value) {
                    probeActive -= 1;
                    job.resolve(value);
                    pumpProbeQueue();
                }, function () {
                    probeActive -= 1;
                    job.resolve(null);
                    pumpProbeQueue();
                });
        }
    }

    // 从扩展取图标
    async function extensionIcon(url) {
        const ext = window.nppExt;
        if (!ext || !ext.isExtension || typeof ext.getFavicon !== 'function') return null;
        if (!Array.isArray(ext.capabilities) || ext.capabilities.indexOf('favicon') === -1) return null;

        try {
            let icon = await ext.getFavicon(url, 64);
            if (!icon && !faviconRequested) {
                faviconRequested = true;
                const result = await ext.requestPermission('favicon');
                if (result && result.granted) icon = await ext.getFavicon(url, 64);
            }
            return typeof icon === 'string' && icon ? icon : null;
        } catch (error) {
            return null;
        }
    }

    /* 底栏 */

    let dockEl = null;
    let items = [];

    function ensureDock() {
        const section = document.getElementById('section');
        if (!section) return false;
        if (dockEl && dockEl.isConnected) return true;

        dockEl = document.createElement('div');
        dockEl.id = 'nppShortcutDock';
        dockEl.className = 'npp-sd-hidden';
        dockEl.addEventListener('dragstart', function (event) { event.preventDefault(); });
        section.appendChild(dockEl);
        return true;
    }

    function paintLetter(box, item) {
        const span = document.createElement('span');
        span.className = 'npp-sd-letter';
        span.textContent = firstChar(item.title || item.url);
        box.replaceChildren(span);
        box.classList.add('npp-sd-letterbg');
    }

    function setImg(box, src, item) {
        const img = document.createElement('img');
        img.alt = '';
        img.decoding = 'async';
        img.draggable = false;
        img.referrerPolicy = 'no-referrer';
        img.onerror = function () {
            img.remove();
            paintLetter(box, item);
        };
        img.addEventListener('load', function () { img.classList.add('npp-sd-sharp'); });
        img.addEventListener('error', function () { img.classList.remove('npp-sd-sharp'); });
        img.src = src;
        box.replaceChildren(img);
        box.style.background = 'transparent';
    }

    // 手动设置的 Icon > 缓存 > 扩展 > favicon.ico > 文字
    async function applyIcon(item, box) {
        const mode = (config.iconModes && item.id && config.iconModes[item.id]) || 'auto';
        if (mode === 'letter') {
            paintLetter(box, item);
            return;
        }
        const override = config.iconOverrides && item.id ? config.iconOverrides[item.id] : '';
        if (mode === 'custom' && override) {
            setImg(box, override, item);
            return;
        }
        const origin = originOf(item.url);

        // 缓存
        const cached = iconCacheGet(origin);
        if (cached) {
            setImg(box, cached, item);
            return;
        }

        if (item.icon) {
            setImg(box, item.icon, item);
            // 存入缓存
            iconCachePut(origin, { icon: item.icon, source: 'record', status: 'ok' });
            return;
        }

        if (iconCacheIsLetter(origin)) {
            paintLetter(box, item);
            return;
        }

        if (!iconProbeAllowed(origin)) return;

        const icon = await ensureIconCached(origin, item.url);
        if (icon) setImg(box, icon, item);
    }

    // 单 origin 的图标解析（含写入缓存）
    // 并发调用共享一个 in-flight Promise，避免重复抓取
    const iconInflight = {};
    function ensureIconCached(origin, url) {
        if (iconInflight[origin]) return iconInflight[origin];
        iconInflight[origin] = (async function () {
            if (!iconProbeAllowed(origin)) return null;
            const fromExt = await runLimited(function () { return extensionIcon(url); });
            if (fromExt) {
                iconCachePut(origin, { icon: fromExt, source: 'extension', status: 'ok' });
                return fromExt;
            }
            const probe = origin + '/favicon.ico';
            const ok = await runLimited(function () { return probeImage(probe); });
            if (ok) {
                iconCachePut(origin, { icon: probe, source: 'favicon', status: 'ok' });
                return probe;
            }
            iconCachePut(origin, { source: 'favicon', status: 'fail' });
            return null;
        })().catch(function () { return null; });
        iconInflight[origin].finally(function () { delete iconInflight[origin]; });
        return iconInflight[origin];
    }

    // 预热所有图标到缓存
    function warmIconCache() {
        const seen = {};
        config.items.forEach(function (item) {
            const origin = originOf(item.url);
            if (!origin || seen[origin]) return;
            seen[origin] = true;
            if (iconCacheGet(origin) || iconCacheIsLetter(origin)) return;
            ensureIconCached(origin, item.url).catch(function () { /* 忽略 */ });
        });
    }

    /* 栏 / 扩展坞 */

    const DRAG_THRESHOLD = 5;
    const TOUCH_LONGPRESS = 350;
    const TOUCH_CANCEL_MOVE = 12;
    const EDGE_SCROLL = 40;

    let folderOverlay = null;
    let dockMenu = null;
    let drag = null;
    let gapEl = null;

    /* 栏列表 */

    function barList() {
        const list = [];
        const usedPins = {};
        const usedFolders = {};

        config.barOrder.forEach(function (entry) {
            if (pinById(entry) && !usedPins[entry] && !pinBarFolder(entry)) {
                usedPins[entry] = true;
                list.push({ type: 'pin', id: entry });
            } else if (barFolderById(entry) && !usedFolders[entry]) {
                usedFolders[entry] = true;
                list.push({ type: 'barFolder', id: entry });
            }
        });

        config.pins.forEach(function (pin) {
            if (usedPins[pin.id] || pinBarFolder(pin.id)) return;
            usedPins[pin.id] = true;
            list.push({ type: 'pin', id: pin.id });
        });

        config.barFolders.forEach(function (folder) {
            if (usedFolders[folder.id]) return;
            usedFolders[folder.id] = true;
            list.push({ type: 'barFolder', id: folder.id });
        });

        config.barOrder = list.map(function (entry) { return entry.id; });
        return list;
    }

    function pageList() {
        const list = [];
        const usedItems = {};
        const usedFolders = {};

        config.pageOrder.forEach(function (entry) {
            if (itemById(entry) && !usedItems[entry] && !itemPageFolder(entry)) {
                usedItems[entry] = true;
                list.push({ type: 'item', id: entry });
            } else if (pageFolderById(entry) && !usedFolders[entry]) {
                usedFolders[entry] = true;
                list.push({ type: 'pageFolder', id: entry });
            }
        });

        config.items.forEach(function (item) {
            if (usedItems[item.id] || itemPageFolder(item.id)) return;
            usedItems[item.id] = true;
            list.push({ type: 'item', id: item.id });
        });

        config.pageFolders.forEach(function (folder) {
            if (usedFolders[folder.id]) return;
            usedFolders[folder.id] = true;
            list.push({ type: 'pageFolder', id: folder.id });
        });

        config.pageOrder = list.map(function (entry) { return entry.id; });
        return list;
    }

    /* 节点 */

    function childPageFolders(parentId) {
        return config.pageFolders.filter(function (folder) { return (folder.parentId || 'root') === parentId; });
    }

    function createFolderTile(folder) {
        const node = document.createElement('div');
        node.className = 'npp-sd-page-item npp-sd-folder-tile';
        node.dataset.pageFolderId = folder.id;
        node.dataset.pageFolder = 'folder';

        const members = childPageFolders(folder.id)
            .map(function (child) { return { __isFolder: true, title: child.name || T('@shortcutDock:folder-default') }; })
            .concat(folder.items.map(itemById).filter(Boolean));
        const box = collageBox(members);
        const label = document.createElement('span');
        label.className = 'npp-sd-label';
        label.setAttribute('translate', 'none');
        label.textContent = folder.name || T('@shortcutDock:folder-default');
        node.append(box, label);

        node.addEventListener('click', function () { selectPageFolder(folder.id); });
        node.addEventListener('pointerdown', onDragStart);
        node.draggable = false;
        return node;
    }

    function createItemNode(item, options) {
        const opts = options || {};
        const link = document.createElement('a');
        link.className = 'npp-sd-item';
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.draggable = false;
        link.dataset.itemId = item.id;
        if (opts.pinId) link.dataset.pinId = opts.pinId;
        if (opts.pageItem) link.classList.add('npp-sd-page-item');
        if (opts.fromFolder) link.dataset.fromFolder = opts.fromFolder;
        link.addEventListener('pointerdown', onDragStart);

        const box = document.createElement('span');
        box.className = 'npp-sd-icon';

        const label = document.createElement('span');
        label.className = 'npp-sd-label';
        label.setAttribute('translate', 'none');
        label.textContent = item.title;

        const cachedFirst = iconCacheGet(originOf(item.url));
        if (cachedFirst) {
            setImg(box, cachedFirst, item);
        } else if (item.icon) {
            setImg(box, item.icon, item);
        } else {
            paintLetter(box, item);
        }

        link.append(box, label);
        if (!opts.pageItem) {
            // hover 展开过渡结束后重新判断底栏是否可以滚动
            link.addEventListener('mouseenter', function () { refreshDockScrollState(280); });
            link.addEventListener('mouseleave', function () { refreshDockScrollState(280); });
        }
        applyIcon(item, box).catch(function (error) { warn('图标解析失败', error); });
        return link;
    }

    function collageBox(items) {
        const box = document.createElement('span');
        box.className = 'npp-sd-icon npp-sd-collage';
        const members = items.slice(0, 4);
        if (!members.length) {
            box.classList.add('npp-sd-collage-empty');
            box.appendChild(makeFolderIcon());
            return box;
        }
        for (let i = 0; i < 4; i++) {
            const mini = document.createElement('span');
            mini.className = 'npp-sd-mini';
            if (members[i]) paintMini(mini, members[i]);
            else mini.classList.add('npp-sd-mini-blank');
            box.appendChild(mini);
        }
        return box;
    }

    function makeFolderIcon() {
        const span = document.createElement('span');
        span.className = 'npp-sd-foldericon';
        return span;
    }

    function paintMini(mini, entry) {
        if (entry && entry.__isFolder) {
            mini.appendChild(makeFolderIcon());
            return;
        }
        const item = entry;
        const src = iconCacheGet(originOf(item.url)) || item.icon;
        if (src) {
            const img = document.createElement('img');
            img.alt = '';
            img.decoding = 'async';
            img.draggable = false;
            img.referrerPolicy = 'no-referrer';
            img.addEventListener('load', function () { img.classList.add('npp-sd-sharp'); });
            img.src = src;
            mini.appendChild(img);
            return;
        }
        mini.textContent = firstChar(item.title || item.url);
    }

    function createBarFolderNode(folder) {
        const node = document.createElement('button');
        node.type = 'button';
        node.className = 'npp-sd-item npp-sd-folder';
        node.dataset.barFolderId = folder.id;
        node.draggable = false;

        const items = (folder.pins || []).map(function (pinId) {
            const pin = pinById(pinId);
            return pin ? itemById(pin.itemId) : null;
        }).filter(Boolean);

        const label = document.createElement('span');
        label.className = 'npp-sd-label';
        label.setAttribute('translate', 'none');
        label.textContent = folder.name || T('@shortcutDock:folder-default');

        node.append(collageBox(items), label);
        node.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (folderOverlay && folderOverlay.dataset.folder === folder.id) closeFolderOverlay();
            else openFolderOverlay(folder.id, node, 'bar');
        });
        node.addEventListener('pointerdown', onDragStart);
        return node;
    }

    /* 浮层 */

    function closeFolderOverlay() {
        if (!folderOverlay) return;
        const overlay = folderOverlay;
        folderOverlay = null;
        overlay.classList.add('npp-sd-closing');
        setTimeout(function () {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 160);
    }

    function openFolderOverlay(folderId, anchorEl, scope) {
        closeFolderOverlay();
        const isBar = scope !== 'page';
        const folder = isBar ? barFolderById(folderId) : pageFolderById(folderId);
        if (!folder) return;
        const section = document.getElementById('section');
        if (!section) return;

        const overlay = document.createElement('div');
        overlay.className = 'npp-sd-overlay';
        overlay.dataset.folder = folder.id;
        overlay.dataset.scope = scope || 'bar';
        overlay.addEventListener('dragstart', function (event) { event.preventDefault(); });

        const name = document.createElement('div');
        name.className = 'npp-sd-overlay-name';
        name.setAttribute('translate', 'none');
        name.textContent = folder.name || '';
        overlay.appendChild(name);

        const row = document.createElement('div');
        row.className = 'npp-sd-overlay-items';

        const nodes = [];
        if (isBar) {
            (folder.pins || []).forEach(function (pinId) {
                const pin = pinById(pinId);
                const item = pin ? itemById(pin.itemId) : null;
                if (!item) return;
                nodes.push(createItemNode(item, { pinId: pinId, fromFolder: folder.id }));
            });
        } else {
            (folder.items || []).forEach(function (itemId) {
                const item = itemById(itemId);
                if (!item) return;
                nodes.push(createItemNode(item, { pageItem: true, fromFolder: folder.id }));
            });
        }

        if (!nodes.length) {
            const empty = document.createElement('div');
            empty.className = 'npp-sd-overlay-empty';
            empty.textContent = T('@shortcutDock:empty-tile');
            row.appendChild(empty);
        }
        nodes.forEach(function (node) {
            node.classList.add('npp-sd-overlay-item');
            row.appendChild(node);
        });
        overlay.appendChild(row);
        section.appendChild(overlay);

        const rect = anchorEl.getBoundingClientRect();
        const width = overlay.offsetWidth || 220;
        const height = overlay.offsetHeight || 80;
        let left = rect.left + rect.width / 2 - width / 2;
        const maxLeft = window.innerWidth - width - 8;
        left = Math.max(8, Math.min(left, maxLeft));
        overlay.style.left = left + 'px';

        if (isBar) {
            overlay.style.bottom = 'calc(var(--npp-sd-height) + 10px)';
            overlay.style.top = 'auto';
        } else {
            // 扩展坞，优先显示在图标上方
            overlay.style.bottom = 'auto';
            const above = rect.top - height - 8;
            overlay.style.top = (above > 8 ? above : Math.min(rect.bottom + 8, window.innerHeight - height - 8)) + 'px';
        }

        folderOverlay = overlay;
    }

    /* 通用右键菜单 */

    function closeDockMenu() {
        if (!dockMenu) return;
        const menu = dockMenu;
        dockMenu = null;
        menu.classList.add('npp-sd-closing');
        setTimeout(function () {
            if (menu.parentNode) menu.parentNode.removeChild(menu);
        }, 160);
    }

    function showMenu(id, items, x, y) {
        closeDockMenu();
        const section = document.getElementById('section');
        if (!section) return;

        const menu = document.createElement('div');
        menu.className = 'npp-sd-menu';
        menu.id = id;

        items.forEach(function (item) {
            const row = document.createElement('div');
            row.className = 'npp-sd-menu-item' + (item.cls ? ' ' + item.cls : '');
            if (item.id) row.id = item.id;
            row.textContent = item.label;
            row.addEventListener('click', function (event) {
                event.stopPropagation();
                item.onClick(row);
            });
            menu.appendChild(row);
        });

        section.appendChild(menu);
        const width = menu.offsetWidth || 160;
        const height = menu.offsetHeight || 100;
        const left = Math.max(8, Math.min(x, window.innerWidth - width - 8));
        let top = y + 4;
        if (top + height > window.innerHeight - 8) top = Math.max(8, y - height - 4);
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
        dockMenu = menu;
    }

    function twoStepMenu(menuId, label, armedLabel, onConfirm) {
        let armed = false;
        let timer = 0;
        return {
            id: menuId,
            label: label,
            cls: 'npp-sd-menu-danger',
            onClick: function (row) {
                if (!armed) {
                    armed = true;
                    row.textContent = armedLabel;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        armed = false;
                        row.textContent = label;
                    }, 2800);
                    return;
                }
                clearTimeout(timer);
                onConfirm();
            }
        };
    }

    function renameFolderForm(menuId, folder, scopeLabel) {
        const menu = dockMenu;
        if (!menu) return;
        menu.replaceChildren();

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'npp-sd-menu-input';
        input.value = folder.name || '';
        menu.appendChild(input);

        const actions = document.createElement('div');
        actions.className = 'npp-sd-menu-actions';

        const save = document.createElement('div');
        save.className = 'npp-sd-menu-item npp-sd-menu-primary';
        save.id = menuId + 'Save';
        save.textContent = T('@shortcutDock:menu-save');
        save.addEventListener('click', function (event) {
            event.stopPropagation();
            const next = String(input.value || '').trim();
            if (next) folder.name = next;
            saveConfig();
            renderDock();
            if (dockPage) {
                renderPageRail();
                renderPageGrid();
            }
            closeDockMenu();

        });
        actions.appendChild(save);

        const cancel = document.createElement('div');
        cancel.className = 'npp-sd-menu-item';
        cancel.textContent = T('@shortcutDock:dialog-cancel');
        cancel.addEventListener('click', function (event) {
            event.stopPropagation();
            closeDockMenu();
        });
        actions.appendChild(cancel);
        menu.appendChild(actions);

        input.focus();
        input.select();
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') save.click();
            if (event.key === 'Escape') closeDockMenu();
        });
    }

    function openBarFolderMenu(folder, x, y) {
        showMenu('nppSdBarFolderMenu', [
            { id: 'nppSdFolderRename', label: T('@shortcutDock:menu-rename'), onClick: function () { renameFolderForm('nppSdFolderRename', folder, '文件夹'); } },
            twoStepMenu('nppSdFolderDissolve', T('@shortcutDock:menu-dissolve'), T('@shortcutDock:menu-dissolve-confirm'), function () {
                config.barFolders = config.barFolders.filter(function (item) { return item.id !== folder.id; });
                config.barOrder = config.barOrder.filter(function (entry) { return entry !== folder.id; });
                saveConfig();
                renderDock();
                closeDockMenu();

            })
        ], x, y);
    }

    function openPageFolderMenu(folder, x, y) {
        const items = [
            { id: 'nppSdPageFolderRename', label: T('@shortcutDock:menu-rename'), onClick: function () { renameFolderForm('nppSdPageFolderRename', folder, '文件夹'); } },
            {
                id: 'nppSdPageFolderPin',
                label: folder.pinned ? T('@shortcutDock:menu-unpin-sidebar') : T('@shortcutDock:menu-pin-sidebar'),
                onClick: function () {
                    folder.pinned = !folder.pinned;
                    saveConfig();
                    renderPageRail();
                    renderPageGrid();
                    closeDockMenu();
                }
            },
            twoStepMenu('nppSdPageFolderDissolve', T('@shortcutDock:menu-dissolve'), T('@shortcutDock:menu-dissolve-confirm'), function () {
                const parentId = folder.parentId || 'root';

                // 收集文件夹内部所有项
                const doomed = [folder.id];
                let grew = true;
                while (grew) {
                    grew = false;
                    config.pageFolders.forEach(function (f) {
                        const pid = f.parentId || 'root';
                        if (doomed.indexOf(pid) >= 0 && doomed.indexOf(f.id) < 0) {
                            doomed.push(f.id);
                            grew = true;
                        }
                    });
                }

                // 项返回上一层
                const allItems = [];
                doomed.forEach(function (id) {
                    const f = pageFolderById(id);
                    if (f) allItems.push.apply(allItems, f.items);
                });
                if (parentId === 'root') {
                    allItems.forEach(function (id) {
                        if (config.pageOrder.indexOf(id) < 0) config.pageOrder.push(id);
                    });
                } else {
                    const parent = pageFolderById(parentId);
                    if (parent) {
                        allItems.forEach(function (id) {
                            if (parent.items.indexOf(id) < 0) parent.items.push(id);
                        });
                    }
                }

                // 删除整个文件夹
                config.pageFolders = config.pageFolders.filter(function (f) { return doomed.indexOf(f.id) < 0; });
                pageActiveFolder = parentId;
                saveActiveFolder();
                saveConfig();
                renderPageRail();
                renderPageGrid();
                closeDockMenu();
            })
        ];
        showMenu('nppSdPageFolderMenu', items, x, y);
    }

    // 侧栏文件夹
    // 重命名 / 取消固定
    function openRailFolderMenu(folder, x, y) {
        showMenu('nppSdRailFolderMenu', [
            { id: 'nppSdRailFolderRename', label: T('@shortcutDock:menu-rename'), onClick: function () { renameFolderForm('nppSdRailFolderRename', folder, '文件夹'); } },
            {
                id: 'nppSdRailFolderUnpin',
                label: T('@shortcutDock:menu-unpin'),
                onClick: function () {
                    folder.pinned = false;
                    saveConfig();
                    renderPageRail();
                    renderPageGrid();
                    closeDockMenu();
                }
            }
        ], x, y);
    }

    function openPinMenu(pin, x, y) {
        showMenu('nppSdPinMenu', [
            twoStepMenu('nppSdUnpin', T('@shortcutDock:menu-unpin'), T('@shortcutDock:menu-unpin-confirm'), function () {
                config.pins = config.pins.filter(function (item) { return item.id !== pin.id; });
                removePinFromBarFolders(pin.id);
                config.barOrder = config.barOrder.filter(function (entry) { return entry !== pin.id; });
                saveConfig();
                renderDock();
                closeDockMenu();

            })
        ], x, y);
    }

    function editItemForm(item, x, y) {
        showMenu('nppSdItemEditMenu', [], x, y);
        const menu = dockMenu;
        if (!menu) return;
        menu.replaceChildren();

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'npp-sd-menu-input';
        nameInput.value = item.title || '';

        const urlInput = document.createElement('input');
        urlInput.type = 'url';
        urlInput.className = 'npp-sd-menu-input';
        urlInput.value = item.url || '';

        menu.append(nameInput, urlInput);

        if (!config.iconOverrides) config.iconOverrides = {};
        if (!config.iconModes) config.iconModes = {};
        const step = function (next) { config.iconModes[item.id] = next; };
        const applyIconChange = function () {
            saveConfig();
            renderDock();
            if (dockPage) renderPageGrid();
        };

        const iconRow = document.createElement('div');
        iconRow.className = 'npp-sd-icon-picks';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.id = 'nppSdIconFile';
        fileInput.style.display = 'none';

        const autoSrc = item.icon || (iconCache[originOf(item.url)] && iconCache[originOf(item.url)].icon) || '';

        const mkPick = function (id, tip) {
            const pick = document.createElement('div');
            pick.className = 'npp-sd-icon-pick';
            pick.id = id;
            pick.title = tip;
            return pick;
        };

        const autoPick = mkPick('nppSdIconPickAuto', T('@shortcutDock:icon-auto'));
        const autoImg = document.createElement('img');
        autoImg.alt = '';
        if (autoSrc) autoImg.src = autoSrc;
        autoPick.appendChild(autoImg);

        const customPick = mkPick('nppSdIconPickCustom', T('@shortcutDock:icon-upload'));
        const customImg = document.createElement('img');
        customImg.alt = '';
        const plus = document.createElement('span');
        plus.className = 'npp-sd-icon-plus';
        plus.textContent = '+';
        customPick.append(customImg, plus, fileInput);

        const clearBadge = document.createElement('span');
        clearBadge.className = 'npp-sd-icon-clear';
        clearBadge.id = 'nppSdIconClear';
        clearBadge.textContent = '×';
        clearBadge.title = T('@shortcutDock:icon-remove-upload');
        customPick.appendChild(clearBadge);

        const letterPick = mkPick('nppSdIconPickLetter', T('@shortcutDock:icon-letter'));
        const letterSpan = document.createElement('span');
        letterSpan.className = 'npp-sd-letter npp-sd-icon-letter';
        letterSpan.textContent = firstChar(item.title || item.url);

        letterPick.appendChild(letterSpan);

        const syncPicks = function () {
            const mode = config.iconModes[item.id] || 'auto';
            const override = config.iconOverrides[item.id] || '';
            [autoPick, customPick, letterPick].forEach(function (el) {
                el.classList.toggle('selected', el === (mode === 'auto' ? autoPick : mode === 'custom' ? customPick : letterPick));
            });
            if (autoSrc) autoImg.src = autoSrc;
            if (override) {
                customImg.src = override;
                customImg.style.display = 'block';
                plus.style.display = 'none';
                clearBadge.style.display = 'flex';
            } else {
                customImg.style.display = 'none';
                plus.style.display = 'block';
                clearBadge.style.display = 'none';
            }
        };

        autoPick.addEventListener('click', function (event) {
            event.stopPropagation();
            step('auto');
            syncPicks();
            applyIconChange();
        });

        customPick.addEventListener('click', function (event) {
            event.stopPropagation();
            if (config.iconOverrides[item.id]) {
                step('custom');
                syncPicks();
                applyIconChange();
                return;
            }
            fileInput.click();
        });

        fileInput.addEventListener('change', function () {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function () {
                config.iconOverrides[item.id] = String(reader.result || '');
                config.iconModes[item.id] = 'custom';
                syncPicks();
                applyIconChange();

            };
            reader.readAsDataURL(file);
            fileInput.value = '';
        });

        clearBadge.addEventListener('click', function (event) {
            event.stopPropagation();
            delete config.iconOverrides[item.id];
            if (config.iconModes[item.id] === 'custom') config.iconModes[item.id] = 'auto';
            syncPicks();
            applyIconChange();

        });

        letterPick.addEventListener('click', function (event) {
            event.stopPropagation();
            step('letter');
            syncPicks();
            applyIconChange();
        });

        iconRow.append(autoPick, customPick, letterPick);
        menu.appendChild(iconRow);
        syncPicks();

        const actions = document.createElement('div');
        actions.className = 'npp-sd-menu-actions';

        const save = document.createElement('div');
        save.className = 'npp-sd-menu-item npp-sd-menu-primary';
        save.id = 'nppSdItemEditSave';
        save.textContent = T('@shortcutDock:menu-save');
        save.addEventListener('click', function (event) {
            event.stopPropagation();
            const url = String(urlInput.value || '').trim();
            if (!/^https?:\/\//i.test(url)) {
                showToast(T('@shortcutDock:url-invalid'), true);
                return;
            }
            item.title = String(nameInput.value || '').trim() || url;
            item.url = url;
            saveConfig();
            refreshItems().catch(function (error) { warn(T('@shortcutDock:refresh-failed'), error); });
            if (dockPage) renderPageGrid();
            closeDockMenu();

        });
        actions.appendChild(save);

        const cancel = document.createElement('div');
        cancel.className = 'npp-sd-menu-item';
        cancel.textContent = T('@shortcutDock:dialog-cancel');
        cancel.addEventListener('click', function (event) {
            event.stopPropagation();
            closeDockMenu();
        });
        actions.appendChild(cancel);
        menu.appendChild(actions);

        nameInput.focus();
        nameInput.select();
        [nameInput, urlInput].forEach(function (input) {
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') save.click();
                if (event.key === 'Escape') closeDockMenu();
            });
        });
    }

    function openPageItemMenu(item, x, y) {
        showMenu('nppSdPageItemMenu', [
            {
                id: 'nppSdItemPin', label: T('@shortcutDock:menu-pin'), onClick: function () {
                    const pin = { id: newPinId(), itemId: item.id };
                    config.pins.push(pin);
                    config.barOrder.push(pin.id);
                    saveConfig();
                    renderDock();
                    closeDockMenu();

                }
            },
            { id: 'nppSdItemEdit', label: T('@shortcutDock:menu-edit'), onClick: function () { editItemForm(item, x, y); } },
            twoStepMenu('nppSdItemDelete', T('@shortcutDock:menu-delete'), T('@shortcutDock:menu-delete-confirm'), function () {
                config.items = config.items.filter(function (entry) { return entry.id !== item.id; });
                config.pins = config.pins.filter(function (pin) { return pin.itemId !== item.id; });
                removeItemFromPageFolders(item.id);
                config.pageOrder = config.pageOrder.filter(function (entry) { return entry !== item.id; });
                config.barOrder = config.barOrder.filter(function (entry) { return pinById(entry) || barFolderById(entry) || config.pins.some(function (pin) { return pin.id === entry; }); });
                saveConfig();
                renderDock();
                renderPageGrid();
                closeDockMenu();

            })
        ], x, y);
    }

    /* 拖拽 */

    let peeked = false;
    let hideTimer = 0;

    // index 按不含被拖项的列表计算
    function moveTo(order, id, index) {
        const next = order.filter(function (entry) { return entry !== id; });
        const target = Math.max(0, Math.min(index, next.length));
        next.splice(target, 0, id);
        order.length = 0;
        Array.prototype.push.apply(order, next);
    }

    function indexAt(container, x, y, isBar) {
        const kids = Array.prototype.slice.call(container.children).filter(function (el) {
            return el !== drag.node;
        });
        for (let i = 0; i < kids.length; i++) {
            const rect = kids[i].getBoundingClientRect();
            if (isBar) {
                if (x < rect.left + rect.width / 2) return i;
            } else {
                if (y < rect.top + rect.height / 2) return i;
                if (y <= rect.bottom && x < rect.left + rect.width / 2) return i;
            }
        }
        return kids.length;
    }

    // 拖拽时 hit-test 无效，直接按子元素矩形做几何命中
    function childAt(scope, x, y) {
        const container = scope === 'bar'
            ? dockEl
            : document.querySelector('#nppShortcutDockPage .npp-sd-page-grid');
        if (!container) return null;
        const kids = Array.prototype.slice.call(container.children);
        for (let i = 0; i < kids.length; i++) {
            const el = kids[i];
            if (el.classList.contains('npp-sd-gap')) continue;
            const rect = el.getBoundingClientRect();
            if (x >= rect.left - 2 && x <= rect.right + 2 && y >= rect.top - 2 && y <= rect.bottom + 2) return el;
        }
        return null;
    }

    function railFolderAt(x, y) {
        const rail = document.getElementById('nppSdRail');
        if (!rail) return null;
        const kids = Array.prototype.slice.call(rail.children);
        for (let i = 0; i < kids.length; i++) {
            const el = kids[i];
            const rect = el.getBoundingClientRect();
            if (x >= rect.left - 2 && x <= rect.right + 2 && y >= rect.top - 2 && y <= rect.bottom + 2) {
                if (el.dataset.pageFolder === 'root') return { type: 'root', el: el };
                if (el.dataset.pageFolderId) return { type: 'folder', el: el, folderId: el.dataset.pageFolderId };
            }
        }
        return null;
    }

    function targetNodeAt(scope, x, y) {
        const el = childAt(scope, x, y);
        if (!el) return null;
        if (scope === 'bar') {
            if (el.dataset.barFolderId) return { type: 'folder', el: el, folderId: el.dataset.barFolderId };
            if (el.dataset.pinId) return { type: 'pin', el: el, pinId: el.dataset.pinId };
            return null;
        }
        if (el.dataset.pageFolderId) return { type: 'folder', el: el, folderId: el.dataset.pageFolderId };
        if (el.dataset.itemId) return { type: 'item', el: el, itemId: el.dataset.itemId };
        return null;
    }

    // 保留 closest 供非拖拽场景使用
    function hitNodeAt(pointerX, pointerY, selector) {
        const stack = document.elementsFromPoint
            ? document.elementsFromPoint(pointerX, pointerY)
            : [document.elementFromPoint(pointerX, pointerY)];
        for (let i = 0; i < stack.length; i++) {
            const el = stack[i];
            if (!el || !el.closest) continue;
            const found = el.closest(selector);
            if (found) return found;
        }
        return null;
    }

    function applyDrop(pointerX, pointerY) {
        const hit = document.elementFromPoint(pointerX, pointerY);
        window.__nppSdLastDrop = { x: pointerX, y: pointerY, hit: hit ? String(hit.className || hit.tagName) : 'null' };
        if (!hit || !drag) return false;

        const isBar = drag.scope === 'bar';
        const kind = drag.kind;

        if (isBar) {
            const barTarget = targetNodeAt('bar', pointerX, pointerY);

            if (kind === 'pin' && barTarget && barTarget.type === 'folder') {
                const folder = barFolderById(barTarget.folderId);
                if (!folder) return false;
                removePinFromBarFolders(drag.pinId);
                if (folder.pins.indexOf(drag.pinId) < 0) folder.pins.push(drag.pinId);
                config.barOrder = config.barOrder.filter(function (entry) { return entry !== drag.pinId; });
                saveConfig();
                renderDock();
                return true;
            }

            if (kind === 'pin' && barTarget && barTarget.type === 'pin' && barTarget.pinId !== drag.pinId) {
                const targetPinId = barTarget.pinId;
                removePinFromBarFolders(drag.pinId);
                removePinFromBarFolders(targetPinId);
                const folder = { id: newBarFolderId(), name: T('@shortcutDock:menu-new-folder'), pins: [targetPinId, drag.pinId] };
                config.barFolders.push(folder);
                const order = config.barOrder.slice();
                const targetIndex = order.indexOf(targetPinId);
                const filtered = order.filter(function (entry) { return entry !== drag.pinId && entry !== targetPinId; });
                const insertAt = targetIndex < 0 ? filtered.length : Math.min(targetIndex, filtered.length);
                filtered.splice(insertAt, 0, folder.id);
                config.barOrder = filtered;
                saveConfig();
                renderDock();
                return true;
            }

            if (dockEl && dockEl.contains(hit)) {
                const index = indexAt(dockEl, pointerX, pointerY, true);
                if (kind === 'pin') moveTo(config.barOrder, drag.pinId, index);
                else if (kind === 'barFolder') moveTo(config.barOrder, drag.folderId, index);
                saveConfig();
                renderDock();
                return true;
            }
            return false;
        }

        // 扩展坞
        const grid = document.querySelector('#nppShortcutDockPage .npp-sd-page-grid');
        const railTarget = railFolderAt(pointerX, pointerY);

        if (kind === 'item' && railTarget && railTarget.type !== 'item') {
            if (railTarget.type === 'root') {
                removeItemFromPageFolders(drag.itemId);
            } else {
                const folder = pageFolderById(railTarget.folderId);
                if (folder) {
                    removeItemFromPageFolders(drag.itemId);
                    if (folder.items.indexOf(drag.itemId) < 0) folder.items.push(drag.itemId);
                }
            }

            saveConfig();
            renderPageRail();
            renderPageGrid();
            return true;
        }

        if (kind === 'pageFolder' && railTarget && railTarget.type === 'folder' && railTarget.folderId !== drag.folderId) {
            // 侧栏内拖动为 排序
            const moving = pageFolderById(drag.folderId);
            if (moving) {
                const pinned = config.pageFolders.filter(function (f) { return f.pinned && f.id !== moving.id; });
                let idx = pinned.length;
                for (let i = 0; i < pinned.length; i++) {
                    const el = document.querySelector('#nppSdRail .npp-sd-rail-folder[data-page-folder-id="' + pinned[i].id + '"]');
                    if (!el) continue;
                    const r = el.getBoundingClientRect();
                    const vertical = r.height >= r.width;
                    const mid = vertical ? r.top + r.height / 2 : r.left + r.width / 2;
                    const pos = vertical ? pointerY : pointerX;
                    if (pos < mid) { idx = i; break; }
                }
                config.pageFolders = config.pageFolders.filter(function (f) { return f.id !== moving.id; });
                const anchor = pinned[idx];
                if (anchor) {
                    const at = config.pageFolders.findIndex(function (f) { return f.id === anchor.id; });
                    config.pageFolders.splice(at < 0 ? config.pageFolders.length : at, 0, moving);
                } else if (pinned.length) {
                    const last = pinned[pinned.length - 1];
                    const at = config.pageFolders.findIndex(function (f) { return f.id === last.id; });
                    config.pageFolders.splice(at < 0 ? config.pageFolders.length : at + 1, 0, moving);
                } else {
                    config.pageFolders.push(moving);
                }
                saveConfig();
                renderPageRail();
                return true;
            }
        }

        const pageTarget = targetNodeAt('page', pointerX, pointerY);

        // 文件夹拖到 项与项之间/空白处 时为 排序
        if (kind === 'pageFolder' && grid && grid.contains(hit) && !(pageTarget && pageTarget.type === 'folder')) {
            const moving = pageFolderById(drag.folderId);
            if (moving) {
                const parentId = moving.parentId || 'root';
                const siblings = childPageFolders(parentId).filter(function (f) { return f.id !== moving.id; });
                let idx = siblings.length;
                for (let i = 0; i < siblings.length; i++) {
                    const el = document.querySelector('#nppShortcutDockPage .npp-sd-folder-tile[data-page-folder-id="' + siblings[i].id + '"]');
                    if (!el) continue;
                    const r = el.getBoundingClientRect();
                    if (pointerX < r.left + r.width / 2) { idx = i; break; }
                }
                config.pageFolders = config.pageFolders.filter(function (f) { return f.id !== moving.id; });
                const anchor = siblings[idx];
                if (anchor) {
                    const at = config.pageFolders.findIndex(function (f) { return f.id === anchor.id; });
                    config.pageFolders.splice(at < 0 ? config.pageFolders.length : at, 0, moving);
                } else {
                    config.pageFolders.push(moving);
                }
                saveConfig();
                renderPageGrid();
                return true;
            }
        }

        // 文件夹放入另一个文件夹
        if (kind === 'pageFolder' && pageTarget && pageTarget.type === 'folder' && pageTarget.folderId !== drag.folderId) {
            const moving = pageFolderById(drag.folderId);
            const target = pageFolderById(pageTarget.folderId);
            if (moving && target) {
                let cyclic = false;
                let pid = target.parentId || 'root';
                while (pid !== 'root') {
                    if (pid === moving.id) { cyclic = true; break; }
                    const p = pageFolderById(pid);
                    pid = p ? (p.parentId || 'root') : 'root';
                }
                if (!cyclic) {
                    moving.parentId = target.id;
                    config.pageOrder = config.pageOrder.filter(function (entry) { return entry !== moving.id; });
                    saveConfig();
                    renderPageRail();
                    renderPageGrid();
                    return true;
                }
            }
        }

        if (kind === 'item' && pageTarget && pageTarget.type === 'folder') {
            const folder = pageFolderById(pageTarget.folderId);
            if (!folder) return false;
            removeItemFromPageFolders(drag.itemId);
            if (folder.items.indexOf(drag.itemId) < 0) folder.items.push(drag.itemId);
            config.pageOrder = config.pageOrder.filter(function (entry) { return entry !== drag.itemId; });
            saveConfig();
            renderPageGrid();
            return true;
        }

        if (kind === 'item' && pageTarget && pageTarget.type === 'item' && pageTarget.itemId !== drag.itemId) {
            const targetItemId = pageTarget.itemId;
            removeItemFromPageFolders(drag.itemId);
            removeItemFromPageFolders(targetItemId);
            const folder = { id: newPageFolderId(), name: T('@shortcutDock:menu-new-folder'), items: [targetItemId, drag.itemId], parentId: pageActiveFolder || 'root', pinned: false };
            config.pageFolders.push(folder);
            if ((folder.parentId || 'root') === 'root') {
                const order = config.pageOrder.slice();
                const targetIndex = order.indexOf(targetItemId);
                const filtered = order.filter(function (entry) { return entry !== drag.itemId && entry !== targetItemId; });
                const insertAt = targetIndex < 0 ? filtered.length : Math.min(targetIndex, filtered.length);
                filtered.splice(insertAt, 0, folder.id);
                config.pageOrder = filtered;
            }
            saveConfig();
            renderPageRail();
            renderPageGrid();
            renderDock();
            return true;
        }

        if (grid && grid.contains(hit)) {
            const index = indexAt(grid, pointerX, pointerY, false);
            if (kind === 'item') moveTo(config.pageOrder, drag.itemId, index);
            if (kind === 'pageFolder') moveTo(config.pageOrder, drag.folderId, index);
            saveConfig();
            renderPageGrid();
            return true;
        }
        return false;
    }

    function updateHover(pointerX, pointerY) {
        const hit = document.elementFromPoint(pointerX, pointerY);
        const marked = document.querySelectorAll('.npp-sd-drop');
        for (let i = 0; i < marked.length; i++) marked[i].classList.remove('npp-sd-drop');
        if (!hit || !hit.closest || !drag) return;
        if (drag.kind !== 'pin' && drag.kind !== 'item' && drag.kind !== 'pageFolder') return;

        if (drag.scope === 'page' && (drag.kind === 'item' || drag.kind === 'pageFolder')) {
            const rail = railFolderAt(pointerX, pointerY);
            if (rail && rail.el !== drag.node) rail.el.classList.add('npp-sd-drop');
        }
        const target = targetNodeAt(drag.scope, pointerX, pointerY);
        if (target && target.el !== drag.node) target.el.classList.add('npp-sd-drop');
    }

    function makeGhost(node, x, y) {
        const ghost = document.createElement('div');
        ghost.className = 'npp-sd-ghost';
        const icon = node.querySelector('.npp-sd-icon');
        if (icon) ghost.appendChild(icon.cloneNode(true));
        const label = node.querySelector('.npp-sd-label') || node.querySelector('.tab_text');
        if (label) {
            const text = document.createElement('span');
            text.className = 'npp-sd-label';
            text.textContent = label.textContent;
            ghost.appendChild(text);
        } else if (node.textContent && node.textContent.trim()) {
            const text = document.createElement('span');
            text.className = 'npp-sd-label';
            text.textContent = node.textContent.trim();
            ghost.appendChild(text);
        }
        ghost.style.left = x + 'px';
        ghost.style.top = y + 'px';
        const section = document.getElementById('section');
        (section || document.body).appendChild(ghost);
        return ghost;
    }

    // 拖拽到边缘自动滚动
    // 离得越近速度越快
    const EDGE_SCROLL_MAX = 16;

    function autoScrollTick() {
        if (!drag || !drag.active) { if (drag) drag.raf = 0; return; }
        const x = drag.x;
        const y = drag.y;
        let bestEl = null;
        let bestAxis = '';
        let bestDelta = 0;

        const speedAt = function (dist) {
            const k = Math.max(0, Math.min(1, 1 - Math.max(0, dist) / EDGE_SCROLL));
            return Math.round(1 + (EDGE_SCROLL_MAX - 1) * k);
        };
        const consider = function (el) {
            if (!el || typeof el.scrollWidth !== 'number') return;
            const maxX = el.scrollWidth - el.clientWidth;
            const maxY = el.scrollHeight - el.clientHeight;
            if (maxX <= 2 && maxY <= 2) return;
            const rect = el.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            if (x < rect.left - EDGE_SCROLL || x > rect.right + EDGE_SCROLL) return;
            if (y < rect.top - EDGE_SCROLL || y > rect.bottom + EDGE_SCROLL) return;
            if (maxX > 2) {
                if (x < rect.left + EDGE_SCROLL && el.scrollLeft > 0) {
                    const delta = -speedAt(x - rect.left);
                    if (Math.abs(delta) > Math.abs(bestDelta)) { bestEl = el; bestAxis = 'x'; bestDelta = delta; }
                } else if (x > rect.right - EDGE_SCROLL && el.scrollLeft < maxX) {
                    const delta = speedAt(rect.right - x);
                    if (Math.abs(delta) > Math.abs(bestDelta)) { bestEl = el; bestAxis = 'x'; bestDelta = delta; }
                }
            }
            if (maxY > 2) {
                if (y < rect.top + EDGE_SCROLL && el.scrollTop > 0) {
                    const delta = -speedAt(y - rect.top);
                    if (Math.abs(delta) > Math.abs(bestDelta)) { bestEl = el; bestAxis = 'y'; bestDelta = delta; }
                } else if (y > rect.bottom - EDGE_SCROLL && el.scrollTop < maxY) {
                    const delta = speedAt(rect.bottom - y);
                    if (Math.abs(delta) > Math.abs(bestDelta)) { bestEl = el; bestAxis = 'y'; bestDelta = delta; }
                }
            }
        };

        consider(drag.scope === 'bar' ? dockEl : null);
        consider(document.getElementById('nppSdRail'));
        const page = document.getElementById('nppShortcutDockPage');
        if (page) consider(page.querySelector('.panelContent'));
        if (folderOverlay) consider(folderOverlay);

        if (bestEl) {
            if (bestAxis === 'x') {
                const max = bestEl.scrollWidth - bestEl.clientWidth;
                bestEl.scrollLeft = Math.max(0, Math.min(max, bestEl.scrollLeft + bestDelta));
            } else {
                const max = bestEl.scrollHeight - bestEl.clientHeight;
                bestEl.scrollTop = Math.max(0, Math.min(max, bestEl.scrollTop + bestDelta));
            }
            updateHover(x, y);
        }
        drag.raf = requestAnimationFrame(autoScrollTick);
    }

    function cleanupDrag() {
        if (!drag) return;
        const node = drag.node;
        if (drag.timer) clearTimeout(drag.timer);
        if (drag.raf) cancelAnimationFrame(drag.raf);
        if (drag.ghost && drag.ghost.parentNode) drag.ghost.parentNode.removeChild(drag.ghost);
        document.body.style.touchAction = '';
        if (node) {
            node.classList.remove('npp-sd-dragging');
            node.removeEventListener('pointermove', onDragMove);
            node.removeEventListener('pointerup', onDragEnd);
            node.removeEventListener('pointercancel', cancelDrag);
            try { node.releasePointerCapture(drag.pointerId); } catch (error) { /* 忽略 */ }
        }
        if (dockEl) dockEl.classList.remove('npp-sd-dragmode');
        const marked = document.querySelectorAll('.npp-sd-drop');
        for (let i = 0; i < marked.length; i++) marked[i].classList.remove('npp-sd-drop');
        drag = null;
    }

    function cancelDrag() { cleanupDrag(); }

    window.__nppSdDragProbe = function () { return drag && drag.active ? drag : null; };

    function activateDrag() {
        if (!drag || drag.active) return;
        drag.active = true;
        document.body.style.touchAction = 'none';
        drag.node.classList.add('npp-sd-dragging');
        drag.ghost = makeGhost(drag.node, drag.x, drag.y);
        if (dockEl) dockEl.classList.add('npp-sd-dragmode');
        drag.raf = requestAnimationFrame(autoScrollTick);
    }

    function suppressNextClick() {
        const stop = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        document.addEventListener('click', stop, { capture: true, once: true });
        setTimeout(function () {
            document.removeEventListener('click', stop, true);
        }, 400);
    }

    function findScrollable(node, horizontal) {
        let el = node && node.parentElement;
        while (el && el !== document.body && el !== document.documentElement) {
            const cs = getComputedStyle(el);
            const overflow = horizontal ? cs.overflowX : cs.overflowY;
            const canScroll = horizontal ? el.scrollWidth > el.clientWidth + 1 : el.scrollHeight > el.clientHeight + 1;
            if (canScroll && (overflow === 'auto' || overflow === 'scroll')) return el;
            el = el.parentElement;
        }
        if (drag && drag.scope === 'bar') return dockEl;
        if (drag && drag.kind === 'pageFolder') return document.getElementById('nppSdRail');
        return document.querySelector('#nppShortcutDockPage .panelContent.npp-sd-page-content');
    }

    function onDragStart(event) {
        if (event.button !== undefined && event.button !== 0) return;
        if (drag) return;
        const node = event.currentTarget;
        if (!node || !node.dataset) return;

        const barFolderId = node.dataset.barFolderId || '';
        const pageFolderId = node.dataset.pageFolderId || '';
        const pinId = node.dataset.pinId || '';
        const itemId = node.dataset.itemId || '';

        let scope = '';
        let kind = '';
        let folderId = '';
        if (barFolderId) { scope = 'bar'; kind = 'barFolder'; folderId = barFolderId; }
        else if (pinId) { scope = 'bar'; kind = 'pin'; }
        else if (pageFolderId) { scope = 'page'; kind = 'pageFolder'; folderId = pageFolderId; }
        else if (itemId) { scope = 'page'; kind = 'item'; }

        if (!kind) return;

        drag = {
            node: node,
            scope: scope,
            kind: kind,
            pinId: pinId,
            itemId: itemId,
            folderId: folderId,
            from: node.dataset.fromFolder || '',
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            x: event.clientX,
            y: event.clientY,
            active: false,
            timer: 0,
            ghost: null,
            raf: 0,
            touch: event.pointerType === 'touch'
        };

        try { node.setPointerCapture(event.pointerId); } catch (error) { /* 忽略 */ }
        node.addEventListener('pointermove', onDragMove);
        node.addEventListener('pointerup', onDragEnd);
        node.addEventListener('pointercancel', cancelDrag);

        if (drag.touch) {
            drag.timer = setTimeout(function () {
                if (!drag || !drag.touch) return;
                activateDrag();
            }, TOUCH_LONGPRESS);
        }
    }

    function onDragMove(event) {
        if (!drag || event.pointerId !== drag.pointerId) return;
        drag.x = event.clientX;
        drag.y = event.clientY;

        const dx = Math.abs(event.clientX - drag.startX);
        const dy = Math.abs(event.clientY - drag.startY);
        const moved = Math.max(dx, dy);

        if (!drag.active) {
            if (drag.touch) {
                if (moved > TOUCH_CANCEL_MOVE) {
                    // 未达到长按阈值时为 滚动
                    if (!drag.swiped) {
                        drag.swiped = true;
                        if (drag.timer) { clearTimeout(drag.timer); drag.timer = 0; }
                        drag.lastX = drag.startX;
                        drag.lastY = drag.startY;
                    }
                    const horizontal = Math.abs(event.clientX - drag.lastX) > Math.abs(event.clientY - drag.lastY);
                    const scroller = findScrollable(drag.node, horizontal);
                    if (scroller) {
                        if (horizontal) scroller.scrollLeft -= (event.clientX - drag.lastX);
                        else scroller.scrollTop -= (event.clientY - drag.lastY);
                    }
                    drag.lastX = event.clientX;
                    drag.lastY = event.clientY;
                }
                return;
            }
            if (moved > DRAG_THRESHOLD) activateDrag();
            if (!drag.active) return;
        }

        event.preventDefault();
        if (drag.ghost) {
            drag.ghost.style.left = drag.x + 'px';
            drag.ghost.style.top = drag.y + 'px';
        }
        updateHover(drag.x, drag.y);
    }

    function onDragEnd(event) {
        window.__nppSdLastEnd = { pid: event.pointerId, dragPid: drag && drag.pointerId, active: drag && drag.active };
        if (!drag || event.pointerId !== drag.pointerId) return;
        if (!drag.active) {
            if (drag.swiped) suppressNextClick();
            cleanupDrag();
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        suppressNextClick();
        applyDrop(event.clientX, event.clientY);
        cleanupDrag();
    }

    /* 右键分发 */

    // 不允许原生拖拽
    document.addEventListener('dragstart', function (event) {
        const target = event.target;
        if (target && target.closest && target.closest('.npp-sd-item')) event.preventDefault();
    }, true);

    // 右键的菜单入口
    function showMenuForTarget(target, x, y) {
        if (!target || !target.closest) return false;

        const barFolderNode = target.closest('[data-bar-folder-id]');
        if (barFolderNode) {
            const folder = barFolderById(barFolderNode.dataset.barFolderId);
            if (folder) { openBarFolderMenu(folder, x, y); return true; }
        }

        const pageFolderNode = target.closest('[data-page-folder-id]');
        if (pageFolderNode) {
            const folder = pageFolderById(pageFolderNode.dataset.pageFolderId);
            if (folder) {
                if (pageFolderNode.closest('#nppSdRail')) openRailFolderMenu(folder, x, y);
                else openPageFolderMenu(folder, x, y);
                return true;
            }
        }

        const pinNode = target.closest('[data-pin-id]');
        if (pinNode) {
            const pin = pinById(pinNode.dataset.pinId);
            if (pin) { openPinMenu(pin, x, y); return true; }
        }

        const pageItemNode = target.closest('#nppShortcutDockPage [data-item-id]');
        if (pageItemNode) {
            const item = itemById(pageItemNode.dataset.itemId);
            if (item) { openPageItemMenu(item, x, y); return true; }
        }

        return false;
    }

    document.addEventListener('contextmenu', function (event) {
        // 拖动时屏蔽右键
        if (drag && drag.active) {
            event.preventDefault();
            return;
        }
        if (showMenuForTarget(event.target, event.clientX, event.clientY)) {
            event.preventDefault();
        }
    }, true);

    document.addEventListener('pointerdown', function (event) {
        if (!folderOverlay) return;
        if (folderOverlay.contains(event.target)) return;
        if (event.target.closest && event.target.closest('.npp-sd-menu')) return;
        const anchor = event.target.closest ? event.target.closest('[data-bar-folder-id],[data-page-folder-id]') : null;
        if (anchor) return;
        closeFolderOverlay();
    }, true);

    document.addEventListener('pointerdown', function (event) {
        if (!dockMenu) return;
        if (dockMenu.contains(event.target)) return;
        closeDockMenu();
    }, true);

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        if (drag && drag.active) { cancelDrag(); return; }
        if (dockMenu) { closeDockMenu(); return; }
        if (folderOverlay) closeFolderOverlay();
    }, true);

    /*  渲染  */

    function applyAppearance() {
        if (!dockEl) return;
        dockEl.classList.toggle('npp-sd-iconmode', config.appearance.mode === 'icon');
        dockEl.classList.toggle('npp-sd-hoverlabel', config.appearance.mode === 'icon' && config.appearance.hoverLabel !== false);
        dockEl.style.setProperty('--npp-sd-icon', String(config.appearance.iconSize || 24) + 'px');
        dockEl.style.setProperty('--npp-sd-height', String(config.appearance.height || 56) + 'px');
        document.documentElement.style.setProperty('--npp-sd-height', String(config.appearance.height || 56) + 'px');
        dockEl.style.setProperty('--npp-sd-alpha', String(config.appearance.opacity || 1));
    }

    let lastDockVisible = null;

    function applyVisibility() {
        if (!dockEl) return;
        const base = config.barVisible && config.pins.length > 0;
        const visible = base && (!config.autoHide || peeked);
        const changed = lastDockVisible !== visible;
        lastDockVisible = visible;
        dockEl.classList.toggle('npp-sd-hidden', !visible);
        if (changed) refreshDockScrollState(340);
        // 底栏出现时抬起页脚
        document.documentElement.classList.toggle('npp-sd-foot-raised', visible);
        const section = document.getElementById('section');
        if (section) section.classList.toggle('npp-sd-on', visible);
    }

    function onAutoHideMove(event) {
        if (!config.autoHide || !config.barVisible) return;

        if (config.autoHideInstant) {
            if (!peeked) {
                // 鼠标靠近屏幕底边唤出
                if (event.clientY > window.innerHeight - 36) { peeked = true; applyVisibility(); }
                return;
            }
            const rect = dockEl ? dockEl.getBoundingClientRect() : null;
            const inside = rect && event.clientX >= rect.left && event.clientX <= rect.right
                && event.clientY >= rect.top && event.clientY <= rect.bottom;
            if (inside) return;
            if (drag && drag.active) return; // 拖动中不关闭
            peeked = false;
            applyVisibility();
            return;
        }

        const near = event.clientY > window.innerHeight - 36;
        if (near) {
            clearTimeout(hideTimer);
            if (!peeked) { peeked = true; applyVisibility(); }
            return;
        }
        if (!peeked) return;
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            peeked = false;
            applyVisibility();
        }, 500);
    }

    let dockArrows = null;
    let dockScrollTarget = 0;
    let dockScrollRaf = 0;

    // 底栏平滑滚动
    function smoothDockScrollBy(delta) {
        if (!dockEl) return;
        const max = Math.max(0, dockEl.scrollWidth - dockEl.clientWidth);
        const base = dockScrollRaf ? dockScrollTarget : dockEl.scrollLeft;
        dockScrollTarget = Math.max(0, Math.min(max, base + delta));
        if (dockScrollRaf) return;
        const step = function () {
            if (!dockEl) { dockScrollRaf = 0; return; }
            const diff = dockScrollTarget - dockEl.scrollLeft;
            if (Math.abs(diff) < 0.5) {
                dockEl.scrollLeft = dockScrollTarget;
                dockScrollRaf = 0;
                updateDockArrows();
                return;
            }
            dockEl.scrollLeft += diff * 0.22;
            dockScrollRaf = requestAnimationFrame(step);
        };
        dockScrollRaf = requestAnimationFrame(step);
    }

    function refreshDockScrollState(extraDelay) {
        updateDockArrows();
        if (extraDelay) setTimeout(updateDockArrows, extraDelay);
    }

    function updateDockArrows() {
        if (!dockEl || !dockArrows) return;
        const hidden = dockEl.classList.contains('npp-sd-hidden') || !dockEl.classList.contains('npp-sd-on') && dockEl.getBoundingClientRect().height === 0;
        const rect = dockEl.getBoundingClientRect();
        const visible = rect.width > 0 && rect.height > 0 && !dockEl.classList.contains('npp-sd-hidden');
        dockArrows.style.display = visible ? 'block' : 'none';
        if (!visible) return;
        dockArrows.style.left = rect.left + 'px';
        dockArrows.style.top = rect.top + 'px';
        dockArrows.style.width = rect.width + 'px';
        dockArrows.style.height = rect.height + 'px';

        const max = Math.max(0, dockEl.scrollWidth - dockEl.clientWidth);
        const canScroll = max > 2;
        let pct = 0;
        if (canScroll) {
            // 距 4px 时隐藏指示器
            if (dockEl.scrollLeft <= 4) pct = 0;
            else if (dockEl.scrollLeft >= max - 4) pct = 100;
            else pct = Math.min(100, Math.max(0, (dockEl.scrollLeft / max) * 100));
        }
        dockEl.style.setProperty('--scrollbar', canScroll ? pct.toFixed(1) + '%' : '0%');
        dockArrows.classList.toggle('can-scroll-left', canScroll && pct > 0);
        dockArrows.classList.toggle('can-scroll-right', canScroll && pct < 100);
    }

    function ensureDockArrows() {
        if (dockArrows || !dockEl) return;
        const section = document.getElementById('section');
        if (!section) return;
        dockArrows = document.createElement('div');
        dockArrows.className = 'npp-sd-dock-arrows';
        const left = document.createElement('div');
        left.className = 'scroll-arrow-left';
        left.innerHTML = '<i class="iconfont icon-right_button"></i>';
        const right = document.createElement('div');
        right.className = 'scroll-arrow-right';
        right.innerHTML = '<i class="iconfont icon-left_button"></i>';
        const step = function (dir) { smoothDockScrollBy(dir * dockEl.clientWidth * 0.7); };
        left.addEventListener('click', function () { step(-1); });
        right.addEventListener('click', function () { step(1); });
        dockEl.addEventListener('wheel', function (event) {
            if (dockEl.scrollWidth <= dockEl.clientWidth + 1) return;
            event.preventDefault();
            smoothDockScrollBy(event.deltaY + event.deltaX);
        }, { passive: false });
        dockEl.addEventListener('scroll', function () {
            if (!dockScrollRaf) dockScrollTarget = dockEl.scrollLeft;
            updateDockArrows();
        }, { passive: true });
        window.addEventListener('resize', updateDockArrows, { passive: true });
        dockArrows.append(left, right);
        section.appendChild(dockArrows);
    }

    function renderDock() {
        if (!ensureDock()) return;
        ensureDockArrows();
        closeFolderOverlay();

        const frag = document.createDocumentFragment();
        barList().forEach(function (entry) {
            if (entry.type === 'barFolder') {
                const folder = barFolderById(entry.id);
                if (folder) frag.appendChild(createBarFolderNode(folder));
                return;
            }
            const pin = pinById(entry.id);
            const item = pin ? itemById(pin.itemId) : null;
            if (item) frag.appendChild(createItemNode(item, { pinId: pin.id }));
        });
        dockEl.replaceChildren(frag);
        applyAppearance();
        applyVisibility();
        requestAnimationFrame(updateDockArrows);
    }

    const ACTIVE_FOLDER_KEY = 'shortcutDock.activePageFolder';
    let pageActiveFolder = (function () {
        try { return localStorage.getItem(ACTIVE_FOLDER_KEY) || 'root'; } catch (error) { return 'root'; }
    })();

    function saveActiveFolder() {
        try { localStorage.setItem(ACTIVE_FOLDER_KEY, pageActiveFolder); } catch (error) { /* 忽略 */ }
    }

    function pageRootItems() {
        return pageList()
            .filter(function (entry) { return entry.type === 'item' && !itemPageFolder(entry.id); })
            .map(function (entry) { return itemById(entry.id); })
            .filter(Boolean);
    }

    function pageFolderItems(folder) {
        if (!folder) return [];
        return (folder.items || []).map(function (itemId) { return itemById(itemId); }).filter(Boolean);
    }

    function renderPageRail() {
        const rail = document.getElementById('nppSdRail');
        if (!rail) return;
        const frag = document.createDocumentFragment();

        const rootTab = document.createElement('div');
        rootTab.className = 'tab-items mark-items npp-sd-rail-root' + (pageActiveFolder === 'root' ? ' actives' : '');
        rootTab.dataset.pageFolder = 'root';
        const rootText = document.createElement('span');
        rootText.className = 'tab_text';
        rootText.setAttribute('translate', 'none');
        rootText.textContent = T('@shortcutDock:page-title');
        rootTab.appendChild(rootText);
        rootTab.addEventListener('click', function () { selectPageFolder('root'); });
        frag.appendChild(rootTab);

        config.pageFolders.filter(function (folder) { return folder.pinned; }).forEach(function (folder) {
            const tab = document.createElement('div');
            tab.className = 'tab-items mark-items npp-sd-rail-folder' + (pageActiveFolder === folder.id ? ' actives' : '');
            tab.dataset.pageFolderId = folder.id;
            const text = document.createElement('span');
            text.className = 'tab_text';
            text.setAttribute('translate', 'none');
            text.textContent = folder.name || T('@shortcutDock:folder-default');
            tab.appendChild(text);
            tab.addEventListener('click', function () { selectPageFolder(folder.id); });
            tab.addEventListener('pointerdown', onDragStart);
            frag.appendChild(tab);
        });

        rail.replaceChildren(frag);
    }

    // 方向判断、滚动指示、滚轮、鼠标
    let railCleanup = null;
    let pageGridObserver = null;

    function watchPageGrid() {
        if (pageGridObserver) pageGridObserver.disconnect();
        pageGridObserver = null;
        const grid = document.querySelector('#nppShortcutDockPage .npp-sd-page-grid');
        if (!grid || typeof ResizeObserver === 'undefined') return;
        pageGridObserver = new ResizeObserver(function () { layoutPageGrid(); });
        pageGridObserver.observe(grid);
    }

    function setupRailScrolling() {
        const rail = document.getElementById('nppSdRail');
        const wrap = rail && rail.closest('.tabs-container');
        if (!rail || !wrap) return;
        if (railCleanup) railCleanup();
        railCleanup = null;

        const isVertical = function () { return getComputedStyle(rail).flexDirection === 'column'; };
        const END_TOLERANCE = 2;
        const update = function () {
            const vertical = isVertical();
            const pos = vertical ? rail.scrollTop : rail.scrollLeft;
            const total = vertical ? rail.scrollHeight : rail.scrollWidth;
            const size = vertical ? rail.clientHeight : rail.clientWidth;
            const max = total - size;
            const canScroll = max > END_TOLERANCE;

            let pct = 0;
            if (canScroll) {
                if (pos <= END_TOLERANCE) pct = 0;
                else if (pos >= max - END_TOLERANCE) pct = 100;
                else pct = Math.min(100, Math.max(0, (pos / max) * 100));
            }

            const sig = canScroll ? pct.toFixed(1) : 'none';
            if (rail.__nppSdSig !== sig) {
                rail.__nppSdSig = sig;
                wrap.style.setProperty('--scrollbar', canScroll ? sig + '%' : '0%');
            }

            wrap.classList.toggle('can-scroll-left', canScroll && pct > 0);
            wrap.classList.toggle('can-scroll-right', canScroll && pct < 100);

            // 小屏切横向
            const verticalByViewport = !window.matchMedia('(max-width: 720px)').matches;
            wrap.classList.toggle('vertical', verticalByViewport);
        };
        const step = function (dir) {
            if (isVertical()) rail.scrollTop += dir * rail.clientHeight * 0.7;
            else rail.scrollLeft += dir * rail.clientWidth * 0.7;
        };
        const onWheel = function (event) {
            const vertical = isVertical();
            const overflow = vertical ? rail.scrollHeight > rail.clientHeight : rail.scrollWidth > rail.clientWidth;
            if (!overflow) return;
            event.preventDefault();
            if (vertical) rail.scrollTop += event.deltaY;
            else rail.scrollLeft += event.deltaY;
        };
        const leftArrow = wrap.querySelector('.scroll-arrow-left');
        const rightArrow = wrap.querySelector('.scroll-arrow-right');
        const onLeft = function () { step(-1); };
        const onRight = function () { step(1); };

        rail.addEventListener('wheel', onWheel, { passive: false });
        rail.addEventListener('scroll', update, { passive: true });
        if (leftArrow) leftArrow.addEventListener('click', onLeft);
        if (rightArrow) rightArrow.addEventListener('click', onRight);

        const mutation = new MutationObserver(update);
        mutation.observe(rail, { childList: true });
        const resize = new ResizeObserver(update);
        resize.observe(rail);

        railCleanup = function () {
            rail.removeEventListener('wheel', onWheel);
            rail.removeEventListener('scroll', update);
            if (leftArrow) leftArrow.removeEventListener('click', onLeft);
            if (rightArrow) rightArrow.removeEventListener('click', onRight);
            mutation.disconnect();
            resize.disconnect();
        };
        update();
    }

    function centerRailActive() {
        const rail = document.getElementById('nppSdRail');
        const active = rail && rail.querySelector('.tab-items.actives');
        if (!rail || !active) return;
        const vertical = getComputedStyle(rail).flexDirection === 'column';
        if (vertical) rail.scrollTop = Math.max(0, active.offsetTop - rail.clientHeight / 2 + active.offsetHeight / 2);
        else rail.scrollLeft = Math.max(0, active.offsetLeft - rail.clientWidth / 2 + active.offsetWidth / 2);
    }

    // 只改 actives 不重建 DOM
    function setRailActive(folderId) {
        const rail = document.getElementById('nppSdRail');
        if (!rail) return;
        Array.prototype.forEach.call(rail.children, function (el) {
            const active = el.dataset.pageFolder === 'root'
                ? folderId === 'root'
                : el.dataset.pageFolderId === folderId;
            el.classList.toggle('actives', active);
        });
    }

    // 内容切换
    function replayContentFade() {
        const main = document.querySelector('#nppShortcutDockPage .mainConts');
        if (!main) return;
        main.classList.remove('selected');
        void main.offsetWidth;
        main.classList.add('selected');
    }

    function selectPageFolder(folderId) {
        pageActiveFolder = folderId && pageFolderById(folderId) ? folderId : 'root';
        saveActiveFolder();
        setRailActive(pageActiveFolder);
        renderPageGrid();
        replayContentFade();
    }

    // 网格列数 = floor((内宽 + gap) / (min + gap))
    // 单元格宽 = 平分后的宽
    function layoutPageGrid() {
        const grid = document.querySelector('#nppShortcutDockPage .npp-sd-page-grid');
        if (!grid) return;
        const inner = grid.clientWidth - 20;
        if (inner <= 0) return;
        const gap = 8;
        const min = 72;
        const cols = Math.max(1, Math.floor((inner + gap) / (min + gap)));
        const cell = Math.floor((inner - (cols - 1) * gap) / cols);
        grid.style.setProperty('--npp-sd-cell', cell + 'px');
        grid.dataset.cols = String(cols);
    }

    function renderPageGrid() {
        const grid = document.querySelector('#nppShortcutDockPage .npp-sd-page-grid');
        if (!grid) return;

        const folder = pageActiveFolder === 'root' ? null : pageFolderById(pageActiveFolder);
        if (pageActiveFolder !== 'root' && !folder) pageActiveFolder = 'root';
        const activeId = folder ? folder.id : 'root';

        const items = folder ? pageFolderItems(folder) : pageRootItems();
        const childFolders = childPageFolders(activeId);
        const frag = document.createDocumentFragment();

        if (!items.length && !childFolders.length) {
            const empty = document.createElement('span');
            empty.className = 'set_text set_text_desc';
            const aboveOrSide = window.matchMedia('(max-width: 720px)').matches
                ? T('@shortcutDock:empty-folder-above')
                : T('@shortcutDock:empty-folder-left');
            empty.textContent = folder ? aboveOrSide : T('@shortcutDock:empty-root');
            frag.appendChild(empty);
        }

        childFolders.forEach(function (child) {
            frag.appendChild(createFolderTile(child));
        });

        items.forEach(function (item) {
            frag.appendChild(createItemNode(item, { pageItem: true }));
        });
        grid.replaceChildren(frag);
        layoutPageGrid();
    }

    /* 数据同步 */

    // 首次启动把 quick_list 转成扩展坞项，之后只增量补充
    function ensureModel(records) {
        const isEmpty = !config.items.length && !config.pins.length;

        if (isEmpty) {
            const items = [];
            Object.keys(records)
                .filter(function (key) { return records[key] && records[key].url; })
                .sort(function (a, b) {
                    const na = Number(a);
                    const nb = Number(b);
                    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
                    return String(a).localeCompare(String(b));
                })
                .forEach(function (key) {
                    const record = records[key];
                    const item = {
                        id: newItemId(),
                        title: record.title || record.url,
                        url: record.url,
                        sourceKey: key
                    };
                    if (record.icon) item.icon = record.icon;
                    items.push(item);
                });

            config.items = items;
            config.pageOrder = items.map(function (item) { return item.id; });
            if (!config.initial) {
                config.initial = { items: JSON.parse(JSON.stringify(items)), pageOrder: items.map(function (item) { return item.id; }) };
            }
            config.pageFolders = [];
            config.pins = [];
            config.barFolders = [];
            config.barOrder = [];
        } else {
            const known = {};
            config.items.forEach(function (item) { if (item.sourceKey) known[item.sourceKey] = true; });
            Object.keys(records).forEach(function (key) {
                const record = records[key];
                if (!record || !record.url || known[key]) return;
                const item = { id: newItemId(), title: record.title || record.url, url: record.url, sourceKey: key };
                if (record.icon) item.icon = record.icon;
                config.items.push(item);
                config.pageOrder.push(item.id);
            });
        }

        config.pins = config.pins.filter(function (pin) { return itemById(pin.itemId); });
        config.barFolders.forEach(function (folder) {
            folder.pins = (folder.pins || []).filter(function (id) { return pinById(id); });
        });
        config.pageFolders.forEach(function (folder) {
            folder.items = (folder.items || []).filter(function (id) { return itemById(id); });
        });
        config.barOrder = config.barOrder.filter(function (entry) { return pinById(entry) || barFolderById(entry); });
        config.pageOrder = config.pageOrder.filter(function (entry) { return itemById(entry) || pageFolderById(entry); });

        saveConfig();
    }

    async function refreshItems() {
        let list = null;
        try {
            list = await readQuickList();
        } catch (error) {
            warn('读取捷径列表失败', error);
        }

        const records = list || {};
        quickRecords = records;
        ensureModel(records);

        items = config.pins.map(function (pin) { return itemById(pin.itemId); }).filter(Boolean);

        renderDock();
        if (dockPage) renderPageGrid();
        warmIconCache();

    }

    const scheduleItemsRefresh = debounce(function () {
        refreshItems().catch(function (error) { warn('刷新条目失败', error); });
    }, 300);

    function initSync() {
        // 起始页/扩展改动捷径后跟进
        try {
            const pageChannel = new BroadcastChannel(PAGE_CHANNEL);
            pageChannel.addEventListener('message', scheduleItemsRefresh);
        } catch (error) { /* 忽略 */ }

        // 多标签页同步
        const own = getChannel();
        if (own) {
            own.addEventListener('message', function (event) {
                if (!event.data || event.data.type !== 'config-changed') return;
                loadConfig().then(function () {
                    applyVisibility();
                    applyAppearance();
                    refreshItems().catch(function (error) { warn('同步刷新失败', error); });
                }).catch(function (error) { warn('同步配置失败', error); });
            });
        }

        // 主程序重新渲染捷径时重读
        (function observeQuickList(attempts) {
            const target = document.querySelector('.quick-all');
            if (target) {
                const observer = new MutationObserver(scheduleItemsRefresh);
                observer.observe(target, { childList: true });
                return;
            }
            if (attempts <= 0) return;
            setTimeout(function () { observeQuickList(attempts - 1); }, 500);
        })(40);

        window.addEventListener('focus', scheduleItemsRefresh);
        document.addEventListener('mousemove', onAutoHideMove);
    }

    /* 快捷键 */

    const MODIFIER_CODES = ['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight'];

    const RESERVED_COMBOS = [
        { ctrl: true, alt: false, shift: false, meta: false, code: 'KeyW' },
        { ctrl: true, alt: false, shift: false, meta: false, code: 'KeyT' },
        { ctrl: true, alt: false, shift: false, meta: false, code: 'KeyN' },
        { ctrl: true, alt: false, shift: true, meta: false, code: 'KeyW' },
        { ctrl: true, alt: false, shift: true, meta: false, code: 'KeyT' },
        { ctrl: true, alt: false, shift: true, meta: false, code: 'KeyN' },
        { ctrl: true, alt: false, shift: false, meta: false, code: 'Tab' },
        { ctrl: true, alt: false, shift: true, meta: false, code: 'Tab' },
        { ctrl: false, alt: false, shift: false, meta: false, code: 'F11' },
        { ctrl: false, alt: false, shift: false, meta: false, code: 'F12' }
    ];

    function comboEquals(a, b) {
        return !!a && !!b
            && a.code === b.code
            && !!a.ctrl === !!b.ctrl
            && !!a.alt === !!b.alt
            && !!a.shift === !!b.shift
            && !!a.meta === !!b.meta;
    }

    function eventMatchesHotkey(event, hotkey) {
        return !!hotkey && !!hotkey.code
            && event.code === hotkey.code
            && event.ctrlKey === !!hotkey.ctrl
            && event.altKey === !!hotkey.alt
            && event.shiftKey === !!hotkey.shift
            && event.metaKey === !!hotkey.meta;
    }

    const IS_MAC = /Mac|iPhone|iPad/i.test(navigator.platform || '');

    function keyLabel(code) {
        if (!code) return '?';
        if (code.indexOf('Key') === 0) return code.slice(3);
        if (code.indexOf('Digit') === 0) return code.slice(5);
        if (code.indexOf('Numpad') === 0) return 'Num ' + code.slice(6);
        const map = {
            Space: 'Space', Escape: 'Esc', Minus: '-', Equal: '=', BracketLeft: '[',
            BracketRight: ']', Backslash: '\\', Semicolon: ';', Quote: "'", Comma: ',',
            Period: '.', Slash: '/', Backquote: '`', ArrowUp: '↑', ArrowDown: '↓',
            ArrowLeft: '←', ArrowRight: '→', Enter: 'Enter', Tab: 'Tab'
        };
        return map[code] || code;
    }

    function formatHotkey(hotkey) {
        const parts = [];
        if (hotkey.ctrl) parts.push(IS_MAC ? '⌃' : 'Ctrl');
        if (hotkey.alt) parts.push(IS_MAC ? '⌥' : 'Alt');
        if (hotkey.shift) parts.push(IS_MAC ? '⇧' : 'Shift');
        if (hotkey.meta) parts.push(IS_MAC ? '⌘' : 'Win');
        parts.push(keyLabel(hotkey.code));
        return parts.join(' + ');
    }

    let recordingAction = null;

    function onGlobalKeydown(event) {
        if (recordingAction) return;
        if (event.isComposing) return;

        const hotkeys = config.hotkeys;

        if (eventMatchesHotkey(event, hotkeys.open)) {
            event.preventDefault();
            event.stopPropagation();
            setBarVisible(true);
            return;
        }

        if (eventMatchesHotkey(event, hotkeys.close)) {
            event.preventDefault();
            event.stopPropagation();
            setBarVisible(false);
            return;
        }

        if (eventMatchesHotkey(event, hotkeys.up)) {
            event.preventDefault();
            event.stopPropagation();
            if (dockPage && pageActiveFolder !== 'root') {
                const folder = pageFolderById(pageActiveFolder);
                selectPageFolder(folder ? (folder.parentId || 'root') : 'root');
            }
            return;
        }

        if (eventMatchesHotkey(event, hotkeys.settings)) {
            event.preventDefault();
            event.stopPropagation();
            openPluginSettings();
        }
    }

    function setBarVisible(visible) {
        config.barVisible = !!visible;
        if (visible) peeked = true;
        saveConfig();
        applyVisibility();
        syncSettingsSwitches();
        refreshDockScrollState(340);
    }

    function validateCombo(combo, action) {
        if (!combo.ctrl && !combo.alt && !combo.meta) {
            return '@shortcutDock:hotkey-err-modifier';
        }

        for (let i = 0; i < RESERVED_COMBOS.length; i++) {
            if (comboEquals(combo, RESERVED_COMBOS[i])) {
                return '@shortcutDock:hotkey-err-reserved';
            }
        }

        const hotkeys = config.hotkeys;
        const others = Object.keys(hotkeys).filter(function (key) { return key !== action; });
        for (let i = 0; i < others.length; i++) {
            if (comboEquals(combo, hotkeys[others[i]])) {
                return '@shortcutDock:hotkey-err-duplicate';
            }
        }

        return null;
    }

    function startRecording(action, button) {
        stopRecording();
        recordingAction = action;
        if (button) {
            button.classList.add('recording');
            button.textContent = T('@shortcutDock:record-prompt');
        }
        window.addEventListener('keydown', onRecordKeydown, true);
    }

    function onRecordKeydown(event) {
        if (!recordingAction) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        if (MODIFIER_CODES.indexOf(event.code) !== -1) return;

        if (event.code === 'Escape') {
            stopRecording();
            syncHotkeyButtons();
            return;
        }

        const combo = {
            ctrl: event.ctrlKey,
            alt: event.altKey,
            shift: event.shiftKey,
            meta: event.metaKey,
            code: event.code
        };

        const problem = validateCombo(combo, recordingAction);
        if (problem) {
            showToast(problem, true);
            return;
        }

        config.hotkeys[recordingAction] = combo;
        saveConfig();
        stopRecording();
        syncHotkeyButtons();
    }

    function stopRecording() {
        recordingAction = null;
        window.removeEventListener('keydown', onRecordKeydown, true);
    }

    /* 打开插件设置 */

    function fireClick(el) {
        try {
            ['pointerdown', 'mousedown', 'pointerup', 'mouseup'].forEach(function (type) {
                const isPointer = type.indexOf('pointer') === 0;
                const Ctor = isPointer && window.PointerEvent ? window.PointerEvent : MouseEvent;
                const init = isPointer
                    ? { bubbles: true, cancelable: true, view: window, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0 }
                    : { bubbles: true, cancelable: true, view: window, button: 0 };
                el.dispatchEvent(new Ctor(type, init));
            });
            el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }));
        } catch (error) {
            warn('合成点击失败', error);
        }
    }

    function openPluginSettings() {
        const entry = document.getElementById('entryPluginSettings');
        if (!entry) {
            showToast('@shortcutDock:settings-entry-missing');
            return;
        }

        fireClick(entry);

        let tries = 0;
        (function selectTab() {
            const tab = document.querySelector('#plugin_set .tab-items[data-value="' + NID + '"]');
            if (tab) {
                fireClick(tab);
                return;
            }
            if (++tries > 40) return;
            setTimeout(selectTab, 50);
        })();
    }

    /* 设置页 */

    let settingsRoot = null;

    /* 管理页 */

    let quickRecords = {};

    function keyList() {
        return Object.keys(quickRecords).sort(function (a, b) {
            const na = Number(a);
            const nb = Number(b);
            if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
            return String(a).localeCompare(String(b));
        });
    }

    function itemOfKey(key) {
        const record = quickRecords[key];
        if (!record || !record.url) return null;
        return { key: key, title: record.title || record.url, url: record.url, icon: record.icon || '' };
    }

    async function writeQuickRecords(records) {
        await idbPut(PAGE_IDB, PAGE_STORE, { id: QUICK_LIST_KEY, value: JSON.stringify(records) });
        try {
            const pageChannel = new BroadcastChannel(PAGE_CHANNEL);
            pageChannel.postMessage({ type: 'shortcut-added' });
            pageChannel.close();
        } catch (error) { /* 忽略 */ }
        await refreshItems();
    }

    async function purgeIconRecords() {
        const list = iconIndexList.slice();
        iconCache = {};
        iconIndexList = [];
        await Promise.all(list.map(function (originEnc) {
            return storeDelete(iconRecordKey(originEnc)).catch(function () { /* 忽略 */ });
        }));
        try { await storeDelete(ICON_INDEX_KEY); } catch (error) { /* 忽略 */ }
    }

    async function clearIconCache() {
        await purgeIconRecords();
        renderDock();
        showToast(T('@shortcutDock:toast-icon-cleared'));
    }

    async function refreshAllIcons() {
        await purgeIconRecords();
        renderDock();
        warmIconCache();
        showToast(T('@shortcutDock:toast-icon-refetch'));
    }

    async function resetPluginData() {
        // 回到初始化状态，优先用初始快照
        config.pins = [];
        config.barFolders = [];
        config.barOrder = [];
        config.pageFolders = [];
        config.iconOverrides = {};
        config.iconModes = {};
        iconCache = {};

        const init = config.initial;
        if (init && Array.isArray(init.items) && init.items.length) {
            config.items = JSON.parse(JSON.stringify(init.items));
            config.pageOrder = init.pageOrder.slice();
            saveConfig();
            await purgeIconRecords();
            await refreshItems();
        } else {
            // 无快照时按照现有的 quicklist 创建快照
            config.items = [];
            config.pageOrder = [];
            saveConfig();
            await purgeIconRecords();
            await refreshItems();
            if (config.items.length && !config.initial) {
                config.initial = { items: JSON.parse(JSON.stringify(config.items)), pageOrder: config.pageOrder.slice() };
            }
        }

        // 应用后广播
        try { await storePut(CONFIG_KEY, config); } catch (error) { /* 忽略 */ }
        broadcast({ type: 'config-changed' });
        if (dockPage) renderPageGrid();
    }

    // 设置
    // 标题 + 说明，控件在右侧
    function settingRow(title, desc) {
        const row = document.createElement('div');
        row.className = 'npp-sd-set-row';
        const text = document.createElement('div');
        text.className = 'npp-sd-set-text';
        const label = document.createElement('span');
        label.className = 'set_text';
        label.setAttribute('translate', 'none');
        label.textContent = title;
        text.appendChild(label);
        if (desc) {
            const note = document.createElement('span');
            note.className = 'npp-sd-set-desc';
            note.textContent = desc;
            text.appendChild(note);
        }
        row.appendChild(text);
        return row;
    }

    function syncHotkeyButtons() {
        if (!settingsRoot || !settingsRoot.isConnected) return;
        ['open', 'close', 'settings', 'up'].forEach(function (action) {
            const button = settingsRoot.querySelector('.npp-sd-hotkey-btn[data-action="' + action + '"]');
            if (button) {
                button.textContent = formatHotkey(config.hotkeys[action]);
                button.classList.remove('recording');
            }
        });
    }

    function buildHotkeyRow(action, labelText) {
        const row = settingRow(labelText, '');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'panel_btn npp-sd-hotkey-btn';
        button.dataset.action = action;
        button.textContent = formatHotkey(config.hotkeys[action]);
        button.addEventListener('click', function () {
            startRecording(action, button);
        });
        row.appendChild(button);
        return row;
    }

    const syncableSwitches = [];

    function syncSettingsSwitches() {
        syncableSwitches.forEach(function (entry) {
            if (!entry.toggle.isConnected) return;
            entry.toggle.classList.toggle('on', !!entry.get());
        });
    }

    function buildSwitchRow(title, desc, checked, onChange, getter) {
        const row = settingRow(title, desc);
        const toggle = document.createElement('div');
        toggle.className = 'switch' + (checked ? ' on' : '');
        toggle.addEventListener('click', function () {
            const next = !toggle.classList.contains('on');
            toggle.classList.toggle('on', next);
            onChange(next);
        });
        row.appendChild(toggle);
        if (typeof getter === 'function') {
            syncableSwitches.push({ toggle: toggle, get: getter });
        }
        return row;
    }

    function sectionTitle(text) {
        const wrap = document.createElement('span');
        wrap.className = 'set_text';
        const big = document.createElement('big');
        big.setAttribute('translate', 'none');
        big.textContent = text;
        wrap.appendChild(big);
        return wrap;
    }

    /* 设置区 */

    function nativeRow(options) {
        const row = document.createElement('div');
        row.className = 'panel_list_row' + (options.cls ? ' ' + options.cls : '');
        if (options.key !== undefined) row.dataset.key = options.key;

        const num = document.createElement('div');
        num.className = 'panel_list_num';
        if (options.numIcon) {
            const icon = document.createElement('i');
            icon.className = 'iconfont ' + options.numIcon;
            num.appendChild(icon);
        } else {
            num.textContent = options.numText || '';
        }
        row.appendChild(num);

        const name = document.createElement('div');
        name.className = 'panel_list_name';
        name.setAttribute('translate', 'none');
        name.textContent = options.name || '';
        row.appendChild(name);

        const actions = document.createElement('div');
        actions.className = 'panel_list_actions';
        (options.actions || []).forEach(function (action) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'panel_row_btn radius-' + action.radius;
            button.title = action.title || '';
            const icon = document.createElement('span');
            icon.className = 'iconfont ' + action.icon;
            button.appendChild(icon);
            button.addEventListener('click', action.onClick);
            actions.appendChild(button);
        });
        row.appendChild(actions);
        return row;
    }

    function card() {
        const box = document.createElement('div');
        box.className = 'set_tip set_tip_new';
        return box;
    }

    function cardOf(node) {
        const box = card();
        box.appendChild(node);
        return box;
    }

    function choiceRow(options, current, onPick) {
        const row = document.createElement('div');
        row.className = 'from_items button npp-sd-choices';
        options.forEach(function (option) {
            const button = document.createElement('div');
            button.className = 'panel_btn' + (String(option.value) === String(current) ? ' npp-sd-choice-on' : '');
            const text = document.createElement('span');
            text.className = 'set_quick_text';
            text.setAttribute('translate', 'none');
            text.textContent = option.label;
            button.appendChild(text);
            button.addEventListener('click', function () {
                Array.prototype.forEach.call(row.children, function (el) { el.classList.remove('npp-sd-choice-on'); });
                button.classList.add('npp-sd-choice-on');
                onPick(String(option.value));
            });
            row.appendChild(button);
        });
        return row;
    }

    let iconEditKey = '';

    // 上栏列表
    /* 导入 / 导出 */

    function downloadText(filename, text, mime) {
        const blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    function exportPayload() {
        return {
            app: 'shortcutDock',
            version: VERSION,
            exportedAt: new Date().toISOString(),
            config: JSON.parse(JSON.stringify({
                barVisible: config.barVisible,
                autoHide: config.autoHide,
                takeover: config.takeover,
                appearance: config.appearance,
                autoHideInstant: config.autoHideInstant,
                hotkeys: config.hotkeys,
                iconOverrides: config.iconOverrides || {},
                iconModes: config.iconModes || {},
                items: config.items,
                pins: config.pins,
                barFolders: config.barFolders,
                barOrder: config.barOrder,
                pageFolders: config.pageFolders,
                pageOrder: config.pageOrder
            })),
            quickList: quickRecords
        };
    }

    function exportConfigJson() {
        const text = JSON.stringify(exportPayload(), null, 2);
        window.__nppSdLastExport = text;
        downloadText('shortcutDock-' + new Date().toISOString().slice(0, 10) + '.json', text, 'application/json;charset=utf-8');

    }

    function applyImportedConfig(next) {
        if (!next || typeof next !== 'object') return;
        ['items', 'pins', 'barFolders', 'barOrder', 'pageFolders', 'pageOrder'].forEach(function (field) {
            if (Array.isArray(next[field])) config[field] = next[field];
        });
        if (next.appearance && typeof next.appearance === 'object') {
            config.appearance = normalizeConfig({ appearance: next.appearance }).appearance;
        }
        if (typeof next.barVisible === 'boolean') config.barVisible = next.barVisible;
        if (typeof next.autoHideInstant === 'boolean') config.autoHideInstant = next.autoHideInstant;
        if (next.iconOverrides && typeof next.iconOverrides === 'object') {
            config.iconOverrides = {};
            Object.keys(next.iconOverrides).forEach(function (key) {
                const value = next.iconOverrides[key];
                if (typeof value === 'string' && value) config.iconOverrides[key] = value;
            });
        }
        if (next.iconModes && typeof next.iconModes === 'object') {
            config.iconModes = {};
            Object.keys(next.iconModes).forEach(function (key) {
                const mode = next.iconModes[key];
                if (mode === 'auto' || mode === 'custom' || mode === 'letter') config.iconModes[key] = mode;
            });
        }
        if (typeof next.autoHide === 'boolean') config.autoHide = next.autoHide;
        if (typeof next.takeover === 'boolean') config.takeover = next.takeover;
        if (next.hotkeys && typeof next.hotkeys === 'object') {
            const defaults = defaultHotkeys();
            config.hotkeys = {
                open: normalizeHotkey(next.hotkeys.open, defaults.open),
                close: normalizeHotkey(next.hotkeys.close, defaults.close),
                settings: normalizeHotkey(next.hotkeys.settings, defaults.settings),
                up: normalizeHotkey(next.hotkeys.up, defaults.up)
            };
        }
    }

    async function importPayload(text) {
        const payload = JSON.parse(text);
        if (payload && payload.config) applyImportedConfig(payload.config);

        if (payload && payload.quickList && typeof payload.quickList === 'object') {
            await writeQuickRecords(payload.quickList);
        } else {
            saveConfig();
            renderDock();
            if (dockPage) renderPageGrid();
            renderSettings();
        }
        showToast(T('@shortcutDock:toast-config-imported'));

    }

    // 解析 HTML 书签
    function parseBookmarksHtmlTree(html) {
        const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
        function parseDL(dl) {
            const nodes = [];
            let lastFolder = null;
            Array.prototype.forEach.call(dl.children, function (el) {
                const tag = el.tagName;
                if (tag === 'DT') {
                    const h3 = el.querySelector(':scope > H3');
                    const a = el.querySelector(':scope > A');
                    const sub = el.querySelector(':scope > DL');
                    if (h3) {
                        lastFolder = { title: (h3.textContent || '').trim(), children: [] };
                        nodes.push(lastFolder);
                        if (sub) { lastFolder.children = parseDL(sub); lastFolder = null; }
                    } else if (a) {
                        nodes.push({ title: (a.textContent || '').trim(), url: a.getAttribute('href') });
                    }
                    return;
                }
                if (tag === 'DL' && lastFolder) {
                    lastFolder.children = parseDL(el);
                    lastFolder = null;
                }
            });
            return nodes;
        }
        const rootDL = doc.querySelector('DL');
        return rootDL ? parseDL(rootDL) : [];
    }

    function importBookmarksHtml(html) {
        const tree = parseBookmarksHtmlTree(html);
        const countNodes = function (nodes) {
            let n = 0;
            (nodes || []).forEach(function (node) {
                if (node.url && /^https?:\/\//i.test(node.url)) n += 1;
                if (node.children) n += countNodes(node.children);
            });
            return n;
        };
        if (!countNodes(tree)) {
            showToast(T('@shortcutDock:toast-bookmark-none'), true);
            return Promise.resolve(0);
        }
        importBookmarkNodes(tree);
        return Promise.resolve(countNodes(tree));
    }

    function exportBookmarksHtml() {
        const NL = String.fromCharCode(10);
        const rows = config.items.map(function (item) {
            const title = String(item.title || item.url).replace(/</g, '&lt;').replace(/"/g, '&quot;');
            const url = String(item.url || '').replace(/"/g, '&quot;');
            return '        <DT><A HREF="' + url + '">' + title + '</A>';
        }).join(NL);
        downloadText('shortcutDock-bookmarks.html',
            '<!DOCTYPE NETSCAPE-Bookmark-file-1>' + NL
            + '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">' + NL
            + '<TITLE>Bookmarks</TITLE>' + NL
            + '<H1>Bookmarks</H1>' + NL
            + '<DL><p>' + NL + rows + NL + '</DL><p>',
            'text/html;charset=utf-8');

    }

    function pickLocalFile(accept, onText) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.style.display = 'none';
        document.body.appendChild(input);
        input.addEventListener('change', function () {
            const file = input.files && input.files[0];
            if (!file) { input.remove(); return; }
            const reader = new FileReader();
            reader.onload = function () {
                try {
                    onText(String(reader.result || ''));
                } catch (error) {
                    showToast(T('@shortcutDock:toast-import-failed') + (error && error.message ? error.message : error), true);
                }
                input.remove();
            };
            reader.readAsText(file);
        });
        input.click();
    }

    function importChromeBookmarkTree(tree) {
        const roots = Array.isArray(tree) ? tree : [tree];
        importBookmarkNodes(roots.map(function (root) {
            return root && root.children ? { title: root.title, children: root.children } : root;
        }));
    }

    function importBookmarkNodes(rootNodes) {
        let added = 0;
        let folders = 0;

        const addItem = function (node, parentId) {
            const url = node.url;
            if (!/^https?:\/\//i.test(url)) return;
            const parent = parentId === 'root' ? null : pageFolderById(parentId);

            // URL 已存在时不新建，直接把它移动到对应文件夹内
            let item = null;
            for (let i = 0; i < config.items.length; i++) {
                if (config.items[i].url === url) { item = config.items[i]; break; }
            }
            if (!item) {
                item = { id: newItemId(), title: node.title || url, url: url };
                config.items.push(item);
            }

            // 清掉旧位置，再归移动
            config.pageOrder = config.pageOrder.filter(function (id) { return id !== item.id; });
            config.pageFolders.forEach(function (f) {
                f.items = f.items.filter(function (id) { return id !== item.id; });
            });
            if (parent) parent.items.push(item.id);
            else config.pageOrder.push(item.id);
            added += 1;
        };

        const walk = function (nodes, parentId) {
            (nodes || []).forEach(function (node) {
                if (node.url) {
                    addItem(node, parentId);
                    return;
                }
                if (!node.children) return;
                const folder = {
                    id: newPageFolderId(),
                    name: node.title || '文件夹',
                    items: [],
                    parentId: parentId,
                    pinned: false
                };
                config.pageFolders.push(folder);
                folders += 1;
                walk(node.children, folder.id);
            });
        };

        (rootNodes || []).forEach(function (root) {
            if (!root) return;
            if (root.children) walk(root.children, 'root');
            else if (root.url) addItem(root, 'root');
        });

        saveConfig();
        renderDock();
        if (dockPage) { renderPageRail(); renderPageGrid(); }
        refreshItems().catch(function () { /* 忽略 */ });
        showToast(T('@shortcutDock:toast-imported') + ' ' + added + ' ' + T('@shortcutDock:toast-imported-links') + '、' + folders + ' ' + T('@shortcutDock:toast-imported-folders'));
    }

    function importBookmarksFlow() {
        const api = window.chrome;
        if (api && api.bookmarks && api.permissions) {
            api.permissions.request({ permissions: ['bookmarks'] }, function (granted) {
                if (!granted) { showToast(T('@shortcutDock:toast-bookmark-denied'), true); return; }
                api.bookmarks.getTree(function (tree) {
                    confirmToast(T('@shortcutDock:confirm-import-bookmarks'), function () {
                        importChromeBookmarkTree(tree);
                    });
                });
            });
            return;
        }
        pickLocalFile('.html,.htm,text/html', function (text) {
            confirmToast(T('@shortcutDock:confirm-import-html'), function () {
                importBookmarksHtml(text).catch(function (error) {
                    showToast(T('@shortcutDock:toast-import-failed') + (error && error.message ? error.message : error), true);
                });
            });
        });
    }

    function buildImportExportCard(wrap) {
        const group = document.createElement('div');
        group.className = 'npp-sd-set-group';
        group.appendChild(sectionTitle(T('@shortcutDock:card-import-export')));

        const bar = document.createElement('div');
        bar.className = 'npp-sd-action-row npp-sd-wrap';

        const mkButton = function (id, text, onClick) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'panel_btn';
            if (id) button.id = id;
            button.textContent = text;
            button.addEventListener('click', onClick);
            return button;
        };

        bar.appendChild(mkButton('nppSdExportConfig', T('@shortcutDock:btn-export-config'), exportConfigJson));
        bar.appendChild(mkButton('nppSdExportBookmarks', T('@shortcutDock:btn-export-bookmarks'), exportBookmarksHtml));
        bar.appendChild(mkButton('nppSdImportConfig', T('@shortcutDock:btn-import-config'), function () {
            pickLocalFile('.json,application/json', function (text) {
                confirmToast(T('@shortcutDock:confirm-import-config'), function () {
                    importPayload(text).catch(function (error) {
                        showToast(T('@shortcutDock:toast-import-failed') + (error && error.message ? error.message : error), true);
                    });
                });
            });
        }));
        bar.appendChild(mkButton('nppSdImportBookmarks', T('@shortcutDock:btn-import-bookmarks'), importBookmarksFlow));

        group.appendChild(bar);
        wrap.appendChild(cardOf(group));
    }

    function renderSettings() {
        if (!settingsRoot || !settingsRoot.isConnected) return;

        const wrap = document.createElement('div');
        wrap.id = 'shortcutDock_setting';

        // 底栏
        const barGroup = document.createElement('div');
        barGroup.className = 'npp-sd-set-group';
        barGroup.appendChild(sectionTitle(T('@shortcutDock:group-bar')));
        barGroup.appendChild(buildSwitchRow(T('@shortcutDock:row-show-bar'), T('@shortcutDock:row-show-bar-desc'), config.barVisible, function (next) {
            setBarVisible(next);
        }, function () { return config.barVisible; }));
        const instantWrap = document.createElement('div');
        instantWrap.className = 'npp-sd-subrow' + (config.autoHide ? ' open' : '');
        barGroup.appendChild(buildSwitchRow(T('@shortcutDock:row-autohide'), T('@shortcutDock:row-autohide-desc'), config.autoHide, function (next) {
            config.autoHide = !!next;
            peeked = false;
            saveConfig();
            applyVisibility();
            instantWrap.classList.toggle('open', !!next);
        }, function () { return config.autoHide; }));
        instantWrap.appendChild(buildSwitchRow(T('@shortcutDock:row-autohide-instant'), T('@shortcutDock:row-autohide-instant-desc'), config.autoHideInstant, function (next) {
            config.autoHideInstant = !!next;
            saveConfig();
        }, function () { return config.autoHideInstant; }));
        barGroup.appendChild(instantWrap);
        barGroup.appendChild(buildSwitchRow(T('@shortcutDock:row-takeover'), T('@shortcutDock:row-takeover-desc'), config.takeover, function (next) {
            config.takeover = !!next;
            saveConfig();
            applyTakeover();
        }, function () { return config.takeover; }));
        wrap.appendChild(cardOf(barGroup));

        // 外观
        const lookGroup = document.createElement('div');
        lookGroup.className = 'npp-sd-set-group';
        lookGroup.appendChild(sectionTitle(T('@shortcutDock:group-look')));
        const hoverWrap = document.createElement('div');
        hoverWrap.className = 'npp-sd-subrow' + (config.appearance.mode === 'icon' ? ' open' : '');
        lookGroup.appendChild(buildSwitchRow(T('@shortcutDock:row-icon-only'), T('@shortcutDock:row-icon-only-desc'), config.appearance.mode === 'icon', function (next) {
            config.appearance.mode = next ? 'icon' : 'label';
            saveConfig();
            applyAppearance();
            hoverWrap.classList.toggle('open', !!next);
            refreshDockScrollState(320);
        }, function () { return config.appearance.mode === 'icon'; }));
        hoverWrap.appendChild(buildSwitchRow(T('@shortcutDock:row-hover-label'), T('@shortcutDock:row-hover-label-desc'), config.appearance.hoverLabel !== false, function (next) {
            config.appearance.hoverLabel = !!next;
            saveConfig();
            applyAppearance();
            refreshDockScrollState(320);
        }, function () { return config.appearance.hoverLabel !== false; }));
        lookGroup.appendChild(hoverWrap);
        lookGroup.appendChild(settingRow(T('@shortcutDock:row-icon-size'), ''));
        lookGroup.appendChild(choiceRow(
            [20, 24, 28, 32].map(function (size) { return { value: size, label: size + ' px' }; }),
            config.appearance.iconSize || 24,
            function (value) {
                config.appearance.iconSize = Number(value) || 24;
                saveConfig();
                applyAppearance();
                refreshDockScrollState(260);
            }
        ));
        lookGroup.appendChild(settingRow(T('@shortcutDock:row-bar-height'), T('@shortcutDock:row-bar-height-desc')));
        lookGroup.appendChild(choiceRow(
            [48, 56, 64].map(function (size) { return { value: size, label: size + ' px' }; }),
            config.appearance.height || 56,
            function (value) {
                config.appearance.height = Number(value) || 56;
                saveConfig();
                applyAppearance();
                refreshDockScrollState(320);
            }
        ));
        lookGroup.appendChild(settingRow(T('@shortcutDock:row-opacity'), T('@shortcutDock:row-opacity-desc')));
        lookGroup.appendChild(choiceRow(
            [{ value: 1, label: '100%' }, { value: 0.85, label: '85%' }, { value: 0.7, label: '70%' }],
            config.appearance.opacity || 1,
            function (value) {
                config.appearance.opacity = Number(value) || 1;
                saveConfig();
                applyAppearance();
            }
        ));
        wrap.appendChild(cardOf(lookGroup));

        // 导入 / 导出
        buildImportExportCard(wrap);

        // 快捷键
        const hotkeyGroup = document.createElement('div');
        hotkeyGroup.className = 'npp-sd-set-group';
        hotkeyGroup.appendChild(sectionTitle(T('@shortcutDock:group-hotkeys')));
        hotkeyGroup.appendChild(buildHotkeyRow('open', T('@shortcutDock:row-show-bar')));
        hotkeyGroup.appendChild(buildHotkeyRow('close', T('@shortcutDock:row-hide-bar')));
        hotkeyGroup.appendChild(buildHotkeyRow('settings', T('@shortcutDock:row-open-settings')));
        hotkeyGroup.appendChild(buildHotkeyRow('up', T('@shortcutDock:row-up')));
        const resetRow = document.createElement('div');
        resetRow.className = 'npp-sd-set-row';
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'panel_btn';
        resetBtn.textContent = T('@shortcutDock:btn-restore-hotkeys');
        resetBtn.addEventListener('click', function () {
            config.hotkeys = defaultHotkeys();
            saveConfig();
            syncHotkeyButtons();
        });
        resetRow.appendChild(resetBtn);
        hotkeyGroup.appendChild(resetRow);
        wrap.appendChild(cardOf(hotkeyGroup));

        // 数据
        const dataGroup = document.createElement('div');
        dataGroup.className = 'npp-sd-set-group';
        dataGroup.appendChild(sectionTitle(T('@shortcutDock:group-data')));
        const dataBar = document.createElement('div');
        dataBar.className = 'npp-sd-action-row npp-sd-wrap';
        const refreshIcons = document.createElement('button');
        refreshIcons.type = 'button';
        refreshIcons.className = 'panel_btn';
        refreshIcons.textContent = T('@shortcutDock:btn-refresh-icons');
        refreshIcons.addEventListener('click', function () {
            refreshAllIcons();
        });
        dataBar.appendChild(refreshIcons);
        const clearIcons = document.createElement('button');
        clearIcons.type = 'button';
        clearIcons.className = 'panel_btn';
        clearIcons.textContent = T('@shortcutDock:btn-clear-icons');
        clearIcons.addEventListener('click', function () {
            clearIconCache();
        });
        dataBar.appendChild(clearIcons);
        const resetDataBtn = document.createElement('button');
        resetDataBtn.type = 'button';
        resetDataBtn.className = 'panel_btn';
        resetDataBtn.textContent = T('@shortcutDock:btn-reset');
        resetDataBtn.addEventListener('click', function () {
            confirmToast(T('@shortcutDock:confirm-reset'), function () {
                resetPluginData();
            });
        });
        dataBar.appendChild(resetDataBtn);
        dataGroup.appendChild(dataBar);
        wrap.appendChild(cardOf(dataGroup));

        settingsRoot.replaceChildren(wrap);
    }

    /* 捷径坞页面 + 时钟/Tab 接管 */

    let dockPage = null;

    function closeDockPage() {
        if (window.__nppSdDebugClose) console.trace("[shortcutDock] closeDockPage");
        if (!dockPage) return;
        const page = dockPage;
        dockPage = null;
        if (railCleanup) { railCleanup(); railCleanup = null; }
        if (pageGridObserver) { pageGridObserver.disconnect(); pageGridObserver = null; }
        applyBoxMode(false);
        applyHomeShift(false);
        applyFoldState(false, null, false);
        const toolAll = document.querySelector('.tool-all');
        if (toolAll) {
            toolAll.style.opacity = '1';
            toolAll.style.pointerEvents = 'unset';
        }
        page.classList.remove('active');
        page.classList.add('inactive');
        setTimeout(function () {
            if (page.parentNode) page.parentNode.removeChild(page);
        }, 320);
    }

    let boxFoldHandler = null;

    function applyBoxMode(open) {
        const content = document.getElementById('content');
        const fold = document.getElementById('fold');

        if (open) {
            if (content) {
                content.classList.add('box');
                content.dataset.nppSdBox = '1';
            }
            document.body.classList.add('open');
            document.body.classList.remove('close');

            if (fold) {
                fold.classList.remove('inactive');
                fold.classList.add('active');
            }
            return;
        }

        if (content) {
            content.classList.remove('box');
            delete content.dataset.nppSdBox;
        }
        document.body.classList.remove('open');
        document.body.classList.add('close');

        if (fold) {
            fold.classList.remove('active');
            fold.classList.add('inactive');
        }
    }

    // 折叠状态
    let pageFolded = false;

    function readStoredFold() {
        try { return localStorage.getItem('foldTime') === 'on'; } catch (error) { return false; }
    }

    function syncNativeFold() {
        const stored = readStoredFold();
        try {
            const root = document.querySelector('#app') || document.getElementById('app');
            const app = root && root.__vue_app__;
            const pinia = app && app.config && app.config.globalProperties && app.config.globalProperties.$pinia;
            const store = pinia && pinia._s && pinia._s.get('ui');
            if (store && typeof store.setFold === 'function' && !!store.foldOn !== stored) {
                store.setFold(stored);
            }
        } catch (error) { /* 忽略 */ }
    }

    function saveStoredFold(folded) {
        try { localStorage.setItem('foldTime', folded ? 'on' : 'off'); } catch (error) { /* 忽略 */ }
    }

    function applyFoldState(folded, page, persist) {
        pageFolded = !!folded;
        if (persist !== false) {
            saveStoredFold(pageFolded);
            syncNativeFold();
        }

        document.body.classList.toggle('npp-sd-folded', pageFolded);

        const toolAll = document.querySelector('.tool-all');
        if (toolAll) {
            toolAll.style.opacity = pageFolded ? '0' : '1';
            toolAll.style.pointerEvents = pageFolded ? 'none' : 'unset';
        }

        const target = page || dockPage;
        if (target) {
            target.classList.toggle('npp-sd-folded', pageFolded);
            target.style.marginTop = pageFolded ? '0px' : '180px';
            target.style.height = pageFolded ? '480px' : '400px';
            target.style.maxHeight = pageFolded ? '480px' : '400px';
        }

        const icon = document.getElementById('icon-fold');
        if (icon) icon.className = 'iconfont ' + (pageFolded ? 'icon-unfold' : 'icon-fold');
    }

    function applyHomeShift(open, page) {
        const toolAll = document.querySelector('.tool-all');
        const searchContainer = document.getElementById('search-form-container');

        if (open) {
            if (toolAll) {
                toolAll.style.transform = 'translateY(-190%)';
                toolAll.style.scale = '0.9';
            }
            if (searchContainer) searchContainer.style.transform = 'translateY(85%)';
            if (page) {
                page.style.marginTop = '0px';
                page.style.height = '480px';
                page.style.maxHeight = '480px';
            }
            return;
        }

        if (toolAll) {
            toolAll.style.transform = 'translateY(-120%)';
            toolAll.style.scale = '1';
        }
        if (searchContainer) searchContainer.style.transform = 'translateY(-70%)';
    }

    function openDockPage() {
        // 挂到 #content
        const host = document.getElementById('content') || document.getElementById('section');
        if (!host) return;
        closeDockPage();

        const page = document.createElement('div');
        page.id = 'nppShortcutDockPage';
        page.className = 'set npp-sd-page inactive';

        // 顶部标题
        const header = document.createElement('div');
        header.className = 'panel-header';
        const menuBtn = document.createElement('button');
        menuBtn.type = 'button';
        menuBtn.className = 'panel-menu';
        menuBtn.innerHTML = '<span class="iconfont icon-round-left"></span>';
        menuBtn.addEventListener('click', function (event) {
            event.stopPropagation();
            const body = page.querySelector('.panel-body');
            const collapsed = body.classList.toggle('menu-collapsed');
            menuBtn.innerHTML = '<span class="iconfont ' + (collapsed ? 'icon-round-right' : 'icon-round-left') + '"></span>';
        });
        const title = document.createElement('span');
        title.className = 'panel-title';
        title.setAttribute('translate', 'none');
        title.textContent = T('@shortcutDock:page-title');
        header.append(menuBtn, title);
        page.appendChild(header);

        // 左栏 文件夹列表（捷径坞为根文件夹）
        // 右侧 当前文件夹内的捷径
        const body = document.createElement('div');
        body.className = 'panel-body';

        const railWrap = document.createElement('div');
        railWrap.className = 'tabs-container vertical';
        const rail = document.createElement('div');
        rail.className = 'tabs mark-items';
        rail.id = 'nppSdRail';
        railWrap.appendChild(rail);

        const arrowLeft = document.createElement('div');
        arrowLeft.className = 'scroll-arrow-left';
        arrowLeft.innerHTML = '<i class="iconfont icon-right_button"></i>';
        const arrowRight = document.createElement('div');
        arrowRight.className = 'scroll-arrow-right';
        arrowRight.innerHTML = '<i class="iconfont icon-left_button"></i>';
        railWrap.append(arrowLeft, arrowRight);
        body.appendChild(railWrap);

        const contents = document.createElement('div');
        contents.className = 'contents productss';
        const main = document.createElement('div');
        main.className = 'mainConts set_blocks selected';
        const panelContent = document.createElement('div');
        panelContent.className = 'panelContent npp-sd-page-content';
        const grid = document.createElement('div');
        grid.className = 'quick-all npp-sd-page-grid';
        panelContent.appendChild(grid);
        main.appendChild(panelContent);
        contents.appendChild(main);
        body.appendChild(contents);
        page.appendChild(body);

        host.appendChild(page);
        dockPage = page;
        if (pageActiveFolder !== 'root' && !pageFolderById(pageActiveFolder)) pageActiveFolder = 'root';
        renderPageRail();
        renderPageGrid();
        setupRailScrolling();
        centerRailActive();
        watchPageGrid();

        // 扩展坞滚动
        page.addEventListener('wheel', function (event) {
            const scroller = page.querySelector('.panelContent.npp-sd-page-content');
            if (!scroller || scroller.scrollHeight <= scroller.clientHeight + 1) return;
            event.preventDefault();
            scroller.scrollTop += event.deltaY;
        }, { passive: false });
        applyBoxMode(true);
        applyHomeShift(true, page);
        syncNativeFold();
        applyFoldState(readStoredFold(), page);
        requestAnimationFrame(function () {
            if (!dockPage) return;
            page.classList.remove('inactive');
            page.classList.add('active');
        });
    }

    // 调试探针
    window.__nppSd = {
        getDrag: function () {
            return drag && {
                active: drag.active,
                scope: drag.scope,
                kind: drag.kind,
                pinId: drag.pinId,
                itemId: drag.itemId,
                folderId: drag.folderId,
                from: drag.from
            };
        },
        getLastExport: function () {
            return window.__nppSdLastExport || '';
        },
        importBookmarksHtml: function (html) {
            return importBookmarksHtml(html);
        }
    };

    function toggleDockPage() {
        if (dockPage) closeDockPage();
        else openDockPage();
    }

    function applyTakeover() {
        if (!config.takeover) closeDockPage();
    }

    // 拦截点击时钟
    function onTimeCapture(event) {
        if (!config.takeover) return;
        const target = event.target;
        if (!target || !target.closest) return;
        if (!target.closest('#time_text')) return;

        const content = document.getElementById('content');
        if (content && content.classList.contains('box')) return;

        event.preventDefault();
        event.stopPropagation();
        toggleDockPage();
    }

    let pendingOutside = false;

    function onPageOutside(event) {
        if (!dockPage) return;
        if (dockPage.contains(event.target)) return;
        if (event.target.closest && event.target.closest('#time_text')) return;
        // 点击后不关闭：菜单 / 浮层 / 底栏指示器
        if (event.target.closest && event.target.closest('.npp-sd-menu, .npp-sd-overlay, .npp-sd-dock-arrows, #fold')) return;
        closeDockPage();
    }

    function onPageKeydown(event) {
        if (event.key === 'Escape' && dockPage) closeDockPage();
    }

    function initTakeover() {
        document.addEventListener('click', onTimeCapture, true);
        document.addEventListener('click', function (event) {
            if (!dockPage) return;
            const fold = event.target.closest && event.target.closest('#fold');
            if (!fold) return;
            event.preventDefault();
            event.stopPropagation();
            applyFoldState(!pageFolded);
        }, true);
        document.addEventListener('pointerdown', onPageOutside, true);
        document.addEventListener('keydown', onPageKeydown, true);

        // 别的面板打开（box 出现） 自动关闭捷径坞
        (function observeBox(attempts) {
            const content = document.getElementById('content');
            if (!content) {
                if (attempts > 0) setTimeout(function () { observeBox(attempts - 1); }, 500);
                return;
            }
            const observer = new MutationObserver(function () {
                // 忽略捷径坞自己的 box
                if (content.classList.contains('box') && content.dataset.nppSdBox !== '1') closeDockPage();
            });
            observer.observe(content, { attributes: true, attributeFilter: ['class'] });

            // 设置 / 商店 / 插件设置打开时重新读一次 foldTime
            ['#set', '#storePage', '.plugin_set', '#mark'].forEach(function (selector) {
                const panel = document.querySelector(selector);
                if (!panel) return;
                new MutationObserver(function () {
                    if (panel.classList.contains('active')) syncNativeFold();
                }).observe(panel, { attributes: true, attributeFilter: ['class'] });
            });
        })(40);
    }

    function onSettingsReady() {
        const container = document.querySelector('.mainConts.pluginMainConts[data-value="' + NID + '"]');
        if (!container) return;
        settingsRoot = container;
        renderSettings();
    }

    /* 启动 */

    async function boot() {
        initTakeover();
        injectStyle();
        await ensureStore();
        await Promise.all([loadConfig(), loadIconCache()]);
        await refreshItems();
        ensureDock();
        applyVisibility();

        window.addEventListener('keydown', onGlobalKeydown, true);
        document.addEventListener('pluginSettingsTemplateReady', onSettingsReady);
        initSync();

        if (window.nppExt && typeof window.nppExt.onPermissionGranted === 'function') {
            window.nppExt.onPermissionGranted(function (permission) {
                if (permission === 'favicon') scheduleItemsRefresh();
            });
        }

        log('ready', VERSION);
    }

    async function loadIconCache() {
        try {
            // 加载 index
            const index = await storeGet(ICON_INDEX_KEY);
            if (Array.isArray(index)) {
                iconIndexList = index.filter(function (item) { return typeof item === 'string'; });
            }
            await Promise.all(iconIndexList.map(async function (originEnc) {
                try {
                    const record = await storeGet(iconRecordKey(originEnc));
                    const origin = decodeURIComponent(originEnc);
                    if (record && typeof record === 'object') iconCache[origin] = record;
                    else iconIndexList = iconIndexList.filter(function (x) { return x !== originEnc; });
                } catch (error) { /* 忽略单条失败 */ }
            }));
            iconIndexSave();
        } catch (error) {
            warn('读取图标缓存失败', error);
        }
    }

    (function start(attempts) {
        if (document.getElementById('section')) {
            boot().catch(function (error) {
                console.error('[shortcutDock] 初始化失败:', error);
            });
            return;
        }
        if (attempts <= 0) return;
        setTimeout(function () { start(attempts - 1); }, 300);
    })(50);
})();
