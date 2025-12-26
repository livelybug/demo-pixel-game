# Pixel Art Quiz Game (React + Google Apps Script)

這是一個結合 React 前端與 Google Sheets 後端的像素風問答遊戲。

## 🛠️ 安裝操作 (Installation)

### 1. 取得專案代碼
若是從 Git 下載：
```bash
git clone <repository-url>
cd demo-pixel-game
```

### 2. 安裝依賴套件
確保您的電腦已安裝 node.js (建議 v18 以上)。
```bash
npm install
```

### 3. 環境變數設定
複製範例檔並建立 `.env` 檔案：
```bash
cp .env .env.local
```
編輯 `.env` (或 `.env.local`)，設定變數：
```env
VITE_GOOGLE_APP_SCRIPT_URL=你的_Google_Apps_Script_URL (稍後部署後填入)
VITE_PASS_THRESHOLD=3           # 通過門檻 (答對幾題算過關)
VITE_QUESTION_COUNT=5           # 每次遊玩隨機抽取的題數
VITE_USE_MOCK_DATA=true         # true: 使用模擬資料 (開發用), false: 連接 Google Sheets
```

### 4. 啟動開發伺服器
```bash
npm run dev
```
打開瀏覽器訪問顯示的 URL (例如 `http://localhost:5173`)。

---

## 📊 Google Sheets 操作

### 1. 建立試算表
在 Google Drive 建立一個新的 Google Sheets，建議命名為 `Pixel Quiz Database`。

### 2. 設定工作表 (Sheets)
此專案需要兩個工作表，請務必依照下方名稱命名並設定標題列 (Row 1)。

#### 工作表 1：`題目`
| 題號 | 題目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

#### 工作表 2：`回答`
| ID | 闖關次數 | 總分 | 最高分 | 第一次通关分数 | 花了几次通关 | 最近游玩时间 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
## ⚙️ Google Apps Script (GAS) 操作

### 1. 開啟腳本編輯器
在您的 Google Sheet 中，點擊上方選單：
`擴充功能 (Extensions)` > `Apps Script`。

### 2. 貼上程式碼
1. 清空Google Sheet `Apps Script`編輯器中檔案的所有內容 (如果有的話)。
2. 開啟本專案中的 `Code.gs` 檔案。
3. 全選複製內容，並貼上到 GAS 編輯器中。
4. 按下磁碟片圖示 (或是 `Ctrl + S`) 儲存，專案名稱可隨意取 (例如 `PixelQuizAPI`)。

### 3. 部署為網路應用程式 (Web App)
為了讓前端 React 能存取資料，必須進行部署。

1. 點擊右上角的 **「部署 (Deploy)」** > **「新增部署 (New deployment)」**。
2. 點擊左側齒輪圖示，選擇 **「網頁應用程式 (Web app)」**。
3. 設定如下：
   - **說明**：Pixel Quiz API v1
   - **執行身分 (Execute as)**：**我 (Me)** (重要！讓程式以您的權限讀寫試算表)
   - **誰可以存取 (Who has access)**：**所有人 (Anyone)** (重要！這樣前端才能不需登入 Google 帳號即可呼叫 API)
4. 點擊 **「部署 (Deploy)」**。
5. (初次部署) 會跳出「授權存取」視窗：
   - 點擊「核對權限」。
   - 選擇您的 Google 帳號。
   - 若出現「Google 尚未驗證這個應用程式」，點擊 **「進階 (Advanced)」** > **「前往 ... (不安全)」**。
   - 點擊 **「允許 (Allow)」**。
6. 部署成功後，複製 **「網頁應用程式網址 (Web App URL)」** (以 `https://script.google.com/macros/s/...` 開頭)。

### 4. 回填 URL
回到前端專案的 `.env` 檔案，將剛剛複製的 URL 貼上：
```env
VITE_GOOGLE_APP_SCRIPT_URL=你的網址
VITE_USE_MOCK_DATA=false
```
(記得將 `Use Mock Data` 設為 `false` 才能連線到真實資料)

---

## 🤖 測試題庫：生成式 AI 基礎知識
您可以直接複製下方內容到您的 Google Sheet 「題目」工作表 (從 A2 開始貼上)。

| 題號 | 題目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 什麼是「生成式 AI」的主要特徵？ | 只能分析數據 | 可以創造新的內容 | 只能下棋 | 只能做語音辨識 | B |
| 2 | 以下哪一個是 OpenAI 開發的知名語言模型？ | BERT | Stable Diffusion | GPT-4 | Midjourney | C |
| 3 | 在 Prompt Engineering 中，「Zero-shot」是指什麼？ | 給予 0 個範例 | 給予 100 個範例 | 電腦當機 | 錯誤的指令 | A |
| 4 | 「幻覺 (Hallucination)」在 AI 領域通常指什麼？ | AI 看到鬼 | AI 產生自信但錯誤的資訊 | VR 虛擬實境技術 | 螢幕閃爍 | B |
| 5 | 下列哪種模型主要用於「文字生成圖片」？ | LLM | Transformer | Diffusion Model | RNN | C |
| 6 | ChatGPT 中的 "GPT" 全名是？ | General Pre-trained Tool | Generative Pre-trained Transformer | Good Public Technology | Global Processing Text | B |
| 7 | 訓練大型語言模型 (LLM) 通常需要大量的什麼？ | 水 |電力與數據 (GPU) | 鍵盤 | 滑鼠 | B |
| 8 | 什麼是 RAG (Retrieval-Augmented Generation)？ | 一種舞蹈 | 隨機生成技術 | 檢索增強生成 | 紅綠燈演算法 | C |
| 9 | 哪家公司開發了 Gemini 模型？ | Microsoft | Google | Meta | Apple | B |
| 10 | 為了讓 AI 回答更精確，我們通常會調整哪個參數來控制「隨機性」？ | Temperature (溫度) | Color (顏色) | Volume (音量) | Speed (速度) | A |

---

## 🚀 自動部署 (GitHub Pages)

本專案已設定 GitHub Actions，只要 Push 到 `main` 分支即可自動部署到 GitHub Pages。

### 設定步驟

1.  **啟用 GitHub Pages**
    - 進入 GitHub Repo > **Settings** > **Pages**。
    - 在 **Build and deployment** 下，`Source` 選擇 **Deploy from a branch**。
    - 但 **不需要** 手動選擇分支 (Action 會自動建立 `gh-pages`)，或者如果 Action 跑完後沒出現，可手動選 `gh-pages` / `/ (root)`。

2.  **設定 Secrets (環境變數)**
    - 進入 GitHub Repo > **Settings** > **Secrets and variables** > **Actions**。
    - 點擊 **New repository secret**，依序加入以下變數 (參考您的 `.env` 或 `.env.example`)：
        - `VITE_GOOGLE_APP_SCRIPT_URL`: 您的 GAS Web App 網址
        - `VITE_PASS_THRESHOLD`: 例如 `3`
        - `VITE_QUESTION_COUNT`: 例如 `5`
        - `VITE_USE_MOCK_DATA`: 建議設為 `false`

3.  **觸發部署**
    - 將程式碼 Push 到 `main` 分支：
    ```bash
    git push origin main
    ```
    - 到 **Actions** 頁籤查看部署進度。
    - 完成後，網頁會上線於 `https://<您的帳號>.github.io/<Repo名稱>/`。
