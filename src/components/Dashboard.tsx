import { format } from 'date-fns';
import { PlusCircle as PlusCircleIcon, TrendingUp as TrendingUpIcon, Activity as ActivityIcon, Calendar as CalendarIcon } from 'lucide-react';
import { useWorkouts } from '../contexts/WorkoutContext';
import WorkoutSummaryCard from './WorkoutSummaryCard';

interface DashboardProps {
  onAddWorkout: () => void;
}

export default function Dashboard({ onAddWorkout }: DashboardProps) {
  const { workouts } = useWorkouts();
  const today = format(new Date(), 'EEEE, MMMM d');
  
  // Get the last 3 workouts
  const recentWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3);
  
  // Calculate stats
  const totalWorkouts = workouts.length;
  const workoutsThisWeek = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    return workoutDate >= weekStart;
  }).length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">{today}</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <ActivityIcon className="text-primary-600" size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Total Workouts</h3>
            <p className="text-xl font-semibold">{totalWorkouts}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <CalendarIcon className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">This Week</h3>
            <p className="text-xl font-semibold">{workoutsThisWeek}</p>
          </div>
        </div>
      </div>
      
      {/* Add Workout Button */}
      <button 
        onClick={onAddWorkout}
        className="w-full btn-primary mb-6 flex items-center justify-center"
      >
        <PlusCircleIcon size={20} className="mr-2" />
        Add New Workout
      </button>
      
      {/* Recent Workouts Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Workouts</h2>
          {recentWorkouts.length > 0 && (
            <a href="#" className="text-primary-600 text-sm flex items-center">
              See All <TrendingUpIcon size={16} className="ml-1" />
            </a>
          )}
        </div>
        
        {recentWorkouts.length > 0 ? (
          <div className="space-y-4">
            {recentWorkouts.map((workout) => (
              <WorkoutSummaryCard key={workout.id} workout={workout} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <ActivityIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-gray-800 font-medium mb-2">No Workouts Yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your fitness journey today</p>
            <button 
              onClick={onAddWorkout}
              className="btn-primary"
            >
              Add Your First Workout
            </button>
          </div>
        )}
      </div>
      
      {/* Motivation Quote */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-center">
        <p className="text-primary-800 font-medium">
          "The only bad workout is the one that didn't happen."
        </p>
      </div>
    </div>
  );
}