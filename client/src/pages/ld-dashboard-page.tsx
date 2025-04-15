import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { PieChart, AreaChart, ResponsiveContainer, Pie, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import { User, Users, BarChart4, Activity, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

const COLORS = ['#4f46e5', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'];

export default function LDDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch persona distribution data
  const { data: personaDistribution, isLoading: isLoadingDistribution } = useQuery({
    queryKey: ["/api/dashboard/personas"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/dashboard/personas");
      return await res.json();
    },
    enabled: !!user,
  });

  // Fetch learning trends data
  const { data: learningTrends, isLoading: isLoadingTrends } = useQuery({
    queryKey: ["/api/dashboard/trends"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/dashboard/trends");
      return await res.json();
    },
    enabled: !!user,
  });

  // Fetch user activity data
  const { data: userActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["/api/dashboard/activity"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/dashboard/activity");
      return await res.json();
    },
    enabled: !!user,
  });

  // Transform department persona data for pie chart
  const transformPersonaData = (departmentName: string) => {
    if (!personaDistribution || !personaDistribution[departmentName]) return [];
    
    return Object.entries(personaDistribution[departmentName]).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Transform trends data for area chart
  const transformTrendsData = () => {
    if (!learningTrends) return [];
    
    // Get all time periods (assuming all personas have same time periods)
    const firstPersona = Object.values(learningTrends)[0];
    const timePeriodsCount = firstPersona ? firstPersona.length : 0;
    
    return Array.from({ length: timePeriodsCount }, (_, i) => {
      const data: any = { name: `Month ${i + 1}` };
      Object.entries(learningTrends).forEach(([persona, values]) => {
        data[persona] = values[i];
      });
      return data;
    });
  };

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
                    L&D Professional
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
                  onClick={() => setActiveTab("personas")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "personas" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Persona Distribution</span>
                </button>
                <button
                  onClick={() => setActiveTab("trends")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "trends" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  <span>Learning Trends</span>
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "activity" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>User Activity</span>
                </button>
              </nav>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-4">
              <h3 className="font-medium mb-2">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/reports" className="text-muted-foreground hover:text-primary transition-colors">
                    Download Reports
                  </Link>
                </li>
                <li>
                  <Link href="/guide" className="text-muted-foreground hover:text-primary transition-colors">
                    Dashboard Guide
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
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
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoadingActivity ? "Loading..." : userActivity ? userActivity.length : 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Departments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoadingDistribution ? "Loading..." : 
                          personaDistribution ? Object.keys(personaDistribution).length : 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Engaged Learners</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {isLoadingActivity ? "Loading..." : userActivity ? 
                          userActivity.filter((a: any) => a.activityType === "completed").length : 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Persona Distribution</CardTitle>
                    <CardDescription>
                      Overview of learning personas across your organization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDistribution ? (
                      <div className="flex items-center justify-center h-64">
                        <p>Loading data...</p>
                      </div>
                    ) : !personaDistribution || Object.keys(personaDistribution).length === 0 ? (
                      <div className="flex items-center justify-center h-64">
                        <p>No data available. As users complete the learning persona quiz, you'll see their distribution here.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-4 text-center">Engineering Department</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={transformPersonaData("Engineering")}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {transformPersonaData("Engineering").map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div>
                          <h3 className="font-medium mb-4 text-center">Marketing Department</h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={transformPersonaData("Marketing")}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {transformPersonaData("Marketing").map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Activity Trends</CardTitle>
                    <CardDescription>
                      6-month activity trends by learning persona
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTrends ? (
                      <div className="flex items-center justify-center h-64">
                        <p>Loading data...</p>
                      </div>
                    ) : !learningTrends ? (
                      <div className="flex items-center justify-center h-64">
                        <p>No trend data available yet.</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={transformTrendsData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {Object.keys(learningTrends).map((persona, index) => (
                            <Area
                              key={persona}
                              type="monotone"
                              dataKey={persona}
                              stackId="1"
                              stroke={COLORS[index % COLORS.length]}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Persona Distribution Tab */}
              <TabsContent value="personas" className="space-y-6">
                <h2 className="text-2xl font-bold">Persona Distribution</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Department Breakdown</CardTitle>
                    <CardDescription>
                      Learning persona distribution across departments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDistribution ? (
                      <div className="flex items-center justify-center h-64">
                        <p>Loading data...</p>
                      </div>
                    ) : !personaDistribution || Object.keys(personaDistribution).length === 0 ? (
                      <div className="flex items-center justify-center h-64">
                        <p>No distribution data available yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {Object.entries(personaDistribution).map(([department, personas]) => (
                          <div key={department}>
                            <h3 className="font-medium mb-4">{department} Department</h3>
                            <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                <Pie
                                  data={transformPersonaData(department)}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={100}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {transformPersonaData(department).map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Training Recommendations</CardTitle>
                    <CardDescription>
                      Based on your team's learning persona distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="font-medium mb-2">Engineering Team</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Your engineering team tends toward Thinker and Creator personas,
                          suggesting a preference for detailed technical content and hands-on projects.
                        </p>
                        <Button variant="outline" size="sm">
                          View Training Plan
                        </Button>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="font-medium mb-2">Marketing Team</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Your marketing team shows a strong preference for Connector and Explorer personas,
                          suggesting collaborative learning environments and diverse content would be most effective.
                        </p>
                        <Button variant="outline" size="sm">
                          View Training Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Learning Trends Tab */}
              <TabsContent value="trends" className="space-y-6">
                <h2 className="text-2xl font-bold">Learning Trends</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>6-Month Activity by Persona</CardTitle>
                    <CardDescription>
                      Learning activity trends segmented by persona
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTrends ? (
                      <div className="flex items-center justify-center h-64">
                        <p>Loading data...</p>
                      </div>
                    ) : !learningTrends ? (
                      <div className="flex items-center justify-center h-64">
                        <p>No trend data available yet.</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={transformTrendsData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {Object.keys(learningTrends).map((persona, index) => (
                            <Area
                              key={persona}
                              type="monotone"
                              dataKey={persona}
                              stackId="1"
                              stroke={COLORS[index % COLORS.length]}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                    <CardDescription>
                      Analysis of learning trends across your organization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="font-medium mb-2">Increasing Explorer Activity</h3>
                        <p className="text-sm text-muted-foreground">
                          Explorer persona activity has increased by 50% over the past 6 months,
                          suggesting your team is becoming more comfortable with exploratory learning.
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="font-medium mb-2">Steady Thinker Engagement</h3>
                        <p className="text-sm text-muted-foreground">
                          Thinker persona engagement remains steady, showing consistent 
                          participation in analytical and reflective learning activities.
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <h3 className="font-medium mb-2">Growth Opportunity: Connector</h3>
                        <p className="text-sm text-muted-foreground">
                          Connector persona activity is lower than other types,
                          suggesting an opportunity to increase collaborative learning initiatives.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* User Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <h2 className="text-2xl font-bold">User Activity</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Learning Activities</CardTitle>
                    <CardDescription>
                      Latest course engagements across your organization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingActivity ? (
                      <div className="flex items-center justify-center h-64">
                        <p>Loading activity data...</p>
                      </div>
                    ) : !userActivity || userActivity.length === 0 ? (
                      <div className="flex items-center justify-center h-64">
                        <p>No user activity recorded yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">User</th>
                              <th className="text-left p-2">Department</th>
                              <th className="text-left p-2">Course</th>
                              <th className="text-left p-2">Activity</th>
                              <th className="text-left p-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userActivity.slice(0, 10).map((activity: any, index: number) => (
                              <tr key={index} className="border-b">
                                <td className="p-2 text-sm">{activity.userName}</td>
                                <td className="p-2 text-sm">{activity.userDepartment}</td>
                                <td className="p-2 text-sm">{activity.courseTitle}</td>
                                <td className="p-2 text-sm">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    activity.activityType === "completed" 
                                      ? "bg-green-100 text-green-700" 
                                      : "bg-blue-100 text-blue-700"
                                  }`}>
                                    {activity.activityType === "completed" ? "Completed" : "Started"}
                                  </span>
                                </td>
                                <td className="p-2 text-sm">
                                  {new Date(activity.timestamp).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Completion Rates</CardTitle>
                    <CardDescription>
                      Course completion rates by department
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Engineering</span>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                        <div className="w-full bg-primary/10 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Marketing</span>
                          <span className="text-sm font-medium">65%</span>
                        </div>
                        <div className="w-full bg-primary/10 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Sales</span>
                          <span className="text-sm font-medium">82%</span>
                        </div>
                        <div className="w-full bg-primary/10 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: "82%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">HR</span>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                        <div className="w-full bg-primary/10 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}