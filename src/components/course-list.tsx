"use client";

import { useState } from "react";
import { Course, CourseCard } from "@/components/course-card";
import { CourseSuggestion } from "@/components/course-suggestion";
import { motion } from "framer-motion";

interface CourseListProps {
  courses: Course[];
  userQuery: string;
}

export function CourseList({ courses, userQuery }: CourseListProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Recommended Courses {courses.length > 0 && `(${courses.length})`}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          {courses.length > 0 && (
            <CourseSuggestion courses={courses} userQuery={userQuery} />
          )}
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No courses available.</p>
        </div>
      )}
    </div>
  );
}
