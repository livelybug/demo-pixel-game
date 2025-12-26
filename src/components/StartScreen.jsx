import React, { useState } from 'react';

const StartScreen = ({ onStart }) => {
  const [id, setId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.trim()) {
      onStart(id.trim());
    }
  };

  return (
    <div className="screen nes-container with-title is-centered is-dark">
      <p className="title">Pixel Quiz</p>
      <div style={{ margin: "2rem 0" }}>
        <i className="nes-icon trophy is-large"></i>
      </div>
      <p>Enter your ID to start the challenge!</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
        <div className="nes-field">
          <label htmlFor="id_field">Player ID</label>
          <input
            type="text"
            id="id_field"
            className="nes-input"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="e.g. Player1"
            autoFocus
          />
        </div>

        <button
          type="submit"
          className={`nes-btn is-primary ${!id.trim() ? 'is-disabled' : ''}`}
          disabled={!id.trim()}
          style={{ marginTop: "2rem", width: "100%" }}
        >
          START GAME
        </button>
      </form>
    </div>
  );
};

export default StartScreen;
