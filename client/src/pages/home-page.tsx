import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
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
              Learning Strategies
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-foreground hover:text-primary transition-colors">
                  Profile
                </Link>
                <Button variant="ghost" onClick={handleLogout} disabled={logoutMutation.isPending}>
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </nav>
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Learning Persona
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Personalized learning strategies and course recommendations
              based on your unique learning style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/quiz">
                  <Button size="lg" className="px-8">
                    Take the Persona Quiz
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button size="lg" className="px-8">
                    Get Started
                  </Button>
                </Link>
              )}
              <Link href="/about">
                <Button size="lg" variant="outline" className="px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Take the Quiz</h3>
                <p className="text-muted-foreground">
                  Discover your unique learning persona through our
                  comprehensive assessment.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h3>
                <p className="text-muted-foreground">
                  Receive tailored course suggestions and learning strategies
                  based on your persona.
                </p>
              </div>
              <div className="text-center p-6 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your learning journey and maintain streaks to stay
                  motivated.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Learning Personas
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              Everyone has a unique learning style. Discover yours and optimize 
              your educational journey.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">The Explorer</h3>
                <p className="text-sm text-muted-foreground">
                  Curious and adventurous learners who thrive on discovering new concepts and ideas.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">The Connector</h3>
                <p className="text-sm text-muted-foreground">
                  Socially oriented learners who learn best through discussion and collaboration.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">The Synthesizer</h3>
                <p className="text-sm text-muted-foreground">
                  Pattern-seeking learners who excel at connecting ideas across disciplines.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">The Thinker</h3>
                <p className="text-sm text-muted-foreground">
                  Analytical and reflective learners who process information deeply before acting.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">The Creator</h3>
                <p className="text-sm text-muted-foreground">
                  Practical, hands-on learners who learn best by doing and creating.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-center">
              For L&D Professionals
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              Get valuable insights into your team's learning preferences and
              optimize training effectiveness.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Team Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Understand the distribution of learning personas across your organization.
                </p>
                <Link href="/for-ld">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Personalized Training</h3>
                <p className="text-muted-foreground mb-4">
                  Design more effective training programs based on your team's learning personas.
                </p>
                <Link href="/for-ld">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LearnPersona</h3>
              <p className="text-sm text-muted-foreground">
                Personalized learning experiences based on your unique learning style.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/strategies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Learning Strategies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">
                  Email: info@learnpersona.com
                </li>
                <li className="text-sm text-muted-foreground">
                  Phone: (555) 123-4567
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LearnPersona. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}