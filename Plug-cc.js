window.formData = {
    get,  // 等同于 get: get
    set   // 等同于 set: set
};

/**
 * 解析表单数据（取值）
 * @param {HTMLFormElement} form 选好的form元素
 * @return {Object}
 */
function get(form) {
    //data为返回的数据
    let data = {};
    //选取表单内具有name属性的元素
    let inputs = form.querySelectorAll('[name]');
    //循环取值
    inputs.forEach(it => {
        switch (it.type) {
            case 'number':
                data[it.name] = parseFloat(it.value);
                break;

            case 'radio':
                //没选的直接跳过
                if (!it.checked)
                    return;
                //选中的存入data
                data[it.name] = it.value;
                break;

            case 'checkbox':
                //复选的值存入相应数组
                //第一次存判断是否为数组，不是就创建一个数组
                if (!Array.isArray(data[it.name]))
                    data[it.name] = [];
                //选中就存入数组
                if (it.checked)
                    data[it.name].push(it.value);
                break;

            case 'date':
            case 'time':
            case 'week':
            case 'month':
            case 'datetime':
            case 'datetime-local':
                // 转为Date对象
                data[it.name] = it.valueAsDate;
                break;
            // 默认取对应字符串的值
            default:
                data[it.name] = it.value;
        };
    });
    //返回数据
    return data;
};

/**
 * 通过数据填表（存值）
 * @param {Object} data
 * @param {HTMLFormElement} form
 */
function set(data, form) {

    //循环数据，再从表单中查找name属性与
    //数据键值对中键同名的元素，判断类型后再填值
    for (let key in data) {
        //声明value用于存对应键的值
        let value = data[key];
        //选取表单中name属性与键同名的所有元素
        let input = form.querySelector(`[name=${key}]`);

        switch (input.type) {
            case 'checkbox':
                //当类型为复选时，先选中所有元素
                input = form.querySelectorAll(`[name=${key}]`);
                //循环所有元素，如果数据里包含相应值，就选中
                input.forEach(el => {
                    if (value.includes(el.value))
                        el.checked = true;
                });
                break;

            case 'radio':
                //另一种多元素的处理方式
                //直接查询是否有对应值的元素
                let radio = form.querySelector(`[type=radio][name=${key}][value=${value}]`);
                //有就选中
                radio && (radio.checked = true);
                break;

            default:
                input.value = data[key];
        };
    };
};


//点击一个按钮，当按钮data-popout有内容时，弹出内容提示
//只显示当前最后点击按钮的弹出提示
//点击非触发元素时隐藏所有弹出提示

//做法，给window绑定点击事件，判断事件源有没有.dataset.popout属性
//如果有， 再判断该元素是否已经添加过弹出元素
//如果已经添加过，就直接显示它
//如果没有添加过，就给该元素添加一个类名为popout的元素，
//其内容为dataset.popout里储存的信息，然后调整其显示位置

//当window点击事件源没有.dataset.popout属性，隐藏所有添加的弹出元素
//当依次点击两个具有.dataset.popout属性的按钮时，
//只显示当前点击的按钮的弹出提示，
//做法是先隐藏全部，再显示当前

//定义全局变量，存储所有弹出消息元素
let triggers = new Set();
//第二种弹出方式全局变量
let trigger, popup, mask;

window.addPopup = {
    global,  // 等同于 get: get
    part   // 等同于 set: set
};

function global() {
    window.addEventListener('click', event => {
        let el = event.target;
        let content = el.dataset.popout;
        //判断事件源是否具有.dataset.popout属性
        if (content) {
            show(el, content);
        } else {
            //隐藏所有弹出消息
            triggers.forEach(it => it.hidden = true);
        }
    })
};

function show(el, content) {
    //判断有没有添加过弹出元素，el._mark为添加过元素的标记
    if (el._mark) {
        //如果已经添加过，显示弹出消息,
        //在这之前先隐藏所有弹出消息，再显示当前
        triggers.forEach(it => it.hidden = true);
        el._mark.hidden = false;
    } else {
        //先隐藏其他消息
        triggers.forEach(it => it.hidden = true);

        //先添加一个类名为.popout的元素
        //其内容为.dataset.popout属性的值
        let popout = document.createElement('div');
        popout.classList.add('popout');
        popout.innerHTML = content;
        document.body.appendChild(popout);

        //做标记
        el._mark = popout;
        //当前弹出消息元素添加集合中
        triggers.add(popout);

        //调整popout位置,传参为该元素本身
        //el._mark（popout）作为元素属性，全局可见
        reposition(el);
    }
};

function reposition(el) {
    //el._mark即是弹出的提示元素，el为触发元素
    let p = el._mark;
    let elPosition = el.getBoundingClientRect();

    switch (el.dataset.position) {
        case 'top':
            // 左边顶头
            p.style.left = elPosition.left + 'px';
            // 向上移动一个弹出框（高度）的距离
            p.style.top = elPosition.top - p.offsetHeight - 5 + 'px';
            break;

        case 'bottom':
            // 左边顶头
            p.style.left = elPosition.left + 'px';
            // 向下移动一个按钮（高度）的距离
            p.style.top = elPosition.top + el.offsetHeight + 5 + 'px';
            break;

        case 'left':
            // 向左移动一个弹出框（宽度）的距离
            p.style.left = elPosition.left - p.offsetWidth - 5 + 'px';
            p.style.top = elPosition.top + 'px';
            break;

        case 'right':
            // 向右移动一个按钮（宽度）的距离
            p.style.left = elPosition.left + el.offsetWidth + 5 + 'px';
            p.style.top = elPosition.top + 'px';
            break;
    };
};



