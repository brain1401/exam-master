import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  addToDeletedUuidAction,
  removeToDeletedUuidAction,
  resetToDeletedUuidAction,
  selectIsDeleteButtonClicked,
  selectToDeletedUuid,
  setIsDeleteButtonClickedAction,
} from "@/slices/ui";
import { useCallback } from "react";

export default function useUiState() {
  const dispatch = useAppDispatch();

  const isDeleteButtonClicked = useAppSelector(selectIsDeleteButtonClicked);
  const toDeletedUuid = useAppSelector(selectToDeletedUuid);

  //useCallback을 사용하지 않으면 렌더링 될 때마다 새로운 함수가 생성되어 바깥에서 useEffect등에서 사용할 때 제대로 작동하지 않는다.

  const addToDeletedUuid = useCallback(
    (uuid: string) => {
      dispatch(addToDeletedUuidAction(uuid));
    },
    [dispatch],
  );

  const removeToDeletedUuid = useCallback(
    (uuid: string) => {
      dispatch(removeToDeletedUuidAction(uuid));
    },
    [dispatch],
  );

  const resetToDeletedUuid = useCallback(() => {
    dispatch(resetToDeletedUuidAction());
  }, [dispatch]);

  const setIsDeleteButtonClicked = useCallback(
    (isClicked: boolean) => {
      dispatch(setIsDeleteButtonClickedAction(isClicked));
    },
    [dispatch],
  );

  return {
    isDeleteButtonClicked,
    setIsDeleteButtonClicked,
    toDeletedUuid,
    resetToDeletedUuid,
    addToDeletedUuid,
    removeToDeletedUuid,
  };
}
