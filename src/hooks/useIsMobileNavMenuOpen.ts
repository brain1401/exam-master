import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectIsNavbarOpen,
  setNavberState,
  toggleNavbar,
} from "@/slices/navbar";
import { useCallback } from "react";

export default function useIsMobileNavMenuOpen() {
  const isMobileMenuOpen = useAppSelector(selectIsNavbarOpen);
  const dispatch = useAppDispatch();

  const setMobileMenuOpen = useCallback(
    (isOpen: boolean) => {
      dispatch(setNavberState(isOpen));
    },
    [dispatch],
  );
  const toggleMobileMenu = useCallback(() => {
    dispatch(toggleNavbar());
  }, [dispatch]);

  return { isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen };
}
