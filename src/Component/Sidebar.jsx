import { MdAdd } from "react-icons/md";
import { AiOutlineHome } from "react-icons/ai";
import { FiHardDrive } from "react-icons/fi";
import { LuLaptop } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { BsClock } from "react-icons/bs";
import { IoStarOutline } from "react-icons/io5";
import { CiCloud } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiSpam2Line } from "react-icons/ri";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useAuth } from "../Context/AuthContext";
import { supabase } from "../supabase";
import { Bounce, toast } from "react-toastify";
function Sidebar({ darkMode, files, storageExceeded, setStorageExceeded }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const db = getFirestore();

  function handleClose() {
    setOpen(false);
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleChange(e) {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setUploading(true);

    if (storageExceeded) {
      toast.error("Storage limit exceeded. Cannot upload more files.", {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
      setUploading(false);
      return;
    }
    if (!user) {
      alert("Please log in.");
      return;
    }

    const filePath = `${user.uid}/${Date.now()}_${file.name}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("google-drive")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error.message);
      toast.error(error.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setUploading(false);
      setOpen(false);
      return;
    }

    // Get signed URL (expires in 1 hour)
    const { data: urlData } = await supabase.storage
      .from("google-drive")
      .createSignedUrl(filePath, 3600);

    // Store metadata in Firestore
    await addDoc(collection(db, "files"), {
      userId: user.uid,
      name: file.name,
      size: file.size,
      type: file.type,
      path: filePath,
      url: urlData.signedUrl,
      uploadedAt: new Date().toISOString(),
    });

    toast.success("File uploaded successfully!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    setFile(null);
    setUploading(false);
    setOpen(false);
  }

  const [usedTotalSize, setUsedTotalSize] = useState(0);
  const [usedStorageInBytes, setUsedStorageInBytes] = useState(0);
  useEffect(() => {
    const usedStorage = files.reduce((total, file) => total + file.size, 0);
    setUsedStorageInBytes(usedStorage);

    if (usedStorage === 0) {
      setUsedTotalSize("0 Bytes");
      return;
    }

    const formatBytes = (bytes, decimals = 2) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    setUsedTotalSize(formatBytes(usedStorage));

    const totalStorage = 1024 * 1024 * 1024;
    if (usedStorage > totalStorage) {
      setStorageExceeded(true);
    } else {
      setStorageExceeded(false);
    }
  }, [files]);

  const totalStorage = 1024 * 1024 * 1024;
  const usagePercent = (usedStorageInBytes / totalStorage) * 100;
  console.log(usagePercent);
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div
          className={`modal_pop top-[50%] relative w-[90vw] sm:w-[500px] m-[auto] transform translate-y-[-50%] ${
            darkMode ? "bg-[#030712] border-1 border-gray-800" : "bg-white"
          } p-[24px] rounded-[10px] border-0`}
        >
          <form onSubmit={handleSubmit}>
            <div
              className={`modalHeading text-lg mb-[16px] font-medium flex justify-between items-center relative ${
                darkMode ? "text-[#95a5bd]" : "text-black"
              }`}
            >
              <h2>Upload File</h2>
              <button
                className="text-sm absolute top-[-10px] right-[0px] cursor-pointer"
                onClick={handleClose}
              >
                X
              </button>
            </div>
            <div className="modalBody">
              <input
                type="file"
                name=""
                onChange={handleChange}
                className={`w-full px-4 py-1 border-1 border-gray-300 rounded mb-[8px] ${
                  darkMode
                    ? "text-[#95a5bd] border-1 border-gray-800"
                    : "text-black"
                }`}
                required
              />
            </div>
            <button
              type="submit"
              className={`${
                darkMode ? "bg-[#f9fafb]" : "bg-[#111827] text-white"
              } py-[6px] px-5 font-medium rounded-lg cursor-pointer`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </Modal>
      <div className="sidebar m-2 p-2 w-[28%] lg:w-[18%]  pr-5">
        <div className="sidebar__button">
          <button
            onClick={handleOpen}
            type="button"
            className={`shadow-[0px_0px_3px_gray] flex gap-2 items-center rounded-2xl py-3 px-8 cursor-pointer transition-all duration-300 ${
              darkMode
                ? "bg-[#1e293b] text-[#cbd5e1] hover:bg-[#031525]"
                : "bg-[#ffffff] text-[#09090b] hover:bg-[#eef5fd]"
            }`}
          >
            <MdAdd className="text-2xl" />
            <span>New</span>
          </button>
        </div>
        <div className="sidebar__options py-2 hidden md:block">
          <div className="sidebar__options__first py-2">
            <div
              className={`sidebar__option flex items-center gap-3 py-2 px-3 rounded-full ${
                darkMode ? "text-[#95a5bd] bg-[#172554]" : "bg-[#dbeafe]"
              }`}
            >
              <AiOutlineHome className="text-2xl" />
              <span>Home</span>
            </div>
            <div
              className={`sidebar__option flex items-center gap-3 py-2 px-3 select-none rounded-full cursor-pointer ${
                darkMode
                  ? "text-[#95a5bd] hover:bg-[#1e293b]"
                  : "text-black hover:bg-[#e2e8f0]"
              }`}
            >
              <FiHardDrive className="text-2xl" />
              <span>My Drive</span>
            </div>
            <div
              className={`sidebar__option flex items-center gap-3 py-2 px-3 select-none rounded-full cursor-pointer ${
                darkMode
                  ? "text-[#95a5bd] hover:bg-[#1e293b]"
                  : "text-black hover:bg-[#e2e8f0]"
              }`}
            >
              <LuLaptop className="text-2xl" />
              <span>Computers</span>
            </div>
          </div>
          <div className="sidebar__options__second py-2">
            <div
              className={`sidebar__option flex items-center gap-3 py-2 px-3 select-none rounded-full cursor-pointer ${
                darkMode
                  ? "text-[#95a5bd] hover:bg-[#1e293b]"
                  : "text-black hover:bg-[#e2e8f0]"
              }`}
            >
              <LuUsers className="text-2xl" />
              <span>Shared with me</span>
            </div>
            <div
              className={`sidebar__option flex items-center gap-3 py-2 px-3 select-none rounded-full cursor-pointer ${
                darkMode
                  ? "text-[#95a5bd] hover:bg-[#1e293b]"
                  : "text-black hover:bg-[#e2e8f0]"
              }`}
            >
              <BsClock className="text-2xl" />
              <span>Recent</span>
            </div>
            <div
              className={`sidebar__option flex items-center gap-3 py-2 px-3 select-none rounded-full cursor-pointer ${
                darkMode
                  ? "text-[#95a5bd] hover:bg-[#1e293b]"
                  : "text-black hover:bg-[#e2e8f0]"
              }`}
            >
              <IoStarOutline className="text-2xl" />
              <span>Starred</span>
            </div>
          </div>
          <div className="sidebar__options__third py-2">
            <div
              className={`sidebar__option flex items-center gap-3 py-2 px-3 select-none rounded-full cursor-pointer ${
                darkMode
                  ? "text-[#95a5bd] hover:bg-[#1e293b]"
                  : "text-black hover:bg-[#e2e8f0]"
              }`}
            >
              <RiSpam2Line className="text-2xl" />
              <span>Spam</span>
            </div>
            <div
              className={`sidebar__option flex items-center gap-3 py-2 px-3 select-none rounded-full cursor-pointer ${
                darkMode
                  ? "text-[#95a5bd] hover:bg-[#1e293b]"
                  : "text-black hover:bg-[#e2e8f0]"
              }`}
            >
              <FaRegTrashAlt className="text-2xl" />
              <span>Trash</span>
            </div>
            <div
              className={`sidebar__option flex items-center gap-3 py-2 px-3 select-none rounded-full cursor-pointer ${
                darkMode
                  ? "text-[#95a5bd] hover:bg-[#1e293b]"
                  : "text-black hover:bg-[#e2e8f0]"
              }`}
            >
              <CiCloud className="text-2xl" />
              <span>Storage</span>
            </div>

            <div className="storage__indicator my-4">
              <div className={`progress__bar w-[80%] h-[9px] rounded-full relative ${darkMode ? "bg-[#384754]" : "bg-[#c9cdd2]"} overflow-hidden`}>
                <div
                  className={`progress__rollar absolute ${darkMode ? "bg-[#bfdbfe]" : "bg-[#3b82f6]"} h-[9px] rounded-full`}
                  style={{ width: `${usagePercent}%` }}
                ></div>
              </div>
              <div className="size__content my-1 text-sm font-medium">
                <p className={`${darkMode ? "text-[#95a5bd]" : "text-gray-700"}`}>{`${usedTotalSize} of 100MB`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
