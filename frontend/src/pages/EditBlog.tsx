import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../hooks";
import axios from "axios";
import QuillEditor from "../components/QuillEditor";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../config";
import { Appbar } from "../components/Appbar";

const EditBlog = () => {
  const { id } = useParams();
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [content, setContent] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { loading: profileLoading, profile } = useProfile();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setTitle(response.data.blog.title);
        setContent(response.data.blog.content);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async () => {
    toast.promise(
      axios
        .put(
          `${BACKEND_URL}/api/v1/blog/${id}`,
          {
            title,
            content,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          navigate(`/blog/${response.data.id}`);
        }),
      {
        loading: "Updating post...",
        success: <b>Post edited successfully!</b>,
        error: <b>Could not edit the post. Please try again.</b>,
      }
    );
  };

  const handleCancel = () => {
    // Navigate user back to blogs
    navigate(`/blog/${id}`);
  };

  if (profileLoading || loading) {
    return (
      <div>
        <Appbar profile={null} />
        <div className="flex justify-center">
          <div className="max-w-screen-lg w-full p-4 animate-pulse">
            <div className="mb-6 bg-gray-200 rounded-lg w-full h-12"></div>
            <div className="mb-6 bg-gray-200 rounded-lg w-full h-80"></div>
            <div className="flex justify-between mt-6">
              <div className="bg-gray-200 rounded-lg w-32 h-10"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Appbar profile={profile} />
      <div className="flex justify-center mt-8">
        <div className="max-w-screen-lg w-full">
          <label className="w-full block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
          <input
            value={title || ""}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            className="focus:outline-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
            placeholder="Title"
          />

          <div className="mt-2 mb-4">
            <QuillEditor value={content || ""} onChange={setContent} />
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleSubmit}
              type="submit"
              className="mr-2 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white rounded bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Save
            </button>
            <button
              className="bg-slate-500 hover:bg-slate-800 text-white py-2 px-4 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
