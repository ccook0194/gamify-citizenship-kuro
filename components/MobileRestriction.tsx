"use client";

import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

const MobileRestriction = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setShowPopup(true);
    }
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center text-black mx-5">
        <h2 className="text-xl font-bold">Sorry, Kuro Cat Universe is not mobile supported at the moment.</h2>
        <p className="mt-2">Login through desktop for the best experience.</p>
      </div>
    </div>
  );
};

export default MobileRestriction;