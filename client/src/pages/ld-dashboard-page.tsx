import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { SparklesCore } from "@/components/ui/sparkles";
import { 
  Home, 
  BookOpen, 
  Lightbulb, 
  User, 
  Users, 
  BarChart3, 
  Brain, 
  PieChart, 
  Calendar, 
  Clock, 
  LineChart, 
  Download,
  School,
  Building2,
  ChevronsUpDown,
  Filter,
  Search
} from "lucide-react";

export default function LDDashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  // Redirect if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  // Define navigation items for L&D dashboard
  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Team View", url: "/for-ld", icon: BarChart3 },
    { name: "Courses", url: "/courses", icon: BookOpen },
    { name: "Strategies", url: "/strategies", icon: Lightbulb },
    { name: "Profile", url: "/profile", icon: User }
  ];

  // Sample department data
  const departments = [
    { id: "eng", name: "Engineering" },
    { id: "sales", name: "Sales" },
    { id: "marketing", name: "Marketing" },
    { id: "hr", name: "Human Resources" },
    { id: "product", name: "Product" }
  ];

  // Sample persona distribution data by department
  const personaDistribution = {
    "Engineering": {
      "Visual Learner": 45,
      "Auditory Learner": 20,
      "Kinesthetic Learner": 25,
      "Reading/Writing Learner": 10
    },
    "Sales": {
      "Visual Learner": 30,
      "Auditory Learner": 40,
      "Kinesthetic Learner": 20,
      "Reading/Writing Learner": 10
    },
    "Marketing": {
      "Visual Learner": 35,
      "Auditory Learner": 25,
      "Kinesthetic Learner": 15,
      "Reading/Writing Learner": 25
    },
    "Human Resources": {
      "Visual Learner": 25,
      "Auditory Learner": 30,
      "Kinesthetic Learner": 15,
      "Reading/Writing Learner": 30
    },
    "Product": {
      "Visual Learner": 40,
      "Auditory Learner": 15,
      "Kinesthetic Learner": 30,
      "Reading/Writing Learner": 15
    }
  };

  // Sample learning activity trends data
  const learningActivityTrends = {
    "Engineering": [10, 12, 15, 18, 16, 20, 22],
    "Sales": [8, 9, 12, 15, 14, 17, 20],
    "Marketing": [6, 8, 10, 12, 16, 15, 17],
    "Human Resources": [5, 7, 8, 10, 12, 14, 16],
    "Product": [7, 9, 11, 13, 15, 16, 18]
  };

  // Sample user activity data
  const userActivityData = [
    { 
      id: 1, 
      name: "Alex Johnson", 
      department: "Engineering", 
      persona: "Visual Learner", 
      completedCourses: 7, 
      streakCount: 12,
      activeToday: true
    },
    { 
      id: 2, 
      name: "Maria Garcia", 
      department: "Sales", 
      persona: "Auditory Learner", 
      completedCourses: 5, 
      streakCount: 8,
      activeToday: true
    },
    { 
      id: 3, 
      name: "James Wilson", 
      department: "Marketing", 
      persona: "Reading/Writing Learner", 
      completedCourses: 4, 
      streakCount: 15,
      activeToday: false
    },
    { 
      id: 4, 
      name: "Sarah Lee", 
      department: "Human Resources", 
      persona: "Kinesthetic Learner", 
      completedCourses: 6, 
      streakCount: 20,
      activeToday: true
    },
    { 
      id: 5, 
      name: "Michael Brown", 
      department: "Engineering", 
      persona: "Auditory Learner", 
      completedCourses: 3, 
      streakCount: 5,
      activeToday: false
    },
    { 
      id: 6, 
      name: "Jessica Smith", 
      department: "Product", 
      persona: "Visual Learner", 
      completedCourses: 8, 
      streakCount: 18,
      activeToday: true
    }
  ];

  // Sample course effectiveness data
  const courseEffectiveness = [
    { 
      id: 1, 
      name: "Visual Learning Mastery", 
      enrollment: 120, 
      completionRate: 85, 
      averageRating: 4.8,
      recommendedFor: "Visual Learner"
    },
    { 
      id: 2, 
      name: "Auditory Learning Techniques", 
      enrollment: 95, 
      completionRate: 78, 
      averageRating: 4.6,
      recommendedFor: "Auditory Learner"
    },
    { 
      id: 3, 
      name: "Hands-on Learning Workshop", 
      enrollment: 85, 
      completionRate: 90, 
      averageRating: 4.9,
      recommendedFor: "Kinesthetic Learner"
    },
    { 
      id: 4, 
      name: "Reading & Writing Strategies", 
      enrollment: 75, 
      completionRate: 82, 
      averageRating: 4.5,
      recommendedFor: "Reading/Writing Learner"
    }
  ];

  // Filter user activity data based on department
  const filteredUserActivity = filterDepartment === "all" 
    ? userActivityData 
    : userActivityData.filter(user => user.department.toLowerCase() === departments.find(d => d.id === filterDepartment)?.name.toLowerCase());

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <School className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">LearnPersona</h1>
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-md ml-2">L&D Dashboard</span>
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
        <div className="max-w-7xl mx-auto">
          {/* Title and Filters */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">L&D Professional Dashboard</h1>
                <p className="text-muted-foreground">
                  Comprehensive insights to optimize your team's learning effectiveness
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Key Stats Overview */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{userActivityData.length}</div>
                  <p className="text-sm text-muted-foreground">Active Learners</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{departments.length}</div>
                  <p className="text-sm text-muted-foreground">Departments</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{courseEffectiveness.length}</div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">
                    {userActivityData.filter(user => user.activeToday).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="col-span-2 space-y-8">
              {/* Persona Distribution by Department */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Persona Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of learning personas across different departments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="Engineering" className="w-full">
                    <TabsList className="grid grid-cols-5 mb-6">
                      {departments.map(dept => (
                        <TabsTrigger key={dept.id} value={dept.name}>{dept.name}</TabsTrigger>
                      ))}
                    </TabsList>

                    {departments.map(dept => (
                      <TabsContent key={dept.id} value={dept.name} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Persona Distribution Chart (simplified with colored bars) */}
                          <div className="space-y-3">
                            {Object.entries(personaDistribution[dept.name]).map(([persona, percentage]) => (
                              <div key={persona} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">{persona}</span>
                                  <span className="text-sm">{percentage}%</span>
                                </div>
                                <Progress 
                                  value={percentage} 
                                  className={`h-2 ${
                                    persona === "Visual Learner" ? "bg-indigo-100 dark:bg-indigo-950" : 
                                    persona === "Auditory Learner" ? "bg-blue-100 dark:bg-blue-950" : 
                                    persona === "Kinesthetic Learner" ? "bg-green-100 dark:bg-green-950" : 
                                    "bg-amber-100 dark:bg-amber-950"
                                  }`}
                                  indicatorClassName={`${
                                    persona === "Visual Learner" ? "bg-indigo-500" : 
                                    persona === "Auditory Learner" ? "bg-blue-500" : 
                                    persona === "Kinesthetic Learner" ? "bg-green-500" : 
                                    "bg-amber-500"
                                  }`}
                                />
                              </div>
                            ))}
                          </div>

                          {/* Recommendations */}
                          <div>
                            <h3 className="text-lg font-medium mb-3">Department Insights</h3>
                            <div className="space-y-3 text-sm">
                              <p>
                                <span className="font-medium">Primary Learning Style: </span>
                                {Object.entries(personaDistribution[dept.name]).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
                              </p>
                              <p>
                                <span className="font-medium">Recommended Approach: </span>
                                {dept.name === "Engineering" ? "Visual learning materials with code examples" :
                                 dept.name === "Sales" ? "Audio/video role playing scenarios and discussions" :
                                 dept.name === "Marketing" ? "Mix of visual content and written case studies" :
                                 dept.name === "Human Resources" ? "Text-based guides with interactive scenarios" :
                                 "Visual workflows and hands-on practice sessions"}
                              </p>
                              <p>
                                <span className="font-medium">Course Completion Rate: </span>
                                {dept.name === "Engineering" ? "78%" :
                                 dept.name === "Sales" ? "82%" :
                                 dept.name === "Marketing" ? "75%" :
                                 dept.name === "Human Resources" ? "85%" :
                                 "80%"}
                              </p>
                              <p>
                                <span className="font-medium">Recommended Courses: </span>
                                {dept.name === "Engineering" ? "Visual Learning Mastery, Technical Documentation" :
                                 dept.name === "Sales" ? "Auditory Learning Techniques, Persuasive Communication" :
                                 dept.name === "Marketing" ? "Mixed Learning Strategies, Creative Thinking" :
                                 dept.name === "Human Resources" ? "Reading & Writing Strategies, People Skills" :
                                 "Visual Learning Mastery, Hands-on Learning Workshop"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Learning Activity Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Learning Activity Trends</CardTitle>
                  <CardDescription>
                    Weekly participation rates across different departments
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] relative">
                  {/* Simplified chart visualization with CSS */}
                  <div className="h-full flex items-end justify-between gap-4 px-4">
                    {departments.map((dept, index) => (
                      <div key={dept.id} className="flex flex-col items-center">
                        <div className="flex flex-col-reverse w-14">
                          {learningActivityTrends[dept.name].map((value, i) => (
                            <div 
                              key={i}
                              className={`w-full h-2 my-0.5 rounded-sm ${
                                index % 5 === 0 ? "bg-indigo-500" :
                                index % 5 === 1 ? "bg-blue-500" :
                                index % 5 === 2 ? "bg-green-500" :
                                index % 5 === 3 ? "bg-amber-500" :
                                "bg-purple-500"
                              }`}
                              style={{ opacity: 0.3 + (i * 0.1) }}
                            ></div>
                          ))}
                        </div>
                        <span className="text-xs mt-2 text-muted-foreground">{dept.name.substring(0, 3)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-12 left-0 right-0 flex justify-between px-10 border-t border-border pt-2">
                    <span className="text-xs text-muted-foreground">Week 1</span>
                    <span className="text-xs text-muted-foreground">Week 7</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <LineChart className="h-4 w-4 mr-1" />
                    All departments show positive learning activity growth over the past 7 weeks
                  </div>
                </CardFooter>
              </Card>

              {/* User Activity Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Learner Activity</CardTitle>
                  <CardDescription>
                    Detailed view of individual learning progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-border">
                            <thead>
                              <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                <th scope="col" className="px-4 py-3">Name</th>
                                <th scope="col" className="px-4 py-3">Department</th>
                                <th scope="col" className="px-4 py-3">Persona</th>
                                <th scope="col" className="px-4 py-3">Courses</th>
                                <th scope="col" className="px-4 py-3">Streak</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {filteredUserActivity.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/50">
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm font-medium">{user.name}</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm">{user.department}</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm">{user.persona}</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm">{user.completedCourses}</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm">{user.streakCount} days</div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      user.activeToday ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                                    }`}>
                                      {user.activeToday ? 'Active Today' : 'Inactive'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common L&D management tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="flex items-center justify-start gap-2 w-full">
                    <Users className="h-4 w-4" />
                    <span>View All Learners</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-start gap-2 w-full">
                    <BookOpen className="h-4 w-4" />
                    <span>Create New Course</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-start gap-2 w-full">
                    <LineChart className="h-4 w-4" />
                    <span>Generate Full Report</span>
                  </Button>
                  <Button variant="outline" className="flex items-center justify-start gap-2 w-full">
                    <Brain className="h-4 w-4" />
                    <span>Persona Recommendations</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Course Effectiveness */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Effectiveness</CardTitle>
                  <CardDescription>Performance metrics for active courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courseEffectiveness.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm">{course.name}</h3>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                            {course.recommendedFor}
                          </span>
                        </div>
                        <div className="space-y-2 mt-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Enrollment</span>
                            <span>{course.enrollment} learners</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Completion Rate</span>
                            <div className="flex items-center gap-2">
                              <Progress value={course.completionRate} className="h-1.5 w-16" />
                              <span>{course.completionRate}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Average Rating</span>
                            <div className="flex items-center">
                              <span>{course.averageRating}/5.0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Visual Background with Sparkles */}
              <div className="h-[200px] relative overflow-hidden rounded-lg shadow-sm">
                <div className="absolute inset-0 z-0">
                  <SparklesCore
                    id="ld-sparkles"
                    background="#0A1D56"
                    minSize={0.6}
                    maxSize={1.4}
                    particleColor="#0EA5E9"
                    particleDensity={70}
                    className="w-full h-full"
                    speed={0.8}
                  />
                </div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2 text-center">Need Custom L&D Analysis?</h3>
                  <p className="text-sm opacity-90 text-center mb-4">Our team can provide detailed insights tailored to your specific needs</p>
                  <Button variant="secondary" size="sm">Contact L&D Support</Button>
                </div>
              </div>
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