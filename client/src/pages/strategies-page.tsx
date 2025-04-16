import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { LearningStrategy } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Search, BookOpen, TrendingUp, Lightbulb, School } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function StrategiesPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Fetch all strategies
  const { data: strategies, isLoading: isLoadingStrategies } = useQuery<LearningStrategy[]>({
    queryKey: ["/api/strategies"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/strategies");
      return await res.json();
    },
  });

  // Fetch recommended strategies if user has a persona
  const { data: recommendedStrategies, isLoading: isLoadingRecommended } = useQuery<LearningStrategy[]>({
    queryKey: ["/api/strategies/recommended"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/strategies/recommended");
      return await res.json();
    },
    enabled: !!user?.persona,
  });

  // Filter and search strategies
  const filterStrategies = (strategyList: LearningStrategy[] | undefined) => {
    if (!strategyList) return [];
    
    return strategyList.filter(strategy => {
      // Apply search filter
      const matchesSearch = 
        searchQuery === "" || 
        strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strategy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strategy.content.toLowerCase().includes(searchQuery.toLowerCase());
        
      // Apply type filter
      const matchesType = 
        typeFilter === "all" || 
        strategy.type === typeFilter;
        
      return matchesSearch && matchesType;
    });
  };

  const filteredAllStrategies = filterStrategies(strategies);
  const filteredRecommendedStrategies = filterStrategies(recommendedStrategies);

  // Get unique strategy types for filter
  const strategyTypes = strategies 
    ? Array.from(new Set(strategies.map(strategy => strategy.type)))
    : [];

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
            {user && (
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Learning Strategies</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover effective learning techniques that enhance knowledge retention and skill development. 
              {user?.persona 
                ? " Personalized strategies based on your learning persona are available below."
                : " Take our persona quiz to receive personalized strategy recommendations."}
            </p>
          </div>

          {/* Filters and search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search strategies..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={typeFilter} 
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {strategyTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Strategy listings */}
          <Tabs defaultValue={user?.persona ? "recommended" : "all"} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              {user?.persona && (
                <TabsTrigger value="recommended">Recommended For You</TabsTrigger>
              )}
              <TabsTrigger value="all">All Strategies</TabsTrigger>
              {!user?.persona && (
                <TabsTrigger value="take-quiz">Personalize Recommendations</TabsTrigger>
              )}
            </TabsList>

            {/* Recommended Strategies Tab */}
            {user?.persona && (
              <TabsContent value="recommended" className="space-y-6">
                <div className="bg-muted rounded-lg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Recommended for {user.persona} Learners</h3>
                    <p className="text-sm text-muted-foreground">
                      These strategies are selected to match your learning style.
                    </p>
                  </div>
                </div>

                {isLoadingRecommended ? (
                  <div className="flex justify-center py-10">
                    <p>Loading recommended strategies...</p>
                  </div>
                ) : filteredRecommendedStrategies && filteredRecommendedStrategies.length > 0 ? (
                  <div className="space-y-6">
                    {filteredRecommendedStrategies.map((strategy) => (
                      <StrategyCard key={strategy.id} strategy={strategy} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <h3 className="font-medium mb-2">No matching strategies found</h3>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search criteria.
                    </p>
                  </div>
                )}
              </TabsContent>
            )}

            {/* All Strategies Tab */}
            <TabsContent value="all" className="space-y-6">
              {isLoadingStrategies ? (
                <div className="flex justify-center py-10">
                  <p>Loading strategies...</p>
                </div>
              ) : filteredAllStrategies && filteredAllStrategies.length > 0 ? (
                <div className="space-y-6">
                  {filteredAllStrategies.map((strategy) => (
                    <StrategyCard key={strategy.id} strategy={strategy} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="font-medium mb-2">No matching strategies found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Take Quiz Tab */}
            {!user?.persona && (
              <TabsContent value="take-quiz" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Discover Your Learning Persona</CardTitle>
                    <CardDescription>
                      Take our quick assessment to get personalized strategy recommendations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <School className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-center mb-6 max-w-md">
                        Our learning persona assessment identifies your unique learning style
                        and recommends strategies that work best for you.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Link href={user ? "/quiz" : "/auth"}>
                      <Button size="lg">
                        {user ? "Take the Quiz" : "Sign In to Take the Quiz"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// Strategy card component
interface StrategyCardProps {
  strategy: LearningStrategy;
}

function StrategyCard({ strategy }: StrategyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{strategy.title}</CardTitle>
            <CardDescription>{strategy.type}</CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {strategy.suitablePersonas?.join(", ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          {strategy.description}
        </p>
        
        <div className={`${isExpanded ? 'block' : 'hidden'}`}>
          <div className="bg-muted p-4 rounded-md mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h4 className="font-medium">How to apply this strategy:</h4>
            </div>
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {strategy.content}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Learn More"}
        </Button>
      </CardFooter>
    </Card>
  );
}