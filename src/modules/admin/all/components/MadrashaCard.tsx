"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DBMadrashaType } from "../types";
import { Separator } from "@/components/ui/separator";
import { Copy, ExpandIcon, Pencil } from "lucide-react";
import { toast } from "sonner";
import { clientEnv } from "@/data/env/client";
import { EditModal } from "./EditModal";
import { useMutation } from "@tanstack/react-query";
import { VisitMadrashaLogin } from "../server/all.action";
import { useRouter } from "next/navigation";

const copyToClipboard = (label: string, value: string) => {
  navigator.clipboard.writeText(value);
  toast.success(`${label} copied`);
};

const MadrashaCard = ({
  info,
  onEdit,
}: {
  info: DBMadrashaType;
  onEdit?: () => void;
}) => {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationKey: ["visiting-login"],
    mutationFn: VisitMadrashaLogin,
    onSuccess: () => {
      router.push("/dashboard/overview");
    },
  });

  return (
    <Card className="w-full flex-none max-w-md shadow-xl rounded-2xl border border-muted">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-bold">
          {info.institutionName}
        </CardTitle>
        <Badge
          className="cursor-pointer"
          onClick={() =>
            mutate({ madrashaId: info.id, madrashaName: info.institutionName })
          }
          variant={info.disabled ? "destructive" : "default"}
        >
          visit <ExpandIcon />
        </Badge>
      </CardHeader>

      <Separator />

      <Separator />

      <CardContent className="space-y-3 text-sm mt-4">
        <div>
          <span className="font-medium text-muted-foreground">Owner: </span>
          {info.ownerName}
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Contact: </span>
          {info.contactNumber}
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Address: </span>
          {info.address}
        </div>
        <div>
          <span className="font-medium text-muted-foreground">
            One-Time Paid:{" "}
          </span>
          ৳{info.oneTimePaid.toLocaleString()}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-muted-foreground">
              Username:{" "}
            </span>
            {clientEnv.NEXT_PUBLIC_MADRASHA_USERNAME_PREFIX + info.userName}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              copyToClipboard(
                "Username",
                clientEnv.NEXT_PUBLIC_MADRASHA_USERNAME_PREFIX + info.userName
              )
            }
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-muted-foreground">
              Password:{" "}
            </span>
            {clientEnv.NEXT_PUBLIC_MADRASHA_PASSWORD_PREFIX + info.password}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              copyToClipboard(
                "Password",
                clientEnv.NEXT_PUBLIC_MADRASHA_PASSWORD_PREFIX + info.password
              )
            }
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between text-xs text-muted-foreground mt-2">
        <div>
          <span>Created: {new Date(info.createdAt).toLocaleDateString()}</span>
          <br />
          <span>Updated: {new Date(info.updatedAt).toLocaleDateString()}</span>
        </div>
        <EditModal info={info}>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </EditModal>
      </CardFooter>
    </Card>
  );
};

export default MadrashaCard;
