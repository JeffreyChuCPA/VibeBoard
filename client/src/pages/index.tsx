import Heading from "../components/Heading.tsx";
import Header from "../components/Header.tsx";
import React, { useState } from "react";
import { useKeyboardPaginated, useKeyboardBySearch } from "../util/db.jsx";
import Meta from "../components/Meta.tsx";
import KeyboardCardList from "../components/Keyboard/Card/KeyboardCardList.tsx";
import Pagination from "../components/Pagination.tsx";
import Spinner from "../components/Spinner.tsx";

export default function IndexPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  // const [fetchedSearchData, setFetchedSearchData] = useState<KeyboardPosts[] | null>(null)
  // const [isSearching, setIsSearching] = useState<boolean>(false)

  const { data: paginatedData, isLoading: isPaginatedLoading } = useKeyboardPaginated(1, 10);
  const { data: fetchedSearchData, isLoading: isSearching } = useKeyboardBySearch(searchQuery)
  
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
  }

  const isLoading = isPaginatedLoading || isSearching
  const displayData = fetchedSearchData || paginatedData

  return (
    <>
      <Meta />
      <Header />
      <Heading onSearch={handleSearch} />
      <div className="sm:border-t sm:border-gray-700/70"></div>
      {isLoading ? (
        <div className="container xl:max-w-7xl mx-auto py-10 px-4 lg:p-8">
          <div className={"w-full h-full"}>
            <Spinner variant={"dark"} />
          </div>
        </div>
      ) : (
        <>
          <KeyboardCardList data={displayData} />
          <div className={"py-10 px-5 sm:p-20"}>
            <Pagination />
          </div>
        </>
      )}
    </>
  );
}
