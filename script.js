document.addEventListener('DOMContentLoaded', function() {
    // 标签切换功能
    const tabButtons = document.querySelectorAll('.tab-btn');
    const timerDisplays = document.querySelectorAll('.timer-display');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            timerDisplays.forEach(display => display.classList.remove('active'));
            
            // 添加当前活动状态
            button.classList.add('active');
            const mode = button.getAttribute('data-mode');
            document.getElementById(`${mode}-display`).classList.add('active');
        });
    });
    
    // 初始化各种显示模式
    initDayCountMode();
    initWeekMode();
    initCountdownMode();
    initYearMode();
    initLifeMode();
});

// 周度计数模式初始化
function initWeekMode() {
    const gridContainer = document.querySelector('#week-display .grid');
    const progressBar = document.querySelector('#week-display .progress');
    
    // 获取当前日期信息
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0-6，0代表周日
    const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // 将周日(0)转换为7
    const totalDays = 7; // 一周7天
    
    // 创建网格
    createGrid(gridContainer, totalDays, adjustedDayOfWeek);
    
    // 设置进度条
    const progressPercentage = (adjustedDayOfWeek / totalDays) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // 更新统计信息
    document.querySelector('#week-display .current').textContent = `${adjustedDayOfWeek}/${totalDays}`;
}

// 天数计数模式初始化（月度视图）
function initDayCountMode() {
    const gridContainer = document.querySelector('#day-count-display .grid');
    const progressBar = document.querySelector('#day-count-display .progress');
    
    // 获取当前日期信息
    const now = new Date();
    const currentDay = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    // 更新显示标题
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    document.querySelector('#day-count-display .number').textContent = `${monthNames[now.getMonth()]}`;
    
    // 创建网格
    createGrid(gridContainer, daysInMonth, currentDay);
    
    // 设置进度条
    const progressPercentage = (currentDay / daysInMonth) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // 更新统计信息
    document.querySelector('#day-count-display .current').textContent = `${currentDay}/${daysInMonth}`;
}

// 倒计时模式初始化
function initCountdownMode() {
    const startButton = document.querySelector('.start-btn');
    const timerDisplay = document.querySelector('#countdown-display .number');
    const progressBar = document.querySelector('#countdown-display .progress');
    let countdown;
    let totalSeconds = 25 * 60; // 25分钟
    let remainingSeconds = totalSeconds;
    let isRunning = false;
    
    // 更新倒计时显示
    function updateCountdown() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 更新进度条
        const progressPercentage = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        if (remainingSeconds === 0) {
            clearInterval(countdown);
            isRunning = false;
            startButton.textContent = '开始';
            // 可以添加提示音或通知
        }
    }
    
    // 开始/暂停按钮点击事件
    startButton.addEventListener('click', () => {
        if (isRunning) {
            // 暂停倒计时
            clearInterval(countdown);
            isRunning = false;
            startButton.textContent = '开始';
        } else {
            // 如果倒计时已结束，重置
            if (remainingSeconds === 0) {
                remainingSeconds = totalSeconds;
            }
            
            // 开始倒计时
            isRunning = true;
            startButton.textContent = '暂停';
            countdown = setInterval(() => {
                remainingSeconds--;
                updateCountdown();
                
                if (remainingSeconds === 0) {
                    clearInterval(countdown);
                    isRunning = false;
                    startButton.textContent = '重置';
                }
            }, 1000);
        }
    });
    
    // 初始显示
    updateCountdown();
}

// 年份模式初始化
function initYearMode() {
    const gridContainer = document.querySelector('#year-display .grid');
    const progressBar = document.querySelector('#year-display .progress');
    
    // 获取当前日期信息
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    const daysInYear = isLeapYear(now.getFullYear()) ? 366 : 365;
    
    // 创建网格
    createGrid(gridContainer, daysInYear, dayOfYear);
    
    // 设置进度条
    const progressPercentage = (dayOfYear / daysInYear) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // 更新统计信息
    document.querySelector('#year-display .current').textContent = `${dayOfYear}/${daysInYear}`;
}

// 日期模式初始化
function initDateMode() {
    const dotContainer = document.querySelector('#date-display .dot-grid');
    
    // 获取当前日期信息
    const now = new Date();
    const currentDay = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    // 创建点阵
    createDotGrid(dotContainer, daysInMonth, currentDay);
    
    // 更新日期显示
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    document.querySelector('#date-display .date-header').textContent = `${monthNames[now.getMonth()]}${currentDay}日`;
    
    // 更新统计信息
    document.querySelector('#date-display .current').textContent = `${currentDay}/${daysInMonth}`;
}

// 创建网格函数
function createGrid(container, total, current) {
    container.innerHTML = '';
    
    for (let i = 1; i <= total; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        
        if (i <= current) {
            gridItem.classList.add('active');
        }
        
        if (i === current) {
            gridItem.classList.add('highlight');
        }
        
        container.appendChild(gridItem);
    }
}

// 人生模式初始化
function initLifeMode() {
    const configForm = document.querySelector('#life-display .config-form');
    const lifeContent = document.querySelector('#life-display .life-content');
    const gridContainer = document.querySelector('#life-display .grid');
    const progressBar = document.querySelector('#life-display .progress');
    const statsText = document.querySelector('#life-display .current');

    // 从localStorage获取配置
    const birthdate = localStorage.getItem('birthdate');
    const lifeExpectancy = localStorage.getItem('lifeExpectancy');

    if (!birthdate || !lifeExpectancy) {
        // 首次使用，显示配置表单
        configForm.style.display = 'block';
        lifeContent.style.display = 'none';
    } else {
        // 已配置，显示进度
        configForm.style.display = 'none';
        lifeContent.style.display = 'block';
        updateLifeProgress();
    }

    // 保存按钮点击事件
    document.querySelector('.save-btn').addEventListener('click', () => {
        const birthdateInput = document.querySelector('#birthdate');
        const lifeExpectancyInput = document.querySelector('#lifeExpectancy');

        if (birthdateInput.value && lifeExpectancyInput.value) {
            localStorage.setItem('birthdate', birthdateInput.value);
            localStorage.setItem('lifeExpectancy', lifeExpectancyInput.value);

            configForm.style.display = 'none';
            lifeContent.style.display = 'block';
            updateLifeProgress();
        }
    });

    // 如果已配置，设置输入框的值
    if (birthdate && lifeExpectancy) {
        document.querySelector('#birthdate').value = birthdate;
        document.querySelector('#lifeExpectancy').value = lifeExpectancy;
    }
}

// 更新人生进度
function updateLifeProgress() {
    const birthdate = new Date(localStorage.getItem('birthdate'));
    const lifeExpectancy = parseInt(localStorage.getItem('lifeExpectancy'));
    const now = new Date();

    // 计算已经过去的年数（精确到小数点后一位）
    const yearsLived = (now - birthdate) / (365.25 * 24 * 60 * 60 * 1000);
    const yearsLivedRounded = Math.floor(yearsLived * 10) / 10;

    // 更新网格（每个格子代表一年）
    const gridContainer = document.querySelector('#life-display .grid');
    createGrid(gridContainer, lifeExpectancy, Math.floor(yearsLived));

    // 更新进度条
    const progressPercentage = (yearsLived / lifeExpectancy) * 100;
    document.querySelector('#life-display .progress').style.width = `${Math.min(progressPercentage, 100)}%`;

    // 更新统计信息
    document.querySelector('#life-display .current').textContent = `已度过${yearsLivedRounded}年`;
}

// 创建点阵函数
function createDotGrid(container, total, current) {
    container.innerHTML = '';
    
    for (let i = 1; i <= total; i++) {
        const dotItem = document.createElement('div');
        dotItem.classList.add('dot-item');
        
        if (i <= current) {
            dotItem.classList.add('active');
        }
        
        if (i === current) {
            dotItem.classList.add('highlight');
        }
        
        container.appendChild(dotItem);
    }
}

// 判断是否为闰年
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}