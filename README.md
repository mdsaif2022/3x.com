# VideoStream Pro - Pre-uploaded Video Streaming Website

A complete video streaming website with integrated Adsterra monetization built with Next.js, featuring pre-watch ads, multi-step download unlocks, and admin management.

## 🚀 Features

### Core Features
- **Homepage**: Video grid with thumbnails, views, and download counts
- **Pre-watch System**: Smart Direct Link ads with 5-second timer requirement
- **Video Player**: Full-featured player with controls and fullscreen support
- **Multi-step Download**: 4-step unlock process with random ads and progress tracking
- **Admin Dashboard**: Complete video and ad management system
- **Ad Integration**: Banner, Native, and Smart Direct Link ads with click tracking

### Technical Features
- **Session Management**: Secure token-based download links (2-minute expiry)
- **Ad Monetization**: Randomized ad selection and timing validation
- **Responsive Design**: Mobile and desktop optimized with Tailwind CSS
- **Modern UI**: Orange (#FF7F00) and Sky Blue (#00BFFF) theme
- **Security**: Ad-skip prevention and direct access protection

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore (with demo data fallback)
- **Authentication**: Firebase Auth (optional)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd video-streaming-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase (Optional)**
   - Create a Firebase project
   - Enable Firestore Database
   - Copy your Firebase config to `lib/firebase.ts`
   - Uncomment Firebase code in `lib/api.ts`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### For Users
1. **Browse Videos**: View the homepage with video grid
2. **Watch Videos**: Click "Watch Now" → Complete ad → Video unlocks
3. **Download Videos**: Click "Download" → Complete 4 ad steps → Download unlocks

### For Admins
1. **Access Admin Panel**: Navigate to `/admin`
2. **Manage Videos**: Add, edit, delete videos
3. **Manage Ads**: Add, edit, delete banner, native, and smart direct link ads
4. **View Analytics**: Track views, downloads, and ad clicks

## 🔧 Configuration

### Adsterra Integration
The website is designed to work with Adsterra ads. To integrate:

1. **Replace Demo Ads**: Update `data/demo.ts` with your Adsterra ad URLs
2. **Configure Ad Types**:
   - Banner Ads: For homepage banners
   - Native Ads: For video grid integration
   - Smart Direct Links: For pre-watch and download unlock

### Firebase Setup (Production)
1. Create Firebase project
2. Enable Firestore Database
3. Update `lib/firebase.ts` with your config
4. Uncomment Firebase code in `lib/api.ts`
5. Set up Firestore collections:
   - `videos`: Video metadata
   - `ads`: Ad configurations
   - `sessions`: User session data

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── download/[id]/     # Download unlock pages
│   ├── player/[id]/       # Video player pages
│   ├── watch/[id]/        # Pre-watch pages
│   └── api/               # API routes
├── components/            # React components
│   ├── admin/             # Admin components
│   ├── ads/               # Ad components
│   ├── layout/            # Layout components
│   └── video/              # Video components
├── data/                  # Demo data
├── lib/                   # Utilities and API
├── types/                 # TypeScript types
├── video/                 # Local video files folder
└── styles/                # Global styles
```

## 🎬 Video Folder Integration

The `/video` folder contains your local video files that are automatically detected and served by the application:

### Features
- **Automatic Detection**: Scans for `.mp4` files on startup
- **Title Generation**: Converts filenames to readable titles
- **Category Detection**: Auto-categorizes based on content
- **Streaming Support**: HTTP range requests for efficient playback
- **Admin Management**: View and manage local videos in admin panel

### Usage
1. Drop `.mp4` files into the `/video` folder
2. Refresh admin panel to see new videos
3. Videos automatically appear on homepage
4. Full integration with ad system and download unlock

## 🎨 Customization

### Theme Colors
Update `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: {
    orange: '#FF7F00',    // Change this
    skyblue: '#00BFFF',   // Change this
  }
}
```

### Ad Timing
Modify ad timing requirements in:
- `app/watch/[id]/page.tsx`: Pre-watch timer (default: 5 seconds)
- `app/download/[id]/page.tsx`: Download step timing (default: 5-10 seconds)

### Download Steps
Change the number of download steps in `app/download/[id]/page.tsx`:
```javascript
// Create 4 steps with 2-4 random ads each
for (let i = 0; i < 4; i++) { // Change this number
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### cPanel/Shared Hosting
1. Build the project: `npm run build`
2. Upload the `.next` folder and other files
3. Configure your web server

### Environment Variables
For production, set up:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 🔒 Security Features

- **Session Validation**: Prevents ad skipping
- **Token Expiry**: Download links expire in 2 minutes
- **Direct Access Protection**: Videos require ad completion
- **Ad Timing**: Minimum time requirements enforced

## 📊 Analytics

The admin dashboard provides:
- Total videos, views, downloads
- Ad click statistics
- Top performing videos
- Real-time metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the demo data for examples

## 🎉 Demo

The website includes demo data for immediate testing:
- 6 sample videos with different categories
- Multiple ad types with realistic data
- Fully functional admin panel
- Complete user flow demonstration

---

**Built with ❤️ using Next.js and Tailwind CSS**
