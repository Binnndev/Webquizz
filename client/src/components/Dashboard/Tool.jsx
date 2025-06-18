import React from "react";
import ToolTip from "./ToolTip";
import Emoji from "../Layout/Emoji";

const Tool = (props) => {
  return (
    <div className="tooltip-wrapper">
      <button className="tool-button">
        <Emoji emoji="💀" /> Tham Gia Quiz
      </button>
      <div className="right">
        <ToolTip
          emoji="🪓"
          title="Bắt họ phải chịu đựng!"
          description="You are going to make them wish they were never born!"
        />
      </div>
    </div>
  );
};

export default Tool;
