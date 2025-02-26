import React from "react";

const Pagenation = ({
    page,
    totalPages,
    currentPage,
}) => {
    return (
        <div className="flex justify-center mt-3" id="pagenation">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    className={`px-2 m-1 rounded ${page === currentPage
                        ? "bg-blue-400 text-white"
                        : "text-black"
                        }`}
                    onClick={() => pagenation(page)}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default Pagenation;