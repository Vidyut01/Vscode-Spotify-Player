import { createContext } from "react";

export const CurrentSongContext = createContext<{currSong?: string | null; setCurrSong?: React.Dispatch<React.SetStateAction<string | null>>}>({});
