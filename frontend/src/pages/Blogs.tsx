import { useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogCardSkeleton } from "../components/BlogCardSkeleton";
import { useBlogs, useProfile } from "../hooks";
import { formatDate } from "../utils";
import { useNavigate } from "react-router-dom";

export const Blogs = () => {
  const { loading, blogs, loadMore } = useBlogs();
  const { loading: profileLoading, profile } = useProfile();
  const navigate = useNavigate();

  if (!localStorage.getItem("token")) {
    navigate("/signin");
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;

      if (scrollTop + windowHeight >= scrollHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); //cleanup
    };
  }, [loading, loadMore]);

  if ((loading && blogs.length === 0) || profileLoading) {
    return (
      <div>
        <Appbar profile={null} />
        <div className="mt-4 flex flex-col items-center">
          <BlogCardSkeleton />
          <BlogCardSkeleton />
          <BlogCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar profile={profile} />
      <div className="flex justify-center">
        <div className="mt-4">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              authorName={blog.author.name || "Anonymous"}
              title={blog.title}
              content={blog.content}
              publishedDate={formatDate(blog.createdAt) || ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
