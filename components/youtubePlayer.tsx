import { useEffect, useRef } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

// プレイヤーの必要なメソッドだけ定義
interface YTPlayer {
  playVideo: () => void;
  stopVideo: () => void;
  // ほかに使うメソッドあればここに追加
}

interface YouTubePlayerProps {
  videoId: string;
}

export const YouTubePlayer = ({ videoId }: YouTubePlayerProps) => {
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    const loadPlayer = () => {
      playerRef.current = new window.YT.Player("yt-player", {
        height: "0", // 画面に表示しない（音だけ）
        width: "0",
        videoId,
        events: {
          onReady: (event) => {
            event.target.playVideo();
            setTimeout(() => {
              event.target.stopVideo();
            }, 30000); // 30秒再生
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = loadPlayer;
    } else {
      loadPlayer();
    }
  }, [videoId]);

  return <div id="yt-player" />;
};
