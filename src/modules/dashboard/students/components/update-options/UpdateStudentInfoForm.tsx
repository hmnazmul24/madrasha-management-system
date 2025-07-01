"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { CustomBtn } from "@/components/ui/custom-button";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getBase64String } from "@/lib/file-to-base64";
import { showMessageOrError } from "@/lib/show-message-error";
import { cn } from "@/lib/utils";
import {
  COURSE_ARRAY,
  DURATION_YEARS,
  GENDER_ARRAY,
} from "@/modules/dashboard/students/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloudUpload, Delete, Paperclip } from "lucide-react";
import Image from "next/image";
import { filteredSessionBasedOnYear } from "../../helper";
import { UpdateStudentSchema } from "../../schema/student.schema";
import { updateStudent } from "../../server/student.action";
import { DBStudentType, UpdateStudentSchemaType } from "../../types";

export default function UpdateStudentInfoForm({
  data,
}: {
  data: DBStudentType;
}) {
  const qc = useQueryClient();
  const [files, setFiles] = useState<File[] | null>(null);
  // checking the data

  // ✅ Ensure hooks are always called, even if `queryPending` is true
  const form = useForm<UpdateStudentSchemaType>({
    resolver: zodResolver(UpdateStudentSchema),
    defaultValues: data
      ? {
          address: data.address || "",
          admissionTimePaid: data.admissionTimePaid
            ? data.admissionTimePaid
            : 0,
          fatherName: data.fatherName || "",
          motherName: data.motherName || "",
          imageUrl: data.imageUrl || undefined,
          imagePublicId: data.imagePublicId || undefined,
          name: data.name,
          gender: data.gender,
          course: data.course,
          sessionLength: data.sessionLength,
          sessionDurationInYear: String(data.sessionDurationInYear),
          dateOfBirth: new Date(data.dataOfBirth),
          physicalCondition: data.physicalCondition
            ? data.physicalCondition
            : undefined,
        }
      : {
          address: "",
          admissionTimePaid: 0,
          fatherName: "",
          motherName: "",
          imageUrl: undefined,
          imagePublicId: undefined,
          name: "",
          dateOfBirth: new Date(),
          physicalCondition: "",
        },
  });

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  // mutations
  const { isPending, mutate } = useMutation({
    mutationFn: updateStudent,
    onSuccess: async (info) => {
      await showMessageOrError(info, qc, ["table_students", "single_student"]);
    },
  });
  async function onSubmit(values: UpdateStudentSchemaType) {
    const newData = {
      ...data,
      ...values,
      sessionDurationInYear: Number(values.sessionDurationInYear),
    };
    if (files?.length) {
      const base64 = await getBase64String(files[0]);
      mutate({ student: newData, base64 });
    } else {
      mutate({ student: newData, base64: null });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full mx-auto py-10 text-white"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select File</FormLabel>
              <FormControl>
                {files?.length ? (
                  <div className="relative ">
                    <Delete
                      className="text-red-500 my-2 cursor-pointer"
                      onClick={() => setFiles([])}
                    />
                    <Image
                      src={URL.createObjectURL(files[0])}
                      height={200}
                      width={200}
                      alt="student-img"
                      className="rounded-md"
                    />
                  </div>
                ) : field.value ? (
                  <div className="relative ">
                    <Delete
                      className="text-red-500 my-2 cursor-pointer"
                      onClick={() => form.setValue("imageUrl", "")}
                    />
                    <Image
                      src={field.value}
                      height={200}
                      width={200}
                      alt="student-img"
                      className="rounded-md"
                    />
                  </div>
                ) : (
                  <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-black/20 rounded-lg p-2"
                  >
                    <FileInput
                      id="fileInput"
                      className="outline-dashed outline-1 outline-slate-500"
                    >
                      <div className="flex items-center justify-center flex-col p-8 w-full ">
                        <CloudUpload className="text-gray-500 w-10 h-10" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {files &&
                        files.length > 0 &&
                        files.map((file, i) => (
                          <FileUploaderItem key={i} index={i}>
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader>
                )}
              </FormControl>
              {!files?.length && (
                <FormDescription>Select a file to upload.</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fatherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" type="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth *</FormLabel>
              <DatetimePicker
                dtOptions={{
                  date: undefined,
                  hour12: true,
                }}
                {...field}
                format={[["days", "months", "years"]]}
              />

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course *</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COURSE_ARRAY.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sessionDurationInYear"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Session Duration *</FormLabel>
              <FormControl>
                <div className="flex flex-row  flex-wrap gap-2">
                  {DURATION_YEARS.map((option, i) => (
                    <Button
                      onClick={() => {
                        form.setValue("sessionLength", "no_session");
                        field.onChange(option);
                      }}
                      className={cn(
                        "flex-none text-white bg-transparent hover:bg-gray-600",
                        field.value === option && "bg-emerald-600"
                      )}
                      type="button"
                      key={i}
                    >
                      {option} {option === "1" ? "year" : "years"}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sessionLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Length *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredSessionBasedOnYear(
                    form.watch("sessionDurationInYear")
                  ).map((item, i) => (
                    <SelectItem key={i} value={item}>
                      {item.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter address"
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Gender *</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col space-y-1"
                >
                  {GENDER_ARRAY.map((option, index) => (
                    <FormItem
                      className="flex items-center space-x-3 space-y-0"
                      key={index}
                    >
                      <FormControl>
                        <RadioGroupItem value={option} />
                      </FormControl>
                      <FormLabel className="font-normal">{option}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormDescription>Select your gender</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="physicalCondition"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Physical condition *</FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col space-y-1"
                >
                  {[
                    ["Normal", "normal"],
                    ["Abnormal", "abnormal"],
                  ].map((option, index) => (
                    <FormItem
                      className="flex items-center space-x-3 space-y-0"
                      key={index}
                    >
                      <FormControl>
                        <RadioGroupItem value={option[1]} />
                      </FormControl>
                      <FormLabel className="font-normal">{option[0]}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="admissionTimePaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Addmission Time paid</FormLabel>
              <FormControl>
                <Input
                  placeholder="amount"
                  type="number"
                  value={field.value}
                  onChange={(e) =>
                    form.setValue("admissionTimePaid", Number(e.target.value))
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <CustomBtn pending={isPending} variant={"signature"} type="submit">
          Update
        </CustomBtn>
      </form>
    </Form>
  );
}
