import { useRef, useState } from "react";
import DisplayTrack from "../DisplayTrack";
import Controls from "../Controls";
import ProgressBar from "../ProgressBar";
import { PostWithUrlType } from "@/server/api/routers/post";

export const tracks = [
  {
    title: "Trinix ft Rushawn – Its a beautiful day",
    author: "Trinix ft Rushawn",
  },
];

// import components

interface ProgressBarProps<T> {
  post: T;
}

const AudioPlayerElement = <T extends { url: string }>({
  post,
}: ProgressBarProps<T>) => {
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const progressBarRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-player shadow-player-light bg-player-light-background  border-player-light-border dark:shadow-player-dark dark:bg-player-dark-background dark:border-player-dark-border relative flex w-full flex-col rounded-xl border pt-10 dark:backdrop-blur-xl">
        <ProgressBar
          {...{ audioRef, progressBarRef, duration, timeProgress }}
        />
        <DisplayTrack {...{ post, audioRef, progressBarRef, setDuration }} />
        <Controls
          {...{ audioRef, progressBarRef, duration, setTimeProgress }}
        />
      </div>
    </div>
  );
};
export default AudioPlayerElement;
