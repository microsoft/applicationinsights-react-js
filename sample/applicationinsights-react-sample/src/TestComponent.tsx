import React from "react";

const TestComponent = () => {

  const MatCard = ({ onClick }: { onClick: () => void }) => (
    <div
      data-sample-id="cardClick"
      role="button"
      tabIndex={0}
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "4px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <h4>MatCard</h4>
      <p>Clicking here triggers the same action as the button.</p>
    </div>
  );

  const handleAction = () => {
    alert("Action triggered!");
  };

  return (
    <div>
      <h2>Customer Click Analytics Example</h2>
      <MatCard onClick={handleAction} />
      <button data-sample-id="buttonClick" onClick={handleAction}>
        Action Button
      </button>
    </div>
  );
};

export default TestComponent;
