import React, { useEffect, useRef } from 'react';
import ZegoExpressEngine from 'zego-express-engine-webrtc';

function VideoChat() {
  const videoRef = useRef(null);

  useEffect(() => {
    const zg = new ZegoExpressEngine(1038036099, "87f7dbcd35c5b1b5df0b909a63513e0ec7393c662126802d8965879993f2cf0b");

    // Initialize the ZegoExpressEngine

    // Create a local stream and play it in the video element
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default VideoChat;
