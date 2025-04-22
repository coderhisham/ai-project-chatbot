import {
  BadgeCheck,
  Clock,
  Book,
  Info,
  Briefcase,
  GraduationCap,
  CalendarClock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Share2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSavedCoursesStore } from "@/lib/store/savedCoursesStore";

// URL cache to prevent duplicate API calls
const urlCache = new Map<string, string>();

export interface Course {
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  provider: string;
}

interface CourseDetails {
  whatYouWillLearn: string[];
  prerequisites: string[];
  keyTopics: string[];
  careerOpportunities: string;
  estimatedStudyTime: string;
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseUrl, setCourseUrl] = useState<string>("");
  const [urlLoading, setUrlLoading] = useState(true);

  // Use the savedCoursesStore
  const { isSaved, toggleSavedCourse } = useSavedCoursesStore();

  // Check if the course is saved
  const bookmarked = isSaved(course);

  // Share course
  const shareCourse = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: `Check out this course: ${course.title} by ${course.provider}`,
          url: window.location.href,
        });
        toast.success("Thanks for sharing!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast.error("Couldn't share course");
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  // Handle toggle bookmark using the store
  const handleToggleBookmark = () => {
    toggleSavedCourse(course);
    toast.success(
      bookmarked
        ? `Removed ${course.title} from saved courses`
        : `Added ${course.title} to saved courses`
    );
  };

  // Create a cache key based on course title and provider
  const getCacheKey = () => `${course.provider}:${course.title}`;

  // Fetch course URL from Gemini API
  useEffect(() => {
    const fetchCourseUrl = async () => {
      const cacheKey = getCacheKey();

      // Check if URL is already in cache
      if (urlCache.has(cacheKey)) {
        setCourseUrl(urlCache.get(cacheKey) || "");
        setUrlLoading(false);
        return;
      }

      setUrlLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch("/api/course-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: course.title,
            provider: course.provider,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.url) {
          // Save to cache and set state
          urlCache.set(cacheKey, data.url);
          setCourseUrl(data.url);
        } else {
          // Fall back to local URL generation if API fails
          const fallbackUrl = generateFallbackUrl();
          urlCache.set(cacheKey, fallbackUrl);
          setCourseUrl(fallbackUrl);
        }
      } catch (err) {
        console.error("Error fetching course URL:", err);
        const fallbackUrl = generateFallbackUrl();
        urlCache.set(cacheKey, fallbackUrl);
        setCourseUrl(fallbackUrl);
      } finally {
        setUrlLoading(false);
      }
    };

    fetchCourseUrl();
  }, [course.title, course.provider]);

  // Generate a fallback URL if the API call fails
  const generateFallbackUrl = () => {
    // Create a clean slug from title
    const slug = course.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 60);

    // Add a random course ID to make URLs more realistic
    const courseId = Math.floor(10000000 + Math.random() * 90000000);

    switch (course.provider.toLowerCase()) {
      case "udemy":
        return `https://www.udemy.com/course/${slug}/?utm_source=recommender`;
      case "coursera":
        return `https://www.coursera.org/learn/${slug}?specialization=recommended`;
      case "edx":
        return `https://www.edx.org/learn/${slug}`;
      case "linkedin learning":
      case "linkedin":
        return `https://www.linkedin.com/learning/courses/${slug}-${courseId}`;
      case "pluralsight":
        return `https://app.pluralsight.com/library/courses/${slug}/table-of-contents`;
      default:
        // Handle other providers with a generic format
        const providerDomain = course.provider
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^\w-]/g, "");
        return `https://www.${providerDomain}.com/courses/${slug}`;
    }
  };

  const fetchCourseDetails = async () => {
    if (details || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/course-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      const data = await response.json();

      if (response.ok) {
        setDetails(data);
      } else {
        setError(data.error || "Failed to load course details");
      }
    } catch (err) {
      setError("An error occurred while loading course details");
    } finally {
      setLoading(false);
    }
  };

  // Fetch course details when dialog opens
  useEffect(() => {
    if (open && !details && !loading) {
      fetchCourseDetails();
    }
  }, [open, details, loading]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-green-500";
      case "Intermediate":
        return "text-blue-500";
      case "Advanced":
        return "text-purple-500";
      default:
        return "text-slate-500";
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400";
      case "Intermediate":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
      case "Advanced":
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400";
      default:
        return "bg-slate-100 dark:bg-slate-900/20 text-slate-700 dark:text-slate-400";
    }
  };

  return (
    <>
      <Card
        className={`w-full transition-all duration-300 hover:shadow-md flex flex-col h-full ${
          bookmarked ? "border-gradient-blue-green" : "hover-gradient-effect"
        }`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="line-clamp-1">{course.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                {course.provider}
                {bookmarked && (
                  <Badge
                    variant="outline"
                    className="ml-1 text-xs py-0 h-5 border-primary/30 bg-primary/5"
                  >
                    <BookmarkCheck className="h-3 w-3 mr-1 text-primary" />
                    Saved
                  </Badge>
                )}
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full -mt-1 -mr-2 hover:bg-primary/10"
                    onClick={handleToggleBookmark}
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {bookmarked
                        ? "Remove from bookmarks"
                        : "Save to bookmarks"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>
                    {bookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-2">
          <p className="line-clamp-3 text-sm text-muted-foreground mb-4">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-auto">
            <div className="flex items-center gap-1.5">
              <Book className="h-4 w-4 text-muted-foreground" />
              <span
                className={`text-xs font-medium ${getLevelColor(course.level)}`}
              >
                {course.level}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {course.duration}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 hover-gradient-effect"
                >
                  <Info className="h-3.5 w-3.5 mr-1.5" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-gradient-blue-green">
                    {course.title}
                  </DialogTitle>
                  <DialogDescription>
                    Offered by {course.provider}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      About this course
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getLevelBadgeColor(
                        course.level
                      )}`}
                    >
                      <Book className="h-3 w-3 mr-1" />
                      {course.level}
                    </div>
                    <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration}
                    </div>
                    {details?.estimatedStudyTime && (
                      <div className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold">
                        <CalendarClock className="h-3 w-3 mr-1" />
                        {details.estimatedStudyTime}
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="py-8">
                      <div className="animate-pulse flex flex-col gap-3">
                        <div className="h-4 w-3/4 bg-muted rounded"></div>
                        <div className="h-4 w-1/2 bg-muted rounded"></div>
                        <div className="h-4 w-5/6 bg-muted rounded"></div>
                        <div className="h-4 w-2/3 bg-muted rounded"></div>
                      </div>
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        Loading course details...
                      </p>
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                      <p className="text-sm">{error}</p>
                    </div>
                  ) : details ? (
                    <>
                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-primary" />
                          What you'll learn
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {details.whatYouWillLearn.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-primary">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          Prerequisites
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {details.prerequisites.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 text-primary">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Book className="h-4 w-4 text-primary" />
                          Key Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {details.keyTopics.map((topic, index) => (
                            <div
                              key={index}
                              className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-medium"
                            >
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          Career Opportunities
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {details.careerOpportunities}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-2">
                        What you'll learn
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-start">
                          <BadgeCheck className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                          <span>
                            Key concepts and fundamentals in this subject area
                          </span>
                        </li>
                        <li className="flex items-start">
                          <BadgeCheck className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                          <span>Practical skills to apply your knowledge</span>
                        </li>
                        <li className="flex items-start">
                          <BadgeCheck className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                          <span>Real-world problem-solving techniques</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 hover-gradient-effect"
                      onClick={handleToggleBookmark}
                    >
                      {bookmarked ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 hover-gradient-effect"
                      onClick={shareCourse}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    {urlLoading ? (
                      <div className="h-10 bg-primary/30 rounded-md animate-pulse w-full"></div>
                    ) : (
                      <a
                        href={courseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center w-full justify-center px-4 py-2 rounded-md bg-gradient-blue-green hover:bg-gradient-blue-green-dark text-white hover:shadow-md text-sm font-medium gap-1.5 transition-all duration-300"
                        aria-label={`Visit ${course.title} on ${course.provider}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visit Course On {course.provider}
                      </a>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Opens in a new window. External content is provided by{" "}
                      {course.provider}.
                    </p>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      This course is available on {course.provider}. Course
                      details may vary. Visit the provider's website for the
                      most up-to-date information.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10"
                    onClick={shareCourse}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Share course</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this course</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {urlLoading ? (
            <div className="h-7 bg-primary/10 rounded-md animate-pulse w-24"></div>
          ) : (
            <a
              href={courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 rounded-md border border-primary/30 text-xs text-primary hover:bg-primary/10 font-medium gap-1.5 transition-colors"
              aria-label={`Visit ${course.title} on ${course.provider}`}
            >
              <ExternalLink className="h-3 w-3" />
              Visit Course
            </a>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
