import { useState, useEffect } from "react";
import { CourseCard, Course } from "@/components/course-card";
import {
  CourseFilters,
  CourseFilters as CourseFiltersType,
} from "@/components/course-filters";
import { Button } from "@/components/ui/button";
import {
  BookmarkIcon,
  GraduationCap,
  LayoutDashboard,
  MessagesSquare,
  PieChart,
  BarChart,
  Clock,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSavedCoursesStore } from "@/lib/store/savedCoursesStore";
import { ChatInterface } from "@/components/chat-interface";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface DashboardProps {
  allCourses: Course[];
}

export function Dashboard({ allCourses }: DashboardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(
    tabParam === "saved" ? "saved" : "overview"
  );
  const [filters, setFilters] = useState<CourseFiltersType>({
    search: "",
    level: "all",
    provider: "all",
    durationMax: "all",
    bookmarkedOnly: false,
  });

  // Use the saved courses store
  const { savedCourses } = useSavedCoursesStore();

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "overview") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard?tab=${value}`);
    }
  };

  // Compute all providers from courses
  const providers = [...new Set(allCourses.map((course) => course.provider))];

  // Filter saved courses based on filters
  const filteredCourses = savedCourses.filter((course) => {
    // Search filter
    if (
      filters.search &&
      !course.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !course.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Level filter
    if (filters.level !== "all" && course.level !== filters.level) {
      return false;
    }

    // Provider filter
    if (filters.provider !== "all" && course.provider !== filters.provider) {
      return false;
    }

    // Duration filter (simplistic approach)
    if (filters.durationMax !== "all") {
      const durationMatch = /(\d+)/.exec(course.duration);
      if (durationMatch) {
        const courseDuration = parseInt(durationMatch[0], 10);
        const maxDuration =
          filters.durationMax === "20+ hours"
            ? 100
            : parseInt(filters.durationMax.split("-")[1], 10);
        if (courseDuration > maxDuration) {
          return false;
        }
      }
    }

    return true;
  });

  // Calculate stats for the dashboard
  const stats = {
    totalSaved: savedCourses.length,
    byLevel: {
      Beginner: savedCourses.filter((c) => c.level === "Beginner").length,
      Intermediate: savedCourses.filter((c) => c.level === "Intermediate")
        .length,
      Advanced: savedCourses.filter((c) => c.level === "Advanced").length,
    },
    byProvider: providers.reduce((acc, provider) => {
      acc[provider] = savedCourses.filter(
        (c) => c.provider === provider
      ).length;
      return acc;
    }, {} as Record<string, number>),
  };

  const handleFiltersChange = (newFilters: CourseFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="text-gradient-blue-green">Learning Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your saved courses and track your learning progress
          </p>
        </div>
      </header>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-1"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-3 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-1 data-[state=active]:bg-gradient-blue-teal data-[state=active]:text-white"
          >
            <PieChart className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="flex items-center gap-1 data-[state=active]:bg-gradient-blue-teal data-[state=active]:text-white"
          >
            <BookmarkIcon className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Saved Courses</span>
            <Badge
              variant="secondary"
              className="ml-1 px-1.5 h-5 bg-white/10 text-white"
            >
              {savedCourses.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="flex items-center gap-1 data-[state=active]:bg-gradient-blue-teal data-[state=active]:text-white"
          >
            <MessagesSquare className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Find Courses</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card className="card-gradient hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Total Saved</CardTitle>
                <CardDescription>Saved courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BookmarkIcon className="h-5 w-5 text-primary" />
                  <span className="text-3xl font-bold text-gradient-blue-green">
                    {stats.totalSaved}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Course Levels</CardTitle>
                <CardDescription>Distribution by difficulty</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="text-xs">Beginner</div>
                    <div className="text-xs text-muted-foreground ml-auto">
                      {stats.byLevel.Beginner} courses
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div className="text-xs">Intermediate</div>
                    <div className="text-xs text-muted-foreground ml-auto">
                      {stats.byLevel.Intermediate} courses
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <div className="text-xs">Advanced</div>
                    <div className="text-xs text-muted-foreground ml-auto">
                      {stats.byLevel.Advanced} courses
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Top Providers</CardTitle>
                <CardDescription>Most saved course sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(stats.byProvider)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([provider, count]) => (
                      <div key={provider} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <div className="text-xs flex-1 truncate">
                          {provider}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {count} courses
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gradient-blue-green hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Recently Saved Courses
              </CardTitle>
              <CardDescription>
                Your most recently saved courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedCourses.length === 0 ? (
                <div className="text-center py-6">
                  <GraduationCap className="h-12 w-12 mx-auto text-primary/50" />
                  <h3 className="mt-2 text-lg font-medium">
                    No saved courses yet
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Save courses to track them here
                  </p>
                  <Link href="/">
                    <Button
                      variant="default"
                      className="mt-4 bg-gradient-blue-green hover:bg-gradient-blue-green-dark hover:shadow-md transition-all"
                    >
                      Find Courses
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {savedCourses.slice(0, 3).map((course) => (
                    <CourseCard
                      key={`${course.provider}-${course.title}`}
                      course={course}
                    />
                  ))}
                  {savedCourses.length > 3 && (
                    <div className="col-span-full text-center mt-2">
                      <Button
                        variant="outline"
                        onClick={() => handleTabChange("saved")}
                        className="hover-gradient-effect"
                      >
                        View All Saved Courses
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="pt-6">
          <div className="space-y-6">
            <Card className="border-gradient-blue-green hover:shadow-md transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookmarkIcon className="h-5 w-5 text-primary" />
                      Saved Courses
                    </CardTitle>
                    <CardDescription>
                      Manage and explore your saved courses
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <Link href="/">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 hover-gradient-effect"
                      >
                        <MessagesSquare className="h-4 w-4" />
                        Find New Courses
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {savedCourses.length > 0 && (
                  <div className="mb-4">
                    <CourseFilters
                      onFiltersChange={handleFiltersChange}
                      providers={providers}
                      initialFilters={filters}
                    />
                  </div>
                )}

                {savedCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <BookmarkIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">
                      No saved courses yet
                    </h3>
                    <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                      Save courses that interest you to access them quickly
                      later
                    </p>
                    <Link href="/">
                      <Button className="mt-4 bg-gradient-blue-green hover:bg-gradient-blue-green-dark hover:shadow-md transition-all">
                        Find Courses
                      </Button>
                    </Link>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Filter className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">
                      No matching courses
                    </h3>
                    <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                      Try adjusting your filters to see more results
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 hover-gradient-effect"
                      onClick={() =>
                        setFilters({
                          search: "",
                          level: "all",
                          provider: "all",
                          durationMax: "all",
                          bookmarkedOnly: false,
                        })
                      }
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredCourses.length} of{" "}
                        {savedCourses.length} saved courses
                      </div>
                    </div>

                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredCourses.map((course) => (
                        <CourseCard
                          key={`${course.provider}-${course.title}`}
                          course={course}
                        />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6 mt-6">
          <Card className="flex flex-col border-gradient-blue-green hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessagesSquare className="h-5 w-5 text-primary" />
                Course Recommendations
              </CardTitle>
              <CardDescription>
                Ask for course recommendations based on your interests
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground mb-4">
                Use our chat interface to find personalized course
                recommendations
              </p>
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-gradient-blue-green hover:bg-gradient-blue-green-dark transition-all duration-300 hover:shadow-md"
                >
                  <MessagesSquare className="h-4 w-4 mr-2" />
                  Go to Chat Interface
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
