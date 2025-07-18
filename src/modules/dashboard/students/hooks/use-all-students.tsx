import { showMessageOrError } from "@/lib/show-message-error";
import { useQuery } from "@tanstack/react-query";
import { getStudentsForTable } from "../server/student.action";
import { StudentTableFilterPropsType } from "../types";

export const useAllStudentsForTable = (info: StudentTableFilterPropsType) => {
  return useQuery({
    queryKey: ["table_students", { ...info }],
    queryFn: async () => {
      const data = await getStudentsForTable({
        ...info,
      });
      if ("error" in data) {
        showMessageOrError(data);

        return { allStudents: [], totalCount: 0, madrashaName: "N/A" };
      } else {
        return {
          allStudents: data.allStudents,
          totalCount: data.studentCount,
          madrashaName: data.madrashaName,
        };
      }
    },
  });
};
