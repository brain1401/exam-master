import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setMediaQueryAction } from "@/slices/mediaQuery";
import { useCallback } from "react";

export default function useCustomMediaQuery() {
  const dispatch = useAppDispatch();
  const mediaQuery = useAppSelector((state) => state.mediaQueryReducer);
  const setMediaQuery = useCallback((payload: Partial<typeof mediaQuery>) => {
    dispatch(setMediaQueryAction(payload));
  }, [dispatch]);
  
  return {
    mediaQuery,
    setMediaQuery,
  }
}
