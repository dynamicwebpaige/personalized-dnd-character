
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraViewProps {
    onCapture: (imageBase64: string) => void;
}

const CameraIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </svg>
);


const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 1280, height: 720 },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please check permissions and try again.");
        }
    }, []);
    
    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if(context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                onCapture(dataUrl);
            }
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-cinzel text-amber-300 mb-4">Step 1: Inspire Your Hero</h2>
            <div className="w-full max-w-lg aspect-video rounded-lg overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-inner mb-6 relative">
                {error ? (
                    <div className="w-full h-full flex items-center justify-center text-center p-4 text-red-400">
                        {error}
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                    />
                )}
            </div>
            <button
                onClick={handleCapture}
                disabled={!!error || !stream}
                className="flex items-center justify-center gap-3 bg-amber-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-700 transition-all duration-300 text-lg shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
            >
                <CameraIcon className="w-6 h-6" />
                Capture & Generate
            </button>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default CameraView;
