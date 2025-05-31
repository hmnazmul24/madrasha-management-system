import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useRef } from "react";
import { DBMadrashaType } from "../types";
import EditMadrashaForm from "./EditForm";

export function EditModal({
  children,
  info,
}: {
  children: ReactNode;
  info: DBMadrashaType;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => {
    closeRef.current?.click();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <EditMadrashaForm closeModal={closeModal} data={info} />
        <DialogClose ref={closeRef} />
      </DialogContent>
    </Dialog>
  );
}
