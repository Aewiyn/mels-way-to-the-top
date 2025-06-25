import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Timeline from './pages/Timeline';
import FlashcardsReview from './pages/FlashcardsReview';
import { modules as initialModules, Module, FileInfo } from './data/modules';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, updateMetadata } from "firebase/storage";

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState<Module[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const modulesCollectionRef = collection(db, 'users', currentUser.uid, 'modules');
                const querySnapshot = await getDocs(modulesCollectionRef);
                if (querySnapshot.empty) {
                    const batch = [];
                    for (const module of initialModules) {
                        const moduleDocRef = doc(db, 'users', currentUser.uid, 'modules', module.id);
                        batch.push(setDoc(moduleDocRef, module));
                    }
                    await Promise.all(batch);
                    setModules(initialModules);
                } else {
                    const userModules = querySnapshot.docs.map(doc => ({ ...doc.data() as Module, id: doc.id }));
                    setModules(userModules);
                }
            } else {
                setModules([]);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const handleUpdateModule = async (moduleId: string, updatedFields: Partial<Module>) => {
        if (!user) return;
        const moduleDocRef = doc(db, 'users', user.uid, 'modules', moduleId);
        try {
            await updateDoc(moduleDocRef, updatedFields);
            setModules(currentModules =>
                currentModules.map(m =>
                    m.id === moduleId ? { ...m, ...updatedFields } : m
                )
            );
        } catch (error) {
            console.error("Error updating module: ", error);
        }
    };

    const handleFileUpload = async (moduleId: string, file: File) => {
        if (!user) return;
        const storage = getStorage();
        const filePath = `users/${user.uid}/modules/${moduleId}/${file.name}`;
        const fileRef = ref(storage, filePath);
        try {
            await uploadBytes(fileRef, file);
            await updateMetadata(fileRef, { contentDisposition: 'inline', contentType: file.type });
            const url = await getDownloadURL(fileRef);
            const moduleDocRef = doc(db, 'users', user.uid, 'modules', moduleId);
            const newFile = { name: file.name, url, path: filePath };
            await updateDoc(moduleDocRef, { files: arrayUnion(newFile) });
            const updatedDoc = await getDoc(moduleDocRef);
            if (updatedDoc.exists()) {
                const updatedModuleData = { ...updatedDoc.data() as Module, id: updatedDoc.id };
                setModules(currentModules => currentModules.map(m => m.id === moduleId ? updatedModuleData : m));
            }
        } catch (error: any) {
            console.error("Error uploading file: ", error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const handleFileDelete = async (moduleId: string, fileToDelete: FileInfo) => {
        if (!user) return;
        const storage = getStorage();
        const fileRef = ref(storage, fileToDelete.path);
        const moduleDocRef = doc(db, 'users', user.uid, 'modules', moduleId);
        try {
            await deleteObject(fileRef);
            await updateDoc(moduleDocRef, { files: arrayRemove(fileToDelete) });
            const updatedDoc = await getDoc(moduleDocRef);
            if (updatedDoc.exists()) {
                const updatedModuleData = { ...updatedDoc.data() as Module, id: updatedDoc.id };
                setModules(currentModules => currentModules.map(m => m.id === moduleId ? updatedModuleData : m));
            }
        } catch (error: any) {
            console.error("Error deleting file: ", error);
            alert(`Deletion failed: ${error.message}`);
        }
    };

    const handleLinkAdd = async (moduleId: string, newLink: { title: string, url: string }) => {
        if (!user) return;
        const moduleDocRef = doc(db, 'users', user.uid, 'modules', moduleId);
        try {
            await updateDoc(moduleDocRef, { links: arrayUnion(newLink) });
            const updatedDoc = await getDoc(moduleDocRef);
            if (updatedDoc.exists()) {
                const updatedModuleData = { ...updatedDoc.data() as Module, id: updatedDoc.id };
                setModules(currentModules => currentModules.map(m => m.id === moduleId ? updatedModuleData : m));
            }
        } catch (error) {
            console.error("Error adding link: ", error);
        }
    };

    const handleLinkDelete = async (moduleId: string, linkToDelete: { title: string, url: string }) => {
        if (!user) return;
        const moduleDocRef = doc(db, 'users', user.uid, 'modules', moduleId);
        try {
            await updateDoc(moduleDocRef, { links: arrayRemove(linkToDelete) });
            const updatedDoc = await getDoc(moduleDocRef);
            if (updatedDoc.exists()) {
                const updatedModuleData = { ...updatedDoc.data() as Module, id: updatedDoc.id };
                setModules(currentModules => currentModules.map(m => m.id === moduleId ? updatedModuleData : m));
            }
        } catch (error) {
            console.error("Error deleting link: ", error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
    }

    return (
        <Router>
            <AppRoutes 
                user={user} 
                modules={modules}
                onUpdateModule={handleUpdateModule}
                onFileUpload={handleFileUpload}
                onFileDelete={handleFileDelete}
                onLinkAdd={handleLinkAdd}
                onLinkDelete={handleLinkDelete}
            />
        </Router>
    );
};

interface AppRoutesProps {
    user: User | null;
    modules: Module[];
    onUpdateModule: (moduleId: string, updatedFields: Partial<Module>) => void;
    onFileUpload: (moduleId: string, file: File) => void;
    onFileDelete: (moduleId: string, file: FileInfo) => void;
    onLinkAdd: (moduleId: string, newLink: { title: string, url: string }) => void;
    onLinkDelete: (moduleId: string, linkToDelete: { title: string, url: string }) => void;
}

const AppRoutes = ({ user, modules, onUpdateModule, onFileUpload, onFileDelete, onLinkAdd, onLinkDelete }: AppRoutesProps) => (
    <>
        {user && <Navbar user={user} />}
        <main>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={user ? <Outlet /> : <Navigate to="/login" replace />}>
                    <Route index element={<Home modules={modules} />} />
                    <Route path="modules" element={<Outlet />}>
                        <Route index element={<Modules modules={modules} />} />
                        <Route 
                            path=":id" 
                            element={
                                <ModuleDetail 
                                    modules={modules} 
                                    onUpdateModule={onUpdateModule} 
                                    onFileUpload={onFileUpload}
                                    onFileDelete={onFileDelete}
                                    onLinkAdd={onLinkAdd}
                                    onLinkDelete={onLinkDelete}
                                />
                            } 
                        />
                    </Route>
                    <Route path="timeline" element={<Timeline modules={modules} />} />
                    <Route path="flashcards" element={<FlashcardsReview modules={modules} />} />
                </Route>
            </Routes>
        </main>
    </>
);

export default App;
