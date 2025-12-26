import React, { useState } from 'react';

const QuizScreen = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = questions[currentIndex];

  // Use DiceBear Pixel Art
  const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${currentQuestion.id || currentIndex}&backgroundColor=b6e3f4`;

  const handleOptionClick = (optionKey) => {
    const newAnswers = [
      ...answers,
      { id: currentQuestion.id, selected: optionKey }
    ];

    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish(newAnswers);
    }
  };

  return (
    <div className="screen nes-container with-title is-dark">
      <p className="title">Stage {currentIndex + 1} / {questions.length}</p>

      <div style={{ textAlign: 'center' }}>
        <img
          src={avatarUrl}
          alt="Boss Avatar"
          className="pixel-art-avatar nes-avatar is-rounded"
          style={{ width: "100px", height: "100px" }}
        />
        <p style={{ margin: "10px 0", color: "#f7d51d" }}>BOSS: "Answer me!"</p>
      </div>

      <div className="nes-container is-rounded is-dark" style={{ margin: "20px 0" }}>
        <p className="question-text">{currentQuestion.text}</p>
      </div>

      <div className="options-grid">
        {Object.entries(currentQuestion.options).map(([key, text]) => (
          <button
            key={key}
            className="nes-btn"
            onClick={() => handleOptionClick(key)}
          >
            {key}. {text}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <progress className="nes-progress is-primary" value={currentIndex} max={questions.length}></progress>
      </div>
    </div>
  );
};

export default QuizScreen;
