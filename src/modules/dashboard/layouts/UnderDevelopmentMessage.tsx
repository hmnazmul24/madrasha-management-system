import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function UnderDevelopmentMessage() {
  return (
    <AlertDialog open>
      <AlertDialogTrigger asChild />
      <AlertDialogContent className="text-center">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-blue-600">
            Under Development 🐤
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            We&apos;re making some updates. Please bear with us — It may take a
            few hours.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
