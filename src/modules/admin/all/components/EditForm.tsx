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

import { showMessageOrError } from "@/lib/show-message-error";
import { DBMadrashaType, EditMadrashaSchemaType } from "../types";
import { editMadrashaSchema } from "../schema/all.schema";
import { eidtMadrasha } from "../server/all.action";

export default function EditMadrashaForm({
  data,
  closeModal,
}: {
  data: DBMadrashaType;
  closeModal: () => void;
}) {
  const qc = useQueryClient();

  const form = useForm<EditMadrashaSchemaType>({
    resolver: zodResolver(editMadrashaSchema),
    defaultValues: {
      address: data.address,
      contactNumber: data.contactNumber.toString(),
      institutionName: data.institutionName,
      oneTimePaid: data.oneTimePaid.toString(),
      ownerName: data.ownerName,
    },
  });

  // mutations

  const { isPending, mutate } = useMutation({
    mutationFn: eidtMadrasha,
    onSuccess: async (info) => {
      await showMessageOrError(info, qc, ["all-madrasha"]);
      if (info.message) {
        form.reset();
        closeModal();
      }
    },
  });

  const onSubmit = (data: EditMadrashaSchemaType) => {
    mutate({ madrashaInfo: data });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-7 w-full mx-auto p-4 border rounded-md shadow-sm backdrop-blur-xs text-white"
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
