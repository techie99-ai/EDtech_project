import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { 
  Search, 
  Book, 
  BookOpen, 
  Clock, 
  BarChart, 
  Star,
  Filter,
  ChevronRight,
  Users,
  CheckCircle,
  Brain,
  Flame,
  ThumbsUp,
  GraduationCap,
  School,
  Signal,
  CheckCircle2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function CoursesPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTestConfig, setShowTestConfig] = useState(false);
  
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

  // Sample data for UI
  const allPersonas = [
    "Visual Learner",
    "Auditory Learner",
    "Kinesthetic Learner",
    "Reading/Writing Learner"
  ];

  const popularTags = [
    "leadership",
    "management",
    "communication",
    "technical",
    "productivity",
    "creativity",
    "problem-solving",
    "teamwork"
  ];

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
        
      // Apply persona filter
      const matchesPersona =
        selectedPersona === "all" ||
        (course.suitablePersonas && course.suitablePersonas.includes(selectedPersona));
      
      // Apply duration filter
      const matchesDuration =
        selectedDuration === "all" ||
        (course.duration === selectedDuration);
      
      // Apply tags filter
      const matchesTags =
        selectedTags.length === 0 ||
        (course.tags && selectedTags.every(tag => course.tags.includes(tag)));
        
      return matchesSearch && matchesDifficulty && matchesPersona && matchesDuration && matchesTags;
    });
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setDifficultyFilter("all");
    setSelectedPersona("all");
    setSelectedDuration("all");
    setSelectedTags([]);
    setSearchQuery("");
  };

  const filteredAllCourses = filterCourses(courses);
  const filteredRecommendedCourses = filterCourses(recommendedCourses);

  // Determine if we have active filters beyond defaults
  const hasActiveFilters = 
    difficultyFilter !== "all" || 
    selectedPersona !== "all" || 
    selectedDuration !== "all" || 
    selectedTags.length > 0 ||
    searchQuery !== "";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">LearnPersona</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 mr-4">
              <Link href="/courses" className="text-primary font-medium">
                Courses
              </Link>
              <Link href="/strategies" className="text-foreground hover:text-primary transition-colors">
                Strategies
              </Link>
              <Link href="/quiz" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
                <School className="h-4 w-4" />
                Take Quiz
              </Link>
            </nav>
            
            <ThemeToggle />
            
            {user ? (
              <Link href={user.role === "l&d_professional" ? "/ld-dashboard" : "/dashboard"}>
                <Button variant="outline" size="sm" className="ml-4">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button size="sm" className="ml-4">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20 pb-32 container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Learning Courses</h2>
            <p className="text-muted-foreground max-w-2xl">
              Browse our curated collection of courses tailored to different learning personas.
              {user?.persona 
                ? ` As a ${user.persona}, you'll find personalized recommendations below.`
                : " Take our persona quiz to receive personalized course recommendations."}
            </p>
          </div>

          {/* Filters and search */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses by title, description, or tags..."
                  className="pl-9 h-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className={`h-10 w-10 ${showFilters ? 'bg-muted' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-10 px-3"
                  onClick={resetFilters}
                >
                  Reset filters
                </Button>
              )}
            </div>
            
            {showFilters && (
              <div className="bg-card rounded-lg p-6 space-y-6 mb-6 border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Refine Results
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                    className="text-xs h-8 px-2"
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Difficulty Filter */}
                  <div className="flex flex-col h-full">
                    <Label className="mb-2 flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
                      <Signal className="h-3.5 w-3.5" />
                      Difficulty Level
                    </Label>
                    <Select 
                      value={difficultyFilter} 
                      onValueChange={setDifficultyFilter}
                    >
                      <SelectTrigger className="w-full h-9">
                        <SelectValue placeholder="All Difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    {difficultyFilter !== "all" && (
                      <div className="mt-1 text-xs text-primary flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Filter active
                      </div>
                    )}
                  </div>
                  
                  {/* Persona Filter */}
                  <div className="flex flex-col h-full">
                    <Label className="mb-2 flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      Learning Persona
                    </Label>
                    <Select 
                      value={selectedPersona} 
                      onValueChange={setSelectedPersona}
                    >
                      <SelectTrigger className="w-full h-9">
                        <SelectValue placeholder="All Personas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Personas</SelectItem>
                        {allPersonas.map((persona) => (
                          <SelectItem key={persona} value={persona}>{persona}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedPersona !== "all" && (
                      <div className="mt-1 text-xs text-primary flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Filter active
                      </div>
                    )}
                  </div>
                  
                  {/* Duration Filter */}
                  <div className="flex flex-col h-full">
                    <Label className="mb-2 flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Duration
                    </Label>
                    <Select 
                      value={selectedDuration} 
                      onValueChange={setSelectedDuration}
                    >
                      <SelectTrigger className="w-full h-9">
                        <SelectValue placeholder="All Durations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Durations</SelectItem>
                        <SelectItem value="Under 1 hour">Under 1 hour</SelectItem>
                        <SelectItem value="1-3 hours">1-3 hours</SelectItem>
                        <SelectItem value="3-6 hours">3-6 hours</SelectItem>
                        <SelectItem value="6+ hours">6+ hours</SelectItem>
                        <SelectItem value="Self-paced">Self-paced</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedDuration !== "all" && (
                      <div className="mt-1 text-xs text-primary flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Filter active
                      </div>
                    )}
                  </div>
                  
                  {/* Course Type Filter */}
                  <div className="flex flex-col h-full">
                    <Label className="mb-2 flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" />
                      Course Type
                    </Label>
                    <Select 
                      defaultValue="all"
                      onValueChange={(value) => {
                        if (value === "test") {
                          setShowTestConfig(true);
                        } else {
                          setShowTestConfig(false);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full h-9">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="challenge">Challenge</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Test Configuration (shown only when test type is selected) */}
                {showTestConfig && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-blue-500 text-white p-1.5 rounded">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <h4 className="font-medium text-blue-700 dark:text-blue-300">
                        Test Configuration
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 mb-1.5 block">
                          Test Duration (minutes)
                        </div>
                        <Select defaultValue="30">
                          <SelectTrigger id="test-duration" className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 mb-1.5 block">
                          Passing Score (%)
                        </div>
                        <Select defaultValue="70">
                          <SelectTrigger id="passing-score" className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                            <SelectValue placeholder="Select passing score" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="60">60%</SelectItem>
                            <SelectItem value="70">70%</SelectItem>
                            <SelectItem value="80">80%</SelectItem>
                            <SelectItem value="90">90%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800"
                      >
                        Apply Test Settings
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Tags Filter */}
                <div>
                  <Label className="mb-2 block">Popular Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-muted/50 capitalize"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                        {selectedTags.includes(tag) && (
                          <span className="ml-1">×</span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top courses showcase (grid-based layout) */}
          {!hasActiveFilters && courses && courses.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-6">Top Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.slice(0, 3).map((course, index) => (
                  <div key={index} className="rounded-xl overflow-hidden border bg-card text-card-foreground shadow group hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
                    <div className="p-6">
                      <div className="mb-1">
                        <Badge variant="outline" className="mb-2">
                          {course.provider || "ThinkWell Academy"}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.tags?.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <BarChart className="h-4 w-4" />
                          <span>{course.difficulty || "Intermediate"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration || "8 weeks"}</span>
                        </div>
                      </div>
                      <Button className="w-full" size="sm">View Course</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                    <Flame className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Recommended for {user.persona}s</h3>
                    <p className="text-sm text-muted-foreground">
                      These courses are specially curated to match your learning style.
                    </p>
                  </div>
                </div>

                {isLoadingRecommended ? (
                  <div className="flex justify-center py-10">
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5 animate-pulse text-primary" />
                      <span>Loading recommended courses...</span>
                    </div>
                  </div>
                ) : filteredRecommendedCourses && filteredRecommendedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecommendedCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-muted/30 rounded-lg">
                    <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
                    <h3 className="font-medium text-lg mb-2">No matching courses found</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    {hasActiveFilters && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={resetFilters}
                      >
                        Reset Filters
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            )}

            {/* All Courses Tab */}
            <TabsContent value="all" className="space-y-6">
              {isLoadingCourses ? (
                <div className="flex justify-center py-10">
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5 animate-pulse text-primary" />
                    <span>Loading courses...</span>
                  </div>
                </div>
              ) : filteredAllCourses && filteredAllCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAllCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-muted/30 rounded-lg">
                  <Book className="h-12 w-12 mx-auto mb-4 text-muted-foreground/70" />
                  <h3 className="font-medium text-lg mb-2">No matching courses found</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
                  </p>
                  {hasActiveFilters && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Take Quiz Tab */}
            {!user?.persona && (
              <TabsContent value="take-quiz" className="space-y-6">
                <Card className="overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <div>
                      <CardHeader>
                        <CardTitle className="text-2xl">Discover Your Learning Persona</CardTitle>
                        <CardDescription>
                          Take our quick assessment to get personalized course recommendations.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                              <span className="text-primary text-sm font-medium">1</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Complete a brief assessment</h4>
                              <p className="text-sm text-muted-foreground">
                                Answer a few questions about how you prefer to learn
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                              <span className="text-primary text-sm font-medium">2</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Receive your persona profile</h4>
                              <p className="text-sm text-muted-foreground">
                                Learn about your unique learning style and strengths
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                              <span className="text-primary text-sm font-medium">3</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Get personalized recommendations</h4>
                              <p className="text-sm text-muted-foreground">
                                Access courses specifically tailored to your learning style
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={user ? "/quiz" : "/auth"}>
                          <Button size="lg" className="gap-2">
                            {user ? "Take the Quiz" : "Sign In to Take the Quiz"}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-700 text-white p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-4">Why Knowing Your Learning Persona Matters</h3>
                        <p className="mb-6 text-blue-100">
                          Understanding how you learn best can dramatically improve your skill acquisition and retention.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                            <GraduationCap className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">Learn more efficiently</h4>
                            <p className="text-sm text-blue-100">
                              Focus on content that matches your learning style
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                            <Flame className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">Stay more engaged</h4>
                            <p className="text-sm text-blue-100">
                              Enjoy learning experiences designed for you
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
                            <ThumbsUp className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">Achieve better results</h4>
                            <p className="text-sm text-blue-100">
                              Apply learning strategies that work for you
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`text-sm font-medium ${className}`}>
      {children}
    </div>
  );
}

function CourseCard({ course }: CourseCardProps) {
  const getPersonaBadgeColor = (persona: string) => {
    if (persona.includes("Visual")) return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800";
    if (persona.includes("Auditory")) return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    if (persona.includes("Kinesthetic")) return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
    if (persona.includes("Reading")) return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
    return "";
  };
  
  // Get suitable personas or use "ALL LEARNERS" as fallback
  const targetPersonas = course.suitablePersonas && course.suitablePersonas.length > 0 
    ? course.suitablePersonas[0] 
    : "ALL LEARNERS";
    
  // Get a letter code based on persona type
  const getPersonaCode = () => {
    if (targetPersonas.includes("Visual")) return "V";
    if (targetPersonas.includes("Auditory")) return "A";
    if (targetPersonas.includes("Kinesthetic")) return "K";
    if (targetPersonas.includes("Reading")) return "R";
    return "C"; // For "ALL LEARNERS" or unknown types
  };

  return (
    <div className="rounded-xl overflow-hidden bg-card border shadow group hover:shadow-md transition-all">
      <div className="relative">
        {/* Color strip at top with persona indicator */}
        <div className="w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        {/* Persona indicator badge */}
        <div className="absolute -top-1 left-4 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-background bg-blue-600 text-white font-semibold text-sm">
          {getPersonaCode()}
        </div>
      </div>
      
      <div className="p-5">
        {/* Provider badge */}
        <div className="mb-2">
          <Badge variant="outline" className="text-xs mb-1">
            {course.provider || "ThinkWell Academy"}
          </Badge>
        </div>
        
        {/* Course title */}
        <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        {/* Course description */}
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {course.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {course.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Course info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <BarChart className="h-3.5 w-3.5" />
            <span>{course.difficulty || "Intermediate"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration || "8 weeks"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 px-1 py-0 text-[10px]">
              Free
            </Badge>
          </div>
        </div>
        
        {/* Action button */}
        <Button 
          size="sm" 
          className="w-full"
          onClick={() => window.open(course.url, '_blank')}
        >
          View Course
        </Button>
      </div>
    </div>
  );
}