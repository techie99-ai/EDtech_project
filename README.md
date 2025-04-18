# 📚 LearnPersona: AI-Powered Persona-Based Learning Recommendation System

## 🚀 Project Overview

LearnPersona revolutionizes corporate learning by delivering personalized, AI-powered learning experiences that adapt to each employee's unique learning style, goals, and engagement patterns. By analyzing behavioral data, educational background, job roles, and learning frequency, our system generates dynamic learner personas and provides tailored content recommendations to enhance upskilling and professional development.

The platform serves both individual learners and L&D (Learning & Development) professionals through intuitive dashboards and interfaces that can either operate independently or integrate seamlessly with existing Learning Management Systems (LMS).


## 🎯 Key Goals

- **Personalize Learning** - Match content to individual learning styles using data-driven employee personas
- **Optimize Engagement** - Deliver the right content to the right learner at the right time
- **Enhance L&D Insights** - Empower L&D professionals with powerful analytics and assignment tools
- **Improve Outcomes** - Track learning progress across personas and departments
- **Simplify Administration** - Streamline content creation and distribution for different learning styles

## 🧠 Core Features

| Module | Description |
|--------|-------------|
| **Persona Generation** | Uses clustering techniques (K-Means, silhouette scoring) on survey + behavioral data to classify learners into distinct personas |
| **Recommendation Engine** | Hybrid system combining content-based and persona-based filtering for tailored learning paths |
| **Learner Dashboard** | Personalized interface showing skill progress, recommendations, learning streaks, and gamification elements |
| **L&D Dashboard** | Comprehensive analytics of team learning, content assignment tools, and cross-department performance comparisons |
| **Content Creation Studio** | Tools to create targeted learning content optimized for different persona types |
| **Gamification Layer** | Leaderboards, streaks, and badges to drive engagement |
| **Feedback Loop** | User input mechanisms on content relevance, improving the model over time |
| **LMS Integration** | Scalable backend that can plug into existing systems or run independently |

## 👤 Learning Personas

Our system currently identifies and supports four primary learning personas:

| Persona Type | Characteristics | Optimal Content |
|--------------|-----------------|-----------------|
| **Visual Learner** | Processes information through images, videos, diagrams | Video tutorials, infographics, visual presentations |
| **Auditory Learner** | Learns best through listening, discussion | Podcasts, audio lessons, discussion groups |
| **Kinesthetic Learner** | Prefers hands-on experiences, interactive learning | Interactive challenges, simulations, practice exercises |
| **Reading/Writing Learner** | Favors text-based information and note-taking | Articles, documentation, written assignments |

## 🏗️ Tech Stack

| Layer | Technology Used |
|-------|----------------|
| **Frontend** | React / Next.js |
| **Backend** | Node.js / FastAPI |
| **ML Model** | Python (scikit-learn, pandas, numpy) |
| **Visualization** | Chart.js, Recharts, D3.js |
| **Database** | PostgreSQL / MongoDB |
| **Hosting** | Vercel (Frontend), Render/Heroku (Backend) |

## 🔍 How It Works

1. **Data Collection**
   - Initial survey data
   - Behavioral learning logs
   - Content interaction patterns
   - Career progression data

2. **Persona Clustering**
   - Data cleaning and encoding (One-Hot, TF-IDF)
   - Processing via clustering algorithms
   - Feature analysis (learning frequency, platform preference, education, domain)

3. **Recommendation Engine**
   - Maps personas to optimal content types
   - Builds hybrid recommendation model
   - Continuously refines suggestions based on feedback

4. **Interface Experience**
   - Personalized dashboards for learners
   - Administrative tools for L&D professionals
   - Comprehensive metrics visualization

5. **Continuous Improvement**
   - A/B testing methodologies
   - User feedback integration
   - Model precision refinement

## 💻 Getting Started

### Prerequisites

```
Node.js >= 16.x
Python >= 3.9
PostgreSQL >= 13.0
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/learnpersona.git
cd learnpersona
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
pip install -r requirements.txt
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Start development servers
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
python app.py
```

## 🛠️ Project Status

- ✅ Data pipeline created
- ✅ Survey round 1 completed
- ✅ Clustering-based persona modeling (v1) built
- ✅ Dashboard design mockups completed
- 🔄 Recommendation engine in testing phase
- 🔜 Interface prototype to be released by May 2025

## 🧪 Future Plans

- Integrate generative AI for natural language feedback interpretation
- Extend to voice-based L&D interaction assistant
- Launch beta testing with corporate partners
- Build adaptive learning tracks based on real-time behavior

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Special thanks to all contributors and beta testers
- Inspired by advancements in personalized learning and AI recommendation systems
- Built with ❤️ by the LearnPersona Team
