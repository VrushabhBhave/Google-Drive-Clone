import { IoMenu } from "react-icons/io5";
import { BsGrid } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { collection, getFirestore, query, where } from "firebase/firestore";
import { supabase } from "../supabase";
import { Bounce, toast } from "react-toastify";
import SkeletonLoader from "./SkeletonLoader";
function Data({ darkMode, searchTerm, files, setFiles }) {
  const [gridActive, setGridActive] = useState(true);
  const [loader, setLoader] = useState(true);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    file: null,
  });
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    setTimeout(() => {
      if (!user) return;

    const q = query(collection(db, "files"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fileList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFiles(fileList);
      setLoader(false);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
    }, 1000);
  }, [user]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const hideContext = () =>
      setContextMenu({ ...contextMenu, visible: false });
    window.addEventListener("click", hideContext);
    return () => window.removeEventListener("click", hideContext);
  }, [contextMenu]);

  function trimContent(name) {
    return name.split('.').pop();
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes == 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  function formatDate(date) {
    const formatteddate = date.split("T");
    return formatteddate[0];
  }

  async function handleToDelete(id, path) {
    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, "files", id));

      // 2. Delete from Supabase Storage
      const { error } = await supabase.storage
        .from("google-drive")
        .remove([path]);

      toast.success(`File deleted successfully!`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: darkMode ? "dark" : "light",
        transition: Bounce,
      });

      if (error) {
        console.error("Error deleting from Supabase:", error.message);
      }

      // 3. Update state
      setFiles((prev) => prev.filter((file) => file.id !== id));
      setContextMenu({ ...contextMenu, visible: false });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  if (loader) {
    return <SkeletonLoader view={gridActive ? "grid" : "list"} darkMode={darkMode} />;
  }
  return filteredFiles.length == 0 ? (
    <div
      className={`no_files flex flex-col flex-wrap items-center justify-center w-full ${
        darkMode ? "text-[#95a5bd]" : "text-[#3f3f46]"
      }`}
    >
      <img
        src="no-files.svg"
        alt=""
        className="w-[50%] md:w-[30%] lg:w-[23%]"
      />
      <p className="text-md sm:text-2xl py-2">
        Welcome to Drive, the home for all your files
      </p>
      <p className="text-sm sm:text-xl">Use the “New” button to upload</p>
    </div>
  ) : (
    <>
      <div
        className={`data min-w-[80%] py-4 px-8 rounded-2xl ${
          darkMode ? "bg-[#031525]" : "bg-[#ffffff]"
        }`}
      >
        <div
          className={`data__header flex justify-between text-xl ${
            darkMode ? "text-[#95a5bd]" : "text-[#52525b]"
          }`}
        >
          <p className="font-medium">Home</p>
          <div className="button">
            <button
              type="button"
              className={`border border-gray-400 py-1 px-5 rounded-l-full cursor-pointer ${
                gridActive ? "" : darkMode ? "bg-[#4e657c]" : "bg-[#e5f1ff]"
              }`}
              onClick={() => setGridActive(false)}
            >
              <IoMenu />
            </button>
            <button
              type="button"
              className={`border border-gray-400 py-1 px-5 rounded-r-full cursor-pointer ${
                gridActive ? (darkMode ? "bg-[#4e657c]" : "bg-[#e5f1ff]") : ""
              }`}
              onClick={() => setGridActive(true)}
            >
              <BsGrid />
            </button>
          </div>
        </div>
        {gridActive == false ? (
          <div className="file__data w-full">
            <div
              className={`file__heading mt-8 font-medium px-4 py-2 hidden sm:flex ${
                darkMode ? "text-slate-400" : "text-zinc-700"
              }`}
            >
              <div className="w-1/2 lg:w-1/1">
                <h1>File Name</h1>
              </div>
              <div className="w-1/4">
                <h1>Size</h1>
              </div>
              <div className="w-1/4">
                <h1>Last Modified</h1>
              </div>
            </div>

            {filteredFiles.map((obj) => (
              <a href={obj.url} target="_blank" key={obj.id}>
                <div
                  className={`file__card flex flex-col sm:flex-row text-center sm:text-left items-center sm:px-4 py-4 transition-all duration-300 cursor-pointer font-medium ${
                    darkMode
                      ? "bg-[#1e293b] hover:bg-blue-950 text-slate-400"
                      : "bg-[#f0f4f9] hover:bg-blue-100 text-zinc-700"
                  } my-5 rounded-xl`}
                  key={obj.id}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      visible: true,
                      x: e.pageX,
                      y: e.pageY,
                      file: obj,
                    });
                  }}
                  onTouchStart={(e) => {
                    const timeout = setTimeout(() => {
                      setContextMenu({
                        visible: true,
                        x: e.touches[0].pageX,
                        y: e.touches[0].pageY,
                        file: obj,
                      });
                    }, 600); // 600ms long press
                    e.currentTarget.ontouchend = () => clearTimeout(timeout);
                  }}
                >
                  <div className="w-1/2 lg:w-1/1 truncate">
                    <p className="truncate mr-0 sm:mr-5 text-md sm:text-md">
                      {obj.name}
                    </p>
                  </div>
                  <div className="w-1/4">
                    <p
                      className={`text-sm sm:text-md ${
                        darkMode ? "text-[#64748B]" : "text-[#71717A]"
                      }`}
                    >
                      {formatBytes(obj.size)}
                    </p>
                  </div>
                  <div className="w-1/4">
                    <p
                      className={`text-sm sm:text-md ${
                        darkMode ? "text-[#64748B]" : "text-[#71717A]"
                      }`}
                    >
                      Modified: {formatDate(obj.uploadedAt)}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="file__Data grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-5">
            {filteredFiles.map((obj) => (
              <div
                className={`file__card shadow py-2 px-3 rounded-lg transition-all duration-300 ${
                  darkMode
                    ? "bg-[#1e293b] hover:bg-blue-950"
                    : "bg-[#f0f4f9] hover:bg-blue-100"
                }`}
                key={obj.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    visible: true,
                    x: e.pageX,
                    y: e.pageY,
                    file: obj,
                  });
                }}
                onTouchStart={(e) => {
                  const timeout = setTimeout(() => {
                    setContextMenu({
                      visible: true,
                      x: e.touches[0].pageX,
                      y: e.touches[0].pageY,
                      file: obj,
                    });
                  }, 600); // 600ms long press
                  e.currentTarget.ontouchend = () => clearTimeout(timeout);
                }}
              >
                <a href={obj.url} target="_blank">
                  <div className="file__name mb-2">
                    <p
                      className={`truncate max-w-full text-sm font-medium text-md ${
                        darkMode ? "text-slate-400" : "text-zinc-700"
                      }`}
                    >
                      {obj.name}
                    </p>
                  </div>
                  <div
                    className={`flex items-center justify-center h-24 mb-1 rounded-lg lg:h-32 ${
                      darkMode ? "bg-[#334155]" : "bg-white"
                    }`}
                  >
                    <h3
                      className={`text-3xl font-bold uppercase ${
                        darkMode ? "text-slate-400" : "text-zinc-500"
                      }`}
                    >
                      {trimContent(obj.name)}
                    </h3>
                  </div>
                  <p
                    className={`text-sm font-medium text-md mt-[8px] ${
                      darkMode ? "text-slate-500" : "text-zinc-500"
                    }`}
                  >
                    {formatBytes(obj.size)}
                  </p>
                  <p
                    className={`text-sm font-medium text-md mt-[8px] ${
                      darkMode ? "text-slate-500" : "text-zinc-500"
                    }`}
                  >
                    Modified : {formatDate(obj.uploadedAt)}
                  </p>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      {contextMenu.visible && (
        <div
          className={`absolute z-50 ${
            darkMode ? "bg-black" : "bg-white"
          } shadow-lg rounded-md text-sm w-30 py-2 px-2`}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={() => setContextMenu({ ...contextMenu, visible: false })}
        >
          <p
            className={`py-1 px-1 font-medium ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Actions
          </p>
          <button
            className={`block w-full py-1 px-1 ${
              darkMode
                ? "text-white hover:bg-[#1e293b]"
                : "hover:bg-gray-100 text-black"
            } text-left rounded`}
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(contextMenu.file.url);
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            Copy Link
          </button>
          <button
            className="block w-full py-1 px-1 hover:bg-red-100 text-left text-red-500 rounded"
            onClick={(e) => {
              e.stopPropagation();
              setContextMenu({ ...contextMenu, visible: false });
              handleToDelete(contextMenu.file.id, contextMenu.file.path);
            }}
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}

export default Data;
