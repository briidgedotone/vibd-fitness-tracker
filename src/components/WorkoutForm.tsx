import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X as XIcon, Plus as PlusIcon, Trash2 as Trash2Icon } from 'lucide-react';
import { useWorkouts } from '../contexts/WorkoutContext';
import { Exercise, ExerciseSet, Workout } from '../types';

interface WorkoutFormProps {
  onClose: () => void;
  existingWorkout?: Workout; // For editing existing workouts
}

export default function WorkoutForm({ onClose, existingWorkout }: WorkoutFormProps) {
  const { addWorkout, updateWorkout } = useWorkouts();
  const isEditing = !!existingWorkout;
  
  const [workoutData, setWorkoutData] = useState<Omit<Workout, 'id'>>({
    name: existingWorkout?.name || '',
    date: existingWorkout?.date || new Date().toISOString().split('T')[0],
    duration: existingWorkout?.duration || 0,
    type: existingWorkout?.type || 'strength',
    notes: existingWorkout?.notes || '',
    exercises: existingWorkout?.exercises || []
  });
  
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    id: uuidv4(),
    name: '',
    sets: [{
      id: uuidv4(),
      weight: 0,
      reps: 0,
      notes: ''
    }]
  });
  
  const workoutTypes = [
    'strength', 
    'cardio', 
    'flexibility', 
    'hiit', 
    'crossfit',
    'bodyweight'
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWorkoutData({
      ...workoutData,
      [name]: value
    });
  };
  
  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentExercise({
      ...currentExercise,
      name: e.target.value
    });
  };
  
  const handleSetChange = (index: number, field: keyof ExerciseSet, value: string | number) => {
    const updatedSets = [...currentExercise.sets];
    updatedSets[index] = {
      ...updatedSets[index],
      [field]: field === 'notes' ? value : Number(value)
    };
    
    setCurrentExercise({
      ...currentExercise,
      sets: updatedSets
    });
  };
  
  const addSet = () => {
    setCurrentExercise({
      ...currentExercise,
      sets: [
        ...currentExercise.sets,
        {
          id: uuidv4(),
          weight: currentExercise.sets[currentExercise.sets.length - 1]?.weight || 0,
          reps: currentExercise.sets[currentExercise.sets.length - 1]?.reps || 0,
          notes: ''
        }
      ]
    });
  };
  
  const removeSet = (index: number) => {
    const updatedSets = [...currentExercise.sets];
    updatedSets.splice(index, 1);
    setCurrentExercise({
      ...currentExercise,
      sets: updatedSets
    });
  };
  
  const addExerciseToWorkout = () => {
    if (!currentExercise.name || currentExercise.sets.length === 0) {
      return;
    }
    
    setWorkoutData({
      ...workoutData,
      exercises: [...workoutData.exercises, currentExercise]
    });
    
    // Reset current exercise
    setCurrentExercise({
      id: uuidv4(),
      name: '',
      sets: [{
        id: uuidv4(),
        weight: 0,
        reps: 0,
        notes: ''
      }]
    });
  };
  
  const removeExercise = (exerciseId: string) => {
    setWorkoutData({
      ...workoutData,
      exercises: workoutData.exercises.filter(ex => ex.id !== exerciseId)
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add current exercise if it has data
    if (currentExercise.name && currentExercise.sets.length > 0) {
      addExerciseToWorkout();
    }
    
    const workoutToSave = {
      ...workoutData,
      id: existingWorkout?.id || uuidv4()
    };
    
    if (isEditing) {
      updateWorkout(workoutToSave);
    } else {
      addWorkout(workoutToSave);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {isEditing ? 'Edit Workout' : 'Add New Workout'}
        </h2>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XIcon size={24} />
        </button>
      </div>
      
      {/* Workout Details */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
            Workout Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={workoutData.name}
            onChange={handleInputChange}
            placeholder="E.g., Morning Workout, Leg Day"
            className="input-field"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-gray-700 font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={workoutData.date}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-gray-700 font-medium mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="0"
              value={workoutData.duration}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="type" className="block text-gray-700 font-medium mb-1">
            Workout Type
          </label>
          <select
            id="type"
            name="type"
            value={workoutData.type}
            onChange={handleInputChange}
            className="input-field"
          >
            {workoutTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-gray-700 font-medium mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={workoutData.notes}
            onChange={handleInputChange}
            rows={2}
            className="input-field"
            placeholder="How did you feel? Any achievements?"
          ></textarea>
        </div>
      </div>
      
      {/* Added Exercises List */}
      {workoutData.exercises.length > 0 && (
        <div className="mb-6">
          <h3 className="text-gray-700 font-medium mb-2">Exercises</h3>
          <div className="space-y-3">
            {workoutData.exercises.map((exercise, index) => (
              <div key={exercise.id} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{exercise.name}</span>
                  <button
                    type="button"
                    onClick={() => removeExercise(exercise.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add Exercise Form */}
      <div className="border border-gray-200 rounded-md p-4 mb-6">
        <h3 className="text-gray-700 font-medium mb-3">Add Exercise</h3>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Exercise Name"
            value={currentExercise.name}
            onChange={handleExerciseChange}
            className="input-field"
          />
        </div>
        
        {/* Sets */}
        <div className="mb-3">
          <h4 className="text-gray-600 text-sm font-medium mb-2">Sets</h4>
          
          {currentExercise.sets.map((set, index) => (
            <div key={set.id} className="flex items-center gap-2 mb-2">
              <div className="w-10 text-center text-sm text-gray-500">{index + 1}</div>
              <input
                type="number"
                placeholder="Weight"
                value={set.weight}
                onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                className="input-field w-20"
                min="0"
                step="0.5"
              />
              <input
                type="number"
                placeholder="Reps"
                value={set.reps}
                onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                className="input-field w-20"
                min="0"
              />
              <input
                type="text"
                placeholder="Notes"
                value={set.notes}
                onChange={(e) => handleSetChange(index, 'notes', e.target.value)}
                className="input-field flex-1"
              />
              {currentExercise.sets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSet(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <XIcon size={16} />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSet}
            className="mt-2 flex items-center text-primary-600 hover:text-primary-800"
          >
            <PlusIcon size={16} className="mr-1" />
            <span>Add Set</span>
          </button>
        </div>
        
        <button
          type="button"
          onClick={addExerciseToWorkout}
          className="btn-secondary w-full"
        >
          Add Exercise
        </button>
      </div>
      
      {/* Submit Buttons */}
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1">
          {isEditing ? 'Save Changes' : 'Save Workout'}
        </button>
      </div>
    </form>
  );
}