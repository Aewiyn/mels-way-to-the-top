import { useParams } from 'react-router-dom';
import { Module, ModuleStatus, LinkInfo, FileInfo, Flashcard } from '../data/modules';
import { useState, useEffect } from 'react';
import { FaFileUpload, FaLink, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const formatMonthYear = (dateString?: string): string => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

interface ModuleDetailProps {
  modules: Module[];
  onUpdateModule: (moduleId: string, updatedFields: Partial<Module>) => void;
  onFileUpload: (moduleId: string, file: File) => void;
  onFileDelete: (moduleId: string, file: FileInfo) => void;
  onLinkAdd: (moduleId: string, newLink: LinkInfo) => void;
  onLinkDelete: (moduleId: string, linkToDelete: LinkInfo) => void;
}

const ModuleDetail = ({ modules, onUpdateModule, onFileUpload, onFileDelete, onLinkAdd, onLinkDelete }: ModuleDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newLink, setNewLink] = useState<LinkInfo>({ title: '', url: '' });
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '' });

  const module = modules.find(m => m.id === id);

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!module || !auth.currentUser) return;
      try {
        const flashcardsCollectionRef = collection(db, 'users', auth.currentUser.uid, 'modules', module.id, 'flashcards');
        const querySnapshot = await getDocs(flashcardsCollectionRef);
        const fetchedFlashcards = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Flashcard));
        setFlashcards(fetchedFlashcards);
      } catch (error) {
        console.error("Error fetching flashcards: ", error);
      }
    };

    fetchFlashcards();
  }, [module]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!module) return;
    const newStatus = e.target.value as ModuleStatus;
    onUpdateModule(module.id, { status: newStatus });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!module) return;
    const { name, value } = e.target;
    onUpdateModule(module.id, { [name]: value });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !module) return;
    setIsUploading(true);
    await onFileUpload(module.id, selectedFile);
    setIsUploading(false);
    setSelectedFile(null);
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
    }
  };

  const handleAddLink = () => {
    if (!module || !newLink.url) return;
    onLinkAdd(module.id, newLink);
    setNewLink({ title: '', url: '' });
  };

  const handleAddFlashcard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!module || !auth.currentUser || !newFlashcard.question || !newFlashcard.answer) {
      alert("Please fill in both question and answer.");
      return;
    }
    try {
      const flashcardsCollectionRef = collection(db, 'users', auth.currentUser.uid, 'modules', module.id, 'flashcards');
      const docRef = await addDoc(flashcardsCollectionRef, {
        question: newFlashcard.question,
        answer: newFlashcard.answer
      });
      setFlashcards([...flashcards, { id: docRef.id, ...newFlashcard }]);
      setNewFlashcard({ question: '', answer: '' });
    } catch (error) {
      console.error("Error adding flashcard: ", error);
    }
  };

  if (!module) {
    return (
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Module Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">The module you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="bg-offwhite dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{module.name}</h1>
        <div className="flex items-center gap-4 mt-2 mb-8">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            Level {module.level}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Module Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Module Details</h2>
            <div className="space-y-4">
              <div>
                <p><strong>Midterm:</strong> {String(module.midterm)}</p>
              </div>
              <div>
                <p><strong>Final:</strong> {String(module.final)}</p>
                <input type="month" id="finalDate" name="finalDate"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  value={module.finalDate || ''}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </div>
          {/* Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  value={module.status}
                  onChange={handleStatusChange}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          {/* Flashcards Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Flashcards</h2>
            
            {/* Add Flashcard Form */}
            <form onSubmit={handleAddFlashcard} className="mb-6 space-y-4">
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question</label>
                <input
                  type="text"
                  id="question"
                  value={newFlashcard.question}
                  onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lavender focus:border-lavender sm:text-sm"
                  placeholder="Enter the question"
                />
              </div>
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Answer</label>
                <input
                  type="text"
                  id="answer"
                  value={newFlashcard.answer}
                  onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-lavender focus:border-lavender sm:text-sm"
                  placeholder="Enter the answer"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-lavender hover:bg-lavender-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lavender"
              >
                Add Flashcard
              </button>
            </form>

            {/* Existing Flashcards List */}
            <div className="space-y-3">
              {flashcards
                .filter(card => typeof card.question === 'string' && typeof card.answer === 'string')
                .map(card => (
                  <div key={card.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Q: {card.question}</p>
                    <p className="text-gray-600 dark:text-gray-400">A: {card.answer}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Files & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Links Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Links</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <input 
                        type="text"
                        placeholder="Link Title (e.g., GitHub)"
                        value={newLink.title}
                        onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                        className="flex-grow w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                    <input 
                        type="url"
                        placeholder="https://..."
                        value={newLink.url}
                        onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                        className="flex-grow w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                    <button
                        onClick={handleAddLink}
                        disabled={!newLink.url}
                        className="w-full sm:w-auto px-4 py-2 bg-lavender text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-gray-400"
                    >
                        Add Link
                    </button>
                </div>

                <div className="space-y-3">
                    {module.links && module.links.map(link => (
                        <div key={link.url} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{link.title || link.url}</a>
                            <button onClick={() => module && onLinkDelete(module.id, link)} className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Files Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Files</h2>
                <div className="flex items-center gap-4">
                    <input
                        id="file-input"
                        type="file"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-lavender
                            hover:file:bg-violet-100"
                    />
                    <button
                        onClick={handleFileUpload}
                        disabled={!selectedFile || isUploading}
                        className="px-4 py-2 bg-lavender text-white rounded-lg font-semibold hover:bg-opacity-90 disabled:bg-gray-400"
                    >
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>

                <div className="mt-6 space-y-3">
                    {module.files && module.files.map(file => (
                        <div key={file.path} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">{file.name}</a>
                            <button onClick={() => module && onFileDelete(module.id, file)} className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModuleDetail; 