import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { BASE_URL } from "../utils/constants";
import Loading from "../pages/Loading.jsx";
import { Toaster, toast } from "sonner";

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

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

  // weekly schedule state
  // Structure:
  // {
  //   monday: { _id, weekday, workoutDayId }
  //   tuesday: { _id, weekday, workoutDayId }
  // }
  const [weeklySchedule, setWeeklySchedule] = useState({});

  // UI & Selection States
  const [selectedWeekday, setSelectedWeekday] = useState("monday");
  const [selectedWorkoutDayId, setSelectedWorkoutDayId] = useState(null);

  // UI Toggles
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [isManagingDays, setIsManagingDays] = useState(false);

  // Edit States
  const [editingExerciseId, setEditingExerciseId] = useState(null); // Tracks which ID is being edited
  const [editExerciseData, setEditExerciseData] = useState(null); // Holds the temporary form data for editing

  // Form States for New Exercise
  const [newDayTitle, setNewDayTitle] = useState("");
  const [newExercise, setNewExercise] = useState({
    exerciseName: "",
    sets: 4,
    reps: 10,
    restTime: 60,
    notes: "",
  });

  // Derived State
  const selectedWorkout = workoutDays.find(
    (day) => day._id === selectedWorkoutDayId,
  );

  // fetch Workout Days
  const [isLoadingDays, setIsLoadingDays] = useState(false);

  // fetch Weekly Schedule
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  // fetch Workout Days
  const fetchWorkoutDays = async () => {
    try {
      // Start loading
      setIsLoadingDays(true);

      const response = await axios.get(BASE_URL + "/workout/days", {
        withCredentials: true,
      });

      // Extract backend data
      const rawDays = response?.data?.data || [];

      // Normalize data
      const formatDays = rawDays.map((day) => {
        // preserve already loaded exercises if they exist
        const existingDay = workoutDays.find((d) => d._id === day._id);

        return {
          ...day,
          exercises: existingDay?.exercises ?? null,
        };
      });

      // Update state
      setWorkoutDays(formatDays);
    } catch (error) {
      console.log("Something went wrong !! :", error);
      toast.error("Failed to fetch workout days");
    } finally {
      // Stop loading
      setIsLoadingDays(false);
    }
  };

  // fetch Weekly Schedule
  const fetchWeeklySchedule = async () => {
    try {
      setIsLoadingSchedule(true);

      const response = await axios.get(BASE_URL + "/schedule/view", {
        withCredentials: true,
      });

      const rawSchedule = response?.data?.data || [];

      // convert array into object for easy lookup
      const formattedSchedule = {};

      rawSchedule.forEach((item) => {
        formattedSchedule[item.weekday] = {
          _id: item._id,
          weekday: item.weekday,
          workoutDayId:
            typeof item.workoutDayId === "object"
              ? item.workoutDayId?._id
              : item.workoutDayId,
        };
      });

      setWeeklySchedule(formattedSchedule);
    } catch (error) {
      console.log("Something went wrong while fetching schedule !! :", error);
      toast.error("Failed to fetch weekly schedule");
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  // fetch Exercises of a Workout Day
  // useCallback keeps the fetch function stable across renders.
  // This helps useEffect track dependencies correctly and prevents
  // stale closures or incorrect exercise data during fast day switching.
  const fetchExercisesOfDay = useCallback(async () => {
    try {
      if (!selectedWorkoutDayId) return;

      const response = await axios.get(
        `${BASE_URL}/exercise/${selectedWorkoutDayId}`,
        { withCredentials: true },
      );

      const rawExercisesOfDay = response?.data?.data || [];

      setWorkoutDays((prev) =>
        prev.map((day) =>
          day._id === selectedWorkoutDayId
            ? { ...day, exercises: rawExercisesOfDay }
            : day,
        ),
      );
    } catch (error) {
      console.log("something went wrong !! : ", error);
      toast.error("Failed to fetch exercises");
    }
  }, [selectedWorkoutDayId]);

  // helper: sync selected weekday -> selected workout day id
  const syncSelectedWorkoutFromWeekday = useCallback(
    (scheduleMap) => {
      const mappedWorkoutDayId = scheduleMap?.[selectedWeekday]?.workoutDayId;
      setSelectedWorkoutDayId(mappedWorkoutDayId || null);
    },
    [selectedWeekday],
  );

  // useEffect which will fetch initial workout days and weekly schedule
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchWorkoutDays(), fetchWeeklySchedule()]);
    };

    loadInitialData();
  }, []);

  // whenever weekday or schedule changes, update selected workout day
  useEffect(() => {
    syncSelectedWorkoutFromWeekday(weeklySchedule);
  }, [weeklySchedule, selectedWeekday, syncSelectedWorkoutFromWeekday]);

  // useEffect for fetch Exercise for particular Workoutday as it is selected.
  useEffect(() => {
    fetchExercisesOfDay();
  }, [fetchExercisesOfDay]);

  // handle create day
  const handleCreateDay = async () => {
    // validation check
    if (!newDayTitle.trim()) {
      toast.error("Workout day title is required");
      return;
    }

    try {
      await axios.post(
        BASE_URL + "/workout/day",
        { title: newDayTitle },
        { withCredentials: true },
      );

      await fetchWorkoutDays();
      toast.success("Workout day created successfully");
    } catch (error) {
      console.error("Failed to create workout day : ", error);
      toast.error("Failed to create workout day");
    }

    setNewDayTitle("");
    setIsAddingDay(false);
  };

  // handle delete a working day
  const handleDeleteDay = async (id, e) => {
    e.stopPropagation(); // stop click from selecting the card

    try {
      await axios.delete(`${BASE_URL}/workout/day/${id}`, {
        withCredentials: true,
      });

      // clear schedule entries in frontend which pointed to deleted day
      const updatedSchedule = { ...weeklySchedule };

      Object.keys(updatedSchedule).forEach((weekday) => {
        if (updatedSchedule[weekday]?.workoutDayId === id) {
          delete updatedSchedule[weekday];
        }
      });

      setWeeklySchedule(updatedSchedule);

      await fetchWorkoutDays();

      if (selectedWorkoutDayId === id) {
        setSelectedWorkoutDayId(null);
        setIsAddingExercise(false);
        setEditingExerciseId(null);
        setEditExerciseData(null);
      }

      toast.success("Workout day deleted successfully");
    } catch (error) {
      console.log("something went wrong !! : ", error);
      toast.error("Failed to delete workout day");
    }
  };

  // Shared validation helper for exercise inputs
  const isValidExerciseData = (exerciseData) => {
    return (
      exerciseData.exerciseName.trim() &&
      exerciseData.sets > 0 &&
      exerciseData.reps > 0 &&
      exerciseData.restTime >= 0
    );
  };

  // handle add a new Exercise method
  const handleAddExercise = async () => {
    // prevent empty exercises
    if (!newExercise.exerciseName.trim()) {
      toast.error("Exercise name is required");
      return;
    }

    // Basic frontend validation to prevent invalid exercise values.
    // Sets/Reps must be greater than 0 and rest time cannot be negative.
    if (!isValidExerciseData(newExercise)) {
      console.log("Invalid exercise data");
      toast.error("Please enter valid exercise data");
      return;
    }

    // check the current working Day
    if (!selectedWorkoutDayId) {
      toast.error("Please assign a workout day first");
      return;
    }

    try {
      await axios.post(
        BASE_URL + "/exercise",
        {
          workoutDayId: selectedWorkoutDayId,
          ...newExercise,
        },
        { withCredentials: true },
      );

      await fetchExercisesOfDay();
      setIsAddingExercise(false);
      setNewExercise({
        exerciseName: "",
        sets: 4,
        reps: 10,
        restTime: 60,
        notes: "",
      });
      toast.success("Exercise added successfully");
    } catch (error) {
      console.log("something went wrong !! : ", error);
      toast.error("Failed to add exercise");
    }
  };

  // EDIT LOGIC

  // 1. Enter Edit Mode
  const startEditing = (exercise) => {
    setEditingExerciseId(exercise._id);
    setEditExerciseData({ ...exercise }); // Clone existing data into form state
    setIsAddingExercise(false); // Close "Add" form if it's open
  };

  // 2. Handle Update (API Call)
  const handleUpdateExercise = async () => {
    if (!isValidExerciseData(editExerciseData)) {
      console.log("Invalid exercise data");
      toast.error("Please enter valid exercise data");
      return;
    }

    try {
      // API CALL: PATCH /exercise/:id
      await axios.patch(
        `${BASE_URL}/exercise/${editingExerciseId}`,
        {
          exerciseName: editExerciseData.exerciseName,
          sets: editExerciseData.sets,
          reps: editExerciseData.reps,
          restTime: editExerciseData.restTime,
          notes: editExerciseData.notes,
        },
        { withCredentials: true },
      );

      await fetchExercisesOfDay(); // Refresh list
      setEditingExerciseId(null); // Exit edit mode
      setEditExerciseData(null);
      toast.success("Exercise updated successfully");
    } catch (error) {
      console.log("Failed to update exercise: ", error);
      toast.error("Failed to update exercise");
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await axios.delete(`${BASE_URL}/exercise/${exerciseId}`, {
        withCredentials: true,
      });

      // Clear edit state if deleted exercise was being edited
      if (editingExerciseId === exerciseId) {
        setEditingExerciseId(null);
        setEditExerciseData(null);
      }

      await fetchExercisesOfDay();
      toast.success("Exercise deleted successfully");
    } catch (error) {
      console.log("something went wrong !! : ", error);
      toast.error("Failed to delete exercise");
    }
  };

  // assign / update weekday -> workout day mapping
  const handleAssignWorkoutDayToWeekday = async (workoutDayId) => {
    try {
      const existingSchedule = weeklySchedule[selectedWeekday];

      // reset edit/add states on mapping change
      setIsAddingExercise(false);
      setEditingExerciseId(null);
      setEditExerciseData(null);

      // If user selects empty option -> unassign schedule
      if (!workoutDayId) {
        if (!existingSchedule?._id) {
          setSelectedWorkoutDayId(null);
          return;
        }

        await axios.delete(`${BASE_URL}/schedule/${existingSchedule._id}`, {
          withCredentials: true,
        });

        await fetchWeeklySchedule();

        setSelectedWorkoutDayId(null);

        toast.success(`${selectedWeekday} marked as Rest Day`);
        return;
      }

      if (existingSchedule?._id) {
        await axios.patch(
          `${BASE_URL}/schedule/${existingSchedule._id}`,
          { workoutDayId },
          { withCredentials: true },
        );

        await fetchWeeklySchedule();
      } else {
        await axios.post(
          BASE_URL + "/schedule/set",
          {
            weekday: selectedWeekday,
            workoutDayId,
          },
          { withCredentials: true },
        );

        await fetchWeeklySchedule();
      }

      // If mapping already exists -> PATCH
      if (existingSchedule?._id) {
        await axios.patch(
          `${BASE_URL}/schedule/${existingSchedule._id}`,
          { workoutDayId },
          { withCredentials: true },
        );

        await fetchWeeklySchedule();
      } else {
        // Else create new mapping -> POST
        await axios.post(
          BASE_URL + "/schedule/set",
          {
            weekday: selectedWeekday,
            workoutDayId,
          },
          { withCredentials: true },
        );

        // backend returns string, so refresh schedule from backend
        await fetchWeeklySchedule();
      }

      setSelectedWorkoutDayId(workoutDayId);
      toast.success(`Workout assigned for ${selectedWeekday}`);
    } catch (error) {
      console.log("something went wrong while assigning schedule !! : ", error);
      toast.error("Failed to update weekday schedule");
    }
  };

  // helper function to display workout day name for each weekday card
  const getWorkoutTitleForWeekday = (weekday) => {
    const mappedWorkoutDayId = weeklySchedule?.[weekday]?.workoutDayId;
    if (!mappedWorkoutDayId) return "Not Assigned";

    const matchedWorkoutDay = workoutDays.find(
      (day) => day._id === mappedWorkoutDayId,
    );

    return matchedWorkoutDay?.title || "Rest Day";
  };

  const isInitialLoading = isLoadingDays || isLoadingSchedule;

  return (
    <div className="bg-base-100 text-base-content min-h-screen p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-8 flex flex-col lg:flex-row gap-3 md:gap-4 lg:gap-5 xl:gap-6">
      <Toaster position="top-right" richColors />

      {/* LEFT PANEL: WEEKDAYS */}
      <div className="w-full lg:w-[34%] xl:w-[32%] 2xl:w-1/3 bg-base-200 rounded-2xl xl:rounded-3xl p-3 sm:p-4 md:p-4 lg:p-4 xl:p-5 shadow-xl flex flex-col min-h-[280px] lg:h-[82vh] lg:max-h-[82vh] border border-base-300 overflow-hidden">
        <div className="mb-4 shrink-0">
          <h2 className="text-lg sm:text-xl lg:text-xl xl:text-2xl font-bold tracking-tight">
            Weekly Planner
          </h2>
          <p className="text-xs sm:text-sm text-base-content opacity-60 mt-1">
            Choose a weekday and plan your split
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 sm:pr-1 pb-1 hide-scrollbar scroll-smooth">
          {isInitialLoading ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 gap-2.5 lg:gap-3">
              {WEEKDAYS.map((weekday, index) => {
                const isSelected = selectedWeekday === weekday;
                const assignedTitle = getWorkoutTitleForWeekday(weekday);

                return (
                  <div
                    key={weekday}
                    onClick={() => setSelectedWeekday(weekday)}
                    className={`group relative overflow-hidden p-3 sm:p-3.5 lg:p-4 rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-300 ease-out border
                    ${
                      isSelected
                        ? "bg-primary text-primary-content border-primary shadow-lg shadow-primary/20 scale-[1.01]"
                        : "bg-base-100 border-base-300 hover:border-primary/40 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="min-w-0">
                        <div
                          className={`text-[10px] sm:text-xs font-semibold mb-1 uppercase tracking-wider ${
                            isSelected
                              ? "text-primary-content/70"
                              : "text-base-content/40"
                          }`}
                        >
                          Day {index + 1}
                        </div>

                        <h3 className="font-bold text-sm sm:text-base lg:text-base xl:text-lg capitalize break-words">
                          {weekday}
                        </h3>

                        <p
                          className={`text-xs sm:text-sm mt-1 break-words ${
                            isSelected
                              ? "text-primary-content/85"
                              : "text-base-content/55"
                          }`}
                        >
                          {assignedTitle}
                        </p>
                      </div>

                      <div
                        className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${
                          weeklySchedule?.[weekday]?.workoutDayId
                            ? isSelected
                              ? "bg-primary-content/20 text-primary-content"
                              : "bg-success/15 text-success"
                            : isSelected
                              ? "bg-primary-content/20 text-primary-content"
                              : "bg-base-300 text-base-content/50"
                        }`}
                      >
                        {weeklySchedule?.[weekday]?.workoutDayId
                          ? "Assigned"
                          : "Open"}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute inset-y-0 right-0 w-1 bg-primary-content/60 rounded-l-full" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 bg-base-200 rounded-2xl xl:rounded-3xl p-3 sm:p-4 md:p-4 lg:p-5 xl:p-6 shadow-xl border border-base-300 flex flex-col min-h-[380px] lg:h-[82vh] lg:max-h-[82vh] overflow-hidden">
        <div className="flex flex-col h-full min-h-0 animate-[fadeIn_0.4s_ease-out]">
          {/* TOP HEADER ALWAYS VISIBLE */}
          <div className="pb-4 md:pb-5 border-b border-base-300 shrink-0">
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
              <div className="min-w-0">
                <div className="badge badge-primary mb-2 capitalize text-[10px] sm:text-xs">
                  {selectedWeekday}
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-black capitalize break-words leading-tight">
                  {selectedWeekday} Planner
                </h1>
                <p className="text-xs sm:text-sm md:text-sm lg:text-base text-base-content/60 mt-2 max-w-xl">
                  Assign a workout day to this weekday and manage all exercises
                  inside that workout split.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:items-stretch xl:justify-end w-full xl:w-auto">
                <button
                  onClick={() => setIsManagingDays(true)}
                  className="btn btn-outline btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                >
                  Manage Workout Days
                </button>

                <select
                  className="select select-bordered select-sm sm:select-md bg-base-100 w-full sm:min-w-[220px] lg:min-w-[240px] sm:w-auto"
                  value={selectedWorkoutDayId || ""}
                  onChange={(e) =>
                    handleAssignWorkoutDayToWeekday(e.target.value)
                  }
                >
                  <option value="">Rest Day / Not Assigned</option>
                  {workoutDays.map((day) => (
                    <option key={day._id} value={day._id}>
                      {day.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setIsAddingExercise(!isAddingExercise);
                    setEditingExerciseId(null);
                  }}
                  disabled={!selectedWorkoutDayId}
                  className="btn btn-secondary btn-sm sm:btn-md shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 w-full sm:w-auto"
                >
                  {isAddingExercise ? "Cancel" : "＋ Add Exercise"}
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 min-h-0 overflow-y-auto pt-4 md:pt-5 pr-0.5 sm:pr-1 hide-scrollbar scroll-smooth">
            {!selectedWorkout ? (
              <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center px-4 sm:px-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-base-100 rounded-full flex items-center justify-center shadow-xl mb-5">
                  <span className="text-3xl sm:text-4xl md:text-5xl">🌴</span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-3 capitalize">
                  {selectedWeekday} is free
                </h2>

                <p className="text-base-content/60 max-w-md text-sm md:text-base">
                  This weekday is currently set as a rest day. Assign a workout
                  day from the dropdown above whenever you want.
                </p>
              </div>
            ) : (
              <div className="flex flex-col min-h-full">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-5 shrink-0">
                  <div className="min-w-0">
                    <div className="badge badge-outline mb-2 text-[10px] sm:text-xs">
                      Assigned Workout
                    </div>
                    <h2 className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-bold break-words">
                      {selectedWorkout.title}
                    </h2>
                  </div>

                  <div className="text-xs sm:text-sm text-base-content/50 sm:text-right">
                    {selectedWorkout.exercises === null
                      ? "Loading exercises..."
                      : `${selectedWorkout.exercises.length} exercises`}
                  </div>
                </div>

                {/* ADD EXERCISE FORM */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isAddingExercise ? "max-h-[650px] opacity-100 mb-5" : "max-h-0 opacity-0"}`}
                >
                  <div className="bg-base-100 p-3 sm:p-4 md:p-5 rounded-xl lg:rounded-2xl shadow-inner border border-base-300 flex flex-col gap-3.5">
                    <input
                      type="text"
                      placeholder="Exercise Name"
                      className="input input-bordered input-sm sm:input-md lg:input-md xl:input-lg w-full font-bold bg-base-200"
                      value={newExercise.exerciseName}
                      onChange={(e) =>
                        setNewExercise({
                          ...newExercise,
                          exerciseName: e.target.value,
                        })
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="form-control">
                        <label className="label text-[10px] sm:text-xs font-bold opacity-70">
                          SETS
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="input input-bordered input-sm sm:input-md bg-base-200"
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
                        <label className="label text-[10px] sm:text-xs font-bold opacity-70">
                          REPS
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="input input-bordered input-sm sm:input-md bg-base-200"
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
                        <label className="label text-[10px] sm:text-xs font-bold opacity-70">
                          REST (S)
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="input input-bordered input-sm sm:input-md bg-base-200"
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
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      className="input input-bordered input-sm sm:input-md w-full bg-base-200"
                      value={newExercise.notes}
                      onChange={(e) =>
                        setNewExercise({
                          ...newExercise,
                          notes: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={handleAddExercise}
                      className="btn btn-success btn-sm sm:btn-md mt-1 w-full sm:w-auto sm:self-end"
                    >
                      Save to Routine
                    </button>
                  </div>
                </div>

                {/* EXERCISE LIST */}
                <div className="flex-1 flex flex-col gap-3.5 pb-3 md:pb-6 min-h-0">
                  {selectedWorkout.exercises === null ? (
                    <Loading />
                  ) : selectedWorkout.exercises.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-10 md:py-12 opacity-70 bg-base-100 rounded-2xl xl:rounded-3xl border border-dashed border-base-300">
                      <span className="text-4xl md:text-5xl mb-4">🏋️‍♂️</span>
                      <h3 className="text-base md:text-lg font-bold">
                        No Exercises Yet
                      </h3>
                      <p className="text-xs sm:text-sm text-base-content/60 mt-1 px-4">
                        Add your first exercise to this workout day.
                      </p>
                    </div>
                  ) : (
                    selectedWorkout.exercises.map((exercise, index) => (
                      <div
                        key={exercise._id}
                        className="animate-[fadeIn_0.3s_ease-out]"
                      >
                        {editingExerciseId === exercise._id ? (
                          /* INLINE EDIT FORM  */
                          <div className="bg-base-300 p-3 sm:p-4 lg:p-4 rounded-xl lg:rounded-2xl border-2 border-primary flex flex-col gap-3 shadow-lg">
                            <input
                              type="text"
                              className="input input-bordered input-sm sm:input-md font-bold"
                              value={editExerciseData.exerciseName}
                              onChange={(e) =>
                                setEditExerciseData({
                                  ...editExerciseData,
                                  exerciseName: e.target.value,
                                })
                              }
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <input
                                type="number"
                                min="1"
                                className="input input-bordered input-sm sm:input-md"
                                value={editExerciseData.sets}
                                onChange={(e) =>
                                  setEditExerciseData({
                                    ...editExerciseData,
                                    sets: Number(e.target.value),
                                  })
                                }
                              />
                              <input
                                type="number"
                                min="1"
                                className="input input-bordered input-sm sm:input-md"
                                value={editExerciseData.reps}
                                onChange={(e) =>
                                  setEditExerciseData({
                                    ...editExerciseData,
                                    reps: Number(e.target.value),
                                  })
                                }
                              />
                              <input
                                type="number"
                                min="0"
                                className="input input-bordered input-sm sm:input-md"
                                value={editExerciseData.restTime}
                                onChange={(e) =>
                                  setEditExerciseData({
                                    ...editExerciseData,
                                    restTime: Number(e.target.value),
                                  })
                                }
                              />
                            </div>
                            <input
                              type="text"
                              className="input input-bordered input-sm sm:input-md"
                              value={editExerciseData.notes}
                              onChange={(e) =>
                                setEditExerciseData({
                                  ...editExerciseData,
                                  notes: e.target.value,
                                })
                              }
                            />
                            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-1">
                              <button
                                onClick={() => {
                                  setEditingExerciseId(null);
                                  setEditExerciseData(null);
                                }}
                                className="btn btn-ghost btn-sm w-full sm:w-auto"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleUpdateExercise}
                                className="btn btn-success btn-sm w-full sm:w-auto"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* NORMAL VIEW  */
                          <div className="group flex flex-col lg:flex-row lg:justify-between bg-base-100 p-3 sm:p-4 lg:p-4 rounded-xl lg:rounded-2xl border border-base-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm sm:text-lg shrink-0">
                                {index + 1}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-base sm:text-lg lg:text-lg xl:text-xl mb-2 break-words">
                                  {exercise.exerciseName}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  <span className="badge badge-neutral font-medium text-[10px] sm:text-xs">
                                    🔥 {exercise.sets} Sets
                                  </span>
                                  <span className="badge badge-neutral font-medium text-[10px] sm:text-xs">
                                    🔄 {exercise.reps} Reps
                                  </span>
                                  <span className="badge badge-outline text-base-content/60 font-medium text-[10px] sm:text-xs">
                                    ⏱ {exercise.restTime}s rest
                                  </span>
                                </div>
                                {exercise.notes && (
                                  <p className="text-xs sm:text-sm mt-2.5 text-base-content/60 italic break-words">
                                    💡 {exercise.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity w-full lg:w-auto">
                              <button
                                onClick={() => startEditing(exercise)}
                                className="btn btn-ghost btn-sm text-primary w-full sm:w-auto"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteExercise(exercise._id)
                                }
                                className="btn btn-error btn-sm btn-outline w-full sm:w-auto"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MANAGE WORKOUT DAYS MODAL */}
      {isManagingDays && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] bg-base-100 rounded-2xl xl:rounded-3xl shadow-2xl border border-base-300 overflow-hidden animate-[fadeIn_0.2s_ease-out] flex flex-col">
            <div className="flex items-start sm:items-center justify-between gap-3 p-4 sm:p-5 lg:p-6 border-b border-base-300 bg-base-200 shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                  Manage Workout Days
                </h2>
                <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                  Create or delete workout day templates
                </p>
              </div>
              <button
                onClick={() => {
                  setIsManagingDays(false);
                  setIsAddingDay(false);
                }}
                className="btn btn-circle btn-ghost btn-sm sm:btn-md shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 lg:p-6 flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 shrink-0">
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg">
                  Your Workout Days
                </h3>
                <button
                  onClick={() => setIsAddingDay(!isAddingDay)}
                  className={`btn btn-sm transition-transform duration-300 w-full sm:w-auto ${isAddingDay ? "btn-ghost" : "btn-primary"}`}
                >
                  {isAddingDay ? "Cancel" : "＋ New Workout Day"}
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out shrink-0 ${isAddingDay ? "max-h-40 opacity-100 mb-4" : "max-h-0 opacity-0"}`}
              >
                <div className="flex flex-col sm:flex-row gap-2 bg-base-200 p-2 rounded-xl lg:rounded-2xl border border-base-300">
                  <input
                    type="text"
                    value={newDayTitle}
                    onChange={(e) => setNewDayTitle(e.target.value)}
                    placeholder="e.g., Push Day..."
                    className="input input-ghost input-sm sm:input-md w-full focus:bg-transparent"
                    onKeyDown={(e) => e.key === "Enter" && handleCreateDay()}
                  />
                  <button
                    onClick={handleCreateDay}
                    className="btn btn-primary btn-sm sm:btn-md rounded-xl w-full sm:w-auto"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 sm:pr-1 hide-scrollbar scroll-smooth flex flex-col gap-3">
                {isLoadingDays ? (
                  <Loading />
                ) : workoutDays.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-10 opacity-70">
                    <span className="text-4xl sm:text-5xl mb-4">📅</span>
                    <h3 className="text-base sm:text-lg font-bold">
                      No Workout Days Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-base-content/60 mt-1">
                      Create your first workout split to get started.
                    </p>
                  </div>
                ) : (
                  workoutDays.map((day) => {
                    const isUsedSomewhere = Object.values(weeklySchedule).some(
                      (schedule) => schedule?.workoutDayId === day._id,
                    );

                    return (
                      <div
                        key={day._id}
                        className="group flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 rounded-xl lg:rounded-2xl bg-base-200 border border-base-300 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-sm sm:text-base lg:text-lg break-words">
                            {day.title}
                          </span>
                          <span className="text-[11px] sm:text-xs mt-1 text-base-content/50 break-words">
                            {isUsedSomewhere
                              ? "Assigned in weekly planner"
                              : "Not assigned to any weekday"}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleDeleteDay(day._id, e)}
                          className="btn btn-sm btn-circle btn-ghost hover:bg-error hover:text-error-content self-end sm:self-auto shrink-0"
                        >
                          🗑
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`}</style>
    </div>
  );
};

export default Planner;
