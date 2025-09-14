document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const cameraSelect = document.getElementById('cameraSelect');
    const startButton = document.getElementById('startButton');
    const captureButton = document.getElementById('captureButton');
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const galleryItems = document.getElementById('galleryItems');
    
    // State
    let stream = null;
    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;
    
    // Get available cameras
    async function getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            cameraSelect.innerHTML = '<option value="">Select Camera</option>';
            
            videoDevices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Camera ${cameraSelect.length + 1}`;
                cameraSelect.appendChild(option);
            });
            
            return videoDevices;
        } catch (err) {
            console.error('Error getting cameras:', err);
            alert('Error accessing cameras. Please make sure you have granted camera permissions.');
            return [];
        }
    }
    
    // Start camera with selected device
    async function startCamera(deviceId) {
        // Stop any existing stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        const constraints = {
            video: {
                deviceId: deviceId ? { exact: deviceId } : undefined,
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: deviceId ? undefined : 'environment'
            },
            audio: false
        };
        
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            
            // Enable buttons
            captureButton.disabled = false;
            recordButton.disabled = false;
            
            // If we didn't specify a device, update the dropdown to show the active camera
            if (!deviceId) {
                const videoTrack = stream.getVideoTracks()[0];
                const settings = videoTrack.getSettings();
                if (settings.deviceId) {
                    cameraSelect.value = settings.deviceId;
                }
            }
            
            return true;
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Could not access the camera. Please make sure you have granted camera permissions.');
            return false;
        }
    }
    
    // Take a photo
    function takePhoto() {
        if (!stream) return;
        
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Create a data URL for the image
        const imageDataUrl = canvas.toDataURL('image/png');
        
        // Add to gallery
        addToGallery(imageDataUrl, 'image');
        
        // Optional: Download the image
        // downloadImage(imageDataUrl);
    }
    
    // Start video recording
    function startRecording() {
        if (!stream) return;
        
        recordedChunks = [];
        const options = { mimeType: 'video/webm;codecs=vp9' };
        
        try {
            mediaRecorder = new MediaRecorder(stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }
        
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(100); // Collect 100ms of data
        isRecording = true;
        
        // Update UI
        recordButton.disabled = true;
        stopButton.disabled = false;
    }
    
    // Stop video recording
    function stopRecording() {
        if (!mediaRecorder || !isRecording) return;
        
        mediaRecorder.stop();
        isRecording = false;
        
        // Update UI
        recordButton.disabled = false;
        stopButton.disabled = true;
    }
    
    // Handle recorded data
    function handleDataAvailable(event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
            
            // If recording has stopped, process the recorded data
            if (!isRecording) {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(blob);
                addToGallery(videoUrl, 'video');
            }
        }
    }
    
    // Add media to gallery
    function addToGallery(url, type) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const mediaElement = type === 'image' 
            ? document.createElement('img') 
            : document.createElement('video');
            
        mediaElement.src = url;
        if (type === 'video') {
            mediaElement.controls = true;
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = () => item.remove();
        
        item.appendChild(mediaElement);
        item.appendChild(deleteBtn);
        
        // Add to the beginning of the gallery
        galleryItems.insertBefore(item, galleryItems.firstChild);
    }
    
    // Download image (optional)
    function downloadImage(dataUrl) {
        const link = document.createElement('a');
        link.download = `photo-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        link.click();
    }
    
    // Event Listeners
    startButton.addEventListener('click', () => {
        const deviceId = cameraSelect.value;
        if (deviceId) {
            startCamera(deviceId);
        } else {
            alert('Please select a camera first');
        }
    });
    
    cameraSelect.addEventListener('change', () => {
        // Auto-start camera when a device is selected
        const deviceId = cameraSelect.value;
        if (deviceId) {
            startCamera(deviceId);
        }
    });
    
    captureButton.addEventListener('click', takePhoto);
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    
    // Initialize
    getCameras().then(devices => {
        if (devices.length > 0) {
            // Auto-start the first camera
            startCamera(devices[0].deviceId);
        }
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });
});