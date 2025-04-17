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
  GraduationCap
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
        (course.recommendedPersonas && course.recommendedPersonas.includes(selectedPersona));
      
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
              <div className="bg-muted/40 rounded-lg p-6 space-y-6 mb-6 border">
                <h3 className="font-semibold mb-4">Refine Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Difficulty Filter */}
                  <div>
                    <Label className="mb-2 block">Difficulty Level</Label>
                    <Select 
                      value={difficultyFilter} 
                      onValueChange={setDifficultyFilter}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Persona Filter */}
                  <div>
                    <Label className="mb-2 block">Learning Persona</Label>
                    <Select 
                      value={selectedPersona} 
                      onValueChange={setSelectedPersona}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Personas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Personas</SelectItem>
                        {allPersonas.map((persona) => (
                          <SelectItem key={persona} value={persona}>{persona}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Duration Filter */}
                  <div>
                    <Label className="mb-2 block">Duration</Label>
                    <Select 
                      value={selectedDuration} 
                      onValueChange={setSelectedDuration}
                    >
                      <SelectTrigger className="w-full">
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
                  </div>
                  
                  {/* Provider Filter (placeholder for real data) */}
                  <div>
                    <Label className="mb-2 block">Provider</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Providers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Providers</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="external">External</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
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

          {/* Featured course (if applicable) */}
          {!hasActiveFilters && courses && courses.length > 0 && (
            <div className="mb-10">
              <div className="rounded-xl overflow-hidden border bg-card text-card-foreground shadow">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-2 mb-4">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                          Featured
                        </Badge>
                        <Badge variant="outline">Top Rated</Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{courses[0].title}</h3>
                      <p className="text-muted-foreground mb-4">{courses[0].description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {courses[0].tags?.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <BarChart className="h-4 w-4" />
                          <span>{courses[0].difficulty || "All Levels"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{courses[0].duration || "Self-paced"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>250+ enrolled</span>
                        </div>
                      </div>
                      <Button className="w-full">Explore Course</Button>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 md:p-8 flex flex-col">
                    <div className="mb-auto">
                      <h4 className="text-lg font-bold mb-2">Why This Course?</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 mt-0.5 text-blue-200" />
                          <span>Created specifically for {courses[0].recommendedPersonas?.join(", ") || "all personas"}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 mt-0.5 text-blue-200" />
                          <span>Highly interactive learning experience</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 mt-0.5 text-blue-200" />
                          <span>Practical exercises with immediate feedback</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="ml-2 text-sm">5.0 (48 reviews)</span>
                      </div>
                      <div className="text-sm italic text-blue-100">
                        "This course transformed my approach to learning and problem-solving."
                      </div>
                    </div>
                  </div>
                </div>
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

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-12 md:col-span-3 bg-gradient-to-br from-blue-500 to-indigo-600 h-40 md:h-full flex items-center justify-center p-4">
          <div className="text-white text-center">
            <div className="text-3xl font-bold mb-1">
              {course.title.charAt(0)}
            </div>
            <div className="text-xs uppercase tracking-wider opacity-80">
              {course.recommendedPersonas && course.recommendedPersonas[0] || "All Learners"}
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-9 p-6">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{course.rating || "4.8"}</span>
                </div>
              </div>
              
              {course.provider && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{course.provider}</span>
                  {course.isVerified && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
                      Verified
                    </Badge>
                  )}
                </div>
              )}
              
              <p className="text-muted-foreground text-sm mb-3">{course.description}</p>
              
              {course.recommendedPersonas && course.recommendedPersonas.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Recommended for:</p>
                  <div className="flex flex-wrap gap-1">
                    {course.recommendedPersonas.map((persona, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={`text-xs ${getPersonaBadgeColor(persona)}`}
                      >
                        {persona}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-3">
                {course.tags?.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t mt-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  <span>{course.difficulty || "All Levels"}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration || "Self-paced"}</span>
                </div>
                
                <span className="font-medium text-foreground">
                  {course.price ? `$${course.price}` : "Free"}
                </span>
              </div>
              
              <Button 
                size="sm"
                onClick={() => window.open(course.url, '_blank')}
              >
                View Course
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}