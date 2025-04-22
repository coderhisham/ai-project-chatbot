"use client";

import { Dashboard } from "@/components/dashboard";
import { Course } from "@/components/course-card";
import { NavBar } from "@/components/nav-bar";
import { useState, useEffect } from "react";

// Sample course data - in a real app, this would come from an API or database
const sampleCourses: Course[] = [
  {
    title: "Machine Learning Foundations",
    description:
      "Learn the fundamentals of machine learning algorithms, theory, and practical implementation with Python.",
    level: "Intermediate",
    duration: "8 weeks",
    provider: "Coursera",
  },
  {
    title: "Web Development Bootcamp",
    description:
      "A comprehensive bootcamp covering HTML, CSS, JavaScript, React, Node.js and more full stack development skills.",
    level: "Beginner",
    duration: "12 weeks",
    provider: "Udemy",
  },
  {
    title: "Advanced Data Science",
    description:
      "Deep dive into advanced data science techniques including neural networks, deep learning, and statistical analysis.",
    level: "Advanced",
    duration: "10 weeks",
    provider: "edX",
  },
  {
    title: "UX Design Fundamentals",
    description:
      "Learn the principles of user experience design from research to wireframing to prototyping.",
    level: "Beginner",
    duration: "6 weeks",
    provider: "LinkedIn Learning",
  },
  {
    title: "Cloud Computing with AWS",
    description:
      "Comprehensive guide to AWS services, cloud architecture, and deployment strategies for scalable applications.",
    level: "Intermediate",
    duration: "8 weeks",
    provider: "Pluralsight",
  },
  {
    title: "Cybersecurity Essentials",
    description:
      "Learn essential cybersecurity concepts, threat detection techniques, and security best practices.",
    level: "Intermediate",
    duration: "7 weeks",
    provider: "Coursera",
  },
  {
    title: "Mobile App Development with React Native",
    description:
      "Build cross-platform mobile applications using React Native with JavaScript and TypeScript.",
    level: "Intermediate",
    duration: "9 weeks",
    provider: "Udemy",
  },
  {
    title: "Artificial Intelligence: Principles and Techniques",
    description:
      "Comprehensive introduction to AI concepts, algorithms, and real-world applications.",
    level: "Advanced",
    duration: "12 weeks",
    provider: "edX",
  },
  {
    title: "Digital Marketing Strategies",
    description:
      "Learn SEO, social media marketing, analytics, and other essential digital marketing skills for business growth.",
    level: "Beginner",
    duration: "5 weeks",
    provider: "LinkedIn Learning",
  },
  {
    title: "DevOps Engineering Practices",
    description:
      "Master continuous integration, deployment, containerization, and infrastructure as code for modern software delivery.",
    level: "Advanced",
    duration: "10 weeks",
    provider: "Pluralsight",
  },
];

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // In a real app, you would fetch courses from an API here
    setCourses(sampleCourses);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Dashboard allCourses={courses} />
        </div>
      </main>
    </div>
  );
}
