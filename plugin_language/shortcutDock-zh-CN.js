// ==Npplication==
// @name    捷径坞 - 简体中文
// @id    1794586786800_8bf96174-5d38-4800-aa83-50c8628f9191
// @version    1.0.0
// @type    translate
// @translates    zh-CN
// @description    捷径坞 插件的简体中文翻译
// @author    Nitai
// @setting    false
// ==/Npplication==

(function () {
    'use strict';

    const translateEntries = {
        "@shortcutDock:btn-clear-icons": "清空图标缓存",
        "@shortcutDock:btn-export-bookmarks": "导出书签",
        "@shortcutDock:btn-export-config": "导出配置",
        "@shortcutDock:btn-import-bookmarks": "导入书签",
        "@shortcutDock:btn-import-config": "导入配置",
        "@shortcutDock:btn-refresh-icons": "刷新所有图标",
        "@shortcutDock:btn-reset": "重置插件数据",
        "@shortcutDock:btn-restore-hotkeys": "恢复默认快捷键",
        "@shortcutDock:card-import-export": "导入 / 导出",
        "@shortcutDock:confirm-import-bookmarks": "已读取浏览器书签，追加到捷径列表？",
        "@shortcutDock:confirm-import-config": "已选择配置文件，导入会覆盖当前设置，继续？",
        "@shortcutDock:confirm-import-html": "已读取书签文件，追加到捷径列表？",
        "@shortcutDock:confirm-reset": "确认重置（恢复到插件安装前的状态）？",
        "@shortcutDock:dialog-cancel": "取消",
        "@shortcutDock:dialog-ok": "确定",
        "@shortcutDock:empty-folder-above": "这个文件夹还是空的，把捷径拖到上方文件夹即可",
        "@shortcutDock:empty-folder-left": "这个文件夹还是空的，把捷径拖到左侧文件夹即可",
        "@shortcutDock:empty-root": "主程序里还没有捷径",
        "@shortcutDock:empty-tile": "空文件夹",
        "@shortcutDock:folder-default": "文件夹",
        "@shortcutDock:group-bar": "底栏",
        "@shortcutDock:group-data": "数据",
        "@shortcutDock:group-hotkeys": "快捷键",
        "@shortcutDock:group-look": "外观",
        "@shortcutDock:hotkey-err-duplicate": "和已设置的快捷键重复",
        "@shortcutDock:hotkey-err-modifier": "快捷键至少包含 Ctrl / Alt / Shift / Win 之一",
        "@shortcutDock:hotkey-err-reserved": "无效，该组合被占用",
        "@shortcutDock:icon-auto": "自动获取",
        "@shortcutDock:icon-letter": "字母图标",
        "@shortcutDock:icon-remove-upload": "删除上传的图标",
        "@shortcutDock:icon-upload": "上传图标",
        "@shortcutDock:menu-delete": "删除",
        "@shortcutDock:menu-delete-confirm": "确认删除？",
        "@shortcutDock:menu-dissolve": "解散",
        "@shortcutDock:menu-dissolve-confirm": "确认解散？（不删除）",
        "@shortcutDock:menu-edit": "编辑",
        "@shortcutDock:menu-new-folder": "新建文件夹",
        "@shortcutDock:menu-pin": "固定到底栏",
        "@shortcutDock:menu-pin-sidebar": "固定到边栏",
        "@shortcutDock:menu-rename": "重命名",
        "@shortcutDock:menu-save": "保存",
        "@shortcutDock:menu-unpin": "取消固定",
        "@shortcutDock:menu-unpin-confirm": "确认取消？",
        "@shortcutDock:menu-unpin-sidebar": "取消固定",
        "@shortcutDock:page-title": "捷径坞",
        "@shortcutDock:record-prompt": "按下组合键…",
        "@shortcutDock:refresh-failed": "刷新失败",
        "@shortcutDock:row-autohide": "自动收起",
        "@shortcutDock:row-autohide-desc": "鼠标离开底部时隐藏，靠近屏幕底边再出现",
        "@shortcutDock:row-autohide-instant": "移出即关闭",
        "@shortcutDock:row-autohide-instant-desc": "鼠标一离开底栏就收起；拖动过程中不会关闭",
        "@shortcutDock:row-bar-height": "栏高",
        "@shortcutDock:row-bar-height-desc": "底栏的高度",
        "@shortcutDock:row-hide-bar": "隐藏底栏",
        "@shortcutDock:row-hover-label": "悬停展开名称",
        "@shortcutDock:row-hover-label-desc": "鼠标悬停的捷径展开名称",
        "@shortcutDock:row-icon-only": "仅图标",
        "@shortcutDock:row-icon-only-desc": "栏上的捷径不显示名称",
        "@shortcutDock:row-icon-size": "图标尺寸",
        "@shortcutDock:row-opacity": "透明度",
        "@shortcutDock:row-opacity-desc": "底栏的透明度",
        "@shortcutDock:row-open-settings": "打开 shortcutDock 设置页",
        "@shortcutDock:row-show-bar": "显示底栏",
        "@shortcutDock:row-show-bar-desc": "固定捷径后出现；隐藏后可用快捷键唤出",
        "@shortcutDock:row-takeover": "接管时钟 / Tab",
        "@shortcutDock:row-takeover-desc": "点时钟或按 Tab 打开捷径坞页面（关闭则使用原捷径面板）",
        "@shortcutDock:row-up": "返回上一级",
        "@shortcutDock:save-failed": "保存失败",
        "@shortcutDock:settings-entry-missing": "未找到设置入口",
        "@shortcutDock:toast-bookmark-denied": "未获得书签权限",
        "@shortcutDock:toast-bookmark-none": "没有解析到书签链接",
        "@shortcutDock:toast-config-imported": "配置已导入",
        "@shortcutDock:toast-icon-cleared": "图标缓存已清空",
        "@shortcutDock:toast-icon-refetch": "图标缓存已清空，正在重新获取",
        "@shortcutDock:toast-import-failed": "导入失败：",
        "@shortcutDock:toast-imported": "已导入",
        "@shortcutDock:toast-imported-folders": "个文件夹",
        "@shortcutDock:toast-imported-links": "条书签",
        "@shortcutDock:url-invalid": "网址需以 http 或 https 开头"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
})();
