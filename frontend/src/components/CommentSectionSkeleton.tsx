export const CommentSectionSkeleton = () => {
  return (
    <div className="flex flex-col pt-6 pb-8 border-t-2">
      <div className="text-2xl font-bold mb-4">Comments</div>
      {/* Loading skeleton for comments */}
      <div className="space-y-4">
        {/* Skeleton for comment item */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex px-4 py-3 animate-pulse">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-gray-200 w-12 h-12"></div>
            </div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
