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

  //useCallback을 사용하지 않으면 렌더링 될 때마다 새로운 함수가 생성되어 바깥에서 useEffect등에서 사용할 때 제대로 작동하지 않는다.
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
