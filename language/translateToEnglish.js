// ==Npplication==
// @name    English
// @id    1754240200155_61322c74-6fe7-436f-a824-e94e594bfa17
// @version    1.0.0
// @updateUrl    https://nfdb.nitai.us.kg/translateToEnglish.js
// @description    All official content is translated into English
// @author    Nitai
// @time    body
// @icon    https://nitai-images.pages.dev/nitaiPage/translateToEnglish.svg
// @setting    false
// ==/Npplication==

// 定义字典
const translationDict = {
    '还没有插件添加设置项或插件设置项未加载...请尝试刷新页面重载': 'No Settings item added by the plugin or the plugin Settings item is not loaded... Please try refreshing the page to reload',

    '是否设置为默认搜索引擎？': 'Is it set as the default search engine?',
    '设置成功,刷新后生效': 'Settings are successful, and the refresh will take effect',
    '已有数据，是否覆盖？': 'There is already data, whether to cover?',
    '默认搜索引擎不可删除': 'The default search engine cannot be deleted',
    '现有搜索引擎数据将被清空': 'Existing search engine data will be cleared',
    '快捷方式数据将被清空': 'Bookmark data will be cleared',
    '壁纸设置成功，刷新生效': 'Wallpaper settings are successful, and the refresh will take effect',
    '检测到链接可能不可用，是否强制设置？': 'Detected that the link may be unavailable, whether to force setting?',
    '所有 Npp 均已更新到最新版本或已提交更新申请': 'All Npp have been updated to the latest version or have submitted an update application',
    '链接设置成功，刷新生效': 'Link settings are successful, and the refresh will take effect',
    '已导出备份文件至下载目录': 'Backup file has been exported to the download directory',
    '当前数据将会被清空': 'Current data will be cleared',
    '覆盖！是否继续导入？': 'Cover! Whether to continue importing?',
    '当前数据将全部清除！是否继续重置？': 'Current data will be cleared! Whether to continue resetting?',
    '设置成功，刷新生效': 'Settings are successful, and the refresh will take effect',
    '安装成功，刷新生效': 'Installation is successful, and the refresh will take effect',
    '插件已卸载，刷新页面生效': 'Plugin has been uninstalled, and the page will be refreshed to take effect',
    '确定要覆盖安装插件吗？': 'Are you sure you want to cover install the plugin?',
    '读取依赖项时出错': 'Error reading dependencies',
    '检查更新时发生错误': 'Error occurred while checking for updates',
    '是否要卸载此插件吗': 'Are you sure you want to uninstall this plugin',
    '可用，是否更新？': 'Available, update?',
    '至少保留一个商店源': 'At least one store source is retained',
    '加载插件管理页面失败': 'Failed to load the plugin management page',

    '点击下方选项以切换壁纸，使用除默认壁纸以外的选项可能会导致页面载入缓慢': 'Click the options below to switch wallpapers, using options other than the default wallpaper may cause the page to load slowly',
    '请点击选项以查看各项说明，高亮项为选中，选中后刷新页面以生效': 'Please click the options to view the instructions, the highlighted item is selected, and the page is refreshed after selection to take effect',
    '不建议使用以主色调为白色的壁纸，会导致本站部分元素无法辨认': 'It is not recommended to use wallpapers with a white main color, which will make some elements of the site unreadable',
    '点击选择配置文件进行恢复': 'Click to select the configuration file to restore',
    '点击下载本站点的配置文件': 'Click to download the configuration file of the site',
    '遇到问题可在此处进行重置': 'You can reset the configuration file here when there is a problem',

    '以 https 或 http 开头的 URL': 'URLs that start with https or http',
    '请填入小于 100 的正整数': 'Please enter a positive integer less than 100',
    '请填入小于 1000 的正整数': 'Please enter a positive integer less than 1000',
    'URL 中 问号 后面的字段': 'The key after ? in the URL',

    '最左侧为默认大小': 'The leftmost is the default size',
    '正中间为默认大小': 'The middle is the default size',
    '最右侧为默认大小': 'The rightmost is the default size',

    '搜索引擎名称': 'Search Engine Name',

    '商店源管理': 'Store Source Management',
    '输入商店源': 'Type the Store Source',

    '高级设置开关': 'Advanced Settings Switch',
    '启用高级功能设置': 'Enable Advanced Function Settings',
    '动态主题(Beta)': 'Dynamic Theme (Beta)',
    '根据壁纸切换主题': 'Switch Theme Based on Wallpaper',
    '开启搜索建议': 'Enable Search Suggestions',
    '启用搜索建议功能': 'Enable Search Suggestions Function',
    '开启快捷翻译': 'Enable Quick Translation',
    '在搜索建议中显示翻译选项': 'Display Translation Options in Search Suggestions',
    '农历大小': 'FontSize of Lunar Calendar',
    '农历粗细': 'FontWeight of Lunar Calendar',
    '农历透明度': 'Opacity of Lunar Calendar',

    '您正在使用的是': 'You are using',
    '字体使用许可协议': 'Font License Agreement',
    '您已成功加载了使用该字体的插件': 'You have successfully loaded the plugin that uses the font',
    '字体文件未经修改且未单独分发': 'Font file is not modified and not distributed separately',
    '更多授权详情请查看 NPP 设置页面': 'For more authorization details, please view the NPP settings page',
    '该字体版权归华为终端有限公司所有': 'The font copyright belongs to Huawei Terminal Co., Ltd.',
    '该字体根据 SIL Open Font License 1.1 授权许可': 'The font is licensed under the SIL Open Font License 1.1',
    '完整许可协议请查看 NPP 设置页面': 'For the complete license agreement, please view the NPP settings page',
    '以下简称“协议”': 'The following is referred to as the "Agreement"',
    '本 NPP 使用的字体基于协议授权': 'The font used in NPP is licensed under the Agreement',

    '不是正整数': 'Not a positive integer',
    '还未安装插件': 'No plugins have been installed',
    '加载插件时出错': 'Error loading plugins',
    '不支持卸载': 'Unsupported uninstallation',
    '数据解析异常': 'Data parsing exception',
    '正在检查更新': 'Checking for updates',
    '数据格式错误': 'Data format error',
    '正在检查更新': 'Checking for updates',
    '已更新至版本': 'Updated to version',
    '已是最新版本': 'Already the latest version',
    '更新时发生错误': 'Error occurred while updating',
    '没有可配置的插件': 'No configurable plugins',
    '数据被导入': 'Data imported',
    '覆盖成功': 'Covered successfully',
    '有新版本可用': 'There is a new version available',
    '添加成功': 'Added successfully',
    '是否删除？': 'Are you sure to delete?',
    '删除成功': 'Deleted successfully',
    '重置成功': 'Reset successfully',
    '重置完成': 'Reset completed',
    '覆盖失败': 'Cover failed',
    '卸载失败': 'Uninstallation failed',
    '安装失败': 'Installation failed',
    '正在安装中': 'Installing...',
    '开始安装': 'Starting installation',
    '快捷方式': 'Bookmark',
    '自动更新': 'Auto Update',
    '不再提示': 'No longer prompt',
    '检查插件': 'Check Plugin',
    '源已存在': 'Source already exists',
    '未找到插件': 'Plugin not found',

    '必应每日一图 4K UHD 超高清，每天更新': 'Bing Daily Image 4K UHD, updated daily',
    '必应每日一图 1080P FHD 全高清，每天更新': 'Bing Daily Image 1080P FHD, updated daily',
    '随机风景图，每次刷新后更换': 'Random Scenery Image, updated after refresh',
    '随机二次元图，每次刷新后更换': 'Random Anime Image, updated after refresh',
    '自定义壁纸地址': 'Custom Wallpaper URL',
    '默认壁纸': 'Default Wallpaper',

    '时间透明度': 'Opacity of time',
    '日期透明度': 'Opacity of date',
    '时间粗细': 'FontWeight of time',
    '时间大小': 'FontSize of time',
    '时间宽度': 'FontWidth of time',
    '日期大小': 'FontSize of date',
    '日期粗细': 'FontWeight of date',
    '日期宽度': 'FontWidth of date',

    '网站名称': 'Site Name',
    '搜索引擎': 'Search Engine',

    '搜你所想': 'Search for...',
    '版权信息': 'Copyright Information',
    '更新日志': 'Update Log',

    '自定义': 'Custom',
    '二次元': 'Anime',
    '默认': 'Default',
    '必应': 'Bing',
    '风景': 'Scenery',

    '新增': 'Add',
    '更新': 'Update',
    '调序': 'Sort',
    '返回': 'Back',
    '安装': 'Install',
    '保存': 'Save',
    '取消': 'Cancel',
    '确认': 'Confirm',
    '稍后': 'Later',
    '序号': 'Serial Number',
    '刷新': 'Refresh',
    '更新': 'Update',
    '覆盖': 'Cover',
    '无效': 'Invalid',

    '声明': 'Declaration',
    '字体': 'Font',
    '根据': 'According to',
    '继续': 'Continue',

    '列表': 'List',
    '描述': 'Description',
    '依赖': 'Dependencies',
    '截图': 'Screenshot',
    '版本': 'Version',
    '来源': 'Source',
    '作者': 'Author',

    '顺序': 'Order',
    '名称': 'Name',
    '网址': 'URL',
    '字段名': 'Key',

    '管理': 'Manage',
    '工具': 'Tools',
    '主题': 'Themes',
    '翻译': 'Translate',
    '关于': 'About',
    '更多': 'More',
    '壁纸': 'Wallpaper',
    '捷径': 'Bookmark',
    '搜取': 'SearchEngine',
    '面板': 'Panel',

    '周一': 'Monday',
    '周二': 'Tuesday',
    '周三': 'Wednesday',
    '周四': 'Thursday',
    '周五': 'Friday',
    '周六': 'Saturday',
    '周日': 'Sunday',

    '设置': 'Settings',
    '导入': 'Import',
    '导出': 'Export',
    '重置': 'Reset',

    '拟态起始页': 'NitaiPage',
    '欢迎使用': 'Welcome to',
    '年': '/',
    '月': '/',
    '日': ''
};

