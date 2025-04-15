import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { QuizResponse, Course, LearningStrategy } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import { Calendar, BarChart4, BookOpen, TrendingUp, Award, Book, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user?.persona && user) {
      // If user has no persona, suggest taking the quiz
      setActiveTab("quiz");
    }
  }, [user]);

  // Fetch quiz history
  const { data: quizHistory, isLoading: isLoadingQuiz } = useQuery<QuizResponse[]>({
    queryKey: ["/api/quiz/history"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/quiz/history");
      return await res.json();
    },
    enabled: !!user,
  });

  // Fetch recommended courses
  const { data: recommendedCourses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses/recommended"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/courses/recommended");
      return await res.json();
    },
    enabled: !!user?.persona,
  });

  // Fetch recommended strategies
  const { data: recommendedStrategies, isLoading: isLoadingStrategies } = useQuery<LearningStrategy[]>({
    queryKey: ["/api/strategies/recommended"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/strategies/recommended");
      return await res.json();
    },
    enabled: !!user?.persona,
  });

  // Fetch user progress
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["/api/progress"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/progress");
      return await res.json();
    },
    enabled: !!user,
  });

  if (!user) {
    return null; // Protected route should handle redirect
  }

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
            <Link href="/profile" className="text-foreground hover:text-primary transition-colors">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-card rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{user.name || user.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.persona ? user.persona : "No persona yet"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-4">
              <h3 className="font-medium mb-4">Navigation</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "overview" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <BarChart4 className="h-4 w-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "courses" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Courses</span>
                </button>
                <button
                  onClick={() => setActiveTab("strategies")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "strategies" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Strategies</span>
                </button>
                <button
                  onClick={() => setActiveTab("streaks")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "streaks" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Streaks</span>
                </button>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "quiz" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>Learning Persona Quiz</span>
                </button>
              </nav>
            </div>

            {/* Learning streak */}
            <div className="bg-card rounded-lg shadow-sm p-4">
              <h3 className="font-medium mb-2">Your Learning Streak</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="text-primary" />
                <span className="text-2xl font-bold">{user.streakCount || 0}</span>
                <span className="text-muted-foreground">days</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Keep learning daily to build your streak!
              </p>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{user.completedCourses || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{user.streakCount || 0} days</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Learning Persona</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {user.persona || "Not Discovered"}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {!user.persona ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Discover Your Learning Persona</CardTitle>
                      <CardDescription>
                        Take our quiz to get personalized course recommendations and learning strategies.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button onClick={() => setActiveTab("quiz")}>Take Quiz Now</Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Learning Journey</CardTitle>
                        <CardDescription>
                          Based on your persona: {user.persona}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Overall Progress</span>
                              <span>{user.progress || 0}%</span>
                            </div>
                            <Progress value={user.progress || 0} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Recommended Courses</CardTitle>
                          <CardDescription>
                            Based on your learning persona
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {isLoadingCourses ? (
                            <p>Loading recommendations...</p>
                          ) : recommendedCourses && recommendedCourses.length > 0 ? (
                            <ul className="space-y-2">
                              {recommendedCourses.slice(0, 3).map((course) => (
                                <li key={course.id} className="flex items-start gap-2">
                                  <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">{course.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {course.description.substring(0, 60)}...
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No courses recommended yet.</p>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" onClick={() => setActiveTab("courses")}>
                            View All Courses
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Learning Strategies</CardTitle>
                          <CardDescription>
                            Techniques that work best for your persona
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {isLoadingStrategies ? (
                            <p>Loading strategies...</p>
                          ) : recommendedStrategies && recommendedStrategies.length > 0 ? (
                            <ul className="space-y-2">
                              {recommendedStrategies.slice(0, 3).map((strategy) => (
                                <li key={strategy.id} className="flex items-start gap-2">
                                  <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                                  <div>
                                    <h4 className="font-medium">{strategy.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {strategy.description.substring(0, 60)}...
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No strategies recommended yet.</p>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" onClick={() => setActiveTab("strategies")}>
                            View All Strategies
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-6">
                <h2 className="text-2xl font-bold">Recommended Courses</h2>
                {!user.persona ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Discover Your Learning Persona</CardTitle>
                      <CardDescription>
                        Take our quiz to get personalized course recommendations.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button onClick={() => setActiveTab("quiz")}>Take Quiz Now</Button>
                    </CardFooter>
                  </Card>
                ) : isLoadingCourses ? (
                  <div className="flex items-center justify-center h-40">
                    <p>Loading courses...</p>
                  </div>
                ) : recommendedCourses && recommendedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedCourses.map((course) => (
                      <Card key={course.id}>
                        <CardHeader>
                          <CardTitle>{course.title}</CardTitle>
                          <CardDescription>{course.provider}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {course.description}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span>{course.difficulty}</span>
                            <span>{course.duration}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => window.open(course.url, '_blank')}
                          >
                            View Course
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Courses Found</CardTitle>
                      <CardDescription>
                        We couldn't find any courses for your learning persona.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>

              {/* Strategies Tab */}
              <TabsContent value="strategies" className="space-y-6">
                <h2 className="text-2xl font-bold">Learning Strategies</h2>
                {!user.persona ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Discover Your Learning Persona</CardTitle>
                      <CardDescription>
                        Take our quiz to get personalized learning strategies.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button onClick={() => setActiveTab("quiz")}>Take Quiz Now</Button>
                    </CardFooter>
                  </Card>
                ) : isLoadingStrategies ? (
                  <div className="flex items-center justify-center h-40">
                    <p>Loading strategies...</p>
                  </div>
                ) : recommendedStrategies && recommendedStrategies.length > 0 ? (
                  <div className="space-y-6">
                    {recommendedStrategies.map((strategy) => (
                      <Card key={strategy.id}>
                        <CardHeader>
                          <CardTitle>{strategy.title}</CardTitle>
                          <CardDescription>{strategy.type}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4">{strategy.description}</p>
                          <div className="bg-muted p-4 rounded-md">
                            <h4 className="font-medium mb-2">How to apply this strategy:</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {strategy.content}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>No Strategies Found</CardTitle>
                      <CardDescription>
                        We couldn't find any learning strategies for your persona.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </TabsContent>

              {/* Streaks Tab */}
              <TabsContent value="streaks" className="space-y-6">
                <h2 className="text-2xl font-bold">Learning Streaks</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Current Streak</CardTitle>
                    <CardDescription>Keep learning daily to maintain your streak</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center p-6">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <span className="text-4xl font-bold text-primary">{user.streakCount || 0}</span>
                      </div>
                      <h3 className="text-xl font-semibold">
                        {user.streakCount === 1 ? "1 Day" : `${user.streakCount || 0} Days`}
                      </h3>
                      <p className="text-muted-foreground text-center mt-2">
                        {user.streakCount ? "Great job maintaining your streak!" : "Start learning today to begin your streak!"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Streak Calendar</CardTitle>
                    <CardDescription>Your learning activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Learning activity visualization coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Quiz Tab */}
              <TabsContent value="quiz" className="space-y-6">
                <h2 className="text-2xl font-bold">Learning Persona Quiz</h2>
                {quizHistory && quizHistory.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Learning Persona</CardTitle>
                      <CardDescription>
                        Based on your most recent quiz result
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center p-6">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Award className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">
                          {quizHistory[0].result}
                        </h3>
                        <p className="text-muted-foreground text-center mt-2 max-w-md">
                          You took this quiz on {new Date(quizHistory[0].completedAt).toLocaleDateString()}.
                          Your learning persona helps us recommend the best courses and strategies for your style.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button variant="outline" onClick={() => navigate("/quiz")}>
                        Retake Quiz
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Discover Your Learning Persona</CardTitle>
                      <CardDescription>
                        Take our quiz to unlock personalized recommendations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center p-6">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Award className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">
                          Unlock Your Learning Potential
                        </h3>
                        <p className="text-muted-foreground text-center mt-2 max-w-md">
                          Our assessment will help you understand your unique learning style.
                          This insight allows us to recommend courses and strategies that align
                          with how you learn best.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button onClick={() => navigate("/quiz")}>
                        Start Quiz
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}