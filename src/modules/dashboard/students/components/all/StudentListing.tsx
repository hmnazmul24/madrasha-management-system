// components/ProductTable.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ProductTableSkeleton } from "@/modules/dashboard/components/ProductTableSkeleton";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  EllipsisVertical,
  Filter,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { filteredSessionBasedOnYear } from "../../helper";
import { useAllStudentsForTable } from "../../hooks/use-all-students";
import {
  AllFilterType,
  genderEnumType,
  StudentCourseEnumType,
  StudentListingType,
} from "../../types";
import AddFeesModal from "../update-options/AddFeesModal";
import DeleteStudentModal from "../update-options/DeleteModal";

import FessRecordsModal from "../update-options/FeesRecordsModal";
import ProvideResultModal from "../update-options/ProvideResultModal";
import UpdateStudentInfoModal from "../update-options/UpdateStudentInfoModal";

import { useTranslations } from "next-intl";
import {
  COURSE_FILTER_YEARS,
  GENDER_ARRAY,
  STUDENT_COURSE_ARRAY,
} from "../../constants";
import DownloadId from "../update-options/DownloadId";
import FilterSelectBar from "./FilterSelectBar";
const StudentListingTable = () => {
  // states
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState<number>(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: limit,
  });
  const [course, setCourse] = useState<StudentCourseEnumType | AllFilterType>(
    "All Courses"
  );
  const [sessionRanges, setSessionRanges] = useState<string | AllFilterType>(
    "All Sessions"
  );
  const [filterYear, setFilterYear] = useState<string | AllFilterType>(
    "All Years"
  );
  const [gender, setGender] = useState<genderEnumType | AllFilterType>(
    "All Genders"
  );
  // translations
  const t = useTranslations("studentCourses");
  // queries
  const { data, isLoading } = useAllStudentsForTable({
    offset: limit * pagination.pageIndex,
    limit,
    search,
    sorting,
    course: course,
    gender: gender,
    sessionRange: sessionRanges,
    yearRange: filterYear,
  });
  // table data
  const columns: ColumnDef<StudentListingType>[] = [
    {
      accessorKey: "imageUrl",
      header: "Profile",
      cell: ({ row }) => (
        <Image
          src={
            row.original.imageUrl ? row.original.imageUrl : "/muslim-user.png"
          }
          height={50}
          width={50}
          className="rounded-md object-cover bg-white/20 size-[50px]"
          alt="ProductImg"
        />
      ),
    },

    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "studentIdNo",
      header: "Id Number",
    },
    {
      header: "Course",
      cell: (info) => t(info.row.original.course),
    },
    {
      accessorKey: "sessionLength",
      header: "Session",
    },
    {
      header: "Actions",
      cell: (info) => (
        <Popover>
          <PopoverTrigger className="px-4 cursor-pointer">
            <EllipsisVertical className={"size-4"} />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-0 ">
            <ul className="flex items-start flex-col *:p-3 *:cursor-pointer *:text-sm *:hover:text-emerald-600">
              <DownloadId
                studentIdInfo={{
                  name: info.row.original.name,
                  course: info.row.original.course,
                  session: info.row.original.sessionLength,
                  id: info.row.original.studentIdNo,
                  imageUrl: info.row.original.imageUrl ?? undefined,
                  madrashaName: data?.madrashaName,
                }}
              >
                <span>Download Id</span>
              </DownloadId>
              <AddFeesModal
                studentId={info.row.original.id}
                session={info.row.original.sessionLength}
              >
                <li>Add Fees</li>
              </AddFeesModal>
              <FessRecordsModal studentId={info.row.original.id}>
                <li>Fees Records </li>
              </FessRecordsModal>
              <UpdateStudentInfoModal id={info.row.original.id}>
                <li>Update Info</li>
              </UpdateStudentInfoModal>
              <ProvideResultModal
                imageUrl={info.row.original.imageUrl}
                userName={info.row.original.name}
                studentId={info.row.original.id}
              >
                <li>Provide Result</li>
              </ProvideResultModal>
              <DeleteStudentModal
                studentId={info.row.original.id}
                imagePublicId={info.row.original.imagePublicId}
              >
                <li className="hover:text-red-500">Delete </li>
              </DeleteStudentModal>
            </ul>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  // table hook
  const table = useReactTable({
    data: data?.allStudents || [],
    columns,
    pageCount: Math.ceil((data?.totalCount || 0) / pagination.pageSize),
    state: {
      sorting,
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
  });

  useEffect(() => {
    table.setPageIndex(0);
  }, [search, table]);

  return (
    <div className="w-full rounded-lg border p-4 shadow-lg backdrop-blur-xs">
      <h1 className="sr-only">Search Input</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="relative">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[260px] p-5 pl-8 text-white shadow-md"
          />
          <SearchIcon className="absolute left-2 top-3 size-5 text-slate-200" />
        </div>
      </div>

      <div className=" border  p-3 rounded-md mb-4 flex items-center justify-start gap-2 overflow-y-auto">
        <Button variant={"signature"}>Filters</Button>
        {/* testings  */}
        <FilterSelectBar
          dataList={STUDENT_COURSE_ARRAY}
          value={course}
          valueSetter={setCourse}
          defaultValueName="All Courses"
          translateTag="studentCourses"
        />
        <FilterSelectBar
          dataList={COURSE_FILTER_YEARS}
          value={filterYear}
          valueSetter={setFilterYear}
          defaultValueName="All Years"
          suffix="years"
        />
        <FilterSelectBar
          dataList={
            filterYear !== "All Years"
              ? filteredSessionBasedOnYear(filterYear)
              : []
          }
          value={sessionRanges}
          valueSetter={setSessionRanges}
          defaultValueName="All Sessions"
        />

        <FilterSelectBar
          dataList={GENDER_ARRAY}
          value={gender}
          valueSetter={setGender}
          defaultValueName="All Genders"
        />

        <Button
          onClick={() => {
            setCourse("All Courses");
            setSessionRanges("All Sessions");
            setFilterYear("All Years");
            setGender("All Genders");
          }}
          variant={"outline"}
          className="text-green-500 hover:text-green-600 cursor-pointer"
        >
          Clear Filter <Filter />
        </Button>
      </div>

      <Table className="text-white">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <button
                    onClick={header.column.getToggleSortingHandler()}
                    className="flex items-center gap-1"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : ""}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                <ProductTableSkeleton count={limit} />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  "",
                  row.original.result === "F"
                    ? "text-gray-400"
                    : row.original.result
                    ? "text-emerald-500"
                    : ""
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between text-white">
        <div className="flex items-center justify-center gap-2">
          <Select
            onValueChange={(e) => Number(setLimit(Number(e)))}
            defaultValue={limit.toString()}
          >
            <SelectTrigger className="w-[70px] bg-white py-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[5, 10, 15, 20, 30].map((item) => (
                  <SelectItem className="" key={item} value={item.toString()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <h1 className="text-sm opacity-55">
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPagination({ ...pagination, pageIndex: 0 })}
            disabled={pagination.pageIndex === 0}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.max(0, prev.pageIndex - 1),
              }))
            }
            disabled={pagination.pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.min(
                  table.getPageCount() - 1,
                  prev.pageIndex + 1
                ),
              }))
            }
            disabled={pagination.pageIndex >= table.getPageCount() - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setPagination({
                ...pagination,
                pageIndex: table.getPageCount() - 1,
              })
            }
            disabled={pagination.pageIndex >= table.getPageCount() - 1}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentListingTable;