//第二种,须先在HTML中预先写入要弹出的内容

/**
 * 
 * @param {HTMLElement} triggerSelector 触发的元素
 * @param {HTMLElement} popupSelector 要弹出的内容
 */
function part(triggerSelector, popupSelector, location) {
    //初始化
    initPopup(triggerSelector, popupSelector);

    //绑定相关事件
    bindEvent(location);
};

function initPopup(triggerSelector, popupSelector) {
    //选中触发元素与弹出元素
    trigger = document.querySelector(triggerSelector);
    popup = document.querySelector(popupSelector);

    //给弹出元素添加一个类名plug-popup,且默认隐藏
    popup.classList.add("plug-popup");
    popup.hidden = true;

    //添加遮罩层
    addMask();
}

function addMask() {
    //定义一个类名为plug-mask的div元素
    mask = document.createElement('div');
    mask.classList.add("plug-mask");
    //默认隐藏
    mask.hidden = true;
    //向页面中添加这个遮罩层元素
    document.body.appendChild(mask);
};

function bindEvent(location) {
    //给触发元素绑定事件
    trigger.addEventListener('click', () => {
        showPopup();
    });

    //绑定隐藏遮罩层事件
    window.addEventListener('keyup', (event) => {
        if (event.code === 'Escape')
            hidePopup();
    });
    //点击遮罩层隐藏
    // mask.addEventListener('click', () => {
    //     hidePopup();
    // });

    //浏览器改变大小时，调整弹出消息位置
    window.addEventListener('resize', () => {
        repositionPopup(location);
    });
};

function showPopup() {
    //先显示弹出消息，然后改变位置，不然无法准确计算显示位置
    mask.hidden = popup.hidden = false;

    repositionPopup();
};

function hidePopup() {
    mask.hidden = popup.hidden = true;
};

/**
 * xOffset,yOffset分别为弹出消息的X轴与Y周偏移量
 * 往上移yOffset加负值，往左移xOffset同理
 * position默认居中center，可为其他参数：mid-top（中上）、mid-bottom（中下）
 * left-top（左上）、left-mid（左中）、left-bottom（左下）
 * right-top（右上）、right-mid（右中）、right-bottom（右下）
 */
function repositionPopup(location) {
    let position = location.position || 'center',
        xOffset = 0 || position.xOffset,
        yOffset = 0 || osition.yOffset;
    // 获取浏览器窗口的尺寸
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    // 获取元素本身的尺寸
    let width = popup.offsetWidth;
    let height = popup.offsetHeight;

    //设置消息位置
    switch (position) {
        //居中
        case 'center':
            popup.style.left = windowWidth / 2 - width / 2 + xOffset + 'px';
            popup.style.right = 'auto';
            popup.style.top = windowHeight / 2 - height / 2 + yOffset + 'px';
            break;

        //中上
        case 'mid-top':
            popup.style.left = windowWidth / 2 - width / 2 + xOffset + 'px';
            popup.style.right = 'auto';
            popup.style.top = yOffset + 'px';
            break;
        //中下
        case 'mid-bottom':
            popup.style.left = windowWidth / 2 - width / 2 + xOffset + 'px';
            popup.style.right = 'auto';
            popup.style.top = windowHeight - height + yOffset + 'px';
            break;

        //左上
        case 'left-top':
            popup.style.left = xOffset + 'px';
            popup.style.right = 'auto';
            popup.style.top = yOffset + 'px';
            break;
        //左中
        case 'left-mid':
            popup.style.left = xOffset + 'px';
            popup.style.right = 'auto';
            popup.style.top = windowHeight / 2 - height / 2 + yOffset + 'px';
            break;
        //左下
        case 'left-bottom':
            popup.style.left = xOffset + 'px';
            popup.style.right = 'auto';
            popup.style.top = windowHeight - height + yOffset + 'px';
            break;

        //右上
        case 'right-top':
            popup.style.left = 'auto';
            popup.style.right = -xOffset + 'px';
            popup.style.top = yOffset + 'px';
            break;
        //右中
        case 'right-mid':
            popup.style.left = 'auto';
            popup.style.right = -xOffset + 'px';
            popup.style.top = windowHeight / 2 - height / 2 + yOffset + 'px';
            break;
        //右下
        case 'right-bottom':
            popup.style.left = 'auto';
            popup.style.right = -xOffset + 'px';
            popup.style.top = windowHeight - height + yOffset + 'px';
            break;
        default:
            popup.style.left = windowWidth / 2 - width / 2 + xOffset + 'px';
            popup.style.right = 'auto';
            popup.style.top = windowHeight / 2 - height / 2 + yOffset + 'px';
    };
};
