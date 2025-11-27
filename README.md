# PawTag India

**India's Smartest QR Pet Tag** - Never lose your furry friend again!

## Features

- **QR Code Technology** - Scan with any smartphone camera, no app needed
- **Instant Notifications** - SMS, Email, and WhatsApp alerts
- **GPS Location Tracking** - Know exactly where your pet was found
- **WhatsApp Integration** - India's favorite messaging app (key differentiator!)
- **Multi-language Support** - English and Hindi
- **Pet Health Profiles** - Medical info, allergies, vaccinations
- **Emergency Contacts** - Multiple contacts with one-tap calling
- **Lost Pet Alerts** - Mark pet as lost, notify finders instantly
- **Scan History** - View all scans with location and finder details

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Build:** Vite
- **Storage:** Local Storage (MVP), ready for backend integration

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Demo Account

- **Email:** demo@pawtag.in
- **Password:** demo123

## Project Structure

```
├── App.tsx              # Main application with all components
├── types.ts             # TypeScript interfaces
├── index.tsx            # React entry point
├── index.html           # HTML template with Tailwind config
└── services/
    ├── storageService.ts      # Local storage CRUD operations
    ├── notificationService.ts # SMS, Email, WhatsApp notifications
    ├── languageService.ts     # Multi-language translations
    └── geolocationService.ts  # GPS location capture
```

## Key Pages

1. **Landing Page** (`/`) - Marketing homepage with features, pricing
2. **Login/Register** (`/login`, `/register`) - User authentication
3. **Dashboard** (`/dashboard`) - Owner's home with stats
4. **My Pets** (`/dashboard/pets`) - Pet management
5. **Pet Detail** (`/dashboard/pets/:id`) - Individual pet profile
6. **Scan History** (`/dashboard/scans`) - All scan events
7. **Settings** (`/dashboard/settings`) - User preferences
8. **Public Profile** (`/pet/:tagCode`) - Finder view when QR is scanned

## India-Specific Features

- **WhatsApp Integration** - Most Indians prefer WhatsApp
- **Hindi Language Support** - Multilingual for wider reach
- **SMS Alerts** - Strong SMS delivery in India
- **INR Pricing** - ₹499, ₹799, ₹1,299 tiers
- **Indian Phone Numbers** - +91 format

## Future Enhancements

- [ ] Lost Pet Alert Network (notify nearby users)
- [ ] Pet Health Passport with reminders
- [ ] Family sharing (multiple owners)
- [ ] Voice/Video messages from finder
- [ ] Nearby vets & emergency services
- [ ] Social media lost pet poster generator
- [ ] Finder rewards & gamification
- [ ] NGO/Shelter network integration
- [ ] Real backend with PostgreSQL/MongoDB
- [ ] E-commerce for tag purchases

## License

MIT License - Built with ❤️ for pet parents in India
