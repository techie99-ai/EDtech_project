import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SparklesCore } from "@/components/ui/sparkles";

// Form schemas
const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerFormSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().optional(),
  role: z.enum(["learner", "l&d_professional"], {
    required_error: "Role is required",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      department: "",
      role: "learner", // Default to learner role
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submissions
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="bg-muted flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">LearnPersona</h1>
            <p className="text-muted-foreground">
              Sign in to access personalized learning recommendations
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Choose a username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your department"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I want to join as</FormLabel>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              field.value === "learner"
                                ? "bg-primary/5 border-primary"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => field.onChange("learner")}
                          >
                            <div className="flex items-center mb-2">
                              <div className={`w-4 h-4 rounded-full mr-2 ${field.value === "learner" ? "bg-primary" : "border border-muted-foreground"}`}></div>
                              <span className="font-medium">Learner</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Discover your learning style and get personalized recommendations
                            </p>
                          </div>
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              field.value === "l&d_professional"
                                ? "bg-primary/5 border-primary"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => field.onChange("l&d_professional")}
                          >
                            <div className="flex items-center mb-2">
                              <div className={`w-4 h-4 rounded-full mr-2 ${field.value === "l&d_professional" ? "bg-primary" : "border border-muted-foreground"}`}></div>
                              <span className="font-medium">L&D Professional</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Monitor team learning profiles and manage content
                            </p>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="hidden md:block relative p-8 flex items-center justify-center overflow-hidden">
        {/* Sparkles background */}
        <div className="absolute inset-0 z-0">
          <SparklesCore
            id="auth-sparkles"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleColor="#5E60CE"
            particleDensity={70}
            className="w-full h-full"
            speed={0.8}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg bg-background/60 backdrop-blur-md p-8 rounded-lg shadow-lg border border-border">
          <h2 className="text-3xl font-bold mb-4">Discover Your Learning Persona</h2>
          <p className="text-lg mb-6">
            Unlock your full learning potential with personalized recommendations
            based on your unique learning persona. Our platform helps you:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-medium">Identify Your Learning Style</h3>
                <p className="text-muted-foreground">
                  Take our assessment to discover how you learn best.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-medium">Get Tailored Course Recommendations</h3>
                <p className="text-muted-foreground">
                  Find courses that match your learning style for better results.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-medium">Track Your Learning Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your development with streaks and achievements.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-medium">For L&D Professionals</h3>
                <p className="text-muted-foreground">
                  Gain insights into your team's learning styles to optimize training.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}