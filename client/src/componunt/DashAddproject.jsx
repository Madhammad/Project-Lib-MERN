import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import ButtonCom from "./helperComp/ButtonCom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { URL_BACKEND } from "./../../constant";

export default function DashAddproject() {
  const { token } = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [baseImage, setBaseImage] = useState("");
  const [file, setFile] = useState(null);
  const [details, setDetails] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [webSite, setWebsiteLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");

  const [loading, setLoading] = useState(false);

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" ||
      (event.key === "Tab" && inputValue.trim() !== "")
    ) {
      event.preventDefault();

      setTags([...tags, inputValue.trim()]);

      setInputValue("");
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleUpdloadImage = async (e) => {
    e.preventDefault();
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBaseImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    // console.log("Form submitted")
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("details", details);
    formData.append("webSite", webSite);
    formData.append("githubLink", githubLink);
    formData.append("tags", tags);
    formData.append("projectImage", file);

    const { data } = await axios.post(
      `${URL_BACKEND}/api/project/createproject`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    if (data.success === false) {
      setLoading(false);
      toast.error(data.message);
      return;
    }
    if (data.success === true) {
      setLoading(false);
      toast.success("Successfully Register");
      navigate("/projects");
    }
  };

  return (
    <div className=" w-full mx-auto min-h-screen  card-body flex flex-col gap-4 relative      ">
      <h1
        className={`text-center text-3xl  font-semibold ${
          loading && "opacity-30"
        }`}
      >
        <span className="text-indigo-500">Add</span> Pro
        <span className="text-indigo-500">J</span>ects
      </h1>

      <form
        className={`flex flex-col gap-4 ${
          loading && "opacity-30"
        } md:w-2/3 w-[95%] mx-auto shadow-2xl p-6 rounded-lg dark:bg-blue-950 bg-white`}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1 p-2 border rounded-lg dark:bg-gray-800 bg-slate-100 border-gray-200 dark:border-gray-700"
            onChange={(e) => setTitle(e.target.value)}
          />
          <small
            className={`${
              title.length > 100 ? "text-red-400" : "text-slate-400"
            }`}
          >
            {title.length}/100 characters
          </small>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <textarea
            type="text"
            placeholder="Description"
            required
            id="description"
            className="flex-1 bg-slate-100 p-2 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800"
            onChange={(e) => setDescription(e.target.value)}
          />
          <small
            className={`${
              description.length > 500 ? "text-red-400" : "text-slate-400"
            }`}
          >
            {description.length}/500 characters
          </small>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Category"
            required
            className="flex-1 p-2 border bg-slate-100 border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800"
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="Website Link"
            className="flex-1 p-2 border rounded-lg bg-slate-100 border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            onChange={(e) => setWebsiteLink(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            type="text"
            placeholder="GitHub Link"
            className="flex-1 p-2 border-gray-200 bg-slate-100 dark:border-gray-700 border rounded-lg dark:bg-gray-800"
            onChange={(e) => setGithubLink(e.target.value)}
          />
        </div>

        <div className="border  p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="mb-2 text-xs p-1 rounded-lg   flex items-center  border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-800"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  className="border ml-1 p-[2px] text-[6px] hover:border-indigo-500 hover:text-indigo-500 dark:border-gray-500 rounded-full bg-slate-100 dark:bg-gray-800"
                  onClick={() => handleRemoveTag(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 bg-slate-100"
            placeholder="Type a tag and press Enter"
          />
        </div>

        <div className="flex items-center justify-between border-4 border-indigo-500 border-dotted p-3 gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="p-2 w-full border-gray-200 dark:border-gray-700 bg-slate-100 text-slate-400 text-xs md:w-1/3 border rounded-lg dark:bg-gray-800"
          />
          <button
            type="button"
            className="p-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            onClick={handleUpdloadImage}
          >
            Upload Image
          </button>
        </div>

        {baseImage && (
          <img
            src={baseImage}
            alt="Uploaded Preview"
            className="w-full h-72 object-cover rounded-lg mt-4"
          />
        )}

        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className=" mb-12 h-52 border-gray-200 dark:border-gray-700 "
          required
          onChange={(value) => setDetails(value)}
        />

        <button type="submit" className="mt-2">
          <ButtonCom text={"Add Project"} />
        </button>
      </form>

      {loading && (
        <div className="bg-slate-300 dark:bg-slate-600 bg-opacity-50 absolute top-0 h-screen w-full flex items-center justify-center">
          <div className="  text-gray-400 flex justify-center items-center flex-col rounded-lg gap-5 text-4xl ">
            <p to={"/"} className=" pl-0 ">
              <span className="border  border-gray-400 rounded-lg md:p-1 hover:text-indigo-500/100 ">
                Pro<span className="text-indigo-500/100">J</span>ects
              </span>
              Lab
            </p>

            <div className="progress-container ">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
