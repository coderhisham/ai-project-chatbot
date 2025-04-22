import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Course } from "@/components/course-card";

interface SavedCoursesState {
  savedCourses: Course[];
  isSaved: (course: Course) => boolean;
  toggleSavedCourse: (course: Course) => void;
  addSavedCourse: (course: Course) => void;
  removeSavedCourse: (course: Course) => void;
  clearSavedCourses: () => void;
}

// Helper function to check if two courses are the same
const isSameCourse = (a: Course, b: Course): boolean => {
  return a.title === b.title && a.provider === b.provider;
};

export const useSavedCoursesStore = create<SavedCoursesState>()(
  persist(
    (set, get) => ({
      savedCourses: [],

      isSaved: (course: Course): boolean => {
        return get().savedCourses.some((savedCourse) =>
          isSameCourse(savedCourse, course)
        );
      },

      toggleSavedCourse: (course: Course): void => {
        const { savedCourses, isSaved } = get();

        if (isSaved(course)) {
          // Remove the course if it's already saved
          set({
            savedCourses: savedCourses.filter(
              (savedCourse) => !isSameCourse(savedCourse, course)
            ),
          });
        } else {
          // Add the course if it's not saved
          set({
            savedCourses: [...savedCourses, course],
          });
        }
      },

      addSavedCourse: (course: Course): void => {
        const { savedCourses, isSaved } = get();

        if (!isSaved(course)) {
          set({
            savedCourses: [...savedCourses, course],
          });
        }
      },

      removeSavedCourse: (course: Course): void => {
        const { savedCourses } = get();

        set({
          savedCourses: savedCourses.filter(
            (savedCourse) => !isSameCourse(savedCourse, course)
          ),
        });
      },

      clearSavedCourses: (): void => {
        set({ savedCourses: [] });
      },
    }),
    {
      name: "saved-courses-storage",
    }
  )
);
 