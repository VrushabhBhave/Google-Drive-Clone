import { useEffect, useState } from "react";
import Header from "./Component/Header";
import Sidebar from "./Component/Sidebar";
import Data from "./Component/Data";
import { useAuth } from "./Context/AuthContext";
import Login from "./Component/Login";

function App() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [modeDropDown, setModeDropDown] = useState(false);
  const [logOutDropDown, setLogOutDropDown] = useState(false);
  const [sortingDropDown, setSortingDropDown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState([]);
  const [storageExceeded, setStorageExceeded] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("bg-[#071a2b]");
      document.documentElement.classList.remove("bg-[#f8fafd]");
    } else {
      document.documentElement.classList.remove("bg-[#071a2b]");
      document.documentElement.classList.add("bg-[#f8fafd]");
    }
    setModeDropDown(false);
  }, [darkMode]);

  return user ? (
    <>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        modeDropDown={modeDropDown}
        setModeDropDown={setModeDropDown}
        logOutDropDown={logOutDropDown}
        setLogOutDropDown = {setLogOutDropDown}
        sortingDropDown = {sortingDropDown}
        setSortingDropDown = {setSortingDropDown}
        searchTerm = {searchTerm}
        setSearchTerm = {setSearchTerm}
        files = {files}
        setFiles = {setFiles}
      />
      <div className="app flex flex-col sm:flex-row min-h-[80%] gap-20 sm:gap-0">
        <Sidebar darkMode={darkMode} files={files} setStorageExceeded={setStorageExceeded} storageExceeded={storageExceeded}/>
        <Data darkMode={darkMode} searchTerm={searchTerm} files = {files}
        setFiles = {setFiles} storageExceeded={storageExceeded}/>
      </div>
    </>
  ) : (
    <Login />
  );
}

export default App;
