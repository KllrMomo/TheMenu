import React from "react";

interface RestaurantCardProps {
  name: string;
  address: string;
}

export function RestaurantCard({ name, address }: RestaurantCardProps) {
  return (
    <div className="shadow-lg overflow-hidden rounded-lg bg-white ">
      <div className="bg-[#920728] text-white p-4 shadow-lg flex items-center justify-center mb-4">
        <p className="text-white, py-20">Image not available</p>
      </div>
      <div className="flex flex-col items-start justify-center px-2">
        <h3 className="text-md font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-700 text-sm mb-4">{address}</p>
      </div>
    </div>
  );
}
