import React from "react";
import CountBox from "./CountBox";

const Profile = (props) => {
  return (
    <React.Fragment>
      <div className={props.classes}>
        <div className="profile-name">{props.name}</div>
        <div className="profile-email">{props.email}</div>
        <div className="row mt-4">
          <div className="col-sm-4">
            <CountBox title="Đã tạo" number={props.curated} />
          </div>
          <div className="col-sm-4">
            <CountBox title="Đã tham gia" number={props.attended} />
          </div>
          <div className="col-sm-4">
            <CountBox title="Đạt hoàn hảo" number={props.flawless} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Profile;
