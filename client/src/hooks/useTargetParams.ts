import { useLocation } from "react-router-dom";
import { getQueryParams } from "../util/helpers.ts";
import { useEffect, useState } from "react";

const useTargetParams = (param: string): string | null => {
  const location = useLocation()
  const [targetParam, setTargetParam] = useState<string | null>(null)

  useEffect(() => {
    const queryParams = getQueryParams(location.search)
    setTargetParam(queryParams.get(param))

  }, [location.search, param])

  return targetParam
}

export default useTargetParams