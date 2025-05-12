// React icons
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { LuSlidersHorizontal } from "react-icons/lu";
import { useAuth } from "../Context/AuthContext";
import { getAuth } from "firebase/auth";
import { Bounce, toast } from "react-toastify";
import app from "../firebase";
import { useEffect, useRef } from "react";
const auth = getAuth(app);
function Header({
  darkMode,
  setDarkMode,
  modeDropDown,
  setModeDropDown,
  logOutDropDown,
  setLogOutDropDown,
  searchTerm,
  setSearchTerm,
  sortingDropDown,
  setSortingDropDown,
  files,
  setFiles,
}) {
  const { user } = useAuth();

  const logOutRef = useRef(null);
  const dropdownRef = useRef(null);
  const sortingDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setModeDropDown(false);
      }

      if (logOutRef.current && !logOutRef.current.contains(event.target)) {
        setLogOutDropDown(false);
      }

      if (sortingDropdownRef.current && !sortingDropdownRef.current.contains(event.target)) {
          setSortingDropDown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleModeDropDown() {
    setLogOutDropDown(false);
    setSortingDropDown(false);
    setModeDropDown((prev) => !prev);
  }

  function handleLogOutDropDown() {
    setModeDropDown(false);
    setSortingDropDown(false);
    setLogOutDropDown((prev) => !prev);
  }

  function handleSortDropDown() {
    setModeDropDown(false);
    setLogOutDropDown(false);
    setSortingDropDown((prev) => !prev);
  }

  function handleLogOut() {
    auth.signOut();
    toast.success("LogOut successful!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    setLogOutDropDown(!logOutDropDown);
  }

  function sortData(order) {
    if (order === "nameAsc") {
      setFiles([...files].sort((a, b) => a.name.localeCompare(b.name)));
    } else if (order === "nameDesc") {
      setFiles([...files].sort((a, b) => b.name.localeCompare(a.name)));
    } else if (order === "dateAsc") {
      setFiles([...files].sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt)));
    } else if (order === "dateDesc") {
      setFiles([...files].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)));
    }
  }

  return (
    <div className="header flex items-center justify-between p-5">
      <div className="header__left flex items-center justify-between">
        <div
          className={`header__icon flex items-center gap-2 w-20 md:w-[40%] ${
            darkMode ? "text-[#95a5bd]" : "text-[#52525b]"
          }`}
        >
          <img src="driveIcon.png" alt="" width="38px" />
          <span className="text-2xl font-medium">GDrive</span>
        </div>
        <div
          className={`header_search hidden md:flex items-center w-[50vw] py-2 px-4 rounded-full ${
            darkMode
              ? "bg-[#0d2136] text-[#95a5bd]"
              : "bg-[#e9eef6] text-[#52525b]"
          }`}
        >
          <CiSearch className="text-2xl mr-3" />
          <input
            className={`bg-transparent outline-0 border-0 flex-1 text-lg placeholder:font-medium`}
            type="text"
            name=""
            id=""
            placeholder="Search in Disk"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button
            type="button"
            className={`cursor-pointer ${
              darkMode ? "hover:bg-[#031525]" : "hover:bg-gray-200"
            } p-2 rounded-full relative`}
            onClick={() => handleSortDropDown()}
          >
            <LuSlidersHorizontal className="text-xl" />
            <div
              className={`absolute text-start top-10 right-[-70px] shadow-[0px_0px_2px_gray] w-50 rounded p-2 ${
                darkMode ? "bg-[black]" : "bg-[white]"
              } ${sortingDropDown ? "block" : "hidden"}`}
              ref={sortingDropdownRef}
            >
              <p
                className={`font-bold text-black text-sm py-2 ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Sort By
              </p>
              <p
                className={`text-sm py-2 px-1 rounded ${
                  darkMode
                    ? "hover:bg-[#1f2937] text-[white]"
                    : "hover:bg-[#f3f4f6] text-black"
                }`}
                onClick={() => sortData("nameAsc")}
              >
                Name Ascending
              </p>
              <p
                className={`text-sm py-2 px-1 rounded ${
                  darkMode
                    ? "hover:bg-[#1f2937] text-[white]"
                    : "hover:bg-[#f3f4f6] text-black"
                }`}
                onClick={() => sortData("nameDesc")}
              >
                Name Decending
              </p>
              <p
                className={`text-sm py-2 px-1 rounded ${
                  darkMode
                    ? "hover:bg-[#1f2937] text-[white]"
                    : "hover:bg-[#f3f4f6] text-black"
                }`}
                onClick={() => sortData("dateAsc")}
              >
                Date Modified Ascending
              </p>
              <p
                className={`text-sm py-2 px-1 rounded ${
                  darkMode
                    ? "hover:bg-[#1f2937] text-[white]"
                    : "hover:bg-[#f3f4f6] text-black"
                }`}
                onClick={() => sortData("dateDesc")}
              >
                Date Modified Decending
              </p>
            </div>
          </button>
        </div>
      </div>
      <div className="header__right">
        <div
          className={`header_option flex gap-1 relative ${
            darkMode ? "text-[#95a5bd]" : "text-[#52525b]"
          }`}
        >
          <button
            className={`cursor-pointer ${
              darkMode ? "hover:bg-[#031525]" : "hover:bg-gray-200"
            } p-3 rounded-full text-2xl`}
            type="button"
          >
            <AiOutlineQuestionCircle />
          </button>
          <button
            className={`cursor-pointer ${
              darkMode ? "hover:bg-[#031525]" : "hover:bg-gray-200"
            } p-3 rounded-full text-2xl`}
            type="button"
            onClick={() => handleModeDropDown()}
          >
            <IoSettingsOutline />
          </button>
          <div
            className={`absolute top-11 right-[60px] p-2 w-35 shadow rounded-lg ${
              darkMode
                ? "bg-black text-white border-2 border-[#071a2b]"
                : "bg-white text-black"
            } ${modeDropDown ? "block" : "hidden"}`}
            ref={dropdownRef}
          >
            <div className="py-1 font-bold select-none">Theme</div>
            <p
              onClick={() => setDarkMode(false)}
              className={`py-1 select-none rounded pl-2 cursor-pointer transition-all duration-300 ${
                darkMode ? "hover:bg-[#071a2b]" : "hover:bg-gray-200"
              }`}
            >
              Light
            </p>
            <p
              onClick={() => setDarkMode(true)}
              className={`py-1  select-none rounded pl-2 cursor-pointer transition-all duration-300 ${
                darkMode ? "hover:bg-[#071a2b]" : "hover:bg-gray-200"
              }`}
            >
              Dark
            </p>
            <p
              onClick={() => setDarkMode(false)}
              className={`py-1 select-none rounded pl-2 cursor-pointer transition-all duration-300 ${
                darkMode ? "hover:bg-[#071a2b]" : "hover:bg-gray-200"
              }`}
            >
              System
            </p>
          </div>
          <div className="login_user_icon w-12 border-1 rounded-full p-[2px] border-red-300">
            <img
              src={user.photoURL}
              alt=""
              className="rounded-full cursor-pointer"
              onClick={() => handleLogOutDropDown()}
            />
          </div>
          <div
            className={`absolute top-13 right-[15px] p-2 w-45 shadow rounded-lg ${
              darkMode
                ? "bg-black text-white border-2 border-[#071a2b]"
                : "bg-white text-black"
            } ${logOutDropDown ? "block" : "hidden"}`}
            ref={logOutRef}
          >
            <div className="py-1 font-bold select-none px-1 border-b">
              My Account
            </div>
            <p
              onClick={() => setDarkMode(false)}
              className={`py-2 my-2 select-none rounded text-sm px-1 text-red-500 cursor-pointer trasition-all duration-300 ${
                darkMode
                  ? "hover:bg-[#071a2b] hover:text-[white]"
                  : "hover:bg-gray-200 hover:text-black"
              }`}
              onClickCapture={handleLogOut}
            >
              Log out
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
