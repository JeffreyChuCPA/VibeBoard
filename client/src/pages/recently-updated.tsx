import React from "react";
import Meta from "../components/Meta";
import { useKeyboardPaginated } from "../util/db.jsx";
import Header from "../components/Header.tsx";
import Spinner from "../components/Spinner.tsx";
import KeyboardCardList from "../components/Keyboard/Card/KeyboardCardList.tsx";
import Pagination from "../components/Pagination.tsx";

function RecentlyUpdatedPage() {
  const { data, isLoading } = useKeyboardPaginated(1, 10);
  return (
    <>
      <Meta />
      <Header />
      {isLoading ? (
        <div className="container xl:max-w-7xl mx-auto py-10 px-4 lg:p-8">
          <div className={"w-full h-full"}>
            <Spinner variant={"dark"} />
          </div>
        </div>
      ) : (
        <>
          <KeyboardCardList data={data} />
          <div className={"py-10 px-5 sm:p-20"}>
            <Pagination />
          </div>
        </>
      )}
    </>
  );
}

export default RecentlyUpdatedPage;
