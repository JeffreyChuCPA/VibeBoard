// import supabase from "../../../util/supabase.ts";
import { KeyboardProps } from "../../../util/types.ts";
import { Link, useLocation } from "react-router-dom";
import KeyboardActionButtonGroup from "./KeyboardActionButtonGroup.tsx";
import Info from "../../Info.tsx";

/*
DesktopKeyboardCard component renders a card displaying information about a keyboard.

Props:

- keyboard: KeyboardProps object containing data to display

Functionality:

- Fetches keyboard image from Supabase storage
- Renders card with header, body, and footer sections
- Header shows keyboard name and a star button
- Body displays keyboard image
- Footer shows description, size, comments, trend info
- Uses dummy placeholder data for text content

Usage:

<KeyboardCard
  keyboard={keyboard}
/>

*/

export default function DesktopKeyboardCard({
  keyboard,
  setIsModalOpen,
  showInfo = true,
  setSelectedKeyboard,
}: {
  keyboard: KeyboardProps;
  setIsModalOpen?: (state: boolean) => void;
  showInfo?: boolean;
  setSelectedKeyboard?: (id: string) => void;
}) {
  const location = useLocation();
  const currentRoute = location.pathname;

  return (
    <>
      <div className="flex flex-col rounded-lg shadow-sm bg-white overflow-hidden dark:text-gray-101 dark:bg-gray-800">
        <div className="py-3 px-5 bg-gray-50 text-left flex justify-between items-center dark:bg-gray-800/70">
          <div>
            <h2 className="font-semibold text-lg mb-1">
              {keyboard.theme_name}
            </h2>
          </div>
          <div>
            <KeyboardActionButtonGroup
              setSelectedKeyboard={setSelectedKeyboard}
              setIsModalOpen={setIsModalOpen}
              route={currentRoute}
              id={keyboard.id}
            />
          </div>
        </div>

        <div>
          {keyboard.image_path && (
            <Link to={`/keyboard/${keyboard.id}`}>
              <img alt={"#"} src={keyboard.image_path} className={"w-full h-full"} />
            </Link>
          )}
        </div>

        {showInfo && <Info keyboard={keyboard} />}
      </div>
    </>
  );
}
