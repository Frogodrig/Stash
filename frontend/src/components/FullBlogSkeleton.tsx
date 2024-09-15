import { Appbar } from "./Appbar";

export const FullBlogSkeleton = () => {
  return (
    <div>
      <Appbar profile={null} /> {/* Skeleton Appbar without profile */}
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-12">
          <div className="col-span-8">
            {/* Title Skeleton */}
            <div className="h-12 w-3/4 bg-gray-300 rounded-md animate-pulse"></div>

            {/* Date Skeleton */}
            <div className="h-4 w-1/4 bg-gray-300 rounded-md mt-2 animate-pulse"></div>

            {/* Content Skeleton */}
            <div className="space-y-4 pt-4">
              <div className="h-4 w-full bg-gray-300 rounded-md animate-pulse"></div>
              <div className="h-4 w-11/12 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-300 rounded-md animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded-md animate-pulse"></div>
            </div>

            {/* Comment Section Skeleton */}
            <div className="grid grid-cols-1 w-full max-w-screen-xl pt-8">
              <div className="h-8 w-1/3 bg-gray-300 rounded-md animate-pulse mb-4"></div>
              <div className="h-16 w-full bg-gray-300 rounded-md animate-pulse"></div>
            </div>
          </div>

          <div className="col-span-4 pl-12">
            {/* Author Section */}
            <div className="h-6 w-1/4 bg-gray-300 rounded-md animate-pulse"></div>

            <div className="flex pt-1">
              {/* Avatar Skeleton */}
              <div className="pr-4 flex flex-col justify-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
              </div>

              {/* Author Name and Bio Skeleton */}
              <div>
                <div className="h-6 w-2/3 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-300 rounded-md mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
