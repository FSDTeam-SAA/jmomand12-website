"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDefaultPaymentMethodSummary } from "../api/payment.api";

type BidPaymentConfirmationDialogProps = {
  open: boolean;
  amount: number | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isConfirming?: boolean;
};

export function BidPaymentConfirmationDialog({
  open,
  amount,
  onOpenChange,
  onConfirm,
  isConfirming = false,
}: BidPaymentConfirmationDialogProps) {
  const paymentMethodQuery = useQuery({
    queryKey: ["payments", "default-payment-method"],
    queryFn: getDefaultPaymentMethodSummary,
    enabled: open,
    staleTime: 60_000,
  });

  const card = paymentMethodQuery.data;
  const amountLabel = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount ?? 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Confirm your bid</DialogTitle>
          <DialogDescription>
            Your saved card will be used automatically only if you win this auction.
          </DialogDescription>
        </DialogHeader>

        {paymentMethodQuery.isLoading ? (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your saved card…
          </div>
        ) : card ? (
          <div className="rounded-xl border border-[#dce6f5] bg-[#f8fbff] p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[#003da5]" />
              <div>
                <p className="font-semibold capitalize text-[#111827]">{card.brand} •••• {card.last4}</p>
                <p className="text-sm text-slate-600">Expires {String(card.expMonth).padStart(2, "0")}/{card.expYear}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">Bid amount: <span className="font-semibold text-[#111827]">{amountLabel}</span></p>
          </div>
        ) : (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            We could not verify your saved payment method. Add a card again before bidding.
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isConfirming}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-[#003da5] hover:bg-[#00358e]"
            disabled={!card || paymentMethodQuery.isLoading || isConfirming}
            onClick={() => void onConfirm()}
          >
            {isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Confirm bid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
