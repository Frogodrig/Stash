import { useNavigate, useParams } from "react-router-dom";
import { useBlog, useProfile } from "../hooks";
import { FullBlog } from "../components/FullBlog";
import { FullBlogSkeleton } from "../components/FullBlogSkeleton";
import { Appbar } from "../components/Appbar";

export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({ id: id ?? "" });
  const navigate = useNavigate();

  const { loading: profileLoading, profile } = useProfile();

  if (!localStorage.getItem("token")) {
    navigate("/signin");
  }

  if (loading || profileLoading) {
    return (
      <div>
        <FullBlogSkeleton />
      </div>
    );
  }

  return (
    <div>
      <Appbar profile={profile} />
      {blog && <FullBlog blog={blog} />}
    </div>
  );
};

export default Blog;
