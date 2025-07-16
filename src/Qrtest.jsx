 import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
 
const Qrtest = () => {
    const navigate = useNavigate();

    const handleScan = data => {
        if (data) {
            // Check if scanned QR code is a YouTube URL
            if (data.startsWith('https://www.youtube.com/') || data.startsWith('https://youtu.be/')) {
                window.location.href = data; // Navigate to YouTube
            }
        }
    };

    const handleError = err => {
        console.error(err);
    };

    return (
        <div>
            <h2>Scan a QR code to navigate to YouTube</h2>
            <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
            />
        </div>
    );
};

export default Qrtest;