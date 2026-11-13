// ==Npplication==
// @name    捷径坞 - 繁體中文
// @id    1794587581719_7eb23b41-5b98-4fcc-8163-0e201bd8f0d2
// @version    1.0.0
// @type    translate
// @translates    zh-TW
// @description    捷径坞 插件的繁體中文翻譯
// @author    Nitai
// @setting    false
// ==/Npplication==

(function () {
    'use strict';

    const translateEntries = {
        "@shortcutDock:btn-clear-icons": "清除圖示快取",
        "@shortcutDock:btn-export-bookmarks": "匯出書籤",
        "@shortcutDock:btn-export-config": "匯出設定",
        "@shortcutDock:btn-import-bookmarks": "匯入書籤",
        "@shortcutDock:btn-import-config": "匯入設定",
        "@shortcutDock:btn-refresh-icons": "重新整理所有圖示",
        "@shortcutDock:btn-reset": "重設外掛資料",
        "@shortcutDock:btn-restore-hotkeys": "還原預設快速鍵",
        "@shortcutDock:card-import-export": "匯入 / 匯出",
        "@shortcutDock:confirm-import-bookmarks": "已讀取瀏覽器書籤，要附加到捷徑列表嗎？",
        "@shortcutDock:confirm-import-config": "已選擇設定檔，匯入會覆蓋目前設定，要繼續嗎？",
        "@shortcutDock:confirm-import-html": "已讀取書籤檔案，要附加到捷徑列表嗎？",
        "@shortcutDock:confirm-reset": "確認重設（回到外掛安裝前的狀態）？",
        "@shortcutDock:dialog-cancel": "取消",
        "@shortcutDock:dialog-ok": "確定",
        "@shortcutDock:empty-folder-above": "這個資料夾還是空的，把捷徑拖到上方的資料夾即可",
        "@shortcutDock:empty-folder-left": "這個資料夾還是空的，把捷徑拖到左側的資料夾即可",
        "@shortcutDock:empty-root": "主程式裡還沒有捷徑。",
        "@shortcutDock:empty-tile": "空資料夾",
        "@shortcutDock:folder-default": "資料夾",
        "@shortcutDock:group-bar": "底欄",
        "@shortcutDock:group-data": "資料",
        "@shortcutDock:group-hotkeys": "快速鍵",
        "@shortcutDock:group-look": "外觀",
        "@shortcutDock:hotkey-err-duplicate": "和已設定的快速鍵重複",
        "@shortcutDock:hotkey-err-modifier": "快速鍵至少需包含 Ctrl / Alt / Shift / Win 之一",
        "@shortcutDock:hotkey-err-reserved": "無效，該組合已被佔用",
        "@shortcutDock:icon-auto": "自動取得",
        "@shortcutDock:icon-letter": "字母圖示",
        "@shortcutDock:icon-remove-upload": "刪除上傳的圖示",
        "@shortcutDock:icon-upload": "上傳圖示",
        "@shortcutDock:menu-delete": "刪除",
        "@shortcutDock:menu-delete-confirm": "確認刪除？",
        "@shortcutDock:menu-dissolve": "解散",
        "@shortcutDock:menu-dissolve-confirm": "確認解散？（不刪除）",
        "@shortcutDock:menu-edit": "編輯",
        "@shortcutDock:menu-new-folder": "新增資料夾",
        "@shortcutDock:menu-pin": "固定到底欄",
        "@shortcutDock:menu-pin-sidebar": "固定到側邊欄",
        "@shortcutDock:menu-rename": "重新命名",
        "@shortcutDock:menu-save": "儲存",
        "@shortcutDock:menu-unpin": "取消固定",
        "@shortcutDock:menu-unpin-confirm": "確認取消？",
        "@shortcutDock:menu-unpin-sidebar": "取消固定",
        "@shortcutDock:page-title": "捷徑塢",
        "@shortcutDock:record-prompt": "按下組合鍵…",
        "@shortcutDock:refresh-failed": "重新整理失敗",
        "@shortcutDock:row-autohide": "自動收合",
        "@shortcutDock:row-autohide-desc": "指標離開底部時隱藏，靠近螢幕底邊再出現",
        "@shortcutDock:row-autohide-instant": "移出即關閉",
        "@shortcutDock:row-autohide-instant-desc": "指標一離開底欄就收合；拖曳過程中不會關閉",
        "@shortcutDock:row-bar-height": "欄高",
        "@shortcutDock:row-bar-height-desc": "底欄的高度",
        "@shortcutDock:row-hide-bar": "隱藏底欄",
        "@shortcutDock:row-hover-label": "懸停展開名稱",
        "@shortcutDock:row-hover-label-desc": "滑鼠懸停的捷徑展開名稱",
        "@shortcutDock:row-icon-only": "僅圖示",
        "@shortcutDock:row-icon-only-desc": "欄上的捷徑不顯示名稱",
        "@shortcutDock:row-icon-size": "圖示尺寸",
        "@shortcutDock:row-opacity": "透明度",
        "@shortcutDock:row-opacity-desc": "底欄的透明度",
        "@shortcutDock:row-open-settings": "開啟 shortcutDock 設定頁",
        "@shortcutDock:row-show-bar": "顯示底欄",
        "@shortcutDock:row-show-bar-desc": "固定捷徑後出現；隱藏後可用快速鍵喚出",
        "@shortcutDock:row-takeover": "接管時鐘 / Tab",
        "@shortcutDock:row-takeover-desc": "點時鐘或按 Tab 開啟捷徑塢頁面（關閉則使用原捷徑面板）",
        "@shortcutDock:row-up": "返回上一層",
        "@shortcutDock:save-failed": "儲存失敗",
        "@shortcutDock:settings-entry-missing": "找不到設定入口",
        "@shortcutDock:toast-bookmark-denied": "未取得書籤權限",
        "@shortcutDock:toast-bookmark-none": "沒有解析到書籤連結",
        "@shortcutDock:toast-config-imported": "設定已匯入",
        "@shortcutDock:toast-icon-cleared": "圖示快取已清除",
        "@shortcutDock:toast-icon-refetch": "圖示快取已清除，正在重新取得",
        "@shortcutDock:toast-import-failed": "匯入失敗：",
        "@shortcutDock:toast-imported": "已匯入",
        "@shortcutDock:toast-imported-folders": "個資料夾",
        "@shortcutDock:toast-imported-links": "筆書籤",
        "@shortcutDock:url-invalid": "網址需以 http 或 https 開頭"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
})();
