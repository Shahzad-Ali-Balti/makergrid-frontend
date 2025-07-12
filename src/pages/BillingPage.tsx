import { useSubscription } from "@/hooks/subscription-user";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const BillingPage: React.FC = () => {
  const { isFree, isMaker, isArtisan } = useSubscription();
  const [price, setPrice] = useState<string>("0.00");
  const [planLabel, setPlanLabel] = useState<string>("Free");
  // const[subscription_type]=useAuth()

  useEffect(() => {
    if (isMaker) {
      setPrice("19.99");
      setPlanLabel("Maker");
    } else if (isArtisan) {
      setPrice("49.99");
      setPlanLabel("Artisan");
    } else {
      setPrice("0.00");
      setPlanLabel("Free");
    }
  }, [isFree, isMaker, isArtisan]);

  return (
    <div className="px-5 py-5 flex flex-col gap-5">
      <div>
        <h1 className="font-bold text-3xl font-cinzel text-[--gold-default] pb-3">Billing</h1>
        <p className="pl-5 text-sm">Manage your billing information and invoices.</p>
      </div>

      <div>
        <h1 className="font-bold text-xl font-cinzel text-[--gold-default] pb-3">Overview</h1>
        <div className="border rounded-2xl flex flex-col gap-3 px-5 py-5">
          <h3 className="font-bold">Current Billing Period</h3>
          <p>
            <span className="font-bold text-xl text-[--gold-default]">${price}</span>{" "}
            <span className="text-sm">per month</span>
          </p>
          <p className="text-sm">You're currently on a <strong className="text-[--gold-default]">{planLabel}</strong> plan.</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-xl font-cinzel text-[--gold-default] pb-3">Payment Method</h1>
        <div className="px-5 py-5 border rounded-xl flex justify-between text-sm">
          <p>No Payment Method</p>
          <button className="border rounded-lg bg-[--gold-default] p-1 text-[--navy-dark] text-[15px] px-2">
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
