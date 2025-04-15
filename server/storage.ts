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
    const newCourse: Course = { ...course, id };
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
    const newStrategy: LearningStrategy = { ...strategy, id };
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
    // Add sample data if needed during development
  }
}

export const storage = new MemStorage();