// 翻译函数
function translateText(text) {
    if (!text || typeof text !== 'string') return text;

    // 对文本进行简单分词和翻译
    let translatedText = text;
    Object.keys(translationDict).forEach(word => {
        const regex = new RegExp(`${word}`, 'gi');
        translatedText = translatedText.replace(regex, translationDict[word]);
    });

    return translatedText;
}

// 翻译元素内容
function translateElement(element) {
    // 检查元素是否存在
    if (!element) return;

    // 检查元素是否标记为不翻译
    if (element.nodeType === Node.ELEMENT_NODE && element.hasAttribute('translate') && element.getAttribute('translate') === 'none') {
        return;
    }

    // 移除翻译标记
    if (element.nodeType === Node.ELEMENT_NODE && element.dataset && element.dataset.translated) {
        delete element.dataset.translated;
    }

    // 翻译文本
    if (element.nodeType === Node.TEXT_NODE) {
        const originalText = element.textContent;
        const translatedText = translateText(originalText);
        if (originalText !== translatedText) {
            element.textContent = translatedText;
            // 标记父元素
            if (element.parentNode && element.parentNode.dataset) {
                element.parentNode.dataset.translated = 'true';
            }
        }
    }

    // 跳过不需要翻译的元素类型
    const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED'];
    if (element.tagName && skipTags.includes(element.tagName.toUpperCase())) {
        return;
    }

    // 翻译属性值
    if (element.attributes && element.attributes.length !== undefined) {
        const placeholderAttr = element.getAttributeNode('placeholder');
        if (placeholderAttr) {
            const originalValue = placeholderAttr.value;
            const translatedValue = translateText(originalValue);
            if (originalValue !== translatedValue) {
                placeholderAttr.value = translatedValue;
                if (element.dataset) {
                    element.dataset.translated = 'true';
                }
            }
        }

        Array.from(element.attributes).forEach(attr => {
            if (attr.name.toLowerCase() === 'title' || attr.name.toLowerCase() === 'alt') {
                const originalValue = attr.value;
                const translatedValue = translateText(originalValue);
                if (originalValue !== translatedValue) {
                    attr.value = translatedValue;
                    // 标记
                    if (element.dataset) {
                        element.dataset.translated = 'true';
                    }
                }
            }
        });
    }

    // 翻译完成后标记元素
    let hasTranslated = false;
    if (element.nodeType === Node.TEXT_NODE) {
        hasTranslated = element.textContent !== translateText(element.textContent);
        if (hasTranslated && element.parentNode && element.parentNode.dataset) {
            element.parentNode.dataset.translated = 'true';
        }
    } else if (element.attributes) {
        Array.from(element.attributes).forEach(attr => {
            if (['title', 'alt', 'placeholder'].includes(attr.name.toLowerCase())) {
                if (attr.value !== translateText(attr.value)) {
                    hasTranslated = true;
                }
            }
        });
        if (hasTranslated && element.dataset) {
            element.dataset.translated = 'true';
        }
    }

    if (element.childNodes && element.childNodes.length !== undefined) {
        Array.from(element.childNodes).forEach(child => {
            translateElement(child);
        });
    }
}

// 初始化
function initTranslation() {
    translateElement(document.body);

    // 监听DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 处理新增元素
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    translateElement(node);
                });
            }

            // 处理文本变化
            if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
                const textNode = mutation.target;
                const originalText = textNode.textContent;
                const translatedText = translateText(originalText);
                if (originalText !== translatedText) {
                    textNode.textContent = translatedText;
                }
                // 标记父元素
                if (textNode.parentNode && textNode.parentNode.dataset) {
                    textNode.parentNode.dataset.translated = 'true';
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });


}

// 页面加载完成后初始化翻译
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslation);
} else {
    initTranslation();
}