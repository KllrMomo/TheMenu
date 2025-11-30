import React from "react";

interface RestaurantCardProps {
  name: string;
  address: string;
}

export function RestaurantCard({ name, address }: RestaurantCardProps) {
  return (
    <>
      <div className="bg-[#920728] text-white p-4 shadow-lg">
        <p className="text-white">Image not available</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-700">{address}</p>
      </div>
    </>
  );
}
