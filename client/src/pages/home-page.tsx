import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SparklesCore } from "@/components/ui/sparkles";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BookOpen, 
  Lightbulb, 
  BarChart, 
  User, 
  School, 
  Trophy, 
  ChevronRight 
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Define navigation items for different user types
  const learnerNavItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Courses", url: "/courses", icon: BookOpen },
    { name: "Strategies", url: "/strategies", icon: Lightbulb },
    { name: "Dashboard", url: "/dashboard", icon: Trophy },
    { name: "Profile", url: "/profile", icon: User }
  ];

  const ldNavItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Team View", url: "/for-ld", icon: BarChart },
    { name: "Courses", url: "/courses", icon: BookOpen },
    { name: "Strategies", url: "/strategies", icon: Lightbulb },
    { name: "Profile", url: "/profile", icon: User }
  ];

  // Define state for interface toggle
  const [interfaceMode, setInterfaceMode] = useState<"learner" | "ld">("learner");
  
  const handleTakeQuiz = () => {
    if (user) {
      navigate("/quiz");
    } else {
      navigate("/auth");
    }
  };

  const toggleInterface = () => {
    setInterfaceMode(interfaceMode === "learner" ? "ld" : "learner");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <School className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">LearnPersona</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleInterface}
              className="text-sm"
            >
              {interfaceMode === "learner" ? "For L&D Professionals" : "For Learners"}
            </Button>
            
            <ThemeToggle />
            
            {user ? (
              <Link href="/profile">
                <Button variant="outline" size="sm" className="ml-4">
                  {user.name || user.username}
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

      {/* Main Content */}
      <main className="pt-20 pb-32">
        {/* Hero Section with Sparkles */}
        <section className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleColor={interfaceMode === "learner" ? "#5E60CE" : "#0EA5E9"}
              particleDensity={100}
              className="w-full h-full"
              speed={1}
            />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {interfaceMode === "learner" 
                  ? "Discover Your Learning Persona" 
                  : "Understand Your Team's Learning Profiles"}
              </h1>
              <p className="text-xl mb-8 text-foreground/80">
                {interfaceMode === "learner"
                  ? "Take our specially designed assessment to understand your unique learning style and get personalized recommendations."
                  : "Gain insights into how your team learns best. Optimize training programs and boost productivity with data-driven learning strategies."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleTakeQuiz}>
                  {interfaceMode === "learner" ? "Take the Quiz" : "View Team Dashboard"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={interfaceMode === "learner" ? "/courses" : "/strategies"}>
                    {interfaceMode === "learner" ? "Browse Courses" : "Explore Strategies"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              {interfaceMode === "learner" 
                ? "Personalized Learning Experience" 
                : "L&D Professional Tools"}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {interfaceMode === "learner" ? (
                // Learner features
                <>
                  <div className="bg-card p-6 rounded-lg shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Discover Your Persona</h3>
                    <p className="text-muted-foreground">
                      Take our assessment to identify your unique learning persona and understand how you learn best.
                    </p>
                  </div>
                  
                  <div className="bg-card p-6 rounded-lg shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Tailored Courses</h3>
                    <p className="text-muted-foreground">
                      Get course recommendations matched to your specific learning style and preferences.
                    </p>
                  </div>
                  
                  <div className="bg-card p-6 rounded-lg shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                    <p className="text-muted-foreground">
                      Monitor your learning journey with streaks, achievements, and personalized insights.
                    </p>
                  </div>
                </>
              ) : (
                // L&D Professional features
                <>
                  <div className="bg-card p-6 rounded-lg shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <BarChart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Team Insights</h3>
                    <p className="text-muted-foreground">
                      Get comprehensive analytics on learning personas across your organization.
                    </p>
                  </div>
                  
                  <div className="bg-card p-6 rounded-lg shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Strategy Recommendations</h3>
                    <p className="text-muted-foreground">
                      Access tailored learning strategies based on your team's unique composition.
                    </p>
                  </div>
                  
                  <div className="bg-card p-6 rounded-lg shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Course Management</h3>
                    <p className="text-muted-foreground">
                      Assign and track appropriate courses for different learning personas in your team.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {interfaceMode === "learner" 
                ? "Ready to discover your learning persona?" 
                : "Ready to optimize your team's learning?"}
            </h2>
            <p className="text-xl mb-8 text-foreground/80 max-w-2xl mx-auto">
              {interfaceMode === "learner"
                ? "Join thousands of learners who have improved their learning effectiveness through persona-based approaches."
                : "Join leading organizations using data-driven insights to transform their training programs."}
            </p>
            <Button size="lg" onClick={handleTakeQuiz}>
              {interfaceMode === "learner" ? "Take the Quiz Now" : "Access L&D Dashboard"}
            </Button>
          </div>
        </section>
      </main>

      {/* Navigation Bar */}
      <NavBar 
        items={interfaceMode === "learner" ? learnerNavItems : ldNavItems}
        className="lg:fixed lg:bottom-12 lg:mb-0"
      />

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <School className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">LearnPersona</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                About
              </a>
              <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-foreground/50">
            &copy; {new Date().getFullYear()} LearnPersona. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}