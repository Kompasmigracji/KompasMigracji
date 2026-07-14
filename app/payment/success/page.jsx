/* /payment/success — providers redirect here after checkout, on both
   success AND failure/cancel (P24 in particular has a single urlReturn
   for every outcome). Actual status check happens client-side in
   PaymentStatusClient against our own DB, not by trusting this URL. */
import { Suspense } from "react";
import PaymentStatusClient from "@/components/payment/PaymentStatusClient";

export const metadata = {
  title: "Płatność — Kompas Migracji",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentStatusClient />
    </Suspense>
  );
}
