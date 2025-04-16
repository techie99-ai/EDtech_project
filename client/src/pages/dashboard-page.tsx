import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PersonaRadarChart } from "@/components/ui/radar-chart";
import { 
  Home, 
  BookOpen, 
  Lightbulb, 
  User, 
  Trophy, 
  BarChart, 
  Brain, 
  BookPlus, 
  CalendarCheck, 
  Puzzle, 
  Video,
  ArrowRight
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  // Define navigation items for learner dashboard - conditional based on role
  const navItems = [
    { name: "Courses", url: "/courses", icon: BookOpen },
    { name: "Strategies", url: "/strategies", icon: Lightbulb },
    { name: "Dashboard", url: "/dashboard", icon: Trophy },
    { name: "Profile", url: "/profile", icon: User }
  ];

  // Sample persona data - in a real app, this would come from the user's quiz results
  const personaData = {
    primary: user.persona || "Visual Learner",
    strengths: ["Visual pattern recognition", "Spatial awareness", "Creative thinking"],
    improvement: ["Auditory learning", "Sequential processing"],
    completedCourses: user.completedCourses || 3,
    inProgressCourses: 2,
    streakCount: user.streakCount || 5,
    progress: 68,
    certificates: 2,
  };

  // Sample recommended courses based on persona
  const recommendedCourses = [
    {
      id: 1,
      title: "Visual Learning Mastery",
      description: "Perfect for visual learners. Learn techniques to maximize information retention through visual aids.",
      duration: "4 weeks",
      completionRate: 72,
      tag: "Recommended for your persona"
    },
    {
      id: 2,
      title: "Auditory Learning Techniques",
      description: "Strengthen your ability to learn through listening with these targeted exercises.",
      duration: "3 weeks",
      completionRate: 25,
      tag: "Addresses improvement area"
    },
    {
      id: 3,
      title: "Comprehensive Learning Strategy",
      description: "A holistic approach to learning that combines multiple modalities.",
      duration: "6 weeks",
      completionRate: 0,
      tag: "New for you"
    }
  ];

  // Sample streak data
  const streakData = Array(30).fill(0).map((_, i) => {
    if (i >= 30 - personaData.streakCount && i < 30) return 2; // Current streak
    if (i % 3 === 0 || i % 7 === 0) return 1; // Past activity
    return 0; // No activity
  });

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
            
            {user && (
              <Link href="/profile">
                <Button variant="outline" size="sm" className="ml-4">
                  {user.name || user.username}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-32 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name || user.username}!</h1>
                <p className="text-muted-foreground">
                  Your learning persona: <span className="text-primary font-medium">{personaData.primary}</span>
                </p>
              </div>
              <Button onClick={() => navigate("/quiz")} variant="outline" className="flex items-center gap-2">
                <Puzzle className="h-4 w-4" />
                Retake Quiz
              </Button>
            </div>
          </section>

          {/* Stats Overview */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{personaData.streakCount}</div>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <BookPlus className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{personaData.completedCourses}</div>
                  <p className="text-sm text-muted-foreground">Completed Courses</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{personaData.inProgressCourses}</div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{personaData.progress}%</div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="col-span-2 space-y-8">
              {/* Learning Persona Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Learning Persona</CardTitle>
                  <CardDescription>
                    Understanding your unique learning style helps optimize your education journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Key Strengths</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {personaData.strengths.map((strength, i) => (
                          <div key={i} className="bg-primary/5 p-3 rounded-lg border border-primary/20 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                            <span>{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Areas for Improvement</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {personaData.improvement.map((area, i) => (
                          <div key={i} className="bg-muted p-3 rounded-lg border border-border flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                            <span>{area}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Learning Effectiveness</h3>
                      <div className="flex justify-center">
                        <PersonaRadarChart 
                          data={[
                            { subject: 'Visual', value: 92, fullMark: 100 },
                            { subject: 'Auditory', value: 45, fullMark: 100 },
                            { subject: 'Kinesthetic', value: 78, fullMark: 100 },
                            { subject: 'Reading', value: 65, fullMark: 100 },
                            { subject: 'Analytical', value: 83, fullMark: 100 },
                          ]}
                          colors={{
                            areaFill: 'rgba(94, 96, 206, 0.2)',
                            areaStroke: '#5E60CE',
                            gridStroke: 'var(--border)'
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary/80"></div>
                          <span className="text-sm">Visual: 92%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary/80"></div>
                          <span className="text-sm">Auditory: 45%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary/80"></div>
                          <span className="text-sm">Kinesthetic: 78%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary/80"></div>
                          <span className="text-sm">Reading: 65%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary/80"></div>
                          <span className="text-sm">Analytical: 83%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/strategies">
                    <Button variant="outline" className="w-full sm:w-auto">View Recommended Strategies</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Recommended Courses */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>
                    Courses selected based on your learning persona and interests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedCourses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{course.title}</h3>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {course.tag}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">
                              Duration: {course.duration}
                            </span>
                            {course.completionRate > 0 && (
                              <div className="flex items-center gap-2">
                                <Progress value={course.completionRate} className="h-2 w-24" />
                                <span className="text-xs">{course.completionRate}%</span>
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="h-8">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/courses">
                    <Button variant="outline" className="w-full sm:w-auto">View All Courses</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Learning Streak */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Streak</CardTitle>
                  <CardDescription>
                    {personaData.streakCount} day streak • Keep it going!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {streakData.map((value, i) => (
                      <div key={i} className="aspect-square">
                        <div 
                          className={`w-full h-full rounded-sm ${
                            value === 0 ? 'bg-muted' : 
                            value === 1 ? 'bg-primary/30' : 
                            'bg-primary'
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    Last 30 days
                  </div>
                </CardContent>
                <CardFooter>
                  <CalendarCheck className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">Maintain your streak by completing at least one learning activity daily</span>
                </CardFooter>
              </Card>

              {/* Tips for Your Learning Style */}
              <Card>
                <CardHeader>
                  <CardTitle>Tips for {personaData.primary}s</CardTitle>
                  <CardDescription>
                    Optimize your learning with these personalized strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-primary text-xs">1</span>
                      </div>
                      <p className="text-sm">Use mind maps and visual diagrams to organize information</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-primary text-xs">2</span>
                      </div>
                      <p className="text-sm">Convert text-based material into visual representations</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-primary text-xs">3</span>
                      </div>
                      <p className="text-sm">Use color-coding for notes and highlighting key concepts</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-primary text-xs">4</span>
                      </div>
                      <p className="text-sm">Watch educational videos instead of just reading text</p>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-primary text-xs">5</span>
                      </div>
                      <p className="text-sm">Practice active listening to improve auditory learning areas</p>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/strategies">
                    <Button variant="outline" className="w-full sm:w-auto">More Learning Strategies</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Certificates</CardTitle>
                  <CardDescription>
                    {personaData.certificates} earned certificates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3 bg-muted/30 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Visual Learning Foundations</h4>
                        <p className="text-xs text-muted-foreground">Completed on Apr 7, 2025</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                    <div className="border rounded-lg p-3 bg-muted/30 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Learning Persona Essentials</h4>
                        <p className="text-xs text-muted-foreground">Completed on Mar 20, 2025</p>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation Bar */}
      <NavBar 
        items={navItems}
        className="lg:fixed lg:bottom-12 lg:mb-0"
      />
    </div>
  );
}