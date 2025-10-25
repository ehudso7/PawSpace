/**
 * App Entry Point
 * Initialize services and set up navigation
 */

import React from 'react';
import { initializeCloudinary } from './src/services/cloudinary';
import { CLOUDINARY_CONFIG } from './src/config/cloudinary.config';
import { PreviewScreen } from './src/screens/create/PreviewScreen';

// Initialize Cloudinary on app start
initializeCloudinary(CLOUDINARY_CONFIG);

export default function App() {
  // In a real app, this would be wrapped in navigation
  // For now, export PreviewScreen for testing
  return <PreviewScreen navigation={{}} route={{
    params: {
      beforeImageUrl: 'https://example.com/before.jpg',
      afterImageUrl: 'https://example.com/after.jpg',
    }
  }} />;
}
