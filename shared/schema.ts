import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define persona types
export const personaTypes = [
  "The Explorer",
  "The Connector",
  "The Synthesizer",
  "The Thinker",
  "The Creator"
] as const;

export const departmentTypes = [
  "Marketing",
  "Engineering",
  "Sales",
  "HR",
  "Finance",
  "Product",
  "Leadership",
  "Operations"
] as const;

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  department: text("department"),
  persona: text("persona"),
  streakCount: integer("streak_count").default(0),
  lastActive: timestamp("last_active"),
  completedCourses: integer("completed_courses").default(0),
  progress: integer("progress").default(0)
});

// Persona quiz table
export const quizResponses = pgTable("quiz_responses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  responses: json("responses").notNull(),
  result: text("result").notNull(),
  completedAt: timestamp("completed_at").notNull()
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  provider: text("provider"),
  tags: text("tags").array(),
  suitablePersonas: text("suitable_personas").array(),
  difficulty: text("difficulty"),
  duration: text("duration")
});

// User progress table
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  progress: integer("progress").default(0),
  completed: boolean("completed").default(false),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at")
});

// Learning strategy table
export const learningStrategies = pgTable("learning_strategies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  suitablePersonas: text("suitable_personas").array(),
  type: text("type").notNull()
});

// Create schemas for insertions
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  department: true
});

export const insertQuizResponseSchema = createInsertSchema(quizResponses).pick({
  userId: true,
  responses: true,
  result: true,
  completedAt: true
});

export const insertCourseSchema = createInsertSchema(courses);

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  courseId: true,
  startedAt: true
});

export const insertLearningStrategySchema = createInsertSchema(learningStrategies);

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuizResponse = z.infer<typeof insertQuizResponseSchema>;
export type QuizResponse = typeof quizResponses.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertLearningStrategy = z.infer<typeof insertLearningStrategySchema>;
export type LearningStrategy = typeof learningStrategies.$inferSelect;
