import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Quiz questions
const quizQuestions = [
  {
    id: "q1",
    question: "How do you prefer to approach a new subject?",
    options: [
      { value: "explorer", label: "I like to explore multiple sources and discover different aspects of the topic." },
      { value: "connector", label: "I prefer to discuss it with others and learn through conversation." },
      { value: "synthesizer", label: "I like to see how it connects to things I already know and find patterns." },
      { value: "thinker", label: "I prefer to understand the underlying principles and analyze it deeply first." },
      { value: "creator", label: "I want to try things out right away and learn by doing." }
    ]
  },
  {
    id: "q2",
    question: "When working on a challenging problem, you typically:",
    options: [
      { value: "thinker", label: "Break it down into smaller parts and analyze each component." },
      { value: "explorer", label: "Look for new approaches or ideas that might help solve it." },
      { value: "creator", label: "Build a prototype or test solution to see what works." },
      { value: "connector", label: "Discuss it with others to get different perspectives." },
      { value: "synthesizer", label: "Look for patterns or similarities to other problems you've solved." }
    ]
  },
  {
    id: "q3",
    question: "How do you best retain information?",
    options: [
      { value: "creator", label: "By applying it in a practical scenario or project." },
      { value: "thinker", label: "By understanding the underlying logic and principles." },
      { value: "connector", label: "By explaining it to someone else or discussing it." },
      { value: "explorer", label: "By connecting it to a variety of different contexts." },
      { value: "synthesizer", label: "By organizing it into a framework or system." }
    ]
  },
  {
    id: "q4",
    question: "In a team project, which role do you naturally gravitate toward?",
    options: [
      { value: "connector", label: "Facilitating communication and ensuring everyone's ideas are heard." },
      { value: "explorer", label: "Bringing in new ideas and resources that others might not have considered." },
      { value: "thinker", label: "Analyzing the project requirements and planning a logical approach." },
      { value: "creator", label: "Implementing and building the actual solutions." },
      { value: "synthesizer", label: "Integrating everyone's contributions into a cohesive whole." }
    ]
  },
  {
    id: "q5",
    question: "What aspect of learning do you find most engaging?",
    options: [
      { value: "explorer", label: "Discovering new ideas and possibilities." },
      { value: "thinker", label: "Understanding complex concepts in depth." },
      { value: "creator", label: "Applying knowledge to create something tangible." },
      { value: "synthesizer", label: "Seeing how different ideas connect to form a bigger picture." },
      { value: "connector", label: "Exchanging perspectives and learning from others." }
    ]
  },
  {
    id: "q6",
    question: "When faced with a new technology or tool, you usually:",
    options: [
      { value: "creator", label: "Jump in and start using it right away to figure out how it works." },
      { value: "thinker", label: "Read the documentation or tutorials thoroughly before starting." },
      { value: "connector", label: "Ask someone who's used it before for guidance or tips." },
      { value: "explorer", label: "Try different features to see what's possible." },
      { value: "synthesizer", label: "Consider how it fits with other tools or systems you use." }
    ]
  },
  {
    id: "q7",
    question: "What type of learning environment helps you thrive?",
    options: [
      { value: "connector", label: "Collaborative settings with plenty of discussion and group work." },
      { value: "explorer", label: "Dynamic environments with variety and new challenges." },
      { value: "creator", label: "Hands-on workshops where you can build and create." },
      { value: "thinker", label: "Structured environments with clear information and time to reflect." },
      { value: "synthesizer", label: "Environments that allow you to connect ideas across different domains." }
    ]
  },
  {
    id: "q8",
    question: "When learning something new, what frustrates you the most?",
    options: [
      { value: "thinker", label: "Lack of clear, logical explanations and structure." },
      { value: "explorer", label: "Too much repetition and not enough novelty or exploration." },
      { value: "creator", label: "Too much theory without practical application opportunities." },
      { value: "connector", label: "Not having others to discuss and share the learning experience with." },
      { value: "synthesizer", label: "Isolated information without context or connections to other knowledge." }
    ]
  },
  {
    id: "q9",
    question: "How do you organize your learning materials?",
    options: [
      { value: "synthesizer", label: "In comprehensive systems that show relationships between topics." },
      { value: "thinker", label: "In logical categories with detailed notes and references." },
      { value: "explorer", label: "In flexible collections that allow for new additions and discoveries." },
      { value: "creator", label: "Around projects or applications where they'll be used." },
      { value: "connector", label: "In shareable formats that make it easy to collaborate with others." }
    ]
  },
  {
    id: "q10",
    question: "What's your approach to solving problems you haven't encountered before?",
    options: [
      { value: "explorer", label: "Research widely to find new approaches and possibilities." },
      { value: "connector", label: "Reach out to others who might have insights or suggestions." },
      { value: "creator", label: "Try different solutions until you find one that works." },
      { value: "thinker", label: "Analyze the problem thoroughly to understand its fundamental nature." },
      { value: "synthesizer", label: "Look for patterns similar to problems you've solved before." }
    ]
  }
];

