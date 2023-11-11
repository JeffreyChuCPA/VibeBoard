import Key from "./Key.tsx";
import { KeyProps } from "./types";

interface KeyBoardProps {
  keys: KeyProps[];
  variant?: string;
}
export default function Keyboard({ keys, variant = "dark" }: KeyBoardProps) {
  const colorVariants = {
    dark: {
      border: "bg-gray-800",
      innerFrame: "bg-gray-900",
    },
    light: {
      border: "bg-gray-300",
      innerFrame: "bg-gray-700",
    },
  };

  const keysByRow = keys.reduce<Record<string, KeyProps[]>>((acc, key) => {
    if (!acc[key.row]) {
      acc[key.row] = [];
    }
    acc[key.row].push(key);
    return acc;
  }, {});

  return (
    // Keyboard Border
    <div
      className={`${colorVariants[variant].border} 
      p-3 rounded-lg border-2 border-t-gray-400 dark:border-t-gray-600 border-x-gray-400 
      dark:border-x-gray-800 border-b-gray-500 dark:border-b-gray-900 shadow-lg`}
    >
      {/*Keyboard Inner Frame*/}
      <div
        className={`p-0.5 ${colorVariants[variant].innerFrame} rounded overflow-hidden`}
      >
        {/*This splits the array into rows to process based on the row prop in keys*/}
        {Object.keys(keysByRow).map((rowNumber: string) => (
          <div
            key={rowNumber}
            className={`flex space-x-[2px] ${
              rowNumber !== "1" ? "mt-[2px]" : ""
            }`}
          >
            {keysByRow[rowNumber].map((key: KeyProps) => (
              <Key key={key.label} keyInfo={key} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
