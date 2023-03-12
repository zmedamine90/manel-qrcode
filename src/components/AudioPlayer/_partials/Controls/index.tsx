import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// icons

interface ControlsProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  progressBarRef: React.RefObject<HTMLInputElement>;
  duration: number;
  setTimeProgress: Dispatch<SetStateAction<number>>;
}

const Controls = ({
  audioRef,
  progressBarRef,
  duration,
  setTimeProgress,
}: ControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAnimationRef = useRef<number | null>();

  const repeat = useCallback(() => {
    if (!!audioRef?.current && !!progressBarRef?.current) {
      const currentTime = audioRef.current.currentTime || 0;
      playAnimationRef.current = requestAnimationFrame(repeat);
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime.toString();

      if (
        Math.floor(duration) === Math.floor(currentTime) ||
        currentTime > duration
      ) {
        audioRef.current?.pause();
        setTimeProgress(0);
        audioRef.current.currentTime = 0;
        audioRef.current?.play().catch((error) => console.error(error));
        progressBarRef.current.value = "0";
      }
    }
  }, [audioRef, progressBarRef, setTimeProgress, duration]);

  useEffect(() => {
    if (isPlaying && !!audioRef?.current) {
      console.log("is playing");
      audioRef.current?.play().catch((error) => console.error(error));
      playAnimationRef.current = requestAnimationFrame(repeat);
    } else if (!!playAnimationRef?.current) {
      audioRef.current?.pause();
      cancelAnimationFrame(playAnimationRef.current);
    }
  }, [isPlaying, audioRef, repeat]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };
  return (
    <>
      <div className="h-control-panel bg-control-panel-light-background dark:bg-control-panel-dark-background z-50 flex justify-center   rounded-b-xl border-t border-gray-200 px-10 py-10  dark:border-gray-900">
        <div className=" amplitude-play-pause border-play-pause-light-border dark:bg-play-pause-dark-background dark:border-play-pause-dark-border flex h-40 w-40  cursor-pointer rounded-full border bg-white shadow-xl">
          <button onClick={togglePlayPause} className="w-full">
            {!isPlaying ? (
              <svg
                id="play-icon"
                className="m-auto"
                width="31"
                height="37"
                viewBox="0 0 31 37"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M29.6901 16.6608L4.00209 0.747111C2.12875 -0.476923 0.599998 0.421814 0.599998 2.75545V33.643C0.599998 35.9728 2.12747 36.8805 4.00209 35.6514L29.6901 19.7402C29.6901 19.7402 30.6043 19.0973 30.6043 18.2012C30.6043 17.3024 29.6901 16.6608 29.6901 16.6608Z"
                  className="fill-slate-900 dark:fill-slate-400"
                />
              </svg>
            ) : (
              <svg
                id="pause-icon"
                className="m-auto"
                width="24"
                height="36"
                viewBox="0 0 24 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="6"
                  height="36"
                  rx="3"
                  className="fill-slate-900 dark:fill-slate-400"
                />
                <rect
                  x="18"
                  width="6"
                  height="36"
                  rx="3"
                  className="fill-slate-900 dark:fill-slate-400"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Controls;