// Form schemas
const quizSchema = z.object({
  q1: z.string({ required_error: "Please select an answer" }),
  q2: z.string({ required_error: "Please select an answer" }),
  q3: z.string({ required_error: "Please select an answer" }),
  q4: z.string({ required_error: "Please select an answer" }),
  q5: z.string({ required_error: "Please select an answer" }),
  q6: z.string({ required_error: "Please select an answer" }),
  q7: z.string({ required_error: "Please select an answer" }),
  q8: z.string({ required_error: "Please select an answer" }),
  q9: z.string({ required_error: "Please select an answer" }),
  q10: z.string({ required_error: "Please select an answer" }),
});

type QuizFormValues = z.infer<typeof quizSchema>;

const personaDescriptions = {
  "The Explorer": 
    "Explorers are curious and adventurous learners who thrive on discovering new concepts and ideas. They enjoy variety and are always looking for fresh perspectives. Explorers learn best when they can explore multiple resources and follow their interests where they lead. They excel at making unique connections and bringing creative approaches to problems.",
  
  "The Connector": 
    "Connectors are social learners who thrive on interaction and collaboration. They learn best through discussion, teaching others, and collaborative projects. Connectors excel at building networks of knowledge through their interactions and are skilled at understanding different viewpoints. They're often effective communicators who can translate complex ideas for different audiences.",
  
  "The Synthesizer": 
    "Synthesizers excel at seeing the big picture and identifying patterns across different domains. They naturally connect ideas that others might see as separate and create cohesive frameworks of knowledge. Synthesizers learn best when they can relate new information to what they already know and understand how concepts work together as a system.",
  
  "The Thinker": 
    "Thinkers are analytical and methodical learners who value depth of understanding. They prefer to master fundamental principles before moving forward and enjoy working through complex problems step by step. Thinkers learn best with clear, logical explanations and time to reflect on and analyze new information. They excel at critical thinking and identifying logical inconsistencies.",
  
  "The Creator": 
    "Creators are hands-on learners who learn by doing and making. They prefer practical applications over theory and want to see tangible results from their learning. Creators learn best through projects, experiments, and real-world applications. They excel at translating ideas into action and finding innovative solutions through trial and error."
};

const personaStrategies = {
  "The Explorer": [
    "Use varied learning resources (videos, books, podcasts) to keep engagement high",
    "Set up learning challenges that take you outside your comfort zone",
    "Allow time for 'learning detours' to explore interesting tangents",
    "Join communities where you can discover new ideas and perspectives",
    "Create a flexible learning schedule with variety built in"
  ],
  
  "The Connector": [
    "Form or join study groups for collaborative learning",
    "Teach concepts to others to solidify your understanding",
    "Engage in discussions and debates about what you're learning",
    "Seek mentorship and be open to mentoring others",
    "Use social learning platforms and community-based resources"
  ],
  
  "The Synthesizer": [
    "Create mind maps or concept maps to visualize connections",
    "Look for interdisciplinary approaches to subjects",
    "Keep a learning journal to track insights and connections",
    "Ask 'how does this relate to X?' when learning something new",
    "Review and reorganize your knowledge periodically to strengthen connections"
  ],
  
  "The Thinker": [
    "Allocate uninterrupted time for deep focused learning",
    "Develop hierarchical note-taking systems",
    "Question assumptions and look for evidence",
    "Master fundamentals before moving to advanced topics",
    "Explain complex topics in your own words to ensure understanding"
  ],
  
  "The Creator": [
    "Choose project-based learning opportunities",
    "Set up practical applications for theoretical knowledge",
    "Break learning into actionable experiments",
    "Build portfolios or tangible outputs from your learning",
    "Seek immediate opportunities to apply new skills"
  ]
};

