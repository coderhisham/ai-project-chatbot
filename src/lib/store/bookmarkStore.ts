import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Course } from "@/components/course-card";

interface BookmarkState {
  bookmarkedCourseIds: string[];
  bookmarkedCourses: Course[];
  isBookmarked: (courseId: string) => boolean;
  toggleBookmark: (course: Course) => void;
  addBookmark: (course: Course) => void;
  removeBookmark: (courseId: string) => void;
  getBookmarkedCourses: () => Course[];
}

// Helper function to generate a consistent course ID
export const generateCourseId = (course: Course): string => {
  return `${course.provider}-${course.title}`
    .toLowerCase()
    .replace(/\s+/g, "-");
};

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedCourseIds: [],
      bookmarkedCourses: [],

      isBookmarked: (courseId: string) => {
        return get().bookmarkedCourseIds.includes(courseId);
      },

      toggleBookmark: (course: Course) => {
        const courseId = generateCourseId(course);
        if (get().isBookmarked(courseId)) {
          get().removeBookmark(courseId);
        } else {
          get().addBookmark(course);
        }
      },

      addBookmark: (course: Course) => {
        const courseId = generateCourseId(course);
        // Only add if not already bookmarked
        if (!get().isBookmarked(courseId)) {
          set((state) => ({
            bookmarkedCourseIds: [...state.bookmarkedCourseIds, courseId],
            bookmarkedCourses: [...state.bookmarkedCourses, course],
          }));
        }
      },

      removeBookmark: (courseId: string) => {
        set((state) => ({
          bookmarkedCourseIds: state.bookmarkedCourseIds.filter(
            (id) => id !== courseId
          ),
          bookmarkedCourses: state.bookmarkedCourses.filter(
            (course) => generateCourseId(course) !== courseId
          ),
        }));
      },

      getBookmarkedCourses: () => {
        return get().bookmarkedCourses;
      },
    }),
    {
      name: "course-bookmarks", // name for the storage key
      partialize: (state) => ({
        bookmarkedCourseIds: state.bookmarkedCourseIds,
        bookmarkedCourses: state.bookmarkedCourses,
      }),
    }
  )
);
