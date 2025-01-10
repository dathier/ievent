import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  onReview: (status: string) => void;
  translations: {
    edit: string;
    delete: string;
    review: string;
    deleteTitle: string;
    deleteDescription: string;
    cancel: string;
    confirm: string;
    statusUpdate: string;
    status: {
      pending: string;
      approved: string;
      rejected: string;
    };
  };
}

export function ActionButtons({
  onEdit,
  onDelete,
  onReview,
  translations: t,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={onEdit}>
        {t.edit}
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          const dialog = document.createElement("dialog");
          dialog.innerHTML = `
            <div>
              <h2>${t.statusUpdate}</h2>
              <select>
                <option value="pending">${t.status.pending}</option>
                <option value="approved">${t.status.approved}</option>
                <option value="rejected">${t.status.rejected}</option>
              </select>
              <button onclick="this.closest('dialog').close(); window.tempReviewCallback('approved')">
                ${t.confirm}
              </button>
              <button onclick="this.closest('dialog').close()">
                ${t.cancel}
              </button>
            </div>
          `;
          window.tempReviewCallback = onReview;
          document.body.appendChild(dialog);
          dialog.showModal();
          dialog.addEventListener("close", () => {
            document.body.removeChild(dialog);
            delete window.tempReviewCallback;
          });
        }}
      >
        {t.review}
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => {
          const dialog = document.createElement("dialog");
          dialog.innerHTML = `
            <div>
              <h2>${t.deleteTitle}</h2>
              <p>${t.deleteDescription}</p>
              <button onclick="this.closest('dialog').close(); window.tempDeleteCallback()">
                ${t.confirm}
              </button>
              <button onclick="this.closest('dialog').close()">
                ${t.cancel}
              </button>
            </div>
          `;
          window.tempDeleteCallback = onDelete;
          document.body.appendChild(dialog);
          dialog.showModal();
          dialog.addEventListener("close", () => {
            document.body.removeChild(dialog);
            delete window.tempDeleteCallback;
          });
        }}
      >
        {t.delete}
      </Button>
    </div>
  );
}
