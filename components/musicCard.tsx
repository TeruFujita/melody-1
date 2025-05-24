import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MusicIcon, HeartIcon } from "lucide-react";

interface MusicCardProps {
  song: {
    title: string;
    artist: string;
    image: string;
    preview_url?: string;
    spotify_url?: string;
  };
}

export function MusicCard({ song }: MusicCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="relative h-48 w-full">
        <Image
          src={song.image}
          alt={`${song.title} by ${song.artist}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-2 right-2">
          <HeartIcon className="h-7 w-7 text-pink-500 drop-shadow-lg" />
        </div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <MusicIcon className="h-4 w-4 text-pink-300" />
            <span className="text-pink-200 text-sm">Mood Melody</span>
          </div>
          <h3 className="text-xl font-bold">{song.title}</h3>
          <p className="text-gray-300">{song.artist}</p>
        </div>
      </div>
      <CardContent className="p-4">
        {song.preview_url && (
          <audio controls src={song.preview_url} className="w-full mt-2" />
        )}
        <div className="mt-4 text-center">
          {song.spotify_url ? (
            <a
              href={song.spotify_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-pink-600 hover:text-pink-700 inline-flex items-center gap-1"
            >
              <span>Spotifyで聴く</span>
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </a>
          ) : (
            <span className="text-sm text-gray-400">Spotifyリンクなし</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
