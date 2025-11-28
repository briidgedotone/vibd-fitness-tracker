import { useState } from 'react';
import { format, subMonths } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useWorkouts } from '../contexts/WorkoutContext';

export default function ProgressCharts() {
  const { workouts } = useWorkouts();
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  
  // Get unique exercises across all workouts
  const exerciseNames = Array.from(
    new Set(
      workouts.flatMap(workout => 
        workout.exercises.map(exercise => exercise.name)
      )
    )
  ).sort();
  
  // Calculate date range for filtering
  const getDateRangeStart = () => {
    const now = new Date();
    
    switch (timeRange) {
      case '1m': return subMonths(now, 1);
      case '3m': return subMonths(now, 3);
      case '6m': return subMonths(now, 6);
      case '1y': return subMonths(now, 12);
      default: return subMonths(now, 3);
    }
  };
  
  const dateRangeStart = getDateRangeStart();
  
  // Get workout data within date range
  const filteredWorkouts = workouts.filter(workout => 
    new Date(workout.date) >= dateRangeStart
  );
  
  // Prepare workout count by type data
  const workoutsByType = filteredWorkouts.reduce((acc, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const workoutTypeData = Object.entries(workoutsByType).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count
  }));
  
  // Prepare exercise progress data
  const exerciseProgressData = selectedExercise 
    ? filteredWorkouts
        .filter(workout => 
          workout.exercises.some(ex => ex.name === selectedExercise)
        )
        .map(workout => {
          const exercise = workout.exercises.find(ex => ex.name === selectedExercise)!;
          // Find the max weight for this exercise in this workout
          const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
          // Find the max volume (weight * reps) for this exercise
          const maxVolume = Math.max(...exercise.sets.map(set => set.weight * set.reps));
          
          return {
            date: format(new Date(workout.date), 'MMM d'),
            weight: maxWeight,
            volume: maxVolume
          };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Progress Tracking</h1>
      
      {/* Time Range Filter */}
      <div className="mb-6">
        <h2 className="text-gray-700 font-medium mb-2">Time Range</h2>
        <div className="flex gap-2">
          {[
            { value: '1m', label: '1 Month' },
            { value: '3m', label: '3 Months' },
            { value: '6m', label: '6 Months' },
            { value: '1y', label: 'Year' }
          ].map(option => (
            <button
              key={option.value}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === option.value 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => setTimeRange(option.value as '1m' | '3m' | '6m' | '1y')}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Workout Summary Chart */}
      <div className="card mb-6">
        <h2 className="section-title">Workout Distribution</h2>
        <div className="h-64">
          {workoutTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={workoutTypeData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" name="Workouts" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No workout data available for the selected time range
            </div>
          )}
        </div>
      </div>
      
      {/* Exercise Progress Chart */}
      <div className="card mb-6">
        <h2 className="section-title">Exercise Progress</h2>
        
        <div className="mb-4">
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="input-field"
          >
            <option value="">Select an exercise</option>
            {exerciseNames.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="h-64">
          {selectedExercise && exerciseProgressData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={exerciseProgressData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#0ea5e9" />
                <YAxis yAxisId="right" orientation="right" stroke="#6366f1" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="weight"
                  name="Max Weight (lbs)"
                  stroke="#0ea5e9"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="volume"
                  name="Max Volume (weight × reps)"
                  stroke="#6366f1"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              {selectedExercise 
                ? "No data available for this exercise in the selected time range" 
                : "Select an exercise to view progress"}
            </div>
          )}
        </div>
      </div>
      
      {/* Workout Frequency Chart */}
      <div className="card">
        <h2 className="section-title">Workout Streak</h2>
        <div className="flex flex-wrap gap-1 py-2">
          {Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 29 + i);
            const dateString = date.toISOString().split('T')[0];
            const hasWorkout = workouts.some(w => w.date === dateString);
            
            return (
              <div 
                key={i}
                className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${
                  hasWorkout 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-400'
                }`}
                title={format(date, 'MMM d, yyyy')}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}