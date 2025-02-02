import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ButtonCom from "./helperComp/ButtonCom";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";
import { URL_BACKEND } from "./../../constant";

export default function DashUpdateproject() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [webSite, setWebSite] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [tags, setTags] = useState([]);

  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();

  const [project, setProject] = useState({});

  const { projectId } = useParams();

  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProject = async () => {
      const { data } = await axios.get(
        `${URL_BACKEND}/api/project/getproject/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log(data, "data");

      if (data.success === false) {
        return toast.error(data.error);
      }
      if (data.success === true) {
        setProject(data.data);
        setTags(data.data.tags);
      }
    };

    fetchProject();
  }, [projectId, token]);

  const handleKeyDown = (event) => {
    if (!inputValue.trim()) return;
    if (
      event.key === "Enter" ||
      (event.key === "Tab" && inputValue.trim() !== "")
    ) {
      event.preventDefault();

      setTags((prevTags) => [...prevTags, inputValue.trim()]);

      setInputValue("");
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    window.scrollTo({ top: 0, behavior: "smooth" });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("details", details);
    formData.append("webSite", webSite);
    formData.append("githubLink", githubLink);
    formData.append("tags", tags);

    console.log("formData", formData.get("tags"));

    const { data } = await axios.put(
      `${URL_BACKEND}/api/project/updateProject/${projectId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (data.success === false) {
      setLoading(false);
      return toast.error(data.message);
    }
    if (data.success === true) {
      setLoading(false);
      toast.success(data.message);
      navigate(`/project/${projectId}`);
    }
  };
  // console.log(webSite, "webSite");

  return (
    <div className="p-1 w-full mx-auto min-h-screen  relative">
      <h1 className="text-center text-3xl my-10 font-semibold">
        <span className="text-indigo-500">Update</span> Pro
        <span className="text-indigo-500">J</span>ect Image
      </h1>

      <div className="md:w-2/3 mx-auto w-[90%] shadow-2xl p-6 rounded-lg dark:bg-blue-950 bg-white">
        <div className="  mb-4 rounded">
          <div className="md:top-1 md:right-1 right-7 absolute border border-indigo-500 p-1 bg-indigo-100 rounded-full text-indigo-500 hover:scale-125 hover:text-indigo-900">
            <Link to={`/updateProjectImage/${project._id}`}>
              <CiEdit />
            </Link>
          </div>

          <img
            src={project?.projectImage?.secure_url}
            className="rounded-2xl w-full md:h-72 object-cover"
            alt=""
          />
        </div>

        <h1 className="text-center text-3xl mb-2 font-semibold">
          <span className="text-indigo-500">Update</span> Pro
          <span className="text-indigo-500">J</span>ect
        </h1>

        <form className="flex flex-col gap-4 " onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <input
              type="text"
              defaultValue={project?.title}
              placeholder="Title"
              required
              id="title"
              className="flex-1 dark:bg-gray-800 rounded-xl p-2 bg-slate-100 border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-400"
              color="indigo"
              onChange={(e) => setTitle(e.target.value)}
            />
            <small
              className={`${
                project?.title?.length > 100 ? "text-red-400" : "text-slate-400"
              }`}
            >
              {project?.title?.length}/100 characters
            </small>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <input
              type="text"
              defaultValue={project?.description}
              placeholder="Description"
              required
              id="description"
              className="flex-1 border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 dark:bg-gray-800 rounded-xl p-2 bg-white"
              color="indigo"
              onChange={(e) => setDescription(e.target.value)}
            />
            <small
              className={`${
                project?.description?.length > 500
                  ? "text-red-400"
                  : "text-slate-400"
              }`}
            >
              {project?.description?.length}/500 characters
            </small>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <input
              type="text"
              defaultValue={project.category}
              placeholder="Category"
              required
              id="description"
              className="flex-1 border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 dark:bg-gray-800 rounded-xl p-2 bg-white"
              color="indigo"
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <input
              type="text"
              defaultValue={project.webSite && project.webSite}
              placeholder="website Link"
              id="description"
              className="flex-1 border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 dark:bg-gray-800 rounded-xl p-2 bg-white"
              color="indigo"
              onChange={(e) => setWebSite(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <input
              type="text"
              defaultValue={project.githubLink && project.githubLink}
              placeholder="github Link"
              id="githubLink"
              className="flex-1 border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 dark:bg-gray-800 rounded-xl p-2 bg-white"
              color="indigo"
              onChange={(e) => setGithubLink(e.target.value)}
            />
          </div>

          <div className="border border-gray-300 dark:border-gray-500 dark:bg-gray-800 p-2 rounded-lg bg-gray-50">
            <div>
              <div className="flex gap-1 flex-wrap">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="mb-1 text-xs p-1 rounded-lg   flex items-center  border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-400"
                  >
                    <span>{tag}</span>
                    <button
                      className="border ml-1 p-[2px] text-[6px] hover:border-indigo-500 hover:text-indigo-500 dark:border-gray-500 rounded-full"
                      onClick={() => handleRemoveTag(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 dark:bg-gray-800 rounded-xl p-2 bg-white border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-400"
              placeholder="Type a tag and press Enter"
            />
          </div>

          <ReactQuill
            theme="snow"
            className="h-72 mb-12 border border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-400"
            required
            value={details || project.details || ""}
            onChange={(value) => setDetails(value)}
          />
          <div className="mt-2">
            <ButtonCom text={"Update Project"} />
            <button type="submit" onClick={handleSubmit}></button>
          </div>
        </form>
      </div>

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
