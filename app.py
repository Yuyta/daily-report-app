from flask import Flask, render_template, request, redirect, url_for, session, jsonify, g
from datetime import datetime, timedelta
import pandas as pd
import os
import re
import csv
import sqlite3

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# ユーザー情報の保存先
# USERS_FILE = 'users.csv'
# REPORTS_DIR = 'reports'

# DBの名前
DATABASE = "daily_report_app.db"

# DB初期化
def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    # usersテーブル作成
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    # reportsテーブル作成
    c.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            work_time TEXT,
            work_type_today TEXT,
            today_schedule TEXT,
            today_performance TEXT,
            work_type_next TEXT,
            next_day_plan TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id),
            UNIQUE(user_id, date)
        )
    ''')
    conn.commit()
    conn.close()


os.makedirs(REPORTS_DIR, exist_ok=True)

# 既に登録されているユーザーかどうかを確認
# def user_exists(username):
#     if not os.path.exists(USERS_FILE):
#         return False
#     with open(USERS_FILE, mode='r', encoding="utf-8") as f:
#         reader = csv.reader(f)
#         for row in reader:
#             if row[0] == username:
#                 return True
#     return False

# 新規ユーザーを登録 CSV管理に変更
# def register_user(username, password):
    
#     with open(USERS_FILE, mode='a', newline='', encoding="utf-8") as f:
#         writer = csv.writer(f)
#         writer.writerow([username, password])

# 新規ユーザーを登録 DB管理に変更
def register_user(username, password):
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute('INSERT INTO users (username, password) VALUES(?, ?)',(username, password))
        conn.commit()
    except sqlite3.IntegrityError:
        return False #ユーザー名が重複
    finally:
        conn.close()
    return True

# ユーザー認証 CSV管理に変更
# def authenticate_user(username, password):

#     if not os.path.exists(USERS_FILE):
#         return False
#     with open(USERS_FILE, mode='r', encoding="utf-8") as f:
#         reader = csv.reader(f)
#         for row in reader:
#             if row[0] == username and row[1] == password:
#                 return True
#     return False

# ユーザー認証 DB管理に変更
def authenticate_user(username, password):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('SELECT id FROM users WHERE username = ? AND password = ?', (username, password))
    user = c.fetchone()
    conn.close()
    return user[0] if user else None

# ログインしているか確認するデコレーター CSV管理
def login_required(f):
    def decorated_function(*args, **kwargs):
        if "username" not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# ログインしているか確認するデコレーター DB管理
def login_required(f):
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# サインアップ　CSV管理
# @app.route('/signup', methods=['GET', 'POST'])
# def signup():
#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']
        
#         if user_exists(username):
#             return redirect(url_for('signup', message="このユーザー名は既に登録されています。別のユーザー名をお使いください。"))
        
#         register_user(username, password)
#         return redirect(url_for('login', message="サインアップに成功しました！ログインページに移動します。"))
    
#     return render_template('signup.html')

# サインアップ　DB管理
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if register_user(username, password):
            return redirect(url_for('login', message="サインアップに成功しました！ログインページに移動します。"))
        else:
            return redirect(url_for('signup', message="このユーザー名は既に登録されています。別のユーザー名をお使いください。"))
    return render_template('signup.html')

# ログイン　CSV管理
# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']
        
#         if authenticate_user(username, password):
#             session['username'] = username
#             return redirect(url_for('index'))
#         else:
#             return redirect(url_for('login', message="ユーザー名またはパスワードが違います"))
    
#     return render_template('login.html')

# ログイン　DB管理
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_id = authenticate_user(username, password)
        if user_id:
            session['user_id'] = user_id
            session['username'] = username
            return redirect(url_for('index'))
        else:
            return redirect(url_for('login', message="ユーザー名またはパスワードが違います"))
    return render_template('login.html')

# ログアウト
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    return redirect(url_for('login'))

# 平日のみ遷移日を取得
# 前日ボタン
def get_previous_workday(date_obj):
    if date_obj.weekday() == 0:
        return date_obj - timedelta(days=3)
    elif date_obj.weekday() == 6:
        return date_obj - timedelta(days=2)
    else:
        return date_obj - timedelta(days=1)
# 翌日ボタン
def get_next_workday(date_obj):
    if date_obj.weekday() == 4:
        return date_obj + timedelta(days=3)
    elif date_obj.weekday() == 5:
        return date_obj + timedelta(days=2)
    else:
        return date_obj + timedelta(days=1)
    
# 日報データのCSV保存関数（重複日付は上書き）
# def save_to_csv(username, data):
#     """ユーザーごとの日報データをCSVに保存"""
#     filename = os.path.join(REPORTS_DIR, f"{username}_daily_report.csv")
#     try:
#         if os.path.exists(filename):
#             df = pd.read_csv(filename, encoding="utf-8-sig")
#             if data["日付"] in df["日付"].values:
#                 df.loc[df["日付"] == data["日付"], :] = list(data.values())
#             else:
#                 df = df.append(data, ignore_index=True)
#         else:
#             df = pd.DataFrame([data])
#         df.to_csv(filename, index=False, encoding="utf-8-sig")
#         return True
#     except Exception as e:
#         print(f"CSV保存エラー: {e}")
#         return False

# 日報をDBへ保存
def save_report(user_id, data):
    try:
        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute('''
            INSERT OR REPLACE INTO reports (user_id, date, work_time, work_type_today, today_schedule,
                                            today_performance, work_type_next, next_day_plan)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)      
        ''', (user_id, data['date'], data['work_time'], data['work_type_today'],
            data['today_schedule'], data['today_performance'], data['work_type_next'], data['next_day_plan']))
        conn.commit()
    finally:
        conn.close()


# 指定された日付の日報データを取得する関数
# def get_report_by_date(filename, date):
#     if os.path.exists(filename):
#         df = pd.read_csv(filename, encoding="utf-8-sig")
#         report_data = df[df["日付"] == date]
#         if not report_data.empty:
#             return report_data.iloc[0].fillna('').to_dict()
#     return None

# 日報をDBから取得
def get_report(user_id, date):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    try:
        c.execute('''
            SELECT work_time, work_type_today, today_schedule, today_performance, work_type_next, next_day_plan
            FROM reports WHERE user_id = ? AND date = ?
        ''',(user_id, date))
        report = c.fetchone()
        conn.close()
        if report:
            return {
                "勤務時間": report[0],
                "本日の勤務形態": report[1],
                "本日の予定": report[2],
               "本日の実績": report[3],
                "翌日の勤務形態": report[4],
                "翌日の計画": report[5]
            }
        return None
    except sqlite3.InterfaceError:
        return None

# urlが正しいフォーマットか確認
def is_valid_date_format(date_str):
    return re.match(r'^\d{4}-\d{2}-\d{2}$', date_str) is not None

@app.route('/')
@login_required
def index():
    today = datetime.now().date()
    return redirect(url_for('report', date=today.strftime('%Y-%m-%d')))

# 日報ページ CSV管理
# @app.route('/report/<date>', methods=['GET', 'POST'])
# @login_required
# def report(date):
#     username = session['username']
#     filename = os.path.join(REPORTS_DIR, f"{username}_daily_report.csv")
    
#     if not is_valid_date_format(date):
#         return jsonify({"status": "error", "message": "日付のフォーマットが正しくありません。YYYY-MM-DD形式で指定してください。"}), 400

#     date_obj = datetime.strptime(date, '%Y-%m-%d').date()
#     prev_date = get_previous_workday(date_obj).strftime('%Y-%m-%d')
#     next_date = get_next_workday(date_obj).strftime('%Y-%m-%d')

#     # 現在の日報データを取得
#     report_data = get_report_by_date(filename, date)
    
#     # 前日の「翌日の勤務形態」と「翌日の計画」を現在の日の「今日の勤務形態」と「本日の予定」に反映
#     if not report_data:
#         prev_report_data = get_report_by_date(filename, prev_date)
#         if prev_report_data:
#             report_data = {
#                 "今日の勤務形態": prev_report_data["翌日の勤務形態"],
#                 "本日の予定": prev_report_data["翌日の計画"],
#             }    
#     if request.method == 'POST':
#         data = {
#             "日付": date,
#             "勤務時間": request.form['work_time'],
#             "今日の勤務形態": request.form['work_type_today'],
#             "本日の予定": request.form['today_schedule'],
#             "本日の実績": request.form['today_performance'],
#             "翌日の勤務形態": request.form['work_type_next'],
#             "翌日の計画": request.form['next_day_plan']
#         }
        
#         if save_to_csv(username, data):
#             return jsonify({"status": "success", "message": "登録に成功しました。"})
#         else:
#             return jsonify({"status": "error", "message": "登録に失敗しました。"})

#     report_data = get_report_by_date(filename, date)
#     return render_template(
#         'report.html',
#         date=date,
#         prev_date = prev_date,
#         next_date = next_date,
#         report_data=report_data
#     )

# 日報ページ DB管理
@app.route('/report/<date>', methods=['GET', 'POST'])
@login_required
def report(date):
    user_id = session['user_id']
    if not is_valid_date_format(date):
        return jsonify({"status": "error", "message": "日付のフォーマットが正しくありません。YYYY-MM-DD形式で指定してください。"}), 400

    date_obj = datetime.strptime(date, '%Y-%m-%d').date()
    prev_date = get_previous_workday(date_obj).strftime('%Y-%m-%d')
    next_date = get_next_workday(date_obj).strftime('%Y-%m-%d')
    if request.method == 'POST':
        data = {
            "date": date,
            "work_time": request.form['work_time'],
            "work_type_today": request.form['work_type_today'],
            "today_schedule": request.form['today_schedule'],
            "today_performance": request.form['today_performance'],
            "work_type_next": request.form['work_type_next'],
            "next_day_plan": request.form['next_day_plan']
        }
        save_report(user_id, data)
        return jsonify({"status":"success", "message":"登録に成功しました。"})
    # 現在の日報データを取得
    report_data = get_report(user_id, date)
    # 前日の「翌日の勤務形態」と「翌日の計画」を現在の日の「今日の勤務形態」と「本日の予定」に反映
    if not report_data:
        prev_report_data = get_report(get_report, prev_date)
        if prev_report_data:
            report_data = {
                "今日の勤務形態": prev_report_data['work_type_next'],
                "本日の予定": prev_report_data["next_day_plan"],
            }
    return render_template(
        'report.html',
        date=date,
        prev_date = prev_date,
        next_date = next_date,
        report_data=report_data
    )

if __name__ == '__main__':
    init_db() # アプリ起動時にDBを初期化
    app.run(debug=True)
