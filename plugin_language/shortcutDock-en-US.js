// ==Npplication==
// @name    捷径坞 - English
// @id    1794587580909_11179cda-f2f8-4b01-aebf-a5b577c26ce0
// @version    1.0.0
// @type    translate
// @translates    en-US
// @description    捷径坞 插件的英文翻译
// @author    Nitai
// @setting    false
// ==/Npplication==

(function () {
    'use strict';

    const translateEntries = {
        "@shortcutDock:btn-clear-icons": "Clear icon cache",
        "@shortcutDock:btn-export-bookmarks": "Export bookmarks",
        "@shortcutDock:btn-export-config": "Export config",
        "@shortcutDock:btn-import-bookmarks": "Import bookmarks",
        "@shortcutDock:btn-import-config": "Import config",
        "@shortcutDock:btn-refresh-icons": "Refresh all icons",
        "@shortcutDock:btn-reset": "Reset plugin data",
        "@shortcutDock:btn-restore-hotkeys": "Restore default hotkeys",
        "@shortcutDock:card-import-export": "Import / Export",
        "@shortcutDock:confirm-import-bookmarks": "Browser bookmarks loaded. Append them to the shortcut list?",
        "@shortcutDock:confirm-import-config": "Config file selected. Importing will overwrite current settings. Continue?",
        "@shortcutDock:confirm-import-html": "Bookmark file loaded. Append them to the shortcut list?",
        "@shortcutDock:confirm-reset": "Reset this plugin to its freshly-installed state?",
        "@shortcutDock:dialog-cancel": "Cancel",
        "@shortcutDock:dialog-ok": "OK",
        "@shortcutDock:empty-folder-above": "This folder is empty. Drag shortcuts to the folder above.",
        "@shortcutDock:empty-folder-left": "This folder is empty. Drag shortcuts to the folder on the left.",
        "@shortcutDock:empty-root": "No shortcuts in the main app yet.",
        "@shortcutDock:empty-tile": "Empty folder",
        "@shortcutDock:folder-default": "Folder",
        "@shortcutDock:group-bar": "Bottom bar",
        "@shortcutDock:group-data": "Data",
        "@shortcutDock:group-hotkeys": "Hotkeys",
        "@shortcutDock:group-look": "Appearance",
        "@shortcutDock:hotkey-err-duplicate": "Already used by another hotkey",
        "@shortcutDock:hotkey-err-modifier": "Must include at least one of Ctrl / Alt / Shift / Win",
        "@shortcutDock:hotkey-err-reserved": "Invalid — this combination is reserved",
        "@shortcutDock:icon-auto": "Auto",
        "@shortcutDock:icon-letter": "Letter icon",
        "@shortcutDock:icon-remove-upload": "Remove uploaded icon",
        "@shortcutDock:icon-upload": "Upload icon",
        "@shortcutDock:menu-delete": "Delete",
        "@shortcutDock:menu-delete-confirm": "Delete this shortcut?",
        "@shortcutDock:menu-dissolve": "Dissolve",
        "@shortcutDock:menu-dissolve-confirm": "Dissolve this folder? (Shortcuts are kept)",
        "@shortcutDock:menu-edit": "Edit",
        "@shortcutDock:menu-new-folder": "New folder",
        "@shortcutDock:menu-pin": "Pin to bottom bar",
        "@shortcutDock:menu-pin-sidebar": "Pin to sidebar",
        "@shortcutDock:menu-rename": "Rename",
        "@shortcutDock:menu-save": "Save",
        "@shortcutDock:menu-unpin": "Unpin",
        "@shortcutDock:menu-unpin-confirm": "Unpin?",
        "@shortcutDock:menu-unpin-sidebar": "Unpin",
        "@shortcutDock:page-title": "Shortcut Dock",
        "@shortcutDock:record-prompt": "Press a key combination…",
        "@shortcutDock:refresh-failed": "Refresh failed",
        "@shortcutDock:row-autohide": "Auto hide",
        "@shortcutDock:row-autohide-desc": "Hide when the pointer leaves the bar; reappears near the bottom edge",
        "@shortcutDock:row-autohide-instant": "Hide on leave",
        "@shortcutDock:row-autohide-instant-desc": "Hide as soon as the pointer leaves; stays open while dragging",
        "@shortcutDock:row-bar-height": "Bar height",
        "@shortcutDock:row-bar-height-desc": "Height of the bottom bar",
        "@shortcutDock:row-hide-bar": "Hide bottom bar",
        "@shortcutDock:row-hover-label": "Expand name on hover",
        "@shortcutDock:row-hover-label-desc": "Show the name of the hovered shortcut",
        "@shortcutDock:row-icon-only": "Icons only",
        "@shortcutDock:row-icon-only-desc": "Hide shortcut names in the bar",
        "@shortcutDock:row-icon-size": "Icon size",
        "@shortcutDock:row-opacity": "Opacity",
        "@shortcutDock:row-opacity-desc": "Background opacity of the bottom bar",
        "@shortcutDock:row-open-settings": "Open shortcutDock settings",
        "@shortcutDock:row-show-bar": "Show bottom bar",
        "@shortcutDock:row-show-bar-desc": "Appears after shortcuts are pinned; use a hotkey to reveal it when hidden",
        "@shortcutDock:row-takeover": "Take over Clock / Tab",
        "@shortcutDock:row-takeover-desc": "Click the clock or press Tab to open the dock page (off: keep the original shortcut panel)",
        "@shortcutDock:row-up": "Go up one level",
        "@shortcutDock:save-failed": "Failed to save",
        "@shortcutDock:settings-entry-missing": "Settings entry not found",
        "@shortcutDock:toast-bookmark-denied": "Bookmark permission denied",
        "@shortcutDock:toast-bookmark-none": "No bookmark links found",
        "@shortcutDock:toast-config-imported": "Config imported",
        "@shortcutDock:toast-icon-cleared": "Icon cache cleared",
        "@shortcutDock:toast-icon-refetch": "Icon cache cleared, refetching",
        "@shortcutDock:toast-import-failed": "Import failed: ",
        "@shortcutDock:toast-imported": "Imported",
        "@shortcutDock:toast-imported-folders": "folders",
        "@shortcutDock:toast-imported-links": "bookmarks",
        "@shortcutDock:url-invalid": "URL must start with http or https"
    };

    if (typeof window !== 'undefined' && window.i18n && window.i18n.addTranslationEntries) {
        window.i18n.addTranslationEntries(translateEntries);
    }
})();
