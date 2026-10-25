# GLASS UI Dashboard

**Your work, in a clearer light.**

A visually striking, highly functional digital workspace built with glassmorphism design principles. This dashboard provides a unified interface for managing projects, priorities, tasks, team activity, and weekly progress through translucent, layered surfaces that reveal an atmospheric environment beneath.

![Glass UI Dashboard](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Functionality
- **Project Management** - Create, edit, filter, and track projects with status updates and progress indicators
- **Task Management** - Full task lifecycle with priorities, assignments, and completion tracking
- **Team Collaboration** - View team members, their workloads, and assigned tasks
- **Dashboard Overview** - Real-time metrics, active projects, recent tasks, and activity feed
- **Insights & Analytics** - Visual charts showing task distribution, project progress, and team workload
- **Global Search** - Quick search across projects and tasks (Ctrl/Cmd + K)
- **Notifications** - In-app notification system with read/unread states
- **Interactive Glass Lab** - Customize glass blur, opacity, accent colors, and atmosphere

### Design System
- **Three-level glass hierarchy** - Ambient, Primary, and Floating glass surfaces
- **Atmospheric background** - Animated gradient orbs and color fields
- **Responsive layouts** - Optimized for mobile, tablet, and desktop
- **Accessibility-first** - Keyboard navigation, focus indicators, reduced motion support
- **Performance optimized** - Efficient blur effects with graceful fallbacks

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd glass-ui-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 📁 Project Structure

```
src/
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
├── index.css                    # Global styles and design system
│
├── components/
│   ├── layout/                  # Application shell (Header, Sidebar, Navigation)
│   ├── dashboard/               # Overview page components
│   ├── projects/                # Project management views
│   ├── tasks/                   # Task management views
│   ├── team/                    # Team directory and details
│   ├── insights/                # Analytics and charts
│   ├── settings/                # Glass Lab and preferences
│   └── ui/                      # Reusable UI components
│
├── lib/
│   └── store.tsx                # State management with Context API
│
└── data/
    └── sampleData.ts            # Sample projects, tasks, and team data
```

## 🎨 Design System

### Glass Surface Levels

**Level 1: Ambient Glass**
- Subtle translucency for background panels
- Light backdrop blur (60% of base blur)
- Thin borders with minimal shadow

**Level 2: Primary Glass**
- Main content containers and cards
- Standard backdrop blur
- Visible borders and subtle shadows
- Gradient highlights for depth

**Level 3: Floating Glass**
- Modals, dialogs, and overlays
- Heavy backdrop blur (150% of base blur)
- Bright edge highlights
- Strong shadows for separation

### Color Palette

- **Midnight Navy** `#0B1024` - Primary background
- **Deep Indigo** `#171A3A` - Secondary background
- **Electric Violet** `#7765F7` - Primary accent
- **Luminous Cyan** `#65DDF2` - Secondary accent
- **Aqua Mint** `#87E8D0` - Success/positive states
- **Soft Lavender** `#B6AEFF` - Tertiary accent
- **Cloud White** `#F5F7FF` - Primary text
- **Muted Blue Grey** `#AAB4D0` - Secondary text

### Customization

Use the **Interactive Glass Lab** (Settings → Glass Lab) to adjust:
- Glass blur intensity (4px - 32px)
- Surface opacity (3% - 25%)
- Accent color (5 presets)
- Background atmosphere

Settings are persisted in localStorage.

## 🛠 Tech Stack

- **React 18.2** - UI framework
- **TypeScript 5** - Type safety
- **Vite 6** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion 11** - Animations
- **Lucide React** - Icon library
- **date-fns** - Date formatting
- **uuid** - Unique ID generation

## 📱 Responsive Design

The dashboard adapts to different screen sizes:

- **Mobile** (< 768px): Bottom navigation, stacked layouts, simplified backgrounds
- **Tablet** (768px - 1024px): Collapsible sidebar, balanced grid layouts
- **Desktop** (> 1024px): Full sidebar, spacious grids, animated backgrounds

## ♿ Accessibility

- Semantic HTML with proper heading hierarchy
- Skip-to-content link
- Keyboard navigation for all interactive elements
- Visible focus indicators
- ARIA labels for icon-only buttons
- Reduced motion support (`prefers-reduced-motion`)
- High contrast text over glass surfaces
- Screen reader friendly status updates

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note:** Browsers without `backdrop-filter` support will see increased opacity fallbacks while maintaining the glass aesthetic.

## 📊 Demo Data

The application includes sample data for demonstration:
- 6 projects with various statuses
- 19 tasks across different priorities
- 6 team members with roles
- Activity feed and notifications

All data is stored locally and can be reset via Settings → Reset Demo Data.

## 🔒 Data Privacy

- All data is stored in browser localStorage
- No external API calls or backend required
- No personal information is collected
- Demo data is clearly labeled as sample content

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript type checking
```

## 🎯 Key Interactions

### Keyboard Shortcuts
- `Ctrl/Cmd + K` - Open global search
- `Escape` - Close modals and search
- `Tab` - Navigate through interactive elements

### Project Management
- Click project cards to view details
- Use filters to search and sort projects
- Update project status directly from detail view
- Track progress through task completion

### Task Management
- Toggle between list and board views
- Filter by status, priority, project, or assignee
- Mark tasks complete/incomplete with one click
- Edit tasks inline or via modal

### Team View
- Click team members to see their workload
- View assigned tasks and active projects
- Track completion rates per member

## 🎨 Glassmorphism Principles

This dashboard implements glassmorphism through:

1. **Transparency** - Surfaces reveal the atmospheric background
2. **Blur** - Backdrop blur creates frosted glass effect
3. **Borders** - Subtle white borders define edges
4. **Light** - Gradient highlights simulate light refraction
5. **Depth** - Layered surfaces create spatial hierarchy
6. **Motion** - Gentle animations enhance the floating sensation

## 🐛 Known Limitations

- No real-time collaboration (frontend-only demo)
- No backend persistence (localStorage only)
- No user authentication
- No file uploads or attachments
- Charts use demo data calculations

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

Inspired by modern glassmorphism design trends and productivity tools like Linear, Notion, and Vercel Dashboard.

---

**Built with transparency, depth, and clarity in mind.**

For questions or feedback, please open an issue on the repository.
