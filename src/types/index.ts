// Workout types
export interface Set {
  weight: number;
  reps: number;
  completed: boolean;
}

export interface Exercise {
  name: string;
  sets: Set[];
  muscleGroup: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO string format
  notes: string;
  exercises: Exercise[];
}

export interface WorkoutSummary {
  id: string;
  name: string;
  date: string;
  exerciseCount: number;
  muscleGroups: string[];
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
}

export interface LineChartData {
  date: string;
  value: number;
}

// Form related types
export interface ExerciseFormData {
  name: string;
  muscleGroup: string;
  sets: Set[];
}

export interface WorkoutFormData {
  name: string;
  exercises: ExerciseFormData[];
  notes: string;
}