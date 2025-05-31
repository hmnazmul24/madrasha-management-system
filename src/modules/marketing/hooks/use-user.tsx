import { useQuery } from "@tanstack/react-query";
import { auth } from "../server/user.action";

export const useUserAuth = () => {
  return useQuery({ queryKey: ["auth-boolean"], queryFn: auth });
};
