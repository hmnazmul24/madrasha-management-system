"use client";

import { CustomBtn } from "@/components/ui/custom-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { madrashaSchema } from "../schema/create.schema";
import { MadrashSchemaType } from "../types/types";
import { createMadrasha } from "../server/create.action";
import { showMessageOrError } from "@/lib/show-message-error";

export default function CreateMadrasha() {
  const qc = useQueryClient();

  const form = useForm<MadrashSchemaType>({
    resolver: zodResolver(madrashaSchema),
    defaultValues: {
      address: "",
      contactNumber: "",
      institutionName: "",
      oneTimePaid: "",
      ownerName: "",
    },
  });

  // mutations

  const { isPending, mutate } = useMutation({
    mutationFn: createMadrasha,
    onSuccess: async (info) => {
      await showMessageOrError(info, qc, ["all-madrasha"]);
      if (info.message) {
        form.reset();
      }
    },
  });

  const onSubmit = (data: MadrashSchemaType) => {
    mutate({ madrashaInfo: data });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-7 max-w-lg mx-auto p-4 border rounded-md shadow-sm backdrop-blur-xs text-white"
      >
        <h2 className="text-xl font-semibold">New Madrasha Form</h2>

        <FormField
          control={form.control}
          name="institutionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Institution name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution Onwer Name *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Institution owner name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter contact number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Donation Details */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Institiution location address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="oneTimePaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One Time Paid *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter one time payment"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <CustomBtn pending={isPending} type="submit" variant={"signature"}>
          Submit
        </CustomBtn>
      </form>
    </Form>
  );
}
