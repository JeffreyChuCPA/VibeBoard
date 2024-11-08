import React from "react";
import Meta from "../components/Meta";
import { useRouter } from "../util/router.jsx";
import { useKeyboardByTheme } from "../util/db.jsx";
import Header from "../components/Header.tsx";
import Spinner from "../components/Spinner.tsx";
import useMobile from "../hooks/useMobile.ts";
import { KeyboardProps } from "../util/types.ts";
import MobileDetailSection from "../components/Detail/MobileDetailSection.tsx";
import DesktopDetailSection from "../components/Detail/DesktopDetailSection.tsx";
import { useScrollToTop } from "../hooks/useScrollToTop.ts";

function DetailsPage() {
  const isMobile = useMobile();
  const router = useRouter();
  const { data, isLoading } = useKeyboardByTheme(router.query.theme_id);

  useScrollToTop(isLoading);

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="container xl:max-w-7xl mx-auto py-10 px-4 lg:p-8">
          <div className={"w-full h-full"}>
            <Spinner variant={"dark"} />
          </div>
        </div>
      </div>
    );
  }

  const keyboard: KeyboardProps = data;

  return (
    <>
      <Header />
      <Meta title={`VibeBoard - ${keyboard.theme_name}`} />
      {isMobile ? (
        <MobileDetailSection keyboard={keyboard} image={keyboard.image_path} />
      ) : (
        <div className={"container xl:max-w-7xl mx-auto px-4 lg:px-8"}>
          <DesktopDetailSection keyboard={keyboard} publicUrl={keyboard.image_path} />
        </div>
      )}
    </>
  );
}

export default DetailsPage;
