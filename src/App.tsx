import { useState } from 'react';
import { Activity as ActivityIcon, BarChart2 as BarChart2Icon, PlusCircle as PlusCircleIcon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WorkoutHistory from './components/WorkoutHistory';
import WorkoutForm from './components/WorkoutForm';
import ProgressCharts from './components/ProgressCharts';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add' | 'progress'>('dashboard');
  const [isWorkoutFormOpen, setIsWorkoutFormOpen] = useState(false);
  
  const handleAddWorkout = () => {
    setIsWorkoutFormOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Main Content */}
        <div className="mb-6">
          {activeTab === 'dashboard' && <Dashboard onAddWorkout={handleAddWorkout} />}
          {activeTab === 'history' && <WorkoutHistory />}
          {activeTab === 'progress' && <ProgressCharts />}
          {activeTab === 'add' && <WorkoutForm onClose={() => setActiveTab('dashboard')} />}
        </div>
        
        {/* Workout Form Modal */}
        {isWorkoutFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <WorkoutForm onClose={() => setIsWorkoutFormOpen(false)} />
            </div>
          </div>
        )}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="bg-white shadow-lg py-3 sticky bottom-0">
        <div className="container mx-auto">
          <div className="flex justify-around">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`flex flex-col items-center ${activeTab === 'dashboard' ? 'text-primary-600' : 'text-gray-600'}`}
            >
              <ActivityIcon size={24} />
              <span className="text-xs mt-1">Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')} 
              className={`flex flex-col items-center ${activeTab === 'history' ? 'text-primary-600' : 'text-gray-600'}`}
            >
              <ActivityIcon size={24} />
              <span className="text-xs mt-1">History</span>
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className={`flex flex-col items-center ${activeTab === 'add' ? 'text-primary-600' : 'text-gray-600'}`}
            >
              <PlusCircleIcon size={24} />
              <span className="text-xs mt-1">Add</span>
            </button>
            <button 
              onClick={() => setActiveTab('progress')} 
              className={`flex flex-col items-center ${activeTab === 'progress' ? 'text-primary-600' : 'text-gray-600'}`}
            >
              <BarChart2Icon size={24} />
              <span className="text-xs mt-1">Progress</span>
            </button>
          </div>
        </div>
      </nav>
      
      <Footer />
    </div>
  );
}