import { showMessageOrError } from "@/lib/show-message-error";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { getStudentsForTable } from "../server/student.action";
import { StudentCourseEnumType } from "../types";

export const useAllStudentsForTable = ({
  pageIndex,
  pageSize,
  search,
  sorting,
  course,
  sessionLength,
  duration,
}: {
  pageIndex: number;
  pageSize: number;
  search?: string;
  sorting?: SortingState;
  course: StudentCourseEnumType | "all";
  sessionLength: string | "all";
  duration: string;
}) => {
  return useQuery({
    queryKey: [
      "table_students",
      pageIndex,
      pageSize,
      search,
      sorting,
      course,
      sessionLength,
      duration,
    ],
    queryFn: async () => {
      const data = await getStudentsForTable({
        limit: pageSize,
        offset: pageIndex * pageSize,
        search,
        sorting,
        course,
        sessionLength,
        duration,
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
