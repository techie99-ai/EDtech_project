import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertQuizResponseSchema } from "@shared/schema";

// Define middleware to check authentication status
const requireAuth = (req: Request, res: Response, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // API routes
  // Quiz routes
  app.post("/api/quiz/submit", requireAuth, async (req, res) => {
    try {
      const validatedData = insertQuizResponseSchema.parse({
        ...req.body,
        userId: req.user?.id,
        completedAt: new Date()
      });
      
      const response = await storage.saveQuizResponse(validatedData);
      res.status(201).json(response);
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(400).json({ error: "Invalid quiz submission" });
    }
  });

  app.get("/api/quiz/history", requireAuth, async (req, res) => {
    try {
      const responses = await storage.getQuizResponsesByUser(req.user!.id);
      res.json(responses);
    } catch (error) {
      console.error("Error fetching quiz history:", error);
      res.status(500).json({ error: "Failed to fetch quiz history" });
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/persona/:persona", requireAuth, async (req, res) => {
    try {
      const persona = req.params.persona;
      const courses = await storage.getCoursesByPersona(persona);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses by persona:", error);
      res.status(500).json({ error: "Failed to fetch courses by persona" });
    }
  });

  app.get("/api/courses/recommended", requireAuth, async (req, res) => {
    try {
      if (!req.user!.persona) {
        return res.status(400).json({ error: "User has no persona defined" });
      }
      
      const courses = await storage.getCoursesByPersona(req.user!.persona);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
      res.status(500).json({ error: "Failed to fetch recommended courses" });
    }
  });

  // Learning strategies routes
  app.get("/api/strategies", async (req, res) => {
    try {
      const strategies = await storage.getLearningStrategies();
      res.json(strategies);
    } catch (error) {
      console.error("Error fetching strategies:", error);
      res.status(500).json({ error: "Failed to fetch learning strategies" });
    }
  });

  app.get("/api/strategies/persona/:persona", requireAuth, async (req, res) => {
    try {
      const persona = req.params.persona;
      const strategies = await storage.getLearningStrategiesByPersona(persona);
      res.json(strategies);
    } catch (error) {
      console.error("Error fetching strategies by persona:", error);
      res.status(500).json({ error: "Failed to fetch strategies by persona" });
    }
  });

  app.get("/api/strategies/recommended", requireAuth, async (req, res) => {
    try {
      if (!req.user!.persona) {
        return res.status(400).json({ error: "User has no persona defined" });
      }
      
      const strategies = await storage.getLearningStrategiesByPersona(req.user!.persona);
      res.json(strategies);
    } catch (error) {
      console.error("Error fetching recommended strategies:", error);
      res.status(500).json({ error: "Failed to fetch recommended strategies" });
    }
  });

  // User progress routes
  app.post("/api/progress/start", requireAuth, async (req, res) => {
    try {
      const courseId = parseInt(req.body.courseId, 10);
      if (isNaN(courseId)) {
        return res.status(400).json({ error: "Invalid course ID" });
      }
      
      const course = await storage.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      const progress = await storage.createUserProgress({
        userId: req.user!.id,
        courseId,
        startedAt: new Date()
      });
      
      res.status(201).json(progress);
    } catch (error) {
      console.error("Error starting course:", error);
      res.status(500).json({ error: "Failed to start course" });
    }
  });

  app.put("/api/progress/:id", requireAuth, async (req, res) => {
    try {
      const progressId = parseInt(req.params.id, 10);
      if (isNaN(progressId)) {
        return res.status(400).json({ error: "Invalid progress ID" });
      }
      
      const progressUpdate = req.body;
      
      // If marking as completed, add completedAt timestamp
      if (progressUpdate.completed) {
        progressUpdate.completedAt = new Date();
      }
      
      const updatedProgress = await storage.updateUserProgress(progressId, progressUpdate);
      
      if (!updatedProgress) {
        return res.status(404).json({ error: "Progress record not found" });
      }
      
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  app.get("/api/progress", requireAuth, async (req, res) => {
    try {
      const progress = await storage.getUserProgressByUser(req.user!.id);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });

  // L&D Professional Dashboard routes
  app.get("/api/dashboard/personas", requireAuth, async (req, res) => {
    try {
      // Would normally check for L&D role here
      const distribution = await storage.getPersonaDistributionByDepartment();
      res.json(distribution);
    } catch (error) {
      console.error("Error fetching persona distribution:", error);
      res.status(500).json({ error: "Failed to fetch persona distribution" });
    }
  });

  app.get("/api/dashboard/trends", requireAuth, async (req, res) => {
    try {
      // Would normally check for L&D role here
      const trends = await storage.getLearningActivityTrends();
      res.json(trends);
    } catch (error) {
      console.error("Error fetching learning trends:", error);
      res.status(500).json({ error: "Failed to fetch learning trends" });
    }
  });

  app.get("/api/dashboard/activity", requireAuth, async (req, res) => {
    try {
      // Would normally check for L&D role here
      const activity = await storage.getUserActivity();
      res.json(activity);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({ error: "Failed to fetch user activity" });
    }
  });

  // Create the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