export default function QuizPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizResult, setQuizResult] = useState<string | null>(null);
  
  // Initialize form with react-hook-form
  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      q8: "",
      q9: "",
      q10: "",
    },
  });
  
  // Handle quiz submission
  const submitQuizMutation = useMutation({
    mutationFn: async (formData: QuizFormValues) => {
      // Calculate results
      const results = {
        explorer: 0,
        connector: 0,
        synthesizer: 0,
        thinker: 0,
        creator: 0,
      };
      
      // Count responses for each persona type
      Object.values(formData).forEach((answer) => {
        if (answer in results) {
          results[answer as keyof typeof results] += 1;
        }
      });
      
      // Find the dominant persona
      let dominantPersona = "explorer";
      let highestScore = 0;
      
      for (const [persona, score] of Object.entries(results)) {
        if (score > highestScore) {
          highestScore = score;
          dominantPersona = persona;
        }
      }
      
      // Map to proper persona name
      const personaMap: Record<string, string> = {
        explorer: "The Explorer",
        connector: "The Connector",
        synthesizer: "The Synthesizer",
        thinker: "The Thinker",
        creator: "The Creator"
      };
      
      const personaResult = personaMap[dominantPersona];
      setQuizResult(personaResult);
      
      // Submit to API
      const res = await apiRequest("POST", "/api/quiz/submit", {
        responses: formData,
        result: personaResult,
        completedAt: new Date()
      });
      
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate user query to reflect updated persona
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Quiz completed!",
        description: "Your learning persona has been identified",
      });
    },
    onError: (error) => {
      toast({
        title: "Error submitting quiz",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: QuizFormValues) => {
    if (currentStep < quizQuestions.length) {
      // Move to next question
      setCurrentStep(currentStep + 1);
    } else {
      // Submit quiz
      submitQuizMutation.mutate(data);
    }
  };

  // Move to a specific question
  const goToQuestion = (step: number) => {
    if (step >= 0 && step <= quizQuestions.length) {
      setCurrentStep(step);
    }
  };

  // Go back to previous question
  const previousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Calculate progress percentage
  const progress = (currentStep / quizQuestions.length) * 100;

  if (!user) {
    navigate("/auth");
    return null;
  }

  // Showing results screen
  if (quizResult || submitQuizMutation.isSuccess) {
    const persona = quizResult as keyof typeof personaDescriptions;
    
    return (
      <div className="min-h-screen bg-background flex flex-col">
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
            </nav>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20">
              <CardHeader className="text-center bg-primary/5 rounded-t-lg">
                <CardTitle className="text-3xl">Your Learning Persona: {persona}</CardTitle>
                <CardDescription className="text-lg">
                  Based on your quiz results
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">About {persona}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {personaDescriptions[persona]}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Learning Strategies for {persona}</h3>
                  <ul className="space-y-2">
                    {personaStrategies[persona].map((strategy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <span className="text-primary text-sm">✓</span>
                        </div>
                        <span>{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-semibold mb-2">Next Steps</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Now that you know your learning persona, we've personalized your dashboard
                    with recommended courses and learning strategies that align with your style.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => navigate("/dashboard")}>
                      View Your Personalized Dashboard
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/courses")}>
                      Browse Recommended Courses
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Quiz questions screen
  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Discover Your Learning Persona</h2>
            <p className="text-muted-foreground mb-6">
              Answer the following questions to identify your unique learning style.
              This will help us recommend courses and strategies that work best for you.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentStep + 1} of {quizQuestions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {currentStep < quizQuestions.length ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{quizQuestions[currentStep].question}</CardTitle>
                    <CardDescription>
                      Select the option that best describes you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name={quizQuestions[currentStep].id as keyof QuizFormValues}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-4"
                            >
                              {quizQuestions[currentStep].options.map((option, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <RadioGroupItem value={option.value} id={`${quizQuestions[currentStep].id}-${index}`} />
                                  <Label htmlFor={`${quizQuestions[currentStep].id}-${index}`} className="font-normal">
                                    {option.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            Choose the answer that feels most natural to you.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={previousQuestion}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>
                    <Button type="submit">
                      {currentStep === quizQuestions.length - 1 ? "Submit" : "Next"}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Ready to Submit</CardTitle>
                    <CardDescription>
                      You've answered all questions. Submit to see your results.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">
                      Based on your answers, we'll identify your learning persona and provide
                      personalized recommendations to enhance your learning experience.
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={previousQuestion}
                    >
                      Review Answers
                    </Button>
                    <Button 
                      type="submit"
                      disabled={submitQuizMutation.isPending}
                    >
                      {submitQuizMutation.isPending ? "Processing..." : "Submit Quiz"}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </form>
          </Form>

          {/* Question navigation */}
          <div className="mt-8">
            <div className="flex justify-center flex-wrap gap-2">
              {quizQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : form.getValues()[`q${index + 1}` as keyof QuizFormValues]
                      ? "bg-primary/20 text-primary"
                      : "bg-muted"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}