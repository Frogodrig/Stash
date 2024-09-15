import { atomFamily } from "recoil";
import { selectorFamily } from "recoil";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { CommentsArray } from "../../hooks";

export const commentsAtomFamily = atomFamily<CommentsArray | null, string>({
  key: "commentsAtomFamily",
  default: null, // Default state for each blog post's comments
});

export const commentsSelectorFamily = selectorFamily<CommentsArray, string>({
  key: "commentsSelectorFamily",
  get:
    (blogId) =>
    async ({ get }) => {
      const cachedComments = get(commentsAtomFamily(blogId));

      // If cached comments exist, return them
      if (cachedComments) {
        console.log("Cached Comments:", cachedComments);
        return cachedComments;
      }

      try {
        const response = await axios.get<{ comments: CommentsArray }>(
          `${BACKEND_URL}/api/v1/blog/${String(blogId)}/comments`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        // Cache the fetched comments
        const fetchedComments = response.data.comments;

        // If the response is an empty array, cache it to avoid further requests
        if (fetchedComments.length === 0) {
          return [];
        }

        return fetchedComments;
      } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
      }
    },
  set:
    (blogId) =>
    ({ set }, newComments) => {
      set(commentsAtomFamily(blogId), newComments); // Cache the comments data
    },
});
