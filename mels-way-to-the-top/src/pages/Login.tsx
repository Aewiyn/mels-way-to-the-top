import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate("/"); // Redirect to dashboard after successful login
        } catch (error) {
            console.error("Error during Google login", error);
            // Optionally, show an error message to the user
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-offwhite dark:bg-gray-900">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center max-w-sm">
                <img src="/logo.png" alt="Logo" className="w-24 h-24 mx-auto mb-4"/>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome to Mel's Way to the Top</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Please sign in to continue.</p>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.06,4.71c1.09-3.003,3.922-5.11,7.634-5.11c1.786,0,3.438,0.592,4.821,1.586l5.657-5.657C30.65,6.6,27.53,4.914,24,4.914C16.9,4.914,10.7,9.138,7.246,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-4.823C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.06,4.71C10.094,39.383,16.396,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,4.823C42.022,35.141,44,30.021,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
};

export default Login; 