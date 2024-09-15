import { atomFamily } from "recoil";
import { selectorFamily } from "recoil";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { Blog } from "../../hooks";

export const blogAtomFamily = atomFamily<Blog | null, string>({
  key: "blogAtomFamily",
  default: null, // Default state for each blog post
});

export const blogSelectorFamily = selectorFamily<Blog | null, string>({
  key: "blogSelectorFamily",
  get:
    (id) =>
    async ({ get }) => {
      const cachedBlog = get(blogAtomFamily(id));
      if (cachedBlog) {
        console.log("Cached blog: ", cachedBlog);
        return cachedBlog; // Return cached blog if available
      }

      try {
        // Fetch from server if not cached
        const response = await axios.get<{ blog: Blog }>(
          `${BACKEND_URL}/api/v1/blog/${String(id)}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        return response.data.blog; // Return fetched blog
      } catch (err) {
        console.log("Error fetching blog:", err);
        throw err;
      }
    },
  set:
    (id) =>
    ({ set }, newBlog) => {
      set(blogAtomFamily(id), newBlog); // Cache the blog data
    },
});
