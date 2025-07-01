import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import AddFeesForm from "./AddFeesForm";

const AddFeesModal = ({
  children,
  session,
  studentId,
}: {
  children: ReactNode;
  session: string;
  studentId: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <AddFeesForm studentId={studentId} session={session} />
      </DialogContent>
    </Dialog>
  );
};

export default AddFeesModal;
