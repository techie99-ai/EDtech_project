import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Search, Book, BookOpen, Clock, BarChart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function CoursesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  
  // Fetch all courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/courses");
      return await res.json();
    },
  });

  // Fetch recommended courses if user has a persona
  const { data: recommendedCourses, isLoading: isLoadingRecommended } = useQuery<Course[]>({
    queryKey: ["/api/courses/recommended"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/courses/recommended");
      return await res.json();
    },
    enabled: !!user?.persona,
  });

  // Filter and search courses
  const filterCourses = (courseList: Course[] | undefined) => {
    if (!courseList) return [];
    
    return courseList.filter(course => {
      // Apply search filter
      const matchesSearch = 
        searchQuery === "" || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.tags && course.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
        
      // Apply difficulty filter
      const matchesDifficulty = 
        difficultyFilter === "all" || 
        course.difficulty === difficultyFilter;
        
      return matchesSearch && matchesDifficulty;
    });
  };

  const filteredAllCourses = filterCourses(courses);
  const filteredRecommendedCourses = filterCourses(recommendedCourses);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with navigation */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">LearnPersona</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/for-learners" className="text-foreground hover:text-primary transition-colors">
              For Learners
            </Link>
            <Link href="/for-ld" className="text-foreground hover:text-primary transition-colors">
              For L&D Professionals
            </Link>
            <Link href="/courses" className="text-foreground hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/strategies" className="text-foreground hover:text-primary transition-colors">
              Strategies
            </Link>
            {user && (
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Courses Library</h2>
            <p className="text-muted-foreground max-w-2xl">
              Browse our curated collection of courses. 
              {user?.persona 
                ? " Personalized recommendations based on your learning persona are available below."
                : " Take our persona quiz to receive personalized course recommendations."}
            </p>
          </div>

          {/* Filters and search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={difficultyFilter} 
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course listings */}
          <Tabs defaultValue={user?.persona ? "recommended" : "all"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              {user?.persona && (
                <TabsTrigger value="recommended">Recommended For You</TabsTrigger>
              )}
              <TabsTrigger value="all">All Courses</TabsTrigger>
              {!user?.persona && (
                <TabsTrigger value="take-quiz">Personalize Recommendations</TabsTrigger>
              )}
            </TabsList>

            {/* Recommended Courses Tab */}
            {user?.persona && (
              <TabsContent value="recommended" className="space-y-6">
                <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Recommended for {user.persona} Learners</h3>
                    <p className="text-sm text-muted-foreground">
                      These courses are selected to match your learning style.
                    </p>
                  </div>
                </div>

                {isLoadingRecommended ? (
                  <div className="flex justify-center py-10">
                    <p>Loading recommended courses...</p>
                  </div>
                ) : filteredRecommendedCourses && filteredRecommendedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecommendedCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <h3 className="font-medium mb-2">No matching courses found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
            )}

            {/* All Courses Tab */}
            <TabsContent value="all" className="space-y-6">
              {isLoadingCourses ? (
                <div className="flex justify-center py-10">
                  <p>Loading courses...</p>
                </div>
              ) : filteredAllCourses && filteredAllCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAllCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="font-medium mb-2">No matching courses found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Take Quiz Tab */}
            {!user?.persona && (
              <TabsContent value="take-quiz" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Discover Your Learning Persona</CardTitle>
                    <CardDescription>
                      Take our quick assessment to get personalized course recommendations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Book className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-center mb-6 max-w-md">
                        Our learning persona assessment identifies your unique learning style
                        and recommends courses that match how you learn best.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Link href={user ? "/quiz" : "/auth"}>
                      <Button size="lg">
                        {user ? "Take the Quiz" : "Sign In to Take the Quiz"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// Course card component
interface CourseCardProps {
  course: Course;
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{course.title}</CardTitle>
        </div>
        <CardDescription>{course.provider}</CardDescription>
      </CardHeader>
      <CardContent className="py-2 flex-1">
        <p className="text-sm text-muted-foreground mb-3">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {course.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>{course.difficulty || "All Levels"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration || "Self-paced"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => window.open(course.url, '_blank')}
        >
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
}