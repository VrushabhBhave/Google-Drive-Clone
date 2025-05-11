import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { createContext, useContext, useState } from "react";
import app from "../firebase";
const authContext = createContext();

function AuthProvider( {children} ){
    const[user, setUser] = useState(null);
    const auth = getAuth(app);

    onAuthStateChanged(auth, (loggedInUser) => {
        setUser(loggedInUser);
    })

    async function signInWithGoogle(){
        const provider = new GoogleAuthProvider();
        try{
            await signInWithPopup(auth, provider)
        }catch(error){
            console.log("Failed Google Sign in", error);
        }
    }

    return <authContext.Provider value={{user, setUser, signInWithGoogle}}>
        {children}
    </authContext.Provider>
}

export function useAuth(){
    return useContext(authContext);
}

export default AuthProvider;