# Educational Fees Management System

A comprehensive web application for managing educational institution fees, student records, and payment tracking.

## Features

- **Student Management**: Complete student records with personal, academic, and contact information
- **Fee Structure Management**: Configure fee structures for different classes
- **Payment Tracking**: Record and track fee payments with multiple payment methods
- **Reports & Analytics**: Generate comprehensive reports and analytics
- **User Authentication**: Secure login system with role-based access
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **State Management**: React Query (TanStack Query)
- **Build Tool**: Vite

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Database Setup

1. Create a new Supabase project
2. Run the SQL queries provided in the setup documentation to create the database schema
3. Update the Supabase configuration in `src/integrations/supabase/client.ts`

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Add Students**: Navigate to Students section to add student records
3. **Configure Fees**: Set up fee structures for different classes
4. **Record Payments**: Track fee payments and generate receipts
5. **Generate Reports**: View comprehensive reports and analytics

## Database Schema

The system uses the following main tables:
- `users` - User accounts and authentication
- `students` - Student records and information
- `fee_structures` - Fee configuration by class
- `payments` - Payment transactions and receipts
- `discount_types` - Available discount categories

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.