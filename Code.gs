function doGet(e) {
  const params = e.parameter;
  const action = params.action;
  
  if (action === "getQuestions") {
    return getQuestions(params.count);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === "submitScore") {
      return submitScore(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getQuestions(count) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("題目");
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ 
      error: "Sheet '題目' not found. Please verify the sheet name." 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Assuming header is row 1
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) {
     return ContentService.createTextOutput(JSON.stringify({ 
      error: "Sheet '題目' is empty or has only headers." 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const headers = rows[0]; // 題號, 題目, A, B, C, D, 解答
  const data = rows.slice(1);
  
  // Shuffle and pick N
  const shuffled = data.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count || 10);
  
  const questions = selected.map(row => ({
    id: row[0],
    text: row[1],
    options: {
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
    },
    answer: row[6] // In a real secure app, maybe don't send answer? But for simple client-side check it's easier, or check on server. 
    // User requested "成績計算：將作答結果傳送到 Google Apps Script 計算成績".
    // So the client sends answers, server calculates? Or client calculates and sends score?
    // User said: "將作答結果傳送到 Google Apps Script 計算成績" (Calculate score on GAS).
    // So we should NOT send the answer to client.
  }));

  // Remove answer from client response
  const clientQuestions = questions.map(q => ({
    id: q.id,
    text: q.text,
    options: q.options
    // No answer here
  }));
  
  // We need to store the session answers somewhere? Or just verify on submit?
  // Simplest stateless: Client sends [{id: 1, answer: 'A'}, ...] and Server checks against Sheet.
  
  return ContentService.createTextOutput(JSON.stringify(clientQuestions)).setMimeType(ContentService.MimeType.JSON);
}

function submitScore(data) {
  // data: { id: "userId", answers: [{id, selected}, ...], timeSpent: ... }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const qSheet = ss.getSheetByName("題目");
  const aSheet = ss.getSheetByName("回答"); // ID, 闖關次數, 總分, 最高分, 第一次通關分數, 花了幾次通關, 最近遊玩時間
  
  // 1. Calculate Score
  const qRows = qSheet.getDataRange().getValues();
  const qData = qRows.slice(1);
  const qMap = new Map();
  qData.forEach(row => {
    qMap.set(String(row[0]), String(row[6]).toUpperCase().trim()); // ID -> Answer
  });
  
  let score = 0;
  let correctCount = 0;
  const totalQuestions = data.answers.length;
  
  data.answers.forEach(ans => {
    const correctLink = qMap.get(String(ans.id));
    if (correctLink && correctLink === String(ans.selected).toUpperCase().trim()) {
      correctCount++;
    }
  });
  
  score = Math.round((correctCount / totalQuestions) * 100);
  
  // 2. Update/Insert User Record
  const userId = data.userId;
  const now = new Date();
  
  const aRows = aSheet.getDataRange().getValues();
  let userRowIndex = -1;
  
  // Find user by ID (Column 0)
  for (let i = 1; i < aRows.length; i++) {
    if (String(aRows[i][0]) === userId) {
      userRowIndex = i + 1; // 1-based row index
      break;
    }
  }
  
  const isPassed = correctCount >= (data.passThreshold || 6); // Default 6 if not sent
  const isFirstPass = false; // logic below
  
  if (userRowIndex > -1) {
    // Update existing
    // Columns: ID(1), Count(2), TotalScore(3), MaxScore(4), FirstPassScore(5), TriesToPass(6), LastPlayed(7)
    
    const currentRow = aRows[userRowIndex - 1];
    const newCount = currentRow[1] + 1;
    const newTotal = currentRow[2] + score;
    const newMax = Math.max(currentRow[3], score);
    
    let firstPassScore = currentRow[4];
    let triesToPass = currentRow[5];
    
    if (currentRow[4] === "" && isPassed) {
         firstPassScore = score;
         triesToPass = newCount;
    }
    
    aSheet.getRange(userRowIndex, 2, 1, 6).setValues([[
      newCount,
      newTotal,
      newMax,
      firstPassScore,
      triesToPass,
      now
    ]]);
    
  } else {
    // New User
    let firstPassScore = "";
    let triesToPass = "";
    
    if (isPassed) {
      firstPassScore = score;
      triesToPass = 1;
    }
    
    aSheet.appendRow([
      userId,
      1,
      score,
      score,
      firstPassScore,
      triesToPass,
      now
    ]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    score: score,
    correctCount: correctCount,
    totalQuestions: totalQuestions,
    passed: isPassed
  })).setMimeType(ContentService.MimeType.JSON);
}
