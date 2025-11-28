import { format } from 'date-fns';
import { ChevronRight as ChevronRightIcon, Dumbbell as DumbbellIcon, Timer as TimerIcon } from 'lucide-react';
import { Workout } from '../types';

interface WorkoutSummaryCardProps {
  workout: Workout;
}

export default function WorkoutSummaryCard({ workout }: WorkoutSummaryCardProps) {
  const formattedDate = format(new Date(workout.date), 'MMM d, yyyy');
  
  // Get summary stats
  const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const totalExercises = workout.exercises.length;
  
  // Calculate workout duration if available
  const durationText = workout.duration 
    ? `${workout.duration} min` 
    : 'N/A';
  
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">{workout.name}</h3>
          <p className="text-gray-600 text-sm">{formattedDate}</p>
        </div>
        <ChevronRightIcon size={20} className="text-gray-400" />
      </div>
      
      <div className="mt-4 flex">
        <div className="flex items-center mr-6">
          <DumbbellIcon size={16} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">{totalExercises} exercises, {totalSets} sets</span>
        </div>
        <div className="flex items-center">
          <TimerIcon size={16} className="text-gray-500 mr-2" />
          <span className="text-sm text-gray-600">{durationText}</span>
        </div>
      </div>
    </div>
  );
}