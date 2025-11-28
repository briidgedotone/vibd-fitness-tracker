import { useState } from 'react';
import { format } from 'date-fns';
import { Filter as FilterIcon, Search as SearchIcon } from 'lucide-react';
import { useWorkouts } from '../contexts/WorkoutContext';
import WorkoutSummaryCard from './WorkoutSummaryCard';

export default function WorkoutHistory() {
  const { workouts } = useWorkouts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Sort workouts by date (newest first)
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Filter by search term and type
  const filteredWorkouts = sortedWorkouts.filter(workout => {
    const matchesSearch = 
      workout.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      workout.exercises.some(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesType = filterType === 'all' || workout.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  // Get unique workout types for filter
  const workoutTypes = ['all', ...new Set(workouts.map(w => w.type))];
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Workout History</h1>
      
      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <SearchIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search workouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <div className="flex items-center">
          <FilterIcon size={18} className="mr-2 text-gray-500" />
          <div className="flex flex-wrap gap-2">
            {workoutTypes.map((type) => (
              <button
                key={type}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterType === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() => setFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Workout List */}
      {filteredWorkouts.length > 0 ? (
        <div className="space-y-4">
          {filteredWorkouts.map(workout => (
            <WorkoutSummaryCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No workouts found. Try changing your filters or add a new workout.</p>
        </div>
      )}
    </div>
  );
}