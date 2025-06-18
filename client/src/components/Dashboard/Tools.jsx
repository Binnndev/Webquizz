import React from "react";
import Emoji from "../Layout/Emoji";
import ToolTip from "./ToolTip";
import { Link } from "react-router-dom";

const Tools = (props) => {
  return (
    <div className={props.classes}>
      <div className="profile-name">{props.title}</div>
      <div className="profile-email">{props.subtitle}</div>
      <div className="row mt-4">
        <div className="card">
          <div className="tooltip-wrapper">
            <Link to="/quiz-builder">
              <button className="tool-button">
                <Emoji emoji="💀" /> Tạo Quiz
              </button>
            </Link>
            <ToolTip
              emoji="🪓"
              title="Make them suffer!"
              description="Bạn sẽ khiến họ ước rằng mình chưa từng sinh ra!"
            />
          </div>
        </div>
        <div className="card">
          <div className="tooltip-wrapper">
            <Link to="/quiz-fetcher">
              <button className="tool-button">
                <Emoji emoji="⚔️" /> Tham Gia Quiz
              </button>
            </Link>
            <ToolTip
              emoji="⚰️"
              title="You will not survive!"
              description="Bạn sẽ không sống sót đâu!"
            />
          </div>
        </div>
        <div className="card">
          <div className="tooltip-wrapper">
            <button disabled="disabled" className="tool-button grayed">
              <Emoji emoji="🔥" /> Sinh tồn (Pro)
            </button>
          </div>
        </div>
        <div className="card">
          <div className="tooltip-wrapper">
            <button disabled="disabled" className="tool-button grayed">
              <Emoji emoji="🩸" /> Chinh phục bài quiz thôi! (Pro)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
