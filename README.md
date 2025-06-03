# Pathzy - AI Course Recommender

An intelligent AI-powered platform that helps learners discover personalized course recommendations through natural language conversations. Built with Next.js 14 and powered by Google's Gemini AI.

## 🚀 Features

### 🤖 AI-Powered Course Discovery
- **Natural Language Chat Interface** - Ask about courses in plain English
- **Intelligent Course Matching** - AI analyzes your query to recommend relevant courses
- **Sample Prompts** - Get started with suggested queries like "I want to learn web development with React"

### 📚 Comprehensive Course Management
- **Course Cards** with detailed information (level, duration, provider)
- **Save/Bookmark System** - Keep track of courses you're interested in
- **Course Details** - AI-generated detailed course information including prerequisites and learning outcomes
- **Direct Course Links** - AI-generated realistic URLs to course providers

### 📊 Personalized Dashboard
- **Saved Courses Management** - View and organize your bookmarked courses
- **Learning Analytics** - Track courses by level, provider, and duration
- **Advanced Filtering** - Search and filter courses by multiple criteria
- **Learning Insights** - AI-powered analysis of your course selection

### 🎯 Smart Features
- **Course Insights** - AI analysis of how courses complement each other
- **Learning Path Recommendations** - Understand course progression and career opportunities
- **Provider Integration** - Support for major platforms (Coursera, Udemy, edX, LinkedIn Learning, Pluralsight)
- **Responsive Design** - Optimized for desktop and mobile devices

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/) for course recommendations
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom gradients
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with persistence
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **TypeScript**: Full type safety throughout
- **Package Manager**: pnpm

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Google Gemini API key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/pathzy-ai-course-recommender.git
cd pathzy-ai-course-recommender
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Add your environment variables:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server:**
```bash
pnpm dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── chat/               # Course recommendation endpoint
│   │   ├── course-details/     # Detailed course information
│   │   ├── course-url/         # Course URL generation
│   │   └── insights/           # AI learning path analysis
│   ├── dashboard/              # Dashboard page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                   # React components
│   ├── ui/                     # shadcn/ui base components
│   ├── chat-interface.tsx      # Main chat interface
│   ├── course-card.tsx         # Individual course display
│   ├── course-list.tsx         # Course grid display
│   ├── course-filters.tsx      # Filtering functionality
│   ├── course-suggestion.tsx   # AI insights dialog
│   ├── dashboard.tsx           # Dashboard analytics
│   ├── hero-section.tsx        # Landing page hero
│   └── nav-bar.tsx             # Navigation component
└── lib/                        # Utilities and configuration
    ├── store/                  # Zustand state management
    │   └── savedCoursesStore.ts # Course bookmarking
    └── gemini.ts               # AI integration
```

## 🔧 Key Components

### [`ChatInterface`](src/components/chat-interface.tsx)
- Main conversational interface for course discovery
- Handles user queries and AI responses
- Manages course recommendations and feedback

### [`CourseCard`](src/components/course-card.tsx)
- Displays individual course information
- Bookmark/save functionality
- AI-generated course details and URLs
- Social sharing capabilities

### [`Dashboard`](src/components/dashboard.tsx)
- Analytics and saved course management
- Advanced filtering and search
- Learning statistics and insights

### [`CourseSuggestion`](src/components/course-suggestion.tsx)
- AI-powered learning path analysis
- Course relationship insights
- Personalized recommendations

## 🌐 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/chat` | Generate course recommendations from user queries |
| `/api/course-details` | Get detailed course information using AI |
| `/api/course-url` | Generate realistic course URLs |
| `/api/insights` | Analyze course selections and provide learning insights |

## 🎨 Features in Detail

### AI-Powered Recommendations
The platform uses Google's Gemini AI to:
- Parse natural language queries
- Generate relevant course suggestions
- Create detailed course descriptions
- Provide learning path analysis

### Course Management
- **Bookmarking System**: Save courses with persistent storage
- **Detailed Information**: AI-generated course details including prerequisites
- **Provider Integration**: Support for major learning platforms
- **Smart Filtering**: Search by level, provider, duration, and more

### Learning Analytics
- **Progress Tracking**: Monitor saved courses by category
- **Provider Statistics**: See which platforms you prefer
- **Level Distribution**: Track learning progression

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Deploy on Vercel:**
   - Import your repository on [Vercel](https://vercel.com)
   - Add environment variables
   - Deploy automatically

### Environment Variables for Production

```env
GEMINI_API_KEY=your_production_gemini_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # TypeScript type checking
```

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Course progress tracking
- [ ] Social features and course sharing
- [ ] Integration with more learning platforms
- [ ] Advanced recommendation algorithms
- [ ] Course reviews and ratings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powering intelligent recommendations
- **Next.js team** for the amazing framework
- **shadcn** for the beautiful UI components
- **Vercel** for seamless deployment

---

**Pathzy AI Course Recommender** - Discover your next learning adventure with the power of AI! 🎓✨

*Ask, Discover, Learn - Your personalized course journey starts here.*
