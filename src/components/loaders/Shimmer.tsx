import React from "react";
const Shimmer = () => {

  const overlay = "relative isolate before:animate-[shimmer_2s_infinite] before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-rose-100/10 before:to-transparent" 
  return (
    <div className="h-24 w-full space-y-3 overflow-hidden">
      <div className={`h-4 rounded-sm relative bg-rose-100/10 ${overlay}`}></div>
      <div className={`h-4 rounded-sm relative bg-rose-100/10 ${overlay}`}></div>
      <div className={`h-4 rounded-sm relative bg-rose-100/10 ${overlay}`}></div>
    </div>
  );
};

export default Shimmer;
