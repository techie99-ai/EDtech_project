import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  User, 
  BarChart, 
  BarChart3, 
  PieChart, 
  LineChart,
  Search,
  Plus,
  ListChecks,
  Brain,
  School,
  Users,
  ListFilter,
  Send,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Loader2,
  Lightbulb,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Rocket
} from "lucide-react";

interface LDDashboardPageProps {
  initialTab?: "overview" | "create" | "push" | "monitor";
}

export default function LDDashboardPage({ initialTab = "overview" }: LDDashboardPageProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");

  // Redirect if not logged in or not an L&D professional
  if (!user) {
    navigate("/auth");
    return null;
  }

  if (user.role !== "l&d_professional") {
    navigate("/dashboard");
    return null;
  }

  // Sample department data
  const departments = [
    { id: "eng", name: "Engineering" },
    { id: "sales", name: "Sales" },
    { id: "marketing", name: "Marketing" },
    { id: "hr", name: "Human Resources" },
    { id: "product", name: "Product" }
  ];

  // Sample persona types
  const personaTypes = [
    "Visual Learner",
    "Auditory Learner",
    "Kinesthetic Learner",
    "Reading/Writing Learner"
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

  // Sample assignments data
  const assignmentsData = [
    {
      id: 1,
      title: "Visual Learning Fundamentals",
      assignedTo: "Engineering",
      targetPersona: "Visual Learner",
      completionRate: 68,
      deadline: "2023-11-15",
      status: "active"
    },
    {
      id: 2,
      title: "Effective Audio Communication",
      assignedTo: "Sales",
      targetPersona: "Auditory Learner",
      completionRate: 75,
      deadline: "2023-11-20",
      status: "active"
    },
    {
      id: 3,
      title: "Hands-on Problem Solving",
      assignedTo: "Product",
      targetPersona: "Kinesthetic Learner",
      completionRate: 92,
      deadline: "2023-11-10",
      status: "completed"
    },
    {
      id: 4,
      title: "Documentation Best Practices",
      assignedTo: "Human Resources",
      targetPersona: "Reading/Writing Learner",
      completionRate: 45,
      deadline: "2023-11-25",
      status: "active"
    },
    {
      id: 5,
      title: "Creative Visual Marketing",
      assignedTo: "Marketing",
      targetPersona: "Visual Learner",
      completionRate: 100,
      deadline: "2023-11-05",
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">LearnPersona</h1>
            <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-0.5 rounded-md ml-2">L&D Dashboard</span>
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
          {/* Dashboard Tabs */}
          <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Content
                </TabsTrigger>
                <TabsTrigger value="push">
                  <Send className="mr-2 h-4 w-4" />
                  Push Content
                </TabsTrigger>
                <TabsTrigger value="monitor">
                  <LineChart className="mr-2 h-4 w-4" />
                  Top Performers
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Overview of Learners</h1>
                    <p className="text-muted-foreground">
                      Visual summary of learners and their personas across the organization
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

                {/* Key Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                          <Users className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold">{userActivityData.length}</div>
                        <p className="text-sm text-muted-foreground">Active Learners</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                          <Brain className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold">{personaTypes.length}</div>
                        <p className="text-sm text-muted-foreground">Learning Personas</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                          <BookOpen className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold">{courseEffectiveness.length}</div>
                        <p className="text-sm text-muted-foreground">Active Courses</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                          <ListChecks className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold">
                          {assignmentsData.filter(assignment => assignment.status === "active").length}
                        </div>
                        <p className="text-sm text-muted-foreground">Active Assignments</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Overview Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Learning Effectiveness */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Learning Effectiveness</CardTitle>
                      <CardDescription>
                        Effectiveness of learning methods across different learning styles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80 flex items-center justify-center">
                        <div className="w-full max-w-2xl mx-auto">
                          <div className="relative">
                            {/* Radar Chart for Learning Effectiveness */}
                            <div className="flex flex-col items-center">
                              {/* Visual axis */}
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                                <div className="text-sm font-medium">Visual</div>
                              </div>
                              
                              {/* Auditory axis */}
                              <div className="absolute top-1/4 right-0 transform translate-x-4 -translate-y-1/2">
                                <div className="text-sm font-medium">Auditory</div>
                              </div>
                              
                              {/* Kinesthetic axis */}
                              <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 translate-y-4">
                                <div className="text-sm font-medium">Kinesthetic</div>
                              </div>
                              
                              {/* Reading/Writing axis */}
                              <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 translate-y-4">
                                <div className="text-sm font-medium">Reading</div>
                              </div>
                              
                              {/* Practical axis */}
                              <div className="absolute top-1/4 left-0 transform -translate-x-4 -translate-y-1/2">
                                <div className="text-sm font-medium">Practical</div>
                              </div>
                              
                              {/* Radar chart polygon */}
                              <svg width="300" height="300" viewBox="0 0 200 200" className="mb-4">
                                {/* Background grid */}
                                <circle cx="100" cy="100" r="80" fill="none" stroke="#ddd" strokeWidth="1" />
                                <circle cx="100" cy="100" r="60" fill="none" stroke="#ddd" strokeWidth="1" />
                                <circle cx="100" cy="100" r="40" fill="none" stroke="#ddd" strokeWidth="1" />
                                <circle cx="100" cy="100" r="20" fill="none" stroke="#ddd" strokeWidth="1" />
                                
                                {/* Axes */}
                                <line x1="100" y1="20" x2="100" y2="180" stroke="#ddd" strokeWidth="1" />
                                <line x1="20" y1="100" x2="180" y2="100" stroke="#ddd" strokeWidth="1" />
                                <line x1="37" y1="37" x2="163" y2="163" stroke="#ddd" strokeWidth="1" />
                                <line x1="37" y1="163" x2="163" y2="37" stroke="#ddd" strokeWidth="1" />
                                
                                {/* Data polygon */}
                                <polygon 
                                  points="100,30 160,70 140,150 60,150 40,70" 
                                  fill="rgba(125, 140, 230, 0.2)" 
                                  stroke="rgba(125, 140, 230, 0.8)" 
                                  strokeWidth="2"
                                />
                                
                                {/* Data points */}
                                <circle cx="100" cy="30" r="4" fill="rgba(125, 140, 230, 1)" />
                                <circle cx="160" cy="70" r="4" fill="rgba(125, 140, 230, 1)" />
                                <circle cx="140" cy="150" r="4" fill="rgba(125, 140, 230, 1)" />
                                <circle cx="60" cy="150" r="4" fill="rgba(125, 140, 230, 1)" />
                                <circle cx="40" cy="70" r="4" fill="rgba(125, 140, 230, 1)" />
                                
                                {/* Scale indicators */}
                                <text x="102" y="20" fontSize="6" textAnchor="start" fill="currentColor">100%</text>
                                <text x="102" y="40" fontSize="6" textAnchor="start" fill="currentColor">75%</text>
                                <text x="102" y="60" fontSize="6" textAnchor="start" fill="currentColor">50%</text>
                                <text x="102" y="80" fontSize="6" textAnchor="start" fill="currentColor">25%</text>
                              </svg>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold">85%</div>
                              <div className="text-xs text-muted-foreground">Visual</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">70%</div>
                              <div className="text-xs text-muted-foreground">Auditory</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">65%</div>
                              <div className="text-xs text-muted-foreground">Kinesthetic</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">60%</div>
                              <div className="text-xs text-muted-foreground">Reading</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold">75%</div>
                              <div className="text-xs text-muted-foreground">Practical</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Department Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Department Breakdown</CardTitle>
                      <CardDescription>
                        Learning persona distribution by department
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {departments.map(dept => (
                          <div key={dept.id} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{dept.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {userActivityData.filter(u => u.department === dept.name).length} learners
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-1 mb-2">
                              {personaTypes.map((persona, index) => {
                                const percentage = personaDistribution[dept.name][persona];
                                return (
                                  <div 
                                    key={index} 
                                    className="h-8 flex items-center justify-center text-xs font-medium text-white rounded-sm"
                                    style={{ 
                                      width: `${percentage}%`, 
                                      backgroundColor: index === 0 ? '#818cf8' : 
                                                       index === 1 ? '#60a5fa' : 
                                                       index === 2 ? '#34d399' : 
                                                                    '#fbbf24'
                                    }}
                                  >
                                    {percentage}%
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              {personaTypes.map((persona, index) => (
                                <div key={index} className="flex items-center">
                                  <div 
                                    className="w-2 h-2 rounded-full mr-1"
                                    style={{ 
                                      backgroundColor: index === 0 ? '#818cf8' : 
                                                       index === 1 ? '#60a5fa' : 
                                                       index === 2 ? '#34d399' : 
                                                                    '#fbbf24'
                                    }}
                                  ></div>
                                  <span>{persona.split(" ")[0]}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Performers */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performers</CardTitle>
                      <CardDescription>
                        Learners with the highest activity and completion rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userActivityData
                          .sort((a, b) => (b.completedCourses + b.streakCount) - (a.completedCourses + a.streakCount))
                          .slice(0, 5)
                          .map(user => (
                            <div key={user.id} className="flex items-center justify-between p-2 border-b last:border-0">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-medium mr-3">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs flex items-center gap-2">
                                    <span className="text-muted-foreground">{user.department}</span>
                                    <Badge variant="outline" className="text-[10px] px-1 py-0">
                                      {user.persona.split(' ')[0]}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm">{user.completedCourses} courses</div>
                                <div className="text-xs text-muted-foreground">
                                  {user.streakCount} day streak
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Create Content Tab */}
              <TabsContent value="create" className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Create Learning Content</h1>
                  <p className="text-muted-foreground">
                    Design new learning experiences tailored to different persona types
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>New Content Form</CardTitle>
                        <CardDescription>
                          Fill in the details to create a new learning resource
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="content-title">Title</Label>
                            <Input id="content-title" placeholder="Enter a descriptive title" />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="content-type">Content Type</Label>
                              <Select defaultValue="course">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select content type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="course">Course</SelectItem>
                                  <SelectItem value="test">Test</SelectItem>
                                  <SelectItem value="challenge">Challenge</SelectItem>
                                  <SelectItem value="video">Video</SelectItem>
                                  <SelectItem value="article">Article</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="target-persona">Target Persona</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select target persona" />
                                </SelectTrigger>
                                <SelectContent>
                                  {personaTypes.map((persona, index) => (
                                    <SelectItem key={index} value={persona.toLowerCase().replace(/\s/g, '-')}>
                                      {persona}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="all">All Personas</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="content-description">Description</Label>
                            <Textarea 
                              id="content-description" 
                              placeholder="Provide a detailed description of this content"
                              rows={4}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="estimated-duration">Estimated Duration (minutes)</Label>
                              <Input id="estimated-duration" type="number" min="1" placeholder="e.g. 30" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="difficulty-level">Difficulty Level</Label>
                              <Select defaultValue="intermediate">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="beginner">Beginner</SelectItem>
                                  <SelectItem value="intermediate">Intermediate</SelectItem>
                                  <SelectItem value="advanced">Advanced</SelectItem>
                                  <SelectItem value="expert">Expert</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="content-tags">Tags (comma separated)</Label>
                            <Input id="content-tags" placeholder="e.g. visual, marketing, design" />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button variant="outline" className="mr-2">Save Draft</Button>
                            <Button>Create Content</Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Content Types</CardTitle>
                        <CardDescription>
                          Available formats for learning content
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                              <BookOpen className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">Courses</h3>
                              <p className="text-sm text-muted-foreground">Comprehensive multi-section learning paths</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                              <ListChecks className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">Tests</h3>
                              <p className="text-sm text-muted-foreground">Knowledge assessments with scoring</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                              <Trophy className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">Challenges</h3>
                              <p className="text-sm text-muted-foreground">Interactive tasks to apply knowledge</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                              <School className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <h3 className="font-medium">Videos</h3>
                              <p className="text-sm text-muted-foreground">Visual learning content with captions</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Persona Targeting Tips</CardTitle>
                        <CardDescription>
                          Strategies for each learning persona
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm space-y-3">
                        <p><span className="font-medium">Visual Learners:</span> Include diagrams, charts, and videos. Use color-coding and visual hierarchies.</p>
                        <p><span className="font-medium">Auditory Learners:</span> Add narrated content, discussions, and verbal instructions. Minimize visual distractions.</p>
                        <p><span className="font-medium">Kinesthetic Learners:</span> Incorporate interactive exercises, simulations, and hands-on activities.</p>
                        <p><span className="font-medium">Reading/Writing:</span> Provide detailed written content with lists, definitions, and text-based assignments.</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Push Content Tab */}
              <TabsContent value="push" className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Push Content</h1>
                  <p className="text-muted-foreground">
                    Assign learning resources to departments or specific personas
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Persona-Based Content Distribution</CardTitle>
                            <CardDescription>
                              Push suitable content to users matching specific personas
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                            Enhanced Features
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <form className="space-y-6">
                          <div className="bg-muted p-4 rounded-lg border mb-6">
                            <h4 className="text-sm font-medium flex items-center mb-3">
                              <BookOpen className="h-4 w-4 mr-2 text-primary" />
                              Content Selection
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="content-select" className="text-sm font-normal flex items-center gap-1.5">
                                  Content to Push
                                </Label>
                                <Select>
                                  <SelectTrigger className="bg-white dark:bg-gray-900">
                                    <SelectValue placeholder="Select content" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {courseEffectiveness.map(course => (
                                      <SelectItem key={course.id} value={course.id.toString()}>
                                        {course.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="content-type" className="text-sm font-normal flex items-center gap-1.5">
                                  Content Type
                                </Label>
                                <Select defaultValue="course">
                                  <SelectTrigger className="bg-white dark:bg-gray-900">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="course">Course</SelectItem>
                                    <SelectItem value="assessment">Assessment</SelectItem>
                                    <SelectItem value="article">Article</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="test">Test</SelectItem>
                                    <SelectItem value="challenge">Challenge</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                            <h4 className="font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2 mb-3">
                              <Users className="h-4 w-4" />
                              Target Audience
                            </h4>
                            
                            <div className="space-y-3 mb-4">
                              <div className="space-y-2">
                                <Label htmlFor="audience-type" className="text-sm font-normal text-blue-700 dark:text-blue-400">
                                  Audience Type
                                </Label>
                                <Select defaultValue="persona">
                                  <SelectTrigger className="border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-900">
                                    <SelectValue placeholder="Select audience type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="persona">By Persona</SelectItem>
                                    <SelectItem value="department">By Department</SelectItem>
                                    <SelectItem value="individual">Specific Individuals</SelectItem>
                                    <SelectItem value="all">All Users</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="target-persona-push" className="text-sm font-normal text-blue-700 dark:text-blue-400">
                                  Target Persona
                                </Label>
                                <Select>
                                  <SelectTrigger className="border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-900">
                                    <SelectValue placeholder="Select target persona" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {personaTypes.map((persona, index) => (
                                      <SelectItem key={index} value={persona.toLowerCase().replace(/\s/g, '-')}>
                                        {persona}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="department-filter" className="text-sm font-normal text-blue-700 dark:text-blue-400">
                                  Department Filter (Optional)
                                </Label>
                                <Select defaultValue="">
                                  <SelectTrigger className="border-blue-200 dark:border-blue-800 bg-white dark:bg-blue-900">
                                    <SelectValue placeholder="All departments" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map(dept => (
                                      <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
                                <span className="text-xs text-blue-700 dark:text-blue-400">
                                  Target selection will automatically match content to appropriate learning styles
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2">
                              <Label htmlFor="deadline" className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                Completion Deadline
                              </Label>
                              <Input id="deadline" type="date" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="priority" className="flex items-center gap-1.5">
                                <Rocket className="h-3.5 w-3.5" />
                                Priority Level
                              </Label>
                              <Select defaultValue="normal">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">
                                    <div className="flex items-center">
                                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                      Low
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="normal">
                                    <div className="flex items-center">
                                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                      Normal
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="high">
                                    <div className="flex items-center">
                                      <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                                      High
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="urgent">
                                    <div className="flex items-center">
                                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                                      Urgent
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="push-message" className="flex items-center gap-1.5">
                              <Send className="h-3.5 w-3.5" />
                              Message to Recipients
                            </Label>
                            <Textarea 
                              id="push-message" 
                              placeholder="Add a custom message to accompany this content"
                              rows={3}
                            />
                          </div>
                          
                          <div className="p-3 bg-muted rounded-md mt-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="send-notification"
                                className="h-4 w-4 mr-2"
                                defaultChecked
                              />
                              <Label htmlFor="send-notification" className="text-sm">Send notification to recipients</Label>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t">
                            <Button variant="outline" className="gap-1">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              Schedule for Later
                            </Button>
                            <Button className="gap-1">
                              <Send className="h-3.5 w-3.5 mr-1" />
                              Push Content Now
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Recipients Preview</CardTitle>
                        <CardDescription>
                          Users who will receive this content
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 mb-4">
                          <div className="text-sm font-medium">Estimated recipients:</div>
                          <div className="text-3xl font-bold">24</div>
                          <div className="text-xs text-muted-foreground">Based on your current selection</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Engineering</span>
                            <span>8 users</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Sales</span>
                            <span>6 users</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Marketing</span>
                            <span>4 users</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>HR</span>
                            <span>3 users</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Product</span>
                            <span>3 users</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="text-sm font-medium mb-2">Matching persona:</div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            <span>Visual Learner</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Pushes</CardTitle>
                        <CardDescription>
                          Content recently distributed
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <div className="space-y-3">
                          <div className="border-b pb-2">
                            <div className="font-medium">Visual Learning Mastery</div>
                            <div className="text-xs text-muted-foreground">Pushed 2 days ago • 35 recipients</div>
                          </div>
                          <div className="border-b pb-2">
                            <div className="font-medium">Auditory Learning Techniques</div>
                            <div className="text-xs text-muted-foreground">Pushed 5 days ago • 28 recipients</div>
                          </div>
                          <div className="">
                            <div className="font-medium">Hands-on Workshop</div>
                            <div className="text-xs text-muted-foreground">Pushed 1 week ago • 42 recipients</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Monitor Results Tab */}
              <TabsContent value="monitor" className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Monitor Assignments & Results</h1>
                  <p className="text-muted-foreground">
                    Track content distribution and learning performance across the organization
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {/* Active Assignments */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Active Assignments</CardTitle>
                          <CardDescription>
                            Track who has received content and completion status
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Filter className="h-3 w-3" />
                            Filter
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Download className="h-3 w-3" />
                            Export
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left font-medium p-2">Assignment</th>
                              <th className="text-left font-medium p-2">Department</th>
                              <th className="text-left font-medium p-2">Target Persona</th>
                              <th className="text-left font-medium p-2">Deadline</th>
                              <th className="text-left font-medium p-2">Completion</th>
                              <th className="text-left font-medium p-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignmentsData.map(assignment => (
                              <tr key={assignment.id} className="border-b hover:bg-muted/50">
                                <td className="p-2">
                                  <div className="font-medium">{assignment.title}</div>
                                </td>
                                <td className="p-2">{assignment.assignedTo}</td>
                                <td className="p-2">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                    {assignment.targetPersona}
                                  </Badge>
                                </td>
                                <td className="p-2">{new Date(assignment.deadline).toLocaleDateString()}</td>
                                <td className="p-2">
                                  <div className="flex items-center gap-2">
                                    <Progress value={assignment.completionRate} className="h-2 w-24" />
                                    <span>{assignment.completionRate}%</span>
                                  </div>
                                </td>
                                <td className="p-2">
                                  {assignment.status === "active" ? (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                      Active
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800">
                                      Completed
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Effectiveness</CardTitle>
                        <CardDescription>
                          Performance metrics for persona-targeted courses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {courseEffectiveness.map(course => (
                            <div key={course.id} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{course.name}</div>
                                  <div className="text-xs text-muted-foreground">For {course.recommendedFor}s</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">{course.averageRating}/5.0</div>
                                  <div className="text-xs text-muted-foreground">{course.enrollment} enrolled</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress value={course.completionRate} className="h-2" />
                                <span className="text-sm">{course.completionRate}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Learner Progress</CardTitle>
                        <CardDescription>
                          Individual performance summary
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {userActivityData
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .slice(0, 6)
                            .map(user => (
                              <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-medium mr-2 text-xs">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">{user.department}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-sm font-medium">{user.completedCourses}</div>
                                    <div className="text-xs text-muted-foreground">Courses</div>
                                  </div>
                                  <div>
                                    {user.activeToday ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <Clock className="h-5 w-5 text-amber-500" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                        </div>
                        <Button variant="outline" className="w-full mt-4 text-sm">
                          View All Learners
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}