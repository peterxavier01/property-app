# Urban Homes 🏠

A modern, cross-platform property discovery app built with React Native and Expo. Urban Homes helps users find, explore, and manage properties with an intuitive interface and powerful search capabilities.

## Features ✨

- **Property Discovery**: Browse and search properties with advanced filtering
- **Interactive Maps**: Explore properties with location-based features
- **User Authentication**: Secure login with email/password and Google OAuth
- **Property Details**: Comprehensive property information with image galleries
- **Agent Profiles**: Connect with property agents and view their listings
- **Responsive Design**: Optimized for iOS, Android, and web platforms
- **Modern UI**: Built with NativeWind (TailwindCSS) for consistent styling

## Tech Stack 🛠️

- **Framework**: [Expo](https://expo.dev) with React Native
- **Navigation**: Expo Router with file-based routing
- **Backend**: [Appwrite](https://appwrite.io) for authentication and database
- **Styling**: [NativeWind](https://www.nativewind.dev/) (TailwindCSS)
- **Authentication**: Email/Password and Google OAuth
- **UI Components**: Custom components with TypeScript support
- **State Management**: React hooks and context

## Prerequisites 📋

Before running this project, make sure you have:

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Emulator
- Appwrite server setup with project configuration

## Environment Setup 🔧

1. Create a `.env` file in the root directory with your Appwrite configuration:

```env
EXPO_PUBLIC_APPWRITE_PLATFORM=your_appwrite_platform
EXPO_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID=your_agents_collection_id
EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID=your_galleries_collection_id
EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID=your_reviews_collection_id
EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID=your_properties_collection_id
```

## Get Started 🚀

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd urban-homes
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

3. **Run on your preferred platform**

   In the terminal output, you'll find options to open the app in:

   - [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go) (limited sandbox)

## Available Scripts 📝

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality
- `npm run reset-project` - Reset to blank project template

## Project Structure 📁

```
urban-homes/
├── app/                    # Main application screens
│   ├── (root)/            # Authenticated user screens
│   │   ├── (tabs)/        # Tab navigation screens
│   │   └── properties/    # Property detail screens
│   ├── sign-in.tsx        # Authentication screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utilities and services
│   ├── appwrite.ts        # Appwrite client setup
│   └── global-provider.tsx # Global state management
├── constants/             # App constants and data
├── assets/               # Images, fonts, and icons
└── hooks/                # Custom React hooks
```

## Key Features Implementation 🔑

### Authentication

- Email/password authentication with Appwrite
- Google OAuth integration
- Secure session management
- Error handling for various auth scenarios

### Property Management

- Property listing with pagination
- Advanced search and filtering
- Property details with image galleries
- Location-based features

### User Interface

- Modern design with NativeWind/TailwindCSS
- Responsive layouts for all screen sizes
- Custom components for consistency
- Smooth animations and transitions

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting 🔧

### Common Issues

1. **OAuth not working in Expo Go**: Use development build for full OAuth functionality
2. **Environment variables not loading**: Ensure `.env` file is in project root
3. **Appwrite connection issues**: Verify endpoint URL and project configuration

### Development Tips

- Use development builds for testing OAuth flows
- Check Expo documentation for platform-specific configurations
- Monitor Appwrite console for backend debugging

## Resources 📚

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Appwrite Documentation](https://appwrite.io/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using Expo and React Native
