import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CustomBtn } from "@/components/ui/custom-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SalaryTeacherSchemaType } from "../types/type";
import { salaryTeacherSchema } from "../schema/teacher.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SALARY_PAYMENTS_BD, SALARY_YEARS } from "../constants";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeacherSalary } from "../server/teacher.action";
import { showMessageOrError } from "@/lib/show-message-error";
import { ENGLISH_MONTHS } from "../../students/constants";

export default function GiveSalaryForm({
  name,
  teacherId,
}: {
  name: string;
  teacherId: string;
}) {
  const qc = useQueryClient();
  const form = useForm({
    resolver: zodResolver(salaryTeacherSchema),
    defaultValues: {
      amount: "",
      bonus: "",
      method: "Hand to Hand",
      notes: "",
      month: "",
      year: "",
    },
  });

  // mutations
  const { isPending, mutate } = useMutation({
    mutationFn: createTeacherSalary,
    onSuccess: async (info) => {
      if (info.message) {
        form.reset();
      }
      await showMessageOrError(info, qc, ["salary_records"]);
    },
  });

  function onSubmit(values: SalaryTeacherSchemaType) {
    mutate({ info: values, teacherId });
  }

  return (
    <Dialog>
      <DialogTrigger className="bg-yellow-600 cursor-pointer p-2 rounded-md">
        Give Salary
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="m-2">To : {name}</DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full mx-auto p-4  border rounded-lg"
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount *</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus (optional)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Month (optional)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ENGLISH_MONTHS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Year (optional)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SALARY_YEARS.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Payment Method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SALARY_PAYMENTS_BD.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Give some information about this payment."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CustomBtn
                pending={isPending}
                variant={"signature"}
                type="submit"
              >
                Submit
              </CustomBtn>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
