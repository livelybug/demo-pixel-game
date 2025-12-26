import React from 'react';

const GameLayout = ({ children }) => {
  return (
    <div className="game-container">
      {/* 
        We could add a CRT monitor border effect here later if we want.
        For now, just a centered flexible container.
       */}
      <section className="nes-container is-dark is-rounded">
        {children}
      </section>

      <footer style={{ textAlign: "center", marginTop: "20px", fontSize: "0.8rem", color: "#666" }}>
        <p>Pixel Quiz Game &copy; 2025</p>
      </footer>
    </div>
  );
};

export default GameLayout;
