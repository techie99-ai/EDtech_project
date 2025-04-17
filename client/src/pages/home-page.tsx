import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Lightbulb, 
  BarChart, 
  User, 
  School, 
  Trophy, 
  ChevronRight,
  Brain,
  Users
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleAction = () => {
    if (user) {
      navigate(user.role === "l&d_professional" ? "/ld-dashboard" : "/dashboard");
    } else {
      navigate("/auth");
    }
  };

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
              <Button size="sm" className="ml-4" onClick={handleAction}>
                Go to Dashboard
              </Button>
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
              particleColor="#5E60CE"
              particleDensity={100}
              className="w-full h-full"
              speed={1}
            />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Personalized Learning Experience
              </h1>
              <p className="text-xl mb-8 text-foreground/80">
                Discover your unique learning style and get personalized recommendations to enhance your educational journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleAction}>
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/auth">
                    Learn More
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
              A Two-Way Platform for Learning
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Learner features */}
              <div className="bg-card p-8 rounded-xl shadow-md border-t-4 border-primary/70">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">For Learners</h3>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                      <Trophy className="h-3 w-3 text-primary" />
                    </div>
                    <p>Discover your unique learning persona through our assessment</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                      <BookOpen className="h-3 w-3 text-primary" />
                    </div>
                    <p>Access courses tailored to your learning style preferences</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                      <Lightbulb className="h-3 w-3 text-primary" />
                    </div>
                    <p>Get personalized learning strategies to enhance your education</p>
                  </li>
                </ul>
                
                <Button className="w-full mt-6" onClick={() => navigate("/auth")}>
                  Register as a Learner
                </Button>
              </div>
              
              {/* L&D Professional features */}
              <div className="bg-card p-8 rounded-xl shadow-md border-t-4 border-blue-500/70">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold">For L&D Professionals</h3>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center mt-0.5 mr-3">
                      <BarChart className="h-3 w-3 text-blue-500" />
                    </div>
                    <p>Access detailed analytics about your team's learning personas</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center mt-0.5 mr-3">
                      <School className="h-3 w-3 text-blue-500" />
                    </div>
                    <p>Create and push tailored content to the right learners</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center mt-0.5 mr-3">
                      <Trophy className="h-3 w-3 text-blue-500" />
                    </div>
                    <p>Monitor assignments and track performance across departments</p>
                  </li>
                </ul>
                
                <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/auth")}>
                  Register as an L&D Professional
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-xl mb-8 text-foreground/80 max-w-2xl mx-auto">
              Join thousands of learners and organizations who have improved their learning effectiveness through our persona-based approaches.
            </p>
            <Button size="lg" onClick={handleAction}>
              Get Started Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain className="h-5 w-5 text-primary" />
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