import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Workout, Exercise, WorkoutSummary } from '@/types';

// Define the context state type
interface WorkoutContextState {
  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id' | 'date'>) => void;
  updateWorkout: (updatedWorkout: Workout) => void;
  deleteWorkout: (workoutId: string) => void;
  getWorkoutById: (id: string) => Workout | undefined;
  getRecentWorkouts: (limit?: number) => WorkoutSummary[];
  getWorkoutsByDateRange: (startDate: Date, endDate: Date) => Workout[];
  getExerciseStats: (exerciseName: string) => { dates: string[], weights: number[], reps: number[] };
  getTotalWorkoutsByMuscleGroup: () => { name: string; value: number }[];
  getTotalVolumeByWeek: () => { week: string; volume: number }[];
  getMuscleGroups: () => string[];
}

// Create the context with a default undefined value
const WorkoutContext = createContext<WorkoutContextState | undefined>(undefined);

// Sample workout data
const initialWorkoutData: Workout[] = [
  {
    id: '1',
    name: 'Full Body Workout',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    notes: 'Felt great, increased weight on squats',
    exercises: [
      { 
        name: 'Squat', 
        sets: [
          { weight: 135, reps: 10, completed: true },
          { weight: 155, reps: 8, completed: true },
          { weight: 175, reps: 6, completed: true }
        ],
        muscleGroup: 'Legs'
      },
      { 
        name: 'Bench Press', 
        sets: [
          { weight: 115, reps: 10, completed: true },
          { weight: 135, reps: 8, completed: true },
          { weight: 145, reps: 6, completed: true }
        ],
        muscleGroup: 'Chest'
      },
      { 
        name: 'Deadlift', 
        sets: [
          { weight: 185, reps: 8, completed: true },
          { weight: 205, reps: 6, completed: true },
          { weight: 225, reps: 4, completed: true }
        ],
        muscleGroup: 'Back'
      }
    ]
  },
  {
    id: '2',
    name: 'Upper Body Focus',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    notes: 'Great pump in the arms',
    exercises: [
      { 
        name: 'Pull-ups', 
        sets: [
          { weight: 0, reps: 10, completed: true },
          { weight: 0, reps: 8, completed: true },
          { weight: 0, reps: 7, completed: true }
        ],
        muscleGroup: 'Back'
      },
      { 
        name: 'Overhead Press', 
        sets: [
          { weight: 65, reps: 10, completed: true },
          { weight: 75, reps: 8, completed: true },
          { weight: 85, reps: 6, completed: true }
        ],
        muscleGroup: 'Shoulders'
      },
      { 
        name: 'Bicep Curls', 
        sets: [
          { weight: 25, reps: 12, completed: true },
          { weight: 30, reps: 10, completed: true },
          { weight: 35, reps: 8, completed: true }
        ],
        muscleGroup: 'Arms'
      }
    ]
  },
  {
    id: '3',
    name: 'Leg Day',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    notes: 'Focused on form with lighter weights',
    exercises: [
      { 
        name: 'Squat', 
        sets: [
          { weight: 135, reps: 12, completed: true },
          { weight: 155, reps: 10, completed: true },
          { weight: 175, reps: 8, completed: true }
        ],
        muscleGroup: 'Legs'
      },
      { 
        name: 'Leg Press', 
        sets: [
          { weight: 180, reps: 12, completed: true },
          { weight: 200, reps: 10, completed: true },
          { weight: 220, reps: 8, completed: true }
        ],
        muscleGroup: 'Legs'
      },
      { 
        name: 'Leg Curl', 
        sets: [
          { weight: 70, reps: 12, completed: true },
          { weight: 80, reps: 10, completed: true },
          { weight: 90, reps: 8, completed: true }
        ],
        muscleGroup: 'Legs'
      }
    ]
  }
];

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with data from localStorage or default data
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    return savedWorkouts ? JSON.parse(savedWorkouts) : initialWorkoutData;
  });

  // Save to localStorage whenever workouts change
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  // Add a new workout
  const addWorkout = (workout: Omit<Workout, 'id' | 'date'>) => {
    const newWorkout = {
      ...workout,
      id: uuidv4(),
      date: new Date().toISOString()
    };
    setWorkouts([...workouts, newWorkout]);
  };

  // Update an existing workout
  const updateWorkout = (updatedWorkout: Workout) => {
    setWorkouts(workouts.map(workout => 
      workout.id === updatedWorkout.id ? updatedWorkout : workout
    ));
  };

  // Delete a workout
  const deleteWorkout = (workoutId: string) => {
    setWorkouts(workouts.filter(workout => workout.id !== workoutId));
  };

  // Get a workout by ID
  const getWorkoutById = (id: string) => {
    return workouts.find(workout => workout.id === id);
  };

  // Get recent workouts
  const getRecentWorkouts = (limit: number = 5): WorkoutSummary[] => {
    return [...workouts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
      .map(workout => ({
        id: workout.id,
        name: workout.name,
        date: workout.date,
        exerciseCount: workout.exercises.length,
        muscleGroups: [...new Set(workout.exercises.map(ex => ex.muscleGroup))]
      }));
  };

  // Get workouts in a date range
  const getWorkoutsByDateRange = (startDate: Date, endDate: Date): Workout[] => {
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startDate && workoutDate <= endDate;
    });
  };

  // Get exercise stats for a specific exercise
  const getExerciseStats = (exerciseName: string) => {
    const relevantWorkouts = workouts
      .filter(workout => 
        workout.exercises.some(exercise => exercise.name === exerciseName)
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dates: string[] = [];
    const weights: number[] = [];
    const reps: number[] = [];

    relevantWorkouts.forEach(workout => {
      const exercise = workout.exercises.find(ex => ex.name === exerciseName);
      if (exercise && exercise.sets.length > 0) {
        // Get max weight set
        const maxWeightSet = [...exercise.sets].sort((a, b) => b.weight - a.weight)[0];
        const maxRepSet = [...exercise.sets].sort((a, b) => b.reps - a.reps)[0];
        
        dates.push(new Date(workout.date).toLocaleDateString());
        weights.push(maxWeightSet.weight);
        reps.push(maxRepSet.reps);
      }
    });

    return { dates, weights, reps };
  };

  // Get total workouts by muscle group
  const getTotalWorkoutsByMuscleGroup = () => {
    const muscleGroupCounts: Record<string, number> = {};
    
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const muscleGroup = exercise.muscleGroup;
        muscleGroupCounts[muscleGroup] = (muscleGroupCounts[muscleGroup] || 0) + 1;
      });
    });

    return Object.entries(muscleGroupCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Get total volume by week
  const getTotalVolumeByWeek = () => {
    const volumeByWeek: Record<string, number> = {};

    workouts.forEach(workout => {
      const date = new Date(workout.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = `${weekStart.getFullYear()}-${weekStart.getMonth() + 1}-${weekStart.getDate()}`;

      let workoutVolume = 0;
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.completed) {
            workoutVolume += set.weight * set.reps;
          }
        });
      });

      volumeByWeek[weekKey] = (volumeByWeek[weekKey] || 0) + workoutVolume;
    });

    return Object.entries(volumeByWeek)
      .map(([week, volume]) => ({ 
        week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
        volume 
      }))
      .sort((a, b) => {
        const dateA = new Date(a.week);
        const dateB = new Date(b.week);
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Get all unique muscle groups
  const getMuscleGroups = () => {
    const muscleGroups = new Set<string>();
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        muscleGroups.add(exercise.muscleGroup);
      });
    });
    return Array.from(muscleGroups);
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      addWorkout,
      updateWorkout,
      deleteWorkout,
      getWorkoutById,
      getRecentWorkouts,
      getWorkoutsByDateRange,
      getExerciseStats,
      getTotalWorkoutsByMuscleGroup,
      getTotalVolumeByWeek,
      getMuscleGroups,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

// Custom hook to use the workout context
export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};