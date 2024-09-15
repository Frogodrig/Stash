import { useComments } from "../hooks";
import { Avatar } from "./BlogCard";
import { Comment } from "../hooks";
import { useState } from "react";
import { TextEditor } from "../pages/Publish";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { CommentSectionSkeleton } from "./CommentSectionSkeleton";
import toast from "react-hot-toast";
import { formatDate } from "../utils";

interface commentSnippetProps {
  comment: Comment;
}

export const CommentSection = ({ blogId }: { blogId: string }) => {
  const { loading, comments, setComments } = useComments({
    id: blogId,
  });
  const [description, setDescription] = useState("");

  if (loading) {
    return (
      <div>
        <CommentSectionSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-4 pb-8 border-t-2 mt-8">
      <div className="text-2xl font-bold mb-4">Comments</div>
      <div>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentSnippet key={comment.id} comment={comment} />
          ))
        ) : (
          <div>Be the first one to comment.</div>
        )}
      </div>

      <div className="mt-2 max-w-4xl px-2">
        <TextEditor
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        <button
          onClick={async () => {
            toast.promise(
              axios
                .post(
                  `${BACKEND_URL}/api/v1/blog/${blogId}/comments`,
                  {
                    content: description,
                  },
                  {
                    headers: {
                      Authorization: localStorage.getItem("token"),
                    },
                  }
                )
                .then((response) => {
                  const newComment: Comment = response.data.comment;
                  setComments((prevComments) => [...prevComments, newComment]);
                  setDescription("");
                }),
              {
                loading: "Sending Comment...",
                success: <b>Commented successfully!</b>,
                error: <b>Could not comment. Please try again.</b>,
              }
            );
          }}
          type="submit"
          className="inline-flex items-center px-5 py-2.5 text-sm rounded-2xl font-medium text-center text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Comment
        </button>
      </div>
    </div>
  );
};

function CommentSnippet({ comment }: commentSnippetProps) {
  return (
    <div className="flex px-4 py-3">
      <div className="flex flex-col justify-center">
        <Avatar name={comment.author.name || "Anonymous"} size={"big"} />
      </div>

      <div className="ml-4">
        <div className="flex">
          <div className="font-semibold">
            {comment.author.name || "Anonymous"}
          </div>
          <div className="font-extralight text-sm text-slate-500 pl-2">
            {formatDate(comment.createdAt).toLowerCase() || ""}
          </div>
        </div>

        <div className="text-slate-600">{comment.content}</div>
      </div>
    </div>
  );
}
