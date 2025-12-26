const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const fetchQuestions = async (count = 10) => {
  if (USE_MOCK) {
    console.warn("Using Mock Data for fetchQuestions");
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockQuestions = Array.from({ length: count }, (_, i) => ({
          id: i + 1,
          text: `Question ${i + 1}: Which is a correct pixel art ratio?`,
          options: {
            A: "16:9",
            B: "4:3",
            C: "1:1",
            D: "21:9"
          }
        }));
        resolve(mockQuestions);
      }, 1000);
    });
  }

  try {
    const response = await fetch(`${GAS_URL}?action=getQuestions&count=${count}`);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      throw new Error("Invalid JSON response from server. Check console for details.");
    }

    if (data.error) {
      throw new Error(data.error);
    }

    // Ensure data is array
    if (!Array.isArray(data)) {
      console.error("Unexpected data format:", data);
      throw new Error("Received data is not a list of questions.");
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export const submitScore = async (data) => {
  // data: { userId, answers: [{id, selected}], passThreshold }
  if (USE_MOCK) {
    console.warn("Using Mock Data for submitScore");
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock scoring: 50% chance to pass or random score
        const total = data.answers.length;
        const correct = Math.floor(Math.random() * (total + 1));
        const score = Math.round((correct / total) * 100);

        resolve({
          success: true,
          score,
          correctCount: correct,
          totalQuestions: total,
          passed: correct >= (data.passThreshold || 6)
        });
      }, 1500);
    });
  }

  // GAS Web App POST requires correct handling of CORS, usually 'no-cors' mode 
  // doesn't return response body readable by JS.
  // HOWEVER, GAS 'text/plain' ContentService output usually works with follow redirects.
  // We use standard POST.
  const response = await fetch(GAS_URL, {
    method: 'POST', // or 'POST', GAS handles POST
    body: JSON.stringify({ action: 'submitScore', ...data }),
    // mode: 'no-cors' // If we use no-cors we can't get result. 
    // Usually GAS set to "Anyone" access allows CORS.
  });
  return response.json();
};
