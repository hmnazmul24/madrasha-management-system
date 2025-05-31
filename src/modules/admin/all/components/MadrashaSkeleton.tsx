import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const MadrashaSkeleton = () => {
  return (
    <Card className="w-full flex-none max-w-md shadow-xl rounded-2xl border border-muted">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-6 w-2/3 rounded-md" />
        <Badge variant="secondary">
          <Skeleton className="h-4 w-12" />
        </Badge>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 text-sm mt-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between mt-2">
        <div className="space-y-1 text-xs">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Button variant="outline" size="sm" disabled>
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MadrashaSkeleton;
