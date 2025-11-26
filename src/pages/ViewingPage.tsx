import { Link, useParams } from "react-router-dom";
import MenuImage from "../assets/images/Menu.png";
import { useState } from "react";

export function ViewingPage() {
    const restaurantId = useParams();
    const [open, setOpen] = useState(false);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Menu image */}
            <div className="col-span-1 flex justify-center">
                <img src={MenuImage} alt="" onClick={() => setOpen(true)} className="w-full h-full object-cover rounded-lg" />
                {/* FULLSCREEN MODAL */}
                {open && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
                        onClick={() => setOpen(false)}
                    >
                        <img
                            src={MenuImage}
                            alt="Full view"
                            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-xl"
                        />
                    </div>
                )}
            </div>

            {/* Restaurant details */}
            <div className="col-span-2">

                {/* Restaurant Name */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    The Bear
                </h1>

                {/* Restaurant Description (placeholder lines) */}
                <div className="bg-gray-200 h-24 rounded mb-10 items-center flex px-4 py-3">
                    Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.
                </div>

                {/* Reviews Title */}
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>

                {/* Review 1 */}
                <div className="bg-white shadow p-4 rounded mb-4">
                    <div className="flex justify-between">
                        <p className="font-semibold text-gray-700">USER’S USERNAME</p>
                        <p className="text-yellow-500">☆☆☆☆☆</p>
                    </div>
                    <div className="bg-gray-200 h-4 mt-3 rounded"></div>
                </div>

                {/* Review 2 */}
                <div className="bg-white shadow p-4 rounded mb-4">
                    <div className="flex justify-between">
                        <p className="font-semibold text-gray-700">USERNAME</p>
                        <p className="text-yellow-500">★★★★☆</p>
                    </div>
                    <p className="mt-3 text-gray-600">Lorem ipsum dolor sit amet.</p>
                </div>

                {/* Review 3 */}
                <div className="bg-white shadow p-4 rounded mb-4">
                    <div className="flex justify-between">
                        <p className="font-semibold text-gray-700">USERNAME</p>
                        <p className="text-yellow-500">★★★☆☆</p>
                    </div>
                    <p className="mt-3 text-gray-600">Lorem ipsum dolor sit amet.</p>
                </div>
            </div>
        </div>
    )
}