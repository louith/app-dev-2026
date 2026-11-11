// import React from "react";

import ButtonComp from "../components/Button";

const Homepage = () => {
  const titles = ["Button 1", "Button 2", "Button 3"];
  return (
    <div className="w-full h-screen">
      {titles.map((title, index) => (
        <ButtonComp key={index}>{title}</ButtonComp>
      ))}
    </div>
  );
};

export default Homepage;
