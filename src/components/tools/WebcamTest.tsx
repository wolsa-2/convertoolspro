import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mic, Video, VideoOff, MicOff, AlertCircle } from 'lucide-react';

export default function WebcamTest() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const activeStream = streamRef.current;
      streamRef.current = null;
      activeStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startTest = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      if (!mountedRef.current) {
        mediaStream.getTracks().forEach(track => track.stop());
        return;
      }
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOn(true);
      setIsMicOn(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Could not access camera or microphone. Please check permissions.');
    }
  };

  const stopTest = () => {
    const activeStream = streamRef.current;
    streamRef.current = null;
    activeStream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsCameraOn(false);
    setIsMicOn(false);
  };

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };


  return (
    <div className="space-y-8">
      {!stream && !error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
            <Camera size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Ready to test?</h3>
          <p className="text-slate-500 mt-2 mb-8 max-w-xs text-center">
            We'll need permission to access your camera and microphone for this test.
          </p>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-8 max-w-sm">
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              <strong>Tip:</strong> If the camera doesn't start, please click the <strong>lock icon</strong> in your browser address bar and enable camera/microphone permissions for this site.
            </p>
          </div>
          <button
            onClick={startTest}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-500 transition-all transform hover:scale-105"
          >
            Start Webcam Test
          </button>
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-rose-100 text-rose-600 rounded-full">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-rose-900">Permission Denied</h3>
            <p className="text-rose-600 mt-1">{error}</p>
          </div>
          <button
            onClick={startTest}
            className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-500 transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
            />
            {!isCameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                <VideoOff size={64} className="mb-4" />
                <p className="text-lg font-medium">Camera is Off</p>
              </div>
            )}
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
              <button
                onClick={toggleCamera}
                className={`p-3 rounded-xl transition-all ${isCameraOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-900/20'}`}
              >
                {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
              <button
                onClick={toggleMic}
                className={`p-3 rounded-xl transition-all ${isMicOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-900/20'}`}
              >
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <div className="w-[1px] h-8 bg-white/10 mx-2" />
              <button
                onClick={stopTest}
                className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all"
              >
                End Test
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCameraOn ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                <Video size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Camera Status</h4>
                <p className="text-sm text-slate-500">{isCameraOn ? 'Working correctly' : 'Disabled or not found'}</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isMicOn ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                <Mic size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Microphone Status</h4>
                <p className="text-sm text-slate-500">{isMicOn ? 'Receiving audio' : 'Muted or not found'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
