import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks";
import toast from "react-hot-toast";
import QuillEditor from "../components/QuillEditor";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { loading, profile } = useProfile();

  if (loading) {
    return (
      <div>
        <Appbar profile={null} />
        <div className="flex justify-center">
          <div className="max-w-screen-lg w-full p-4">
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
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            type="text"
            className="focus:outline-none w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
            placeholder="Title"
          />

          <div className="mt-2 mb-4">
            <QuillEditor value={description} onChange={setDescription} />
          </div>

          <button
            onClick={async () => {
              toast.promise(
                axios
                  .post(
                    `${BACKEND_URL}/api/v1/blog`,
                    {
                      title,
                      content: description,
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
                  loading: "Publishing post...",
                  success: <b>Post published successfully!</b>,
                  error: <b>Could not publish the post. Please try again.</b>,
                }
              );
            }}
            type="submit"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white rounded bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export function TextEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="mt-2">
      <div className="w-full mb-4">
        <div className="flex items-center justify-between border">
          <div className="my-2 bg-white rounded-b-lg w-full">
            <label className="sr-only">Publish post</label>
            <textarea
              value={value}
              onChange={onChange}
              id="editor"
              rows={8}
              className="focus:outline-none pl-2 block w-full px-0 text-sm text-gray-800 bg-white border-0 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What's on your mind?"
              required
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
