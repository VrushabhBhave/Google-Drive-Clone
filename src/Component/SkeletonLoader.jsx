function SkeletonLoader() {
  return (
    <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-[100%]">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-300 rounded-xl p-4 w-full h-45"
        >
          <div className="h-24 bg-gray-400 rounded mb-2"></div>
          <div className="h-4 bg-gray-400 rounded w-full mb-3"></div>
          <div className="h-4 bg-gray-400 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;