export const BlogCardSkeleton = () => {
  return (
    <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md animate-pulse">
      <div className="flex">
        <div className="rounded-full bg-gray-300 w-6 h-6"></div>
        <div className="flex justify-center flex-col font-extralight pl-2 text-sm">
          <div className="h-3 w-24 bg-gray-300 rounded-md"></div>
        </div>
        <div className="flex justify-center flex-col pl-2">
          <div className="h-1 w-1 rounded-full bg-gray-300"></div>
        </div>
        <div className="flex justify-center flex-col pl-2 font-thin text-slate-500 text-sm">
          <div className="h-3 w-16 bg-gray-300 rounded-md"></div>
        </div>
      </div>
      <div className="pt-2">
        <div className="h-6 w-3/4 bg-gray-300 rounded-md"></div>
      </div>
      <div className="pt-2">
        <div className="h-4 w-full bg-gray-300 rounded-md mb-2"></div>
        <div className="h-4 w-5/6 bg-gray-300 rounded-md"></div>
      </div>
      <div className="text-slate-500 text-sm font-thin pt-4">
        <div className="h-3 w-20 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
};
