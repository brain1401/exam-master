"use client";
import { ClipLoader } from "react-spinners";

type Props = {
  size?: number;
  color?: string;
  className?: string;
};
export default function ClientClipLoader({ size, color, className }: Props) {
  return <ClipLoader size={size} color={color} className={className} />;
}
