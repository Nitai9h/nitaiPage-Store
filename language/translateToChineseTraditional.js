// ==Npplication==
// @name    繁體中文
// @id    1756540331413_5eecc0bf-22af-454d-9e42-e64339a5843a
// @version    1.0.0
// @updateUrl    https://nfdb.nitai.us.kg/translateToChineseTraditional.js
// @description    將所有官方內容翻譯為繁體中文
// @author    Nitai
// @time    body
// @icon    https://nitai-images.pages.dev/nitaiPage/translateToChineseTraditional.svg
// @setting    false
// ==/Npplication==

// 定义字典
const translationDict = {
    '还没有插件添加设置项或插件设置项未加载...请尝试刷新页面重载': '沒有外掛程式新增設定項目或外掛程式設定項目未載入... 請嘗試刷新頁面重載',

    '点击下方选项以切换壁纸，使用除默认壁纸以外的选项可能会导致页面载入缓慢': '點擊下方選項以切換壁紙，使用除預設壁紙以外的選項可能會導致頁面載入緩慢',
    '请点击选项以查看各项说明，高亮项为选中，选中后刷新页面以生效': '請點擊選項以查看各項說明，高亮項為選中，選中后刷新頁面以生效',
    '不建议使用以主色调为白色的壁纸，会导致本站部分元素无法辨认': '不建議使用以主色調為白色的壁紙，會導致本站部分元素無法辨認',
    '点击选择配置文件进行恢复': '點擊選擇設定檔進行恢復',
    '点击下载本站点的配置文件': '點擊下載本網站的配置檔',
    '遇到问题可在此处进行重置': '遇到問題可在此處進行重置',

    '该字体根据 SIL Open Font License 1.1 授权许可': '該字體根據 SIL Open Font License 1.1 授權許可',
    '您已成功加载了使用该字体的插件': '您已成功加載了使用該字體的插件',
    '字体文件未经修改且未单独分发': '字體文件未經修改且未單獨分發',
    '更多授权详情请查看 NPP 设置页面': '更多授權詳情請查看 NPP 設置頁面',
    '该字体版权归华为终端有限公司所有': '該字體版權歸華為終端有限公司所有',
    '完整许可协议请查看 NPP 设置页面': '完整許可協議請查看 NPP 設置頁面',
    '本 NPP 使用的字体基于协议授权': '本 NPP 使用的字體基於協議授權',
    '以下简称“协议”': '以下簡稱“協議”',
    '您正在使用的是': '您正在使用的是',
    '字体使用许可协议': '字體使用許可協議',

    '这是一个危险的操作，请不要填入不被信任的样式，这样可能会导致隐私泄露、布局错乱等。': '這是一個危險的操作，請不要填入不被信任的樣式，這樣可能會導致隱私洩露、布局錯亂等。',
    '如要使用，请开启高级设置。': '如要使用，請開啟高級設置。',
    '添加自定义CSS样式': '添加自定義CSS樣式',
    '在此粘贴 CSS 样式': '在此粘貼 CSS 樣式',

    '以 https 或 http 开头的 URL': '以 https 或 http 開頭的 URL',
    '请填入小于 1000 的正整数': '請填入小於 1000 的正整數',
    '请填入小于 100 的正整数': '請填入小於 100 的正整數',
    'URL 中 问号 后面的字段': 'URL 中 問號 後面的字段',

    '所有 Npp 均已更新到最新版本或已提交更新申请': '所有 Npp 均已更新到最新版本或已提交更新申請',
    '检测到链接可能不可用，是否强制设置？': '檢測到連結可能不可用，是否強制設置？',
    '当前数据将全部清除！是否继续重置？': '當前數據將全部清除！是否繼續重置？',
    '是否设置为默认搜索引擎？': '是否設置為默認搜尋引擎？',
    '现有搜索引擎数据将被清空': '現有搜尋引擎數據將被清空',
    '插件已卸载，刷新页面生效': '插件已卸載，刷新頁面生效',
    '已导出备份文件至下载目录': '已導出備份文件至下載目錄',
    '确定要覆盖安装插件吗？': '確定要覆蓋安裝插件嗎？',
    '默认搜索引擎不可删除': '默認搜尋引擎不可刪除',
    '快捷方式数据将被清空': '快捷方式數據將被清空',
    '壁纸设置成功，刷新生效': '壁紙設置成功，刷新生效',
    '链接设置成功，刷新生效': '連結設置成功，刷新生效',
    '当前数据将会被清空': '當前數據將會被清空',
    '覆盖！是否继续导入？': '覆蓋！是否繼續導入？',
    '设置成功,刷新后生效': '設置成功,刷新後生效',
    '设置成功，刷新生效': '設置成功，刷新生效',
    '安装成功，刷新生效': '安裝成功，刷新生效',
    '已有数据，是否覆盖？': '已有數據，是否覆蓋？',
    '读取依赖项时出错': '讀取依賴項時出錯',
    '检查更新时发生错误': '檢查更新時發生錯誤',
    '是否要卸载此插件吗': '是否要卸載此插件嗎',
    '可用，是否更新？': '可用，是否更新？',
    '至少保留一个商店源': '至少保留一個商店源',
    '加载插件管理页面失败': '加載插件管理頁面失敗',

    '最左侧为默认大小': '最左側為默認大小',
    '正中间为默认大小': '正中間為默認大小',
    '最右侧为默认大小': '最右側為默認大小',

    '搜索引擎名称': '搜尋引擎名稱',

    '商店源管理': '商店源管理',
    '输入商店源': '輸入商店源',
    '用于显示秒数': '用於顯示秒數',
    '无需依赖项': '無需依賴項',
    '暂时没有截图': '暫時沒有截圖',

    '开启后每隔一段时间自动切换下一张壁纸，不建议仅有单张图片的壁纸项开启此功能': '開啟後每隔一段時間自動切換下一張壁紙，不建議僅有單張圖片的壁紙項開啟此功能',
    '点击选项切换壁纸，部分壁纸源不支持动态颜色': '點擊選項切換壁紙，部分壁紙源不支援動態顏色',
    '在搜索建议中显示翻译选项': '在搜尋建議中顯示翻譯選項',
    '是否在时间和日期前补零': '是否在時間和日期前補零',
    '是否启用搜索框模糊效果': '是否啟用搜尋框模糊效果',
    '是否启用时钟数字切换动效': '是否啟用時鐘數字切換動效',
    '是否闪烁时钟指示器': '是否閃爍時鐘指示器',
    '是否使用 12 小时制': '是否使用 12 小時制',
    '是否启用模糊增强': '是否啟用模糊增強',
    '启用高级功能设置': '啟用高級功能設置',
    '设置切换间隔时间': '設置切換間隔時間',
    '是否切换为白色主题': '是否切換為白色主題',
    '是否启用壁纸遮罩': '是否啟用壁紙遮罩',
    '根据壁纸切换主题': '根據壁紙切換主題',
    '启用搜索建议功能': '啟用搜尋建議功能',
    '是否显示页脚': '是否顯示頁腳',
    '高级设置开关': '高級設置開關',
    '开启搜索建议': '開啟搜尋建議',
    '开启快捷翻译': '開啟快捷翻譯',
    '是否显示日期': '是否顯示日期',
    '农历透明度': '農曆透明度',
    '时间与日期': '時間與日期',
    '全局模糊度': '全局模糊度',
    '日期显示': '日期顯示',
    '动态主题': '動態主題',
    '农历大小': '農曆大小',
    '农历粗细': '農曆粗細',
    '缺位补零': '缺位補零',
    '时钟制式': '時鐘制式',
    '时钟闪烁': '時鐘閃爍',
    '时钟动效': '時鐘動效',
    '页面设置': '頁面設置',
    '模糊增强': '模糊增強',
    '搜索模糊': '搜尋模糊',
    '全局字重': '全局字重',
    '显示页脚': '顯示頁腳',
    '壁纸遮罩': '壁紙遮罩',
    '数据设置': '數據設置',
    '白色主题': '白色主題',
    '自动切换': '自動切換',
    '切换间隔': '切換間隔',

    '必应每日一图 4K UHD 超高清，每天更新': '必應每日一圖 4K UHD 超高清，每天更新',
    '必应每日一图 1080P FHD 全高清，每天更新': '必應每日一圖 1080P FHD 全高清，每天更新',
    '随机风景图，每次刷新后更换': '隨機風景圖，每次刷新後更換',
    '随机二次元图，每次刷新后更换': '隨機二次元圖，每次刷新後更換',
    '自定义壁纸地址': '自定義壁紙地址',
    '默认壁纸': '默認壁紙',

    '随机壁纸，每次刷新后更换': '隨機壁紙，每次刷新後更換',
    '纯色背景，可自定义颜色': '純色背景，可自定義顏色',
    '添加壁纸项': '添加壁紙項',
    '自定义壁纸项': '自定義壁紙項',

    '当前数据将会被': '當前數據將會被',
    '加载插件时出错': '加載插件時出錯',
    '更新时发生错误': '更新時發生錯誤',
    '有新版本': '有新版本',
    '没有可配置的插件': '沒有可配置的插件',
    '不是正整数': '不是正整數',
    '还未安装插件': '還未安裝插件',
    '不支持卸载': '不支持卸載',
    '数据解析异常': '數據解析異常',
    '正在检查更新': '正在檢查更新',
    '数据格式错误': '數據格式錯誤',
    '正在检查更新': '正在檢查更新',
    '已更新至版本': '已更新至版本',
    '已是最新版本': '已是最新版本',
    '数据被导入': '數據被導入',
    '覆盖成功': '覆蓋成功',
    '添加成功': '添加成功',
    '是否删除？': '是否刪除？',
    '删除成功': '刪除成功',
    '重置成功': '重置成功',
    '重置完成': '重置完成',
    '覆盖失败': '覆蓋失敗',
    '卸载失败': '卸載失敗',
    '安装失败': '安裝失敗',
    '正在安装中': '正在安裝中',
    '开始安装': '開始安裝',
    '快捷方式': '快捷方式',
    '自动更新': '自動更新',
    '不再提示': '不再提示',
    '检查插件': '檢查插件',
    '源已存在': '源已存在',
    '未找到插件': '未找到插件',
    '保存成功': '保存成功',
    '随机壁纸': '隨機壁紙',
    '纯色背景': '純色背景',
    '时间透明度': '時間透明度',
    '日期透明度': '日期透明度',
    '时间粗细': '時間粗細',
    '时间大小': '時間大小',
    '时间宽度': '時間寬度',
    '日期大小': '日期大小',
    '日期粗细': '日期粗細',
    '日期宽度': '日期寬度',

    '网站名称': '網站名稱',
    '搜索引擎': '搜尋引擎',

    '搜你所想': '搜你所想',
    '版权信息': '版權信息',
    '更新日志': '更新日志',

    '新增': '新增',
    '更新': '更新',
    '调序': '調序',
    '返回': '返回',
    '安装': '安裝',
    '保存': '保存',
    '取消': '取消',
    '确认': '確認',
    '稍后': '稍後',
    '序号': '序號',
    '刷新': '刷新',
    '更新': '更新',
    '覆盖': '覆蓋',
    '无效': '無效',

    '声明': '聲明',
    '字体': '字體',
    '根据': '根據',
    '继续': '繼續',

    '列表': '列表',
    '描述': '描述',
    '依赖': '依賴',
    '截图': '截圖',
    '版本': '版本',
    '来源': '來源',
    '作者': '作者',

    '顺序': '順序',
    '名称': '名稱',
    '网址': '網址',
    '字段名': '字段名',

    '管理': '管理',
    '工具': '工具',
    '主题': '主題',
    '语言': '語言',
    '关于': '關於',
    '更多': '更多',
    '壁纸': '壁紙',
    '捷径': '捷徑',
    '搜取': '搜取',
    '面板': '面板',

    '周一': '週一',
    '周二': '週二',
    '周三': '週三',
    '周四': '週四',
    '周五': '週五',
    '周六': '週六',
    '周日': '週日',

    '设置': '設置',
    '导入': '導入',
    '导出': '導出',
    '重置': '重置',

    '凌晨啦': '凌晨啦',
    '早上好': '早上好',
    '上午好': '上午好',
    '中午好': '中午好',
    '下午好': '下午好',
    '傍晚啦': '傍晚啦',
    '晚上好': '晚上好',
    '夜深了': '夜深了',
    '拟态起始页': '擬態起始頁',
    '欢迎使用': '歡迎使用',
    '年': '年',
    '月': '月',
    '日': '日',
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