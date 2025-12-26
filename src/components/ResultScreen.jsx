import React from 'react';

const ResultScreen = ({ result, onRestart, loading, error }) => {
  if (loading) {
    return (
      <div className="screen nes-container is-dark is-centered">
        <p>Calculating Score...</p>
        <progress className="nes-progress is-primary"></progress>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen nes-container is-dark is-centered">
        <p className="is-error">Error!</p>
        <p>{error}</p>
        <button className="nes-btn is-error" onClick={onRestart}>Try Again</button>
      </div>
    )
  }

  if (!result) return null;

  const { score, correctCount, totalQuestions, passed } = result;

  return (
    <div className="screen nes-container with-title is-dark is-centered">
      <p className="title">Result</p>

      <div style={{ margin: "2rem 0" }}>
        <i className={`nes-icon is-large ${passed ? 'heart' : 'close'}`}></i>
      </div>

      <h2>{passed ? "MISSION COMPLETED" : "GAME OVER"}</h2>

      <div className="nes-table-responsive" style={{ margin: "2rem 0" }}>
        <table className="nes-table is-bordered is-centered is-dark" style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>Score</td>
              <td>{score}</td>
            </tr>
            <tr>
              <td>Correct</td>
              <td>{correctCount} / {totalQuestions}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td style={{ color: passed ? "#92cc41" : "#e76e55" }}>
                {passed ? "PASSED" : "FAILED"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className="nes-btn is-primary" onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
};

export default ResultScreen;
