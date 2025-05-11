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
      />
      <div className="app flex flex-col sm:flex-row min-h-screen">
        <Sidebar darkMode={darkMode} />
        <Data darkMode={darkMode} />
      </div>
    </>
  ) : (
    <Login />
  );
}

export default App;
