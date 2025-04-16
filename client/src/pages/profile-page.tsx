import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { User, Key, LogOut, Settings, Shield, Award, Calendar } from "lucide-react";

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");

  // Initialize form with react-hook-form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Handle form submission
  const onSubmit = (data: ProfileFormValues) => {
    // This would typically update the user profile
    console.log(data);
    // Show success message
    alert("Profile updated successfully");
  };

  if (!user) {
    navigate("/auth");
    return null;
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
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/courses" className="text-foreground hover:text-primary transition-colors">
              Courses
            </Link>
            <Link href="/strategies" className="text-foreground hover:text-primary transition-colors">
              Strategies
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="bg-card rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{user.name || user.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.persona || "No persona yet"}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Learning streak</span>
                  </div>
                  <span className="font-medium">{user.streakCount || 0} days</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Completed courses</span>
                  </div>
                  <span className="font-medium">{user.completedCourses || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              <div className="bg-muted py-2 px-4">
                <h3 className="font-medium">Settings</h3>
              </div>
              <nav className="p-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "profile" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "security" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-3 transition-colors ${
                    activeTab === "settings" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Preferences</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full mt-2 text-left px-3 py-2 rounded-md flex items-center space-x-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                Your full name will be displayed on your profile.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                Your email address for communications.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" value={user.username} disabled className="mt-1" />
                          <p className="text-sm text-muted-foreground mt-1">
                            Your username cannot be changed.
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Input id="department" value={user.department || ""} disabled className="mt-1" />
                          <p className="text-sm text-muted-foreground mt-1">
                            Contact your administrator to update department information.
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="persona">Learning Persona</Label>
                          <Input id="persona" value={user.persona || "Not determined yet"} disabled className="mt-1" />
                          <p className="text-sm text-muted-foreground mt-1">
                            Take the persona quiz to update your learning persona.
                          </p>
                        </div>

                        <Button type="submit">Save Changes</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password to keep your account secure.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" className="mt-1" />
                        <p className="text-sm text-muted-foreground mt-1">
                          Password must be at least 8 characters long.
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" className="mt-1" />
                      </div>
                      <Button>Change Password</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Login Sessions</CardTitle>
                    <CardDescription>Manage your active sessions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Key className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Current Session</h4>
                            <p className="text-sm text-muted-foreground">
                              Started {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Active
                        </Button>
                      </div>
                      <Button variant="destructive">Sign Out of All Sessions</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control how and when you receive notifications.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Course Recommendations</h4>
                          <p className="text-sm text-muted-foreground">
                            Notifications about new course recommendations
                          </p>
                        </div>
                        <div className="ml-auto flex items-center space-x-2">
                          <Label htmlFor="notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email
                          </Label>
                          <input
                            type="checkbox"
                            id="notifications"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Learning Streak</h4>
                          <p className="text-sm text-muted-foreground">
                            Reminders to maintain your learning streak
                          </p>
                        </div>
                        <div className="ml-auto flex items-center space-x-2">
                          <Label htmlFor="streak-notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email
                          </Label>
                          <input
                            type="checkbox"
                            id="streak-notifications"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Learning Tips</h4>
                          <p className="text-sm text-muted-foreground">
                            Weekly tips based on your learning persona
                          </p>
                        </div>
                        <div className="ml-auto flex items-center space-x-2">
                          <Label htmlFor="tips-notifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Email
                          </Label>
                          <input
                            type="checkbox"
                            id="tips-notifications"
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                    <CardDescription>Customize your interface preferences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <select
                          id="theme"
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-1"
                        >
                          <option value="system">System Default</option>
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}