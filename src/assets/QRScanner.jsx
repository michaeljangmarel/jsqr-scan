// src/components/QRScanner.jsx
import  { useRef, useEffect, useState } from 'react';
import QrCode from 'jsqr';

const QRScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" } // Use rear camera if available
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Could not access the camera. Please allow camera permissions.");
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const scanFrame = () => {
      if (
        videoRef.current?.readyState === HTMLVideoElement.READY_TO_PLAY &&
        canvasRef.current
      ) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = QrCode.decode(imageData);

        if (code) {
          setResult(code.data);
        }
      }

      requestAnimationFrame(scanFrame);
    };

    scanFrame();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>QR Code Scanner</h2>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
        />

        {/* Hidden Canvas for QR Detection */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>

      {result ? (
        <div>
          <h3>✅ QR Code Scanned:</h3>
          <p><strong>{result}</strong></p>
        </div>
      ) : (
        <p>Align QR code in view to scan...</p>
      )}
    </div>
  );
};

export default QRScanner;