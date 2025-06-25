import { NavLink } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { User } from 'firebase/auth';
import { useState } from 'react';

interface NavbarProps {
    user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // The onAuthStateChanged listener in App.tsx will handle the redirect.
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    // Fallback while loading user state
    if (!user) {
        return null;
    }

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <img className="h-8 w-auto" src="/logo.png" alt="Mel's Way to the Top Logo" />
                        <span className="text-xl font-bold text-lavender">Mel's Way to the Top</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                `text-lg transition-colors ${isActive ? 'font-bold text-lavender' : 'font-medium text-gray-600 dark:text-gray-300'} hover:text-lavender`
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink 
                            to="/modules" 
                            className={({ isActive }) => 
                                `text-lg transition-colors ${isActive ? 'font-bold text-lavender' : 'font-medium text-gray-600 dark:text-gray-300'} hover:text-lavender`
                            }
                        >
                            Modules
                        </NavLink>
                        <NavLink 
                            to="/timeline" 
                            className={({ isActive }) => 
                                `text-lg transition-colors ${isActive ? 'font-bold text-lavender' : 'font-medium text-gray-600 dark:text-gray-300'} hover:text-lavender`
                            }
                        >
                            Timeline
                        </NavLink>
                        <NavLink 
                            to="/flashcards" 
                            className={({ isActive }) => 
                                `text-lg transition-colors ${isActive ? 'font-bold text-lavender' : 'font-medium text-gray-600 dark:text-gray-300'} hover:text-lavender`
                            }
                        >
                            Flashcards
                        </NavLink>
                    </div>
                    <div className="hidden md:block">
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 focus:outline-none">
                                {(user.photoURL && !imgError) ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt="User" 
                                        className="w-8 h-8 rounded-full"
                                        onError={() => setImgError(true)}
                                     />
                                ) : (
                                    <span className="h-8 w-8 rounded-full bg-lavender flex items-center justify-center text-white font-bold">
                                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                )}
                            </button>
                            {isMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">{user.displayName || 'User'}</div>
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(prev => !prev)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            {/* Icon for menu */}
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink to="/" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'font-bold text-lavender' : 'text-gray-600 dark:text-gray-300'}`}>Dashboard</NavLink>
                        <NavLink to="/modules" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'font-bold text-lavender' : 'text-gray-600 dark:text-gray-300'}`}>Modules</NavLink>
                        <NavLink to="/timeline" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'font-bold text-lavender' : 'text-gray-600 dark:text-gray-300'}`}>Timeline</NavLink>
                        <NavLink to="/flashcards" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'font-bold text-lavender' : 'text-gray-600 dark:text-gray-300'}`}>Flashcards</NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 