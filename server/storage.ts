import { 
  users, 
  type User, 
  type InsertUser,
  courses,
  type Course,
  type InsertCourse,
  quizResponses,
  type QuizResponse,
  type InsertQuizResponse,
  userProgress,
  type UserProgress,
  type InsertUserProgress,
  learningStrategies,
  type LearningStrategy,
  type InsertLearningStrategy
} from "@shared/schema";

import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // Session store for user authentication
  sessionStore: session.Store;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;

  // Quiz methods
  saveQuizResponse(quizResponse: InsertQuizResponse): Promise<QuizResponse>;
  getQuizResponsesByUser(userId: number): Promise<QuizResponse[]>;
  getLatestQuizResponse(userId: number): Promise<QuizResponse | undefined>;

  // Course methods
  createCourse(course: InsertCourse): Promise<Course>;
  getCourses(): Promise<Course[]>;
  getCoursesByPersona(persona: string): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  getCoursesByTags(tags: string[]): Promise<Course[]>;

  // User progress methods
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserProgressByUser(userId: number): Promise<UserProgress[]>;
  updateUserProgress(id: number, progress: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // Learning strategies methods
  createLearningStrategy(strategy: InsertLearningStrategy): Promise<LearningStrategy>;
  getLearningStrategies(): Promise<LearningStrategy[]>;
  getLearningStrategiesByPersona(persona: string): Promise<LearningStrategy[]>;
  getLearningStrategyById(id: number): Promise<LearningStrategy | undefined>;

  // L&D Dashboard methods
  getPersonaDistributionByDepartment(): Promise<Record<string, Record<string, number>>>;
  getLearningActivityTrends(): Promise<Record<string, number[]>>;
  getUserActivity(): Promise<Record<string, any>[]>;
}

export class MemStorage implements IStorage {
  // Storage maps for each entity
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private quizResponses: Map<number, QuizResponse>;
  private userProgress: Map<number, UserProgress>;
  private learningStrategies: Map<number, LearningStrategy>;
  
  // ID counters
  private userIdCounter: number;
  private courseIdCounter: number;
  private quizResponseIdCounter: number;
  private userProgressIdCounter: number;
  private learningStrategyIdCounter: number;

  // Session store
  sessionStore: session.Store;

  constructor() {
    // Initialize storage maps
    this.users = new Map();
    this.courses = new Map();
    this.quizResponses = new Map();
    this.userProgress = new Map();
    this.learningStrategies = new Map();
    
    // Initialize ID counters
    this.userIdCounter = 1;
    this.courseIdCounter = 1;
    this.quizResponseIdCounter = 1;
    this.userProgressIdCounter = 1;
    this.learningStrategyIdCounter = 1;

    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours in milliseconds
    });

    // Add some initial data for development
    this.initDemoData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      streakCount: 0, 
      completedCourses: 0, 
      progress: 0,
      lastActive: now,
      persona: null,
      department: insertUser.department || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Quiz methods
  async saveQuizResponse(quizResponse: InsertQuizResponse): Promise<QuizResponse> {
    const id = this.quizResponseIdCounter++;
    const response: QuizResponse = { ...quizResponse, id };
    this.quizResponses.set(id, response);

    // Also update user persona if quiz result present
    if (quizResponse.result) {
      const user = await this.getUser(quizResponse.userId);
      if (user) {
        await this.updateUser(user.id, { persona: quizResponse.result });
      }
    }

    return response;
  }

  async getQuizResponsesByUser(userId: number): Promise<QuizResponse[]> {
    return Array.from(this.quizResponses.values())
      .filter(response => response.userId === userId)
      .sort((a, b) => {
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      });
  }

  async getLatestQuizResponse(userId: number): Promise<QuizResponse | undefined> {
    const responses = await this.getQuizResponsesByUser(userId);
    return responses.length > 0 ? responses[0] : undefined;
  }

  // Course methods
  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const newCourse: Course = { 
      ...course, 
      id,
      imageUrl: course.imageUrl || null,
      provider: course.provider || null,
      tags: course.tags || null,
      suitablePersonas: course.suitablePersonas || null,
      difficulty: course.difficulty || null,
      duration: course.duration || null
    };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCoursesByPersona(persona: string): Promise<Course[]> {
    return Array.from(this.courses.values())
      .filter(course => course.suitablePersonas && course.suitablePersonas.includes(persona));
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCoursesByTags(tags: string[]): Promise<Course[]> {
    return Array.from(this.courses.values())
      .filter(course => {
        if (!course.tags) return false;
        return tags.some(tag => course.tags?.includes(tag));
      });
  }

  // User progress methods
  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = this.userProgressIdCounter++;
    const userProgress: UserProgress = { 
      ...progress, 
      id, 
      progress: 0, 
      completed: false,
      completedAt: null 
    };
    this.userProgress.set(id, userProgress);
    return userProgress;
  }

  async getUserProgressByUser(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId);
  }

  async updateUserProgress(id: number, progressData: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;

    const updatedProgress = { ...progress, ...progressData };
    this.userProgress.set(id, updatedProgress);

    // If course was completed, also update user's completed courses count
    if (progressData.completed && !progress.completed) {
      const user = await this.getUser(progress.userId);
      if (user) {
        await this.updateUser(user.id, { 
          completedCourses: (user.completedCourses || 0) + 1 
        });
      }
    }

    return updatedProgress;
  }

  // Learning strategies methods
  async createLearningStrategy(strategy: InsertLearningStrategy): Promise<LearningStrategy> {
    const id = this.learningStrategyIdCounter++;
    const newStrategy: LearningStrategy = { 
      ...strategy, 
      id,
      suitablePersonas: strategy.suitablePersonas || null 
    };
    this.learningStrategies.set(id, newStrategy);
    return newStrategy;
  }

  async getLearningStrategies(): Promise<LearningStrategy[]> {
    return Array.from(this.learningStrategies.values());
  }

  async getLearningStrategiesByPersona(persona: string): Promise<LearningStrategy[]> {
    return Array.from(this.learningStrategies.values())
      .filter(strategy => strategy.suitablePersonas && strategy.suitablePersonas.includes(persona));
  }

  async getLearningStrategyById(id: number): Promise<LearningStrategy | undefined> {
    return this.learningStrategies.get(id);
  }

  // L&D Dashboard methods
  async getPersonaDistributionByDepartment(): Promise<Record<string, Record<string, number>>> {
    const result: Record<string, Record<string, number>> = {};
    
    // Group users by department and count personas within each
    Array.from(this.users.values()).forEach(user => {
      if (!user.department || !user.persona) return;
      
      if (!result[user.department]) {
        result[user.department] = {};
      }
      
      if (!result[user.department][user.persona]) {
        result[user.department][user.persona] = 0;
      }
      
      result[user.department][user.persona]++;
    });
    
    return result;
  }

  async getLearningActivityTrends(): Promise<Record<string, number[]>> {
    // This would normally aggregate activity over time periods
    // For demo, we'll return dummy data
    return {
      'Explorer': [30, 35, 38, 40, 42, 45],
      'Connector': [25, 28, 30, 33, 35, 38],
      'Thinker': [20, 22, 25, 28, 30, 31],
      'Creator': [15, 18, 20, 24, 26, 29],
      'Synthesizer': [10, 14, 18, 20, 22, 25]
    };
  }

  async getUserActivity(): Promise<Record<string, any>[]> {
    // Return recent user activity
    const activities: Record<string, any>[] = [];
    
    // Convert all user progress entries to activity items
    Array.from(this.userProgress.values()).forEach(progress => {
      const user = this.users.get(progress.userId);
      const course = this.courses.get(progress.courseId);
      
      if (user && course) {
        activities.push({
          userId: user.id,
          userName: user.name,
          userDepartment: user.department,
          courseTitle: course.title,
          activityType: progress.completed ? 'completed' : 'started',
          timestamp: progress.completed ? progress.completedAt : progress.startedAt
        });
      }
    });
    
    return activities.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA; // Sort descending (newest first)
    });
  }

  // Initialize some demo data for development
  private initDemoData() {
    // Sample courses
    const sampleCourses = [
      // LearnPersona original courses
      {
        title: "Critical Thinking Masterclass",
        description: "Develop analytical thinking skills through systematic problem-solving methods and logical reasoning frameworks.",
        url: "https://example.com/critical-thinking",
        imageUrl: null,
        provider: "ThinkWell Academy",
        tags: ["critical thinking", "logic", "analysis"],
        suitablePersonas: ["Visual Learner", "Reading/Writing Learner"],
        difficulty: "Intermediate",
        duration: "8 weeks"
      },
      {
        title: "Effective Communication Strategies",
        description: "Build skills in articulating ideas, facilitating discussions, and navigating diverse communication contexts.",
        url: "https://example.com/communication",
        imageUrl: null,
        provider: "ThinkWell Academy",
        tags: ["communication", "facilitation", "networking"],
        suitablePersonas: ["Auditory Learner", "Kinesthetic Learner"],
        difficulty: "Beginner",
        duration: "6 weeks"
      },
      
      // Coursera courses
      {
        title: "Collaborative Innovation Workshop",
        description: "Learn to leverage group dynamics and collaborative techniques to generate innovative solutions to complex problems.",
        url: "https://coursera.org/collaborative-innovation",
        imageUrl: null,
        provider: "Coursera",
        tags: ["collaboration", "innovation", "teamwork"],
        suitablePersonas: ["Kinesthetic Learner", "Auditory Learner"],
        difficulty: "Beginner",
        duration: "4 weeks"
      },
      {
        title: "Design Thinking Process",
        description: "Master the design thinking methodology through hands-on exercises and real-world applications.",
        url: "https://coursera.org/design-thinking",
        imageUrl: null,
        provider: "Coursera",
        tags: ["design thinking", "creativity", "problem-solving"],
        suitablePersonas: ["Visual Learner", "Kinesthetic Learner"],
        difficulty: "Intermediate",
        duration: "6 weeks"
      },
      
      // edX courses
      {
        title: "Systems Thinking Fundamentals",
        description: "Understand complex systems and learn methodologies for analyzing and improving them in business contexts.",
        url: "https://edx.org/systems-thinking",
        imageUrl: null,
        provider: "edX",
        tags: ["systems thinking", "analysis", "business"],
        suitablePersonas: ["Reading/Writing Learner", "Visual Learner"],
        difficulty: "Advanced",
        duration: "5 weeks"
      },
      {
        title: "Data Visualization Masterclass",
        description: "Learn to create compelling visual representations of data that drive understanding and decision-making.",
        url: "https://edx.org/data-visualization",
        imageUrl: null,
        provider: "edX",
        tags: ["data", "visualization", "analytics"],
        suitablePersonas: ["Visual Learner"],
        difficulty: "Intermediate",
        duration: "7 weeks"
      },
      
      // LinkedIn Learning courses
      {
        title: "Agile Project Management",
        description: "Master the principles and practices of Agile methodology for more efficient project delivery.",
        url: "https://linkedin-learning.com/agile-project-management",
        imageUrl: null,
        provider: "LinkedIn Learning",
        tags: ["agile", "project management", "scrum"],
        suitablePersonas: ["Kinesthetic Learner", "Reading/Writing Learner"],
        difficulty: "Intermediate",
        duration: "3 weeks"
      },
      {
        title: "Emotional Intelligence at Work",
        description: "Develop your emotional intelligence to improve workplace relationships and leadership effectiveness.",
        url: "https://linkedin-learning.com/emotional-intelligence",
        imageUrl: null,
        provider: "LinkedIn Learning",
        tags: ["emotional intelligence", "leadership", "soft skills"],
        suitablePersonas: ["Auditory Learner", "Kinesthetic Learner"],
        difficulty: "Beginner",
        duration: "2 weeks"
      }
    ];

    // Add courses
    sampleCourses.forEach(course => {
      this.createCourse(course);
    });

    // Sample learning strategies
    const sampleStrategies = [
      {
        title: "Mind Mapping",
        description: "A visual technique for organizing information and seeing connections between concepts.",
        content: "1. Start with a central idea or topic in the middle of a blank page\n2. Draw branches from the center with key concepts related to the main topic\n3. Add smaller branches with related details\n4. Use colors, images, and symbols to enhance memory\n5. Connect related ideas with lines or arrows\n6. Review and revise your mind map as your understanding evolves",
        suitablePersonas: ["Visual Learner"],
        type: "Organization"
      },
      {
        title: "The Feynman Technique",
        description: "A method for deepening understanding by explaining concepts in simple terms.",
        content: "1. Choose a concept or topic you want to learn\n2. Explain it in simple language as if teaching a child\n3. Identify gaps in your explanation or understanding\n4. Review your source material to fill those gaps\n5. Simplify your explanation further, using analogies and plain language\n6. Repeat until you can explain the concept clearly and completely",
        suitablePersonas: ["Auditory Learner", "Reading/Writing Learner"],
        type: "Comprehension"
      },
      {
        title: "Spaced Repetition",
        description: "A technique for reviewing information at optimal intervals to improve long-term retention.",
        content: "1. Learn the initial material thoroughly\n2. Review after 1 day\n3. Review again after 3 days\n4. Then after 7 days\n5. Then after 14 days\n6. Then after 30 days\n7. Use flashcards or spaced repetition software to automate this process\n8. Focus more time on difficult items and less on well-known items",
        suitablePersonas: ["Reading/Writing Learner"],
        type: "Retention"
      },
      {
        title: "Project-Based Learning",
        description: "Learning through the process of creating something tangible that solves a problem or meets a need.",
        content: "1. Identify a real-world problem or need that interests you\n2. Research and gather information about the problem domain\n3. Design a project that addresses the problem\n4. Break the project into manageable steps\n5. Learn the necessary skills as you implement each step\n6. Reflect on challenges and solutions throughout the process\n7. Share your final project and gather feedback\n8. Document what you learned for future reference",
        suitablePersonas: ["Kinesthetic Learner"],
        type: "Application"
      },
      {
        title: "Collaborative Learning Circles",
        description: "A method for learning through regular discussion and knowledge sharing with peers.",
        content: "1. Form a group of 4-7 people with similar learning interests\n2. Set regular meeting times (weekly or bi-weekly)\n3. Establish clear goals and expectations for the group\n4. Rotate responsibility for facilitating discussions\n5. Share resources and insights between meetings\n6. Use structured formats like book discussions or topic presentations\n7. Provide constructive feedback to each other\n8. Document key insights from each meeting",
        suitablePersonas: ["Auditory Learner", "Kinesthetic Learner"],
        type: "Social Learning"
      },
      {
        title: "Comparative Analysis",
        description: "A technique for deepening understanding by systematically comparing related concepts or approaches.",
        content: "1. Identify two or more related concepts, theories, or approaches\n2. Create a structured framework for comparison (table, matrix, etc.)\n3. Identify key dimensions or criteria for comparison\n4. Analyze similarities and differences across each dimension\n5. Consider contexts where each approach is most effective\n6. Synthesize insights about underlying principles\n7. Apply this comparative understanding to new situations",
        suitablePersonas: ["Reading/Writing Learner", "Visual Learner"],
        type: "Analysis"
      },
      {
        title: "Exploratory Learning Journeys",
        description: "A method for expanding knowledge through structured but open-ended exploration of related topics.",
        content: "1. Start with a central topic of interest\n2. Identify 3-5 related subtopics or questions\n3. Set a time limit for initial exploration (e.g., 2 hours per subtopic)\n4. Gather diverse resources on each subtopic\n5. Take notes focusing on surprising discoveries and connections\n6. Create a visual map of how the topics interconnect\n7. Identify the most promising areas for deeper exploration\n8. Share your discoveries with others to gain new perspectives",
        suitablePersonas: ["Visual Learner", "Kinesthetic Learner"],
        type: "Discovery"
      },
      {
        title: "Prototyping and Iteration",
        description: "A hands-on approach to learning through creating quick versions, gathering feedback, and refining.",
        content: "1. Start with a clear goal or problem to solve\n2. Create a simple, quick version (prototype) of your solution\n3. Test the prototype with real users or situations\n4. Gather specific feedback about what works and what doesn't\n5. Identify the most important improvements to make\n6. Create an improved version based on feedback\n7. Repeat the testing and iteration process\n8. Document lessons learned throughout the process",
        suitablePersonas: ["Kinesthetic Learner"],
        type: "Application"
      }
    ];

    // Add learning strategies
    sampleStrategies.forEach(strategy => {
      this.createLearningStrategy(strategy);
    });
  }
}

export const storage = new MemStorage();
