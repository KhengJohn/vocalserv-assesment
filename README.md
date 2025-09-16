# Staff Directory Application

A comprehensive staff directory web application built for VocalServ's Frontend Developer Assessment. This application allows organizations to manage employees and grade levels with advanced filtering, search capabilities, and data persistence.


## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/KhengJohn/vocalserv-assesment
   cd assesment
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

   If you encounter dependency conflicts, use:
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`
   # or
   yarn install
   \`\`\`

If you encounter dependency conflicts, use:
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`
   
3. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`


## 🚀 Features

### Employee Management
- **CRUD Operations**: Create, read, update, and delete employee records
- **Comprehensive Employee Profiles**: Name, country, state, address, role, department, grade level, email, and phone
- **Employee Profile View**: Detailed view of individual employee information
- **Form Validation**: Client-side validation with error handling

### Grade Level System
- **Grade Level Management**: Create, edit, and delete organizational grade levels
- **Employee Assignment**: Assign employees to specific grade levels
- **Automatic Unassignment**: Safe deletion with automatic employee unassignment
- **Employee Count Tracking**: View how many employees are assigned to each grade level

### Advanced Search & Filtering
- **Multi-field Search**: Search across name, role, department, email, and location
- **Advanced Filters**: Filter by grade level, department, and country
- **Sorting Options**: Sort by name, role, department, country, or grade level
- **Active Filter Management**: Visual filter badges with individual removal options
- **Real-time Results**: Instant filtering and search results

### Data Management
- **Local Storage Persistence**: All data persists in browser localStorage
- **Import/Export**: Backup and restore data via JSON files
- **Data Validation**: Robust error handling and data integrity checks
- **Storage Monitoring**: Track localStorage usage and manage data efficiently
- **Automatic Backups**: Periodic data backups for data safety

### UI/UX Features
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Professional Styling**: Clean, corporate design with consistent branding
- **Loading States**: Skeleton loading for better user experience
- **Smooth Animations**: Subtle transitions and hover effects
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Error Handling**: Comprehensive error states and user feedback

## 🛠 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React useState/useEffect
- **Data Persistence**: Browser localStorage
- **API Integration**: World Cities API for location data


## 🎯 Usage Guide

### Getting Started
1. **Add Employees**: Click "Add Employee" to create your first employee record
2. **Create Grade Levels**: Use the "Grade Levels" tab to set up organizational levels
3. **Assign Grades**: Edit employees to assign them to specific grade levels
4. **Search & Filter**: Use the search bar and filters to find specific employees
5. **Manage Data**: Use the "Data Management" tab to backup or import data

### Key Features Walkthrough

#### Employee Management
- **Adding**: Fill out the comprehensive form with all required fields
- **Editing**: Click the edit button on any employee card
- **Viewing**: Click "View" for detailed employee profiles
- **Deleting**: Use the delete button with confirmation dialog

#### Grade Level System
- **Creating**: Add new grade levels with names and descriptions
- **Managing**: Edit existing levels or delete unused ones
- **Assignment**: Employees can be assigned during creation or editing

#### Advanced Filtering
- **Quick Search**: Type in the search bar for instant results
- **Advanced Filters**: Click "Filters" to access department, country, and grade filters
- **Sorting**: Choose sort criteria and direction
- **Clear Filters**: Remove individual filters or clear all at once

## 🏗 Project Structure

\`\`\`
staff-directory/
├── app/
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout with fonts
│   ├── loading.tsx          # Loading page
│   └── page.tsx             # Main application
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── data-management.tsx  # Data import/export functionality
│   ├── employee-form.tsx    # Employee creation/editing form
│   ├── employee-profile.tsx # Employee detail view
│   ├── grade-level-form.tsx # Grade level management form
│   └── loading-skeleton.tsx # Loading state components
├── lib/
│   ├── data-persistence.ts  # localStorage management utilities
│   └── utils.ts            # Utility functions
└── README.md
\`\`\`

## 🎨 Design System

### Color Palette
- **Primary**: Gray-based professional theme
- **Secondary**: Purple accents for interactive elements
- **Neutral**: Comprehensive gray scale for backgrounds and text
- **Semantic**: Success, warning, and error colors for feedback

### Typography
- **Headings**: Geist Sans with multiple weights
- **Body**: Geist Sans for consistency
- **Monospace**: Geist Mono for code elements

### Components
- **Cards**: Elevated surfaces with hover effects
- **Buttons**: Multiple variants with loading states
- **Forms**: Comprehensive validation and error handling
- **Modals**: Smooth animations with backdrop blur

## 🔧 API Integration

### World Cities API
- **Endpoint**: `https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json`
- **Usage**: Provides country and city data for employee location fields
- **Implementation**: Fetched on app initialization and cached for form usage

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices with progressive enhancement
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Adaptive UI**: Components adjust layout and functionality based on screen size
- **Touch Friendly**: Appropriate touch targets and gestures

## 🔒 Data Security & Privacy

- **Local Storage**: All data stored locally in browser
- **No External Database**: No personal data transmitted to external servers
- **Data Validation**: Input sanitization and validation
- **Error Handling**: Graceful error recovery and user feedback

## 🚀 Performance Optimizations

- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component for optimal loading
- **Lazy Loading**: Components loaded on demand
- **Caching**: Efficient data caching strategies
- **Bundle Size**: Optimized dependencies and tree shaking

## 🧪 Testing Considerations

### Manual Testing Checklist
- [ ] Employee CRUD operations
- [ ] Grade level management
- [ ] Search and filtering functionality
- [ ] Data persistence across browser sessions
- [ ] Responsive design on multiple devices
- [ ] Form validation and error handling
- [ ] Import/export functionality

## 🔮 Future Enhancements

- **Authentication**: User login and role-based access
- **Database Integration**: PostgreSQL or MongoDB backend
- **Advanced Reporting**: Analytics and employee reports
- **Bulk Operations**: Import/export CSV files
- **Photo Upload**: Employee profile pictures
- **Department Management**: Dedicated department system
- **Audit Trail**: Track changes and modifications

## 📞 Support

For questions or issues regarding this assessment project, please contact:
- **Developer**: John Idoko
- **Email**: idokojohn42@yahoo.com
- **Assessment**: VocalServ Frontend Developer Role

## 📄 License

This project was created as part of a technical assessment for VocalServ and is intended for evaluation purposes only.

