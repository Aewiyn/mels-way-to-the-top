import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Module, Flashcard } from '../data/modules';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface FlashcardsReviewProps {
  modules: Module[];
}

const FlashcardsReview = ({ modules }: FlashcardsReviewProps) => {
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [reviewStarted, setReviewStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    setSelectedModuleIds(options.map(opt => opt.value));
  };

  const startReview = async () => {
    setLoading(true);
    setShowAnswer(false);
    setCurrentIndex(0);
    let allFlashcards: Flashcard[] = [];
    if (!auth.currentUser) {
      alert('You must be logged in.');
      setLoading(false);
      return;
    }
    for (const moduleId of selectedModuleIds) {
      const flashcardsCollectionRef = collection(db, 'users', auth.currentUser.uid, 'modules', moduleId, 'flashcards');
      const querySnapshot = await getDocs(flashcardsCollectionRef);
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Flashcard));
      allFlashcards = allFlashcards.concat(fetched);
    }
    setFlashcards(allFlashcards);
    setReviewStarted(true);
    setLoading(false);
  };

  const handleShowAnswer = () => setShowAnswer(true);
  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex(idx => Math.min(idx + 1, flashcards.length - 1));
  };
  const handlePrev = () => {
    setShowAnswer(false);
    setCurrentIndex(idx => Math.max(idx - 1, 0));
  };
  const handleIKnew = () => {
    // Future: log or update spaced repetition
    handleNext();
  };
  const handleReviewAgain = () => {
    // Future: log or update spaced repetition
    handleNext();
  };

  return (
    <div className="p-8 bg-offwhite dark:bg-gray-900 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Flashcards Review</h1>
        {!reviewStarted && (
          <>
            <label className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
              Select modules to review:
            </label>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
              value={selectedModuleIds}
              onChange={handleModuleChange}
            >
              {modules.map(module => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
            <div className="mt-4 text-gray-700 dark:text-gray-200">
              {selectedModuleIds.length === 0
                ? 'No module selected.'
                : `${selectedModuleIds.length} module(s) selected.`}
            </div>
            <button
              className="mt-6 px-6 py-2 bg-lavender text-white rounded-md font-semibold hover:bg-lavender-dark disabled:opacity-50"
              onClick={startReview}
              disabled={selectedModuleIds.length === 0 || loading}
            >
              {loading ? 'Loading...' : 'Start Review'}
            </button>
          </>
        )}
        {reviewStarted && flashcards.length > 0 && (
          <div className="mt-8 flex flex-col items-center">
            <div className="w-full max-w-md bg-gray-100 dark:bg-gray-700 rounded-lg shadow p-8 mb-6 cursor-pointer text-center" onClick={!showAnswer ? handleShowAnswer : undefined}>
              <div className="text-lg text-gray-700 dark:text-gray-200 font-semibold">
                {!showAnswer ? flashcards[currentIndex].question : flashcards[currentIndex].answer}
              </div>
              {!showAnswer && <div className="mt-2 text-sm text-gray-500">Click to show answer</div>}
            </div>
            <div className="flex gap-4 mb-4">
              <button onClick={handlePrev} disabled={currentIndex === 0} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50">Previous</button>
              <button onClick={handleNext} disabled={currentIndex === flashcards.length - 1} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50">Next</button>
            </div>
            <div className="flex gap-4 mb-4">
              <button onClick={handleIKnew} className="px-4 py-2 bg-green-500 text-white rounded">I knew</button>
              <button onClick={handleReviewAgain} className="px-4 py-2 bg-red-500 text-white rounded">Review again</button>
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              Card {currentIndex + 1} / {flashcards.length}
            </div>
          </div>
        )}
        {reviewStarted && flashcards.length === 0 && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-300">
            No flashcards found for the selected modules.
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardsReview; 