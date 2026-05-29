import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../utils/constants";

const Planner = () => {
  // Initial Local State (Dummy Data)
  // const [workoutDays, setWorkoutDays] = useState([
  //   {
  //     _id: "1",
  //     title: "Chest & Triceps",
  //     exercises: [
  //       {
  //         _id: "11",
  //         exerciseName: "Barbell Bench Press",
  //         sets: 4,
  //         reps: 10,
  //         restTime: 90,
  //         notes: "Focus on slow eccentric",
  //       },
  //     ],
  //   },
  // ]);

  // workoutDays and exercises state
  const [workoutDays, setWorkoutDays] = useState([]);

  // UI & Selection States
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);

  // Form States
  const [newDayTitle, setNewDayTitle] = useState("");
  const [newExercise, setNewExercise] = useState({
    exerciseName: "",
    sets: 4,
    reps: 10,
    restTime: 60,
    notes: "",
  });

  // Derived State
  const selectedWorkout = workoutDays.find((day) => day._id === selectedDayId);

  // fetch Workout Days
  const fetchWorkoutDays = async () => {
    try {
      const response = await axios.get(BASE_URL + "/workout/days", {
        withCredentials: true,
      });

      // console.log(response?.data?.data);

      // extracted the array from backend's data structure
      const rawDays = response?.data?.data || [];

      // Normalize the data: inject an empty exercises array into each workout day
      const formatDays = rawDays?.map((day) => ({
        ...day,
        exercises: [],
      }));

      // Update your state to trigger the UI re-render
      setWorkoutDays(formatDays);
    } catch (error) {
      console.log("Something went wrong !! : ", error);
    }
  };

  // fetch Exercises of a Worout Day
  const fetchExercisesOfDay = async () => {
    try {
      if (!selectedDayId) return;

      const response = await axios.get(
        `${BASE_URL}/exercise/${selectedDayId}`,
        { withCredentials: true },
      );

      // get raw Exercises from backend response
      const rawExercisesOfDay = response?.data?.data;

      // set the raw Exercises to matched workoutDay Exercises []
      setWorkoutDays((prev) =>
        prev.map((day) =>
          day._id === selectedDayId
            ? { ...day, exercises: rawExercisesOfDay }
            : day,
        ),
      );
    } catch (error) {
      console.log("something went wrong !! : ", error);
    }
  };

  // useEffect which will fetch initial workout days
  useEffect(() => {
    fetchWorkoutDays();
  }, []);

  // useEffect for fetch Exercise for perticular Workoutday as it is selected.
  useEffect(() => {
    fetchExercisesOfDay();
  }, [selectedDayId]);

  // handle create day
  const handleCreateDay = async () => {
    // validation check
    if (!newDayTitle.trim()) return;

    // create new object
    //  const newDayPayload = {
    //     _id: Date.now().toString(),
    //     title: newDayTitle,
    //     exercises: [],
    //  }

    //  setWorkoutDays([...workoutDays, newDayPayload]);

    //if (workoutDays.length === 0 ) setSelectedDayId(newDayPayload._id);

    try {
      const response = await axios.post(
        BASE_URL + "/workout/day",
        { title: newDayTitle },
        { withCredentials: true },
      );

      await fetchWorkoutDays();

      console.log(response);
    } catch (error) {
      console.error("Failed to create workout day : ", error);
    }

    setNewDayTitle("");
    setIsAddingDay(false);
  };

  // handle delete a working day
  const handleDeleteDay = async (id, e) => {
    e.stopPropagation(); // stop click from selecting the card
    console.log("id of day : ", id);
    try {
      const response = await axios.delete(`${BASE_URL}/workout/day/${id}`, {
        withCredentials: true,
      });

      await fetchWorkoutDays();
    } catch (error) {
      console.log("something went wrong !! : ", error);
    }
  };

  // handle add a new Exercise method
  const handleAddExercise = async () => {
    // prevent empty exercises
    if (!newExercise.exerciseName.trim()) return;

    // check the current working Day
    if (!selectedDayId) return;

    try {
      const response = await axios.post(
        BASE_URL + "/exercise",
        {
          workoutDayId: selectedDayId,
          exerciseName: newExercise?.exerciseName,
          sets: newExercise?.sets,
          reps: newExercise?.reps,
          restTime: newExercise?.restTime,
          notes: newExercise?.notes,
        },
        { withCredentials: true },
      );

      await fetchExercisesOfDay();

      setIsAddingExercise(false);
    } catch (error) {
      console.log("something went wrong !! : ", error);
    }
  };

  // handle delete a exercise of a working day
  const handleDeleteExercise = async (exerciseId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/exercise/${exerciseId}`,
        { withCredentials: true },
      );

      if (selectedDayId === id) {
        setSelectedDayId(null);
      }

      await fetchExercisesOfDay();
    } catch (error) {
      console.log("something went wrong !! : ", error);
    }
  };

  return (
    // Main App Container uses base-100 (FitFlow Theme Guide)
    <div className="bg-base-100 text-base-content min-h-screen p-4 md:p-8 flex flex-col md:flex-row gap-6">
      {/* LEFT PANEL: Workout Days  */}

      <div className="w-full md:w-1/3 bg-base-200 rounded-3xl p-6 shadow-xl flex flex-col h-[85vh] border border-base-300">
        {/* Header section with clean flexbox */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Splits</h2>
            <p className="text-sm text-base-content opacity-60 mt-1">
              Design your routine
            </p>
          </div>
          <button
            onClick={() => setIsAddingDay(!isAddingDay)}
            className={`btn btn-circle shadow-sm transition-transform duration-300 ${isAddingDay ? "btn-ghost rotate-45" : "btn-primary hover:scale-105"}`}
          >
            {isAddingDay ? "✕" : "＋"}
          </button>
        </div>

        {/* Animated Input Field for New Day */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isAddingDay ? "max-h-32 opacity-100 mb-4" : "max-h-0 opacity-0"}`}
        >
          <div className="flex gap-2 bg-base-300 p-2 rounded-2xl border border-base-200">
            <input
              type="text"
              value={newDayTitle}
              onChange={(e) => setNewDayTitle(e.target.value)}
              placeholder="e.g., Pull Day..."
              className="input input-ghost w-full focus:bg-transparent"
              onKeyDown={(e) => e.key === "Enter" && handleCreateDay()}
            />
            <button
              onClick={handleCreateDay}
              className="btn btn-primary rounded-xl"
            >
              Add
            </button>
          </div>
        </div>

        {/* Scrollable List of Days */}
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-4 custom-scrollbar">
          {workoutDays.length === 0 && !isAddingDay && (
            <div className="text-center mt-10 opacity-60 animate-pulse">
              <span className="text-4xl block mb-2">📋</span>
              <p>No workout days yet.</p>
            </div>
          )}

          {workoutDays.map((day) => {
            const isSelected = selectedDayId === day._id;

            return (
              <div
                key={day._id}
                onClick={() => setSelectedDayId(day._id)}
                // Creative Hover & Active states
                className={`
                  group relative flex justify-between items-center p-5 rounded-2xl cursor-pointer
                  transition-all duration-300 ease-out border 
                  ${
                    isSelected
                      ? "bg-primary text-primary-content border-primary shadow-lg shadow-primary/20 scale-[1.02] translate-x-1"
                      : "bg-base-100 border-base-300 hover:border-primary/50 hover:shadow-md hover:translate-x-1"
                  }
                `}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-lg">{day.title}</span>
                  <span
                    className={`text-xs mt-1 ${isSelected ? "text-primary-content/80" : "text-base-content/50"}`}
                  >
                    {day.exercises?.length || 'select card to check'} exercises
                  </span>
                </div>

                <button
                  onClick={(e) => handleDeleteDay(day._id, e)}
                  className={`
                    btn btn-sm btn-circle btn-ghost transition-all duration-300
                    ${isSelected ? "text-primary-content hover:bg-error" : "opacity-0 group-hover:opacity-100 hover:bg-error hover:text-error-content"}
                  `}
                >
                  🗑
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: Exercises*/}

      <div className="flex-1 bg-base-200 rounded-3xl p-6 md:p-8 shadow-xl border border-base-300 flex flex-col h-[85vh] relative overflow-hidden">
        {!selectedWorkout ? (
          // Empty State - Creative & Animated
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-linear-to-br from-base-200 to-base-300">
            <div className="w-32 h-32 bg-base-100 rounded-full flex items-center justify-center shadow-xl animate-bounce mb-8">
              <span className="text-6xl">🏋️‍♂️</span>
            </div>
            <h2 className="text-3xl font-extrabold mb-3 text-base-content">
              Select a Workout Day
            </h2>
            <p className="text-base-content/60 max-w-md text-lg">
              Click on a day in your planner to start organizing your exercises,
              sets, and rep schemes.
            </p>
          </div>
        ) : (
          // Active State - Exercise Workspace
          <div className="flex flex-col h-full animate-[fadeIn_0.4s_ease-out]">
            {/* Header */}
            <div className="flex justify-between items-end mb-6 pb-6 border-b border-base-300">
              <div>
                <div className="badge badge-primary mb-2">Workspace</div>
                <h1 className="text-4xl font-black">{selectedWorkout.title}</h1>
              </div>
              <button
                onClick={() => setIsAddingExercise(!isAddingExercise)}
                className="btn btn-secondary shadow-md hover:scale-105 transition-transform"
              >
                {isAddingExercise ? "Cancel" : "＋ Add Exercise"}
              </button>
            </div>

            {/* Add Exercise Form */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isAddingExercise ? "max-h-125 opacity-100 mb-6" : "max-h-0 opacity-0"}`}
            >
              <div className="bg-base-100 p-6 rounded-2xl shadow-inner border border-base-300 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Exercise Name (e.g., Squat)"
                  className="input input-bordered input-lg w-full font-bold bg-base-200 focus:bg-base-100"
                  value={newExercise.exerciseName}
                  onChange={(e) =>
                    setNewExercise({
                      ...newExercise,
                      exerciseName: e.target.value,
                    })
                  }
                />

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/70 uppercase">
                      Sets
                    </label>
                    <input
                      type="number"
                      className="input input-bordered bg-base-200"
                      value={newExercise.sets}
                      onChange={(e) =>
                        setNewExercise({
                          ...newExercise,
                          sets: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/70 uppercase">
                      Reps
                    </label>
                    <input
                      type="number"
                      className="input input-bordered bg-base-200"
                      value={newExercise.reps}
                      onChange={(e) =>
                        setNewExercise({
                          ...newExercise,
                          reps: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/70 uppercase">
                      Rest (sec)
                    </label>
                    <input
                      type="number"
                      className="input input-bordered bg-base-200"
                      value={newExercise.restTime}
                      onChange={(e) =>
                        setNewExercise({
                          ...newExercise,
                          restTime: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    className="input input-bordered w-full bg-base-200"
                    value={newExercise.notes}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, notes: e.target.value })
                    }
                  />
                </div>

                <button
                  onClick={handleAddExercise}
                  className="btn btn-success mt-2"
                >
                  Save to Routine
                </button>
              </div>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 custom-scrollbar pb-10">
              {selectedWorkout.exercises.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-base-content/40 border-2 border-dashed border-base-300 rounded-3xl p-10">
                  <span className="text-4xl mb-4 opacity-50">📝</span>
                  <p className="text-lg">This day is empty.</p>
                  <p className="text-sm mt-1">
                    Add exercises to build your system.
                  </p>
                </div>
              ) : (
                selectedWorkout.exercises.map((exercise, index) => (
                  <div
                    key={exercise._id}
                    className="group flex flex-col md:flex-row justify-between bg-base-100 p-5 rounded-2xl border border-base-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Info Section */}
                    <div className="flex items-start gap-4">
                      {/* Stylized Index Number */}
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-bold text-xl mb-2">
                          {exercise.exerciseName}
                        </h3>

                        {/* LLD Badges */}
                        <div className="flex flex-wrap gap-2">
                          <span className="badge badge-neutral font-medium">
                            🔥 {exercise.sets} Sets
                          </span>
                          <span className="badge badge-neutral font-medium">
                            🔄 {exercise.reps} Reps
                          </span>
                          <span className="badge badge-outline text-base-content/60 font-medium">
                            ⏱ {exercise.restTime}s rest
                          </span>
                        </div>

                        {exercise.notes && (
                          <p className="text-sm mt-3 text-base-content/60 italic flex items-center gap-1">
                            <span>💡</span> {exercise.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Section */}
                    <div className="mt-4 md:mt-0 flex items-center md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleDeleteExercise(exercise._id)}
                        className="btn btn-error btn-sm btn-outline w-full md:w-auto"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Global Style for subtle scrollbars (Optional but nice for UX) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #88888840; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #88888880; }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />
    </div>
  );
};

export default Planner;
