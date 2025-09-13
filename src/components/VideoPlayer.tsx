import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward, Crown } from "lucide-react";

interface VideoPlayerProps {
  episodeId: string;
  title: string;
  videoUrl?: string;
  userSubscription?: "free" | "premium";
}

const VideoPlayer = ({ episodeId, title, videoUrl, userSubscription = "free" }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1440); // 24 minutes in seconds
  const [selectedQuality, setSelectedQuality] = useState("480p");
  const [showControls, setShowControls] = useState(true);
  
  const qualities = [
    { label: "480p", available: true },
    { label: "720p", available: userSubscription === "premium" },
    { label: "1080p", available: userSubscription === "premium" }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-card group">
      {/* Video Container */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        {/* Video Element or Placeholder */}
        {videoUrl ? (
          <video
            className="w-full h-full object-cover"
            controls={false}
            poster=""
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="text-white text-center">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              {isPlaying ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12 ml-1" />}
            </div>
            <p className="text-lg font-medium">{title}</p>
            <p className="text-sm text-gray-400 mt-2">Episode {episodeId}</p>
            <p className="text-xs text-gray-500 mt-2">Video URL not available</p>
          </div>
        )}

        {/* Quality Restriction Overlay for Free Users */}
        {userSubscription === "free" && selectedQuality !== "480p" && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white p-8">
              <Crown className="w-16 h-16 text-anime-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-300 mb-6">Upgrade to Premium to watch in {selectedQuality}</p>
              <Button className="bg-gradient-primary hover:opacity-90 text-white shadow-glow">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              <p className="text-gray-300 text-sm">Episode {episodeId}</p>
            </div>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowControls(!showControls)}
              >
                <Settings className="w-5 h-5" />
              </Button>
              
              {/* Quality Selector */}
              <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm rounded-lg p-2 min-w-[100px]">
                <p className="text-white text-xs font-medium mb-2">Quality</p>
                {qualities.map((quality) => (
                  <button
                    key={quality.label}
                    onClick={() => quality.available && setSelectedQuality(quality.label)}
                    className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                      selectedQuality === quality.label 
                        ? 'bg-anime-primary text-white' 
                        : quality.available 
                          ? 'text-white hover:bg-white/20' 
                          : 'text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!quality.available}
                  >
                    {quality.label}
                    {!quality.available && (
                      <Crown className="w-3 h-3 inline ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Play/Pause */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              size="lg"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 rounded-full w-16 h-16 p-0"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full h-1 bg-white/30 rounded-full cursor-pointer">
                <div 
                  className="h-full bg-anime-primary rounded-full transition-all duration-150"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-anime-primary rounded-full shadow-glow"
                  style={{ left: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                  <SkipForward className="w-5 h-5" />
                </Button>
                
                <Button
                  onClick={() => setIsMuted(!isMuted)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-2"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                
                <span className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm bg-anime-primary/30 backdrop-blur-sm px-2 py-1 rounded">
                  {selectedQuality}
                </span>
                
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;