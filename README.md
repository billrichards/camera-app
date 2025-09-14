# Camera Web App

A simple, responsive web application for accessing your device's camera, taking photos, and recording videos. The app works entirely in the browser with no server-side processing required.

## Features

- 📸 Capture high-quality photos
- 🎥 Record videos with audio
- 🔄 Switch between multiple cameras
- 📱 Responsive design that works on desktop and mobile
- 💾 Save photos and videos with one click
- 🗑️ Delete unwanted media from the gallery
- 🎨 Clean, modern user interface

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A working webcam
- Internet connection (only required for loading external resources)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd camera-app
   ```

2. Run a local server:
   - Using Python (recommended):

     ```bash
     python3 -m http.server 8000
     ```

   - Or using Node.js (if you have it installed):

     ```bash
     npx http-server -p 8000
     ```

3. Open your browser and navigate to:

   `http://localhost:8000`

## How to Use

### Taking Photos

1. Click "Start Camera" or select a camera from the dropdown
2. Click "Take Photo" to capture an image
3. The photo will appear in the gallery below
4. Click the download button (↓) to save the photo
5. Click the delete button (×) to remove a photo

### Recording Videos

1. Click "Start Camera" or select a camera from the dropdown
2. Click "Start Recording" to begin recording
3. Click "Stop Recording" when finished
4. The video will appear in the gallery
5. Right-click on the video and select "Save Video As..." to download
   - Or click the download button (↓) to save the video

### Switching Cameras

1. Click the camera dropdown menu
2. Select your desired camera from the list
3. The video feed will automatically switch to the selected camera

## Browser Support

The app uses the following modern web APIs:

- MediaDevices API for camera access
- MediaRecorder API for video recording
- Canvas API for photo capture

It works best in the latest versions of:

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Apple Safari

## Known Issues

- On some mobile devices, video recording might be limited to lower resolutions
- The first time you access the app, you'll need to grant camera permissions
- Some browsers may require HTTPS for camera access on production sites

## Troubleshooting

- **Camera not working?**
  - Make sure you've granted camera permissions in your browser
  - Try refreshing the page
  - Check if another application is using the camera

- **Video recording not working?**
  - Try a different browser (Chrome and Firefox have the best support)
  - Check if your browser supports the MediaRecorder API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- Built with vanilla JavaScript, HTML5, and CSS3
- No external dependencies
- Icons from Unicode characters
- Built with Windsurf SWE-1

---

*Note: All media captured by this app stays in your browser and is not uploaded to any server.*
