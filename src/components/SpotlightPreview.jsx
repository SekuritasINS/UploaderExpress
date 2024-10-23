import React from "react";
import { Spotlight } from "./Spotlight";

const SpotlightPreview = ({ children }) => {
  return (
    <div className="relative overflow-hidden bg-black/[0.96] antialiased">
      <Spotlight
        className="-top-50 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default SpotlightPreview;
