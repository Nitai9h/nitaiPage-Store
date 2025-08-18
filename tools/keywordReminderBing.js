// ==Npplication==
// @name    搜索建议-必应源
// @id    1754203017843_73f7c9b5-d5d1-4b86-a1a6-dd46729b10a0
// @version    1.0.3
// @updateUrl    https://nfdb.nitai.us.kg/keywordReminderBing.js
// @description    用于展示搜索建议
// @author    Nitai
// @time    head
// @icon    https://nitai-images.pages.dev/nitaiPage/keywordReminder.svg
// @setting    true
// ==/Npplication==

// 检查搜索建议是否启用
function isKeywordReminderEnabled() {
    return localStorage.getItem('keywordReminder') !== 'off';
}

// 检查快捷翻译是否启用
function isQuickTranslationEnabled() {
    return localStorage.getItem('quickTranslation') !== 'off' && isKeywordReminderEnabled();
}

function keywordReminder() {
    // 检查搜索建议是否启用
    if (!isKeywordReminderEnabled()) {
        return;
    }
    var keyword = $(".wd").val();
    if (keyword != "") {
        $.ajax({
            url: 'https://api.bing.com/qsonhs.aspx?type=cb&q=' + keyword,
            dataType: 'jsonp',
            jsonp: 'cb', //回调函数的参数名(键值)key
            success: function (data) {
                // 获取宽度
                $("#keywords").css("width", $('.sou').width());
                $("#keywords").empty().show();
                if (data && data.AS && data.AS.Results) {
                    // 添加翻译选项
                    if (isQuickTranslationEnabled()) {
                        $('#keywords').append(`<div class="keyword" data-id="translate"><i class='iconfont icon-fanyi'></i>${keyword}</div>`);
                    }
                    data.AS.Results.forEach(function (result) {
                        if (result.Suggests) {
                            result.Suggests.forEach(function (suggest) {
                                $('#keywords').append(`<div class="keyword" data-id="${suggest.Sk}"><i class='iconfont icon-sousuo'></i>${suggest.Txt}</div>`);
                            });
                        }
                    });
                    $("#keywords").attr("data-length", data.AS.Results.reduce((total, result) => total + (result.Suggests ? result.Suggests.length : 0), 0));
                }
                $(".keyword").click(function () {
                    var keywordId = $(this).data('id');
                    if (keywordId === 'translate') {
                        // 处理翻译逻辑
                        // 使用Bing源
                        window.open('https://www.bing.com/translator/?text=' + encodeURIComponent($(".wd").val()), '_blank');
                    } else {
                        $(".wd").val($(this).text());
                        $("#search-submit").click();
                    }
                });
            },
            error: function () {
                $("#keywords").empty().show();
                $("#keywords").hide();
            }
        })
    } else {
        $("#keywords").empty().show();
        $("#keywords").hide();
    }
}


// 创建设置
function createKeywordReminderSetting() {
    const pluginId = '1754203017843_73f7c9b5-d5d1-4b86-a1a6-dd46729b10a0';
    const mainConts = document.querySelector(`.mainConts[data-value="${pluginId}"]`);

    if (mainConts) {
        const settingDiv = document.createElement('div');
        settingDiv.id = 'keywordReminder_setting';
        settingDiv.className = 'set_tip';
        settingDiv.style = 'width: 100%';
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
                        <span class="set_text"><big>开启搜索建议</big><br></span>
                        <span class="set_text" style="color: gray;"><small>启用搜索建议功能</small></span>
                    </div>
                    <div class="switch" id="toggleKeywordReminder"></div>
                </div>
                <div class="keywordReminder_switch-container" style="margin-bottom: 0px;">
                    <div>
                        <span class="set_text"><big>开启快捷翻译</big><br></span>
                        <span class="set_text" style="color: gray;"><small>在搜索建议中显示翻译选项</small></span>
                    </div>
                    <div class="switch" id="toggleQuickTranslation"></div>
                </div>
            `;
        mainConts.appendChild(settingDiv);

        // 初始化开关状态
        const toggleKeywordReminder = $('#toggleKeywordReminder');
        const toggleQuickTranslation = $('#toggleQuickTranslation');

        const keywordReminderState = localStorage.getItem('keywordReminder') || 'on';
        const quickTranslationState = localStorage.getItem('quickTranslation') || 'on';

        if (keywordReminderState === 'on') {
            toggleKeywordReminder.addClass('on');
        }

        if (quickTranslationState === 'on' && keywordReminderState === 'on') {
            toggleQuickTranslation.addClass('on');
        } else if (keywordReminderState === 'off') {
            // 搜索建议未开启时，快捷翻译自动关闭且不可用
            toggleQuickTranslation.addClass('disabled');
        }

        // 搜索建议开关点击事件
        toggleKeywordReminder.on('click', function () {
            const isOn = $(this).hasClass('on');
            if (isOn) {
                $(this).removeClass('on');
                localStorage.setItem('keywordReminder', 'off');
                // 搜索建议关闭时，快捷翻译也自动关闭
                toggleQuickTranslation.removeClass('on').addClass('disabled');
                localStorage.setItem('quickTranslation', 'off');
            } else {
                $(this).addClass('on');
                localStorage.setItem('keywordReminder', 'on');
                // 搜索建议开启时，快捷翻译恢复可用
                toggleQuickTranslation.removeClass('disabled');
            }
        });

        // 快捷翻译开关点击事件
        toggleQuickTranslation.on('click', function () {
            // 检查是否被禁用
            if ($(this).hasClass('disabled')) {
                return;
            }

            const isOn = $(this).hasClass('on');
            if (isOn) {
                $(this).removeClass('on');
                localStorage.setItem('quickTranslation', 'off');
            } else {
                $(this).addClass('on');
                localStorage.setItem('quickTranslation', 'on');
            }
        });
    }
}

(function () {
    // 页面加载完成后初始化设置
    $(document).ready(function () {
        createKeywordReminderSetting();
    });
})();