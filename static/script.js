
function submitReport() {
    const form = document.getElementById('reportForm');
    const formData = new FormData(form);

    fetch(window.location.href, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('statusMessage').innerText = data.message;
        setTimeout(() => {
            document.getElementById('statusMessage').innerText = "";
        }, 5000);
    })
    .catch(error => {
        document.getElementById('statusMessage').innerText = "エラーが発生しました";
    });
}

function saveAndNavigate(event, targetUrl) {
    event.preventDefault();
    const form = document.getElementById('reportForm');
    const formData = new FormData(form);

    fetch(window.location.href, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            window.location.href = targetUrl;


        } else {
            document.getElementById('statusMessage').innerText = "保存に失敗しました。";
        }
    })
    .catch(error => {
        document.getElementById('statusMessage').innerText = "エラーが発生しました";
    });


}

// 日報コピー
function copyReport() {
    const workTime = document.querySelector("input[name='work_time']").value;
    const workTypeToday = document.querySelector("select[name='work_type_today']").value;
    const todaySchedule = document.querySelector("textarea[name='today_schedule']").value;
    const todayPerformance = document.querySelector("textarea[name='today_performance']").value;
    const workTypeNext = document.querySelector("select[name='work_type_next']").value;
    const nextDayPlan = document.querySelector("textarea[name='next_day_plan']").value;

    const content = `勤務時間: ${workTime}\n本日の勤務形態: ${workTypeToday}\n\n【本日の予定】\n${todaySchedule}\n\n【本日の実績】\n${todayPerformance}\n\n翌日の勤務形態: ${workTypeNext}\n\n【翌日の計画】\n${nextDayPlan}`;

    navigator.clipboard.writeText(content).then(() => {
        document.getElementById('statusMessage2').innerText = "クリップボードにコピーしました。";

        setTimeout(() => {
            document.getElementById('statusMessage2').innerText = "";
        }, 5000);
    });
}

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// 曜日の表示
const weekdays = ["月", "火", "水", "木", "金", "土", "日"];

// カレンダーをロード
function loadCalendar(year = currentYear, month = currentMonth) {
    const calendar = document.getElementById('calendar');
    const title = document.getElementById('calendar-title');
    const weekdaysContair = document.getElementById('calendar-weekdays');

    // カレンダーのタイトル（年と月）
    title.innerText = `${year}年 ${month + 1}月`;

    //曜日のヘッダーを表示
    weekdaysContair.innerHTML = '';
    weekdays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.innerText = day;
        weekdaysContair.appendChild(dayElement);
    })

    // 現在の月の最初と最後の日を取得
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    calendar.innerHTML = ''; // カレンダーをクリア
    const startDay = (firstDay.getDay() + 6) % 7 //月曜日をスタートに合わせる

    //空のセルを追加
    for (let i = 0; i < startDay; i ++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    //各日付を生成
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day);
        const dayElement = document.createElement('div');
        
        dayElement.className = 'calendar-day';
        if (date.toDateString() === new Date().toDateString()) {
            dayElement.classList.add('today');
        }

        dayElement.innerText = day;
        
        // 日付クリック時の処理
        dayElement.onclick = function() {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            window.location.href = `/report/${dateStr}`;
        };

        calendar.appendChild(dayElement);
    }
}

//月を変更する関数
function changeMonth(offset) {
    currentMonth += offset
    if(currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar(currentYear, currentMonth);
}

// ページロード時にカレンダーを生成
window.onload = function() {
    loadCalendar();
};