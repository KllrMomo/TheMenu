import React from "react";

interface RestaurantCardProps {
  name: string;
  address: string;
}

export function RestaurantCard({ name, address }: RestaurantCardProps) {
  return (
    <div className="gap-y-4">
      <div className="bg-[#920728] text-white p-4 shadow-lg flex items-center justify-center">
        <p className="text-white">Image not available</p>
      </div>
      <div className="flex flex-col items-center justify-start">
        <h3 className="text-md font-bold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-700 text-sm">{address}</p>
      </div>
    </div>
  );
}
