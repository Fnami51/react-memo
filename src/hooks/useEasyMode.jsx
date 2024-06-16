import { useContext } from "react";
import { EasyModeContext } from "../context/EasyModeContext.jsx";

export default function useEasyMode() {
  return useContext(EasyModeContext);
}
