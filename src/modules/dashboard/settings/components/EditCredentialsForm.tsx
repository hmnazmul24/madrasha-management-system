"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { clientEnv } from "@/data/env/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Loading from "../../components/Loading";
import { settingSchema } from "../schemas/settings.schema";
import {
  getMadrashaUserName,
  updateMadrashPassword,
} from "../server/settings.action";

// Zod Schema (you can modify if needed)
const formSchema = settingSchema;

// Type inference from Zod
type SettingsFormType = z.infer<typeof formSchema>;

export default function EditCredentialsForm() {
  //query data
  const { isPending, error, data } = useQuery({
    queryKey: ["madrashUserName"],
    queryFn: () => getMadrashaUserName(),
  });

  // mutatations
  const updateMutate = useMutation({
    mutationFn: updateMadrashPassword,
    onSuccess: (info) => {
      if (info.errorMessage) {
        toast.error(info.errorMessage);
      }
      if (info.successMessage) {
        toast.success(info.successMessage);
        form.reset();
      }
    },
  });
  const form = useForm<SettingsFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newConfirmPassword: "",
    },
  });

  const onSubmit = (values: SettingsFormType) => {
    updateMutate.mutate(values);
  };

  if (isPending) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  if (error) {
    return <div>Error occurs, try refresh</div>;
  }

  return (
    <Card className="max-w-md mx-auto shadow-lg rounded-2xl p-6 bg-transparent">
      <CardHeader>
        <CardTitle className="text-xl">Update Credentials</CardTitle>
        <p className="text-muted-foreground text-sm">
          Change your password below
        </p>
      </CardHeader>

      <CardContent>
        {/* Static Username Display */}
        <div className="mb-6">
          <h1 className="text-sm font-medium">Username</h1>
          <div className="bg-muted px-3 py-2 rounded-md text-sm font-semibold">
            {clientEnv.NEXT_PUBLIC_MADRASHA_USERNAME_PREFIX + data.userName}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Old Password */}
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="px-2 py-2 bg-muted border border-input rounded-l-md text-sm text-muted-foreground">
                        {clientEnv.NEXT_PUBLIC_MADRASHA_PASSWORD_PREFIX}
                      </span>
                      <Input
                        {...field}
                        placeholder="Enter current password"
                        type="password"
                        className="rounded-l-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="px-2 py-2 bg-muted border border-input rounded-l-md text-sm text-muted-foreground">
                        {clientEnv.NEXT_PUBLIC_MADRASHA_PASSWORD_PREFIX}
                      </span>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter new password"
                        className="rounded-l-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="newConfirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Re-enter new password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <CustomBtn
              pending={updateMutate.isPending}
              variant={"signature"}
              type="submit"
              className="w-full"
            >
              Update Password
            </CustomBtn>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
