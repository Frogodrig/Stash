import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { blogAtomFamily, blogSelectorFamily } from "../recoil/atom/blogState";
import {
  commentsAtomFamily,
  commentsSelectorFamily,
} from "../recoil/atom/commentsState";
import { profileAtom, profileSelector } from "../recoil/atom/profileState";

export interface Blog {
  content: string;
  title: string;
  id: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    bio: string;
  };
}

export interface Comment {
  content: string;
  id: number;
  createdAt: string;
  author: {
    name: string;
  };
}

export type CommentsArray = Comment[];

export interface Profile {
  id: number;
  name: string;
  email: string;
  bio?: string;
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useRecoilState(blogAtomFamily(id));
  const blogLoadable = useRecoilValueLoadable(blogSelectorFamily(id));

  useEffect(() => {
    let isMounted = true;

    const fetchBlog = async () => {
      switch (blogLoadable.state) {
        case "hasValue":
          if (isMounted) {
            setBlog(blogLoadable.contents); // Cache blog after fetching
            setLoading(false);
          }
          break;
        case "loading":
          if (isMounted) {
            setLoading(true);
          }
          break;
      }
    };

    fetchBlog();

    return () => {
      isMounted = false;
    };
  }, [blogLoadable, setBlog]);

  return { blog, loading };
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadBlogs = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        params: {
          page: pageNumber,
          perPage: 5,
        },
      });

      const newBlogs = response.data.blogs;

      // Check if the newBlogs contains duplicate items
      setBlogs((prevBlogs) => {
        // Create a Set of existing blog IDs
        const existingIds = new Set(prevBlogs.map((blog) => blog.id));
        // Filter out duplicates
        const filteredNewBlogs = newBlogs.filter(
          (blog: Blog) => !existingIds.has(blog.id)
        );
        return [...prevBlogs, ...filteredNewBlogs];
      });

      setHasMore(newBlogs.length > 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return {
    loading,
    blogs,
    loadMore,
  };
};

export const useComments = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useRecoilState(commentsAtomFamily(id));
  const commentsLoadable = useRecoilValueLoadable(commentsSelectorFamily(id));

  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      switch (commentsLoadable.state) {
        case "hasValue":
          if (isMounted) {
            setComments(commentsLoadable.contents);
            setLoading(false);
          }
          break;
        case "loading":
          if (isMounted) {
            setLoading(true);
          }
          break;
        case "hasError":
          console.error("Error fetching comments");
          setLoading(false);
          break;
      }
    };

    fetchComments();

    return () => {
      isMounted = false;
    };
  }, [commentsLoadable, setComments]);

  return { loading, comments, setComments };
};

export const useProfile = () => {
  const [profile, setProfile] = useRecoilState(profileAtom);
  const [loading, setLoading] = useState(true);
  const profileLoadable = useRecoilValueLoadable(profileSelector);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      switch (profileLoadable.state) {
        case "hasValue":
          if (isMounted) {
            setProfile(profileLoadable.contents);
            setLoading(false);
          }
          break;
        case "loading":
          setLoading(true);
          break;
        case "hasError":
          console.error("Error fetching profile");
          setLoading(false);
          break;
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [profileLoadable, setProfile]);

  return {
    loading,
    profile,
  };
};

// export const useBlog = ({ id }: { id: string }) => {
//   const [loading, setLoading] = useState(true);
//   const [blog, setBlog] = useState<Blog>();

//   useEffect(() => {
//     axios
//       .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       })
//       .then((response) => {
//         setBlog(response.data.blog);
//         setLoading(false);
//       });
//   }, [id]);

//   return {
//     loading,
//     blog,
//   };
// };

// export const useComments = ({ id }: { id: string }) => {
//   const [loading, setLoading] = useState(true);
//   const [comments, setComments] = useState<Comment[]>([]);

//   useEffect(() => {
//     axios
//       .get(`${BACKEND_URL}/api/v1/blog/${id}/comments`, {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       })
//       .then((response) => {
//         setComments(response.data.comments);
//         setLoading(false);
//       });
//   }, [id]);

//   return {
//     loading,
//     comments,
//   };
// };

// export const useProfile = () => {
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState<Profile>();

//   useEffect(() => {
//     axios
//       .get(`${BACKEND_URL}/api/v1/user/profile/view`, {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       })
//       .then((response) => {
//         setProfile(response.data.profile);
//         setLoading(false);
//       });
//   }, []);

//   return {
//     loading,
//     profile,
//   };
// };
