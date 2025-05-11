import { ToastContainer } from "react-toastify";
import App from "./App";
import AuthProvider from "./Context/AuthContext";

function MainApp(){
    return (
        <AuthProvider>
            <App />
            <ToastContainer />
        </AuthProvider>
    )
}

export default MainApp;