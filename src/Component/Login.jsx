import { Bounce, toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";

function Login() {
  const { signInWithGoogle, user } = useAuth();
  async function handleGoogleLogIn() {
    try {
      await signInWithGoogle();
      toast.success(`Successfully logged in with google!`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.log("error creating account", error);
      toast.error({error}, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  return (
    <div className="login__Page bg-white">
      <div className="header py-6 px-3 sm:px-15 flex justify-between items-center">
        <div className="logo flex items-center gap-2">
          <img src="driveIcon.png" alt="icon.png" className="w-9" />
          <span className="text-2xl font-medium">GDisk</span>
        </div>
        <div className="login-button">
          <button
            type="button"
            className="bg-[#3b82f6] px-10 py-3 text-white rounded-lg font-medium tex-lg cursor-pointer hover:bg-[#2563eb] trasition-bg duration-300" onClick={handleGoogleLogIn}
          >
            Log In
          </button>
        </div>
      </div>
      <div className="content w-[100%] flex items-center">
        <div className="left w-[100%] md:w-[50%] py-[64px] px-[20px] sm:px-[64px]">
          <h1 className="text-2xl sm:text-6xl md:text-2xl lg:text-4xl xl:text-6xl py-10">
            Easy and secure access to your content
          </h1>
          <p className="text-xl sm:text-2xl lg:text-xl xl:text-2xl text-[#71717a] pb-10">
            Store, share, and collaborate on files and folders from your mobile
            device, tablet, or computer
          </p>
          <button
            type="button"
            className="bg-[#3b82f6] px-10 py-3 text-white rounded-lg font-medium tex-lg cursor-pointer hover:bg-[#2563eb] trasition-bg duration-300"
            onClick={handleGoogleLogIn}
          >
            Log In
          </button>
        </div>
        <div className="right w-[50%] py-10 hidden md:inline-block">
          <img
            src="landing-splash.jpg"
            alt=""
            className="md:w-[600px] lg:w-[800px] xl:w-[1000px]"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
