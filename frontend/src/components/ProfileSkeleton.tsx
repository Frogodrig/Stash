export const ProfileSkeleton = () => (
  <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded shadow animate-pulse">
    {/* Profile Card Skeleton */}
    <div className="flex flex-col items-center mb-6">
      <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
      <div className="pt-4">
        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-48"></div>
      </div>
    </div>

    {/* Bio Section Skeleton */}
    <div className="mb-6">
      <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
      <div className="h-20 bg-gray-200 rounded"></div>
    </div>

    {/* Password Section Skeleton */}
    <div className="mb-6">
      <div className="h-4 bg-gray-300 rounded w-32 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>

      <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
      <div className="h-10 bg-gray-200 rounded mb-4"></div>

      <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>

    {/* Action Buttons Skeleton */}
    <div className="flex justify-end space-x-4 mt-6">
      <div className="h-10 bg-gray-300 rounded w-24"></div>
      <div className="h-10 bg-gray-300 rounded w-24"></div>
    </div>
  </div>
);
