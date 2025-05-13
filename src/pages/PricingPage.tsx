import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import ShieldButton from '@/components/ShieldButton';

import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from '@/hooks/use-auth';
import axiosInstance from '@/lib/axiosInstance';
import { Loader2 } from "lucide-react"
import { useSubscription } from "@/hooks/subscription-user"

const planFeatures = {
  free: [
    { feature: '5 Model Generations per month', included: true },
    { feature: 'Basic editing tools', included: true },
    { feature: 'Standard resolution exports', included: true },
    { feature: 'Community forum access', included: true },
    { feature: 'Limited badge achievements', included: true },
    { feature: 'Advanced AI generation options', included: false },
    { feature: 'G-code generation', included: false },
    { feature: 'Unlimited cloud storage', included: false },
    { feature: 'Custom brushes marketplace access', included: false },
    { feature: 'Expert model refinement', included: false },
    { feature: 'Priority support', included: false },
    { feature: 'Model selling commission', description: '15%', highlight: false }
  ],
  maker: [
    { feature: '25 Model Generations per month', included: true },
    { feature: 'Advanced editing tools', included: true },
    { feature: 'High resolution exports', included: true },
    { feature: 'Community forum access', included: true },
    { feature: 'Full badge achievements', included: true },
    { feature: 'Advanced AI generation options', included: true },
    { feature: 'G-code generation', included: true },
    { feature: 'Unlimited cloud storage', included: false },
    { feature: 'Custom brushes marketplace access', included: true },
    { feature: 'Expert model refinement', included: false },
    { feature: 'Priority support', included: false },
    { feature: 'Model selling commission', description: '10%', highlight: true }
  ],
  artisan: [
    { feature: 'Unlimited Model Generations', included: true },
    { feature: 'Professional editing tools', included: true },
    { feature: 'Maximum resolution exports', included: true },
    { feature: 'Community forum access', included: true },
    { feature: 'Full badge achievements', included: true },
    { feature: 'Advanced AI generation options', included: true },
    { feature: 'G-code generation', included: true },
    { feature: 'Unlimited cloud storage', included: true },
    { feature: 'Custom brushes marketplace access', included: true },
    { feature: 'Expert model refinement', included: true },
    { feature: 'Priority support', included: true },
    { feature: 'Model selling commission', description: '5%', highlight: true }
  ]
};



const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

const PlanCard: React.FC<{
  title: string;
  price: string;
  description: string;
  buttonText: string;
  recommended?: boolean;
  planType: 'free' | 'maker' | 'artisan';
}> = ({ title, price, description, buttonText, recommended = false, planType }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/accounts/stripe/create-checkout-session/", {
        plan: planType,
        email: user?.email,
      });

      const { id } = res.data;
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: id });
      }
    } catch (err) {
      console.error("Stripe Checkout error", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Determine if current user is on this plan
  const isCurrentPlan = user?.subscription_type?.toLowerCase() === planType.toLowerCase();
  const hasSubscribedPlan = Boolean(user?.subscription_type && user.subscription_type !== 'free');

  return (
    <div className={`relative bg-[--navy-default] rounded-lg overflow-hidden ${recommended ? 'border-2 border-[--gold-default]' : 'border border-[--royal-default]/30'}`}>
      {recommended && (
        <div className="absolute top-0 left-0 w-full bg-[--gold-default] text-[--navy-dark] text-center py-1 font-cinzel text-sm font-bold">
          Most Popular
        </div>
      )}

      <div className={`p-6 ${recommended ? 'pt-10' : ''}`}>
        <h3 className="font-cinzel text-2xl font-bold mb-2 text-[--gold-default]">{title}</h3>
        <div className="mb-2">
          <span className="text-3xl font-bold text-white">{price}</span>
          {price !== 'Free' && <span className="text-gray-400 ml-1">/month</span>}
        </div>
        <p className="text-gray-300 mb-6">{description}</p>

        {isCurrentPlan ? (
          <ShieldButton variant="secondary" fullWidth size="lg" disabled>
            Your Current Plan
          </ShieldButton>
        ) : planType === 'free' ? (
          <ShieldButton
            variant="secondary"
            fullWidth
            size="lg"
            disabled={hasSubscribedPlan}
          >
            {buttonText}
          </ShieldButton>
        ) : (
          <ShieldButton
            variant={recommended ? 'default' : 'secondary'}
            fullWidth
            size="lg"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonText}
          </ShieldButton>
        )}

      </div>

      <div className="px-6 pb-6">
        <div className="pt-6 border-t border-[--royal-default]/30">
          <h4 className="font-cinzel font-bold mb-4 text-white">What's included:</h4>
          <ul className="space-y-3">
            {planFeatures[planType].map((feature, index) => (
              <li key={index} className="flex items-start">
                {feature.included ? (
                  <i className="ri-checkbox-circle-fill text-[--gold-default] mt-0.5 mr-2 flex-shrink-0"></i>
                ) : (
                  <i className="ri-close-circle-line text-gray-500 mt-0.5 mr-2 flex-shrink-0"></i>
                )}
                <div>
                  <span className={feature.included ? 'text-gray-200' : 'text-gray-500'}>
                    {feature.feature}
                  </span>
                  {feature.description && (
                    <span className={`ml-2 ${feature.highlight ? 'text-[--gold-default] font-bold' : 'text-gray-400'}`}>
                      ({feature.description})
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};




const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  useEffect(() => {
    // Reset scroll position when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-cinzel-decorative text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-[--gold-default]">Craftsman's Path</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300">
            Select the plan that best fits your creative journey. Upgrade or downgrade anytime as your needs evolve.
          </p>

          <div className="mt-8 inline-flex p-1 bg-[--navy-default] rounded-full border border-[--royal-default]/50">
            <button
              className={`px-6 py-2 rounded-full font-cinzel text-sm ${billingCycle === 'monthly' ? 'bg-[--royal-default] text-[--gold-default]' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-full font-cinzel text-sm ${billingCycle === 'annually' ? 'bg-[--royal-default] text-[--gold-default]' : 'text-gray-300 hover:text-white'}`}
              onClick={() => setBillingCycle('annually')}
            >
              Annually <span className="text-[--gold-default]">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PlanCard
            title="Free"
            price="Free"
            description="Perfect for hobbyists and beginners exploring the world of 3D creation."
            buttonText="Free Plan"
            planType="free"
          />

          <PlanCard
            title="Maker"
            price={billingCycle === 'monthly' ? '$19.99' : '$191.90'}
            description="Designed for active creators who want more capabilities and customization."
            buttonText="Join Maker Plan"
            recommended={true}
            planType="maker"
          />

          <PlanCard
            title="Artisan"
            price={billingCycle === 'monthly' ? '$49.99' : '$479.90'}
            description="For professional 3D artists and studios requiring unlimited access and priority features."
            buttonText="Join Artisan Plan"
            planType="artisan"
          />
        </div>

        <div className="mt-16 bg-[--navy-light] rounded-lg p-8 border border-[--royal-default]/30">
          <h2 className="font-cinzel text-2xl font-bold mb-6 text-center">
            <span className="text-[--gold-default]">Enterprise</span> Solutions
          </h2>

          <div className="md:flex items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <p className="text-gray-300 mb-4">
                Need a custom solution for your business, educational institution, or large team?
                Our enterprise plans include advanced administration features, custom integrations,
                dedicated support, and volume discounts.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <li className="flex items-center text-gray-200">
                  <i className="ri-shield-check-fill text-[--gold-default] mr-2"></i>
                  Team management dashboard
                </li>
                <li className="flex items-center text-gray-200">
                  <i className="ri-shield-check-fill text-[--gold-default] mr-2"></i>
                  Custom branding options
                </li>
                <li className="flex items-center text-gray-200">
                  <i className="ri-shield-check-fill text-[--gold-default] mr-2"></i>
                  API access for integrations
                </li>
                <li className="flex items-center text-gray-200">
                  <i className="ri-shield-check-fill text-[--gold-default] mr-2"></i>
                  Dedicated account manager
                </li>
                <li className="flex items-center text-gray-200">
                  <i className="ri-shield-check-fill text-[--gold-default] mr-2"></i>
                  Custom training workshops
                </li>
                <li className="flex items-center text-gray-200">
                  <i className="ri-shield-check-fill text-[--gold-default] mr-2"></i>
                  Volume licensing discounts
                </li>
              </ul>
            </div>

            <div className="md:w-1/3 flex justify-center">
              <Link href="/enterprise">
                <ShieldButton size="lg">Contact Enterprise Sales</ShieldButton>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="font-cinzel text-2xl font-bold mb-8 text-center">
            Frequently Asked <span className="text-[--gold-default]">Questions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30">
              <h3 className="font-cinzel text-xl font-bold mb-3 text-[--gold-default]">Can I change plans later?</h3>
              <p className="text-gray-300">
                Yes, you can upgrade, downgrade, or cancel your subscription at any time.
                Changes to your subscription will take effect at the start of your next billing cycle.
              </p>
            </div>

            <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30">
              <h3 className="font-cinzel text-xl font-bold mb-3 text-[--gold-default]">What payment methods do you accept?</h3>
              <p className="text-gray-300">
                We accept all major credit cards, PayPal, and select cryptocurrencies.
                Enterprise plans can also be paid via invoice with net-30 terms.
              </p>
            </div>

            <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30">
              <h3 className="font-cinzel text-xl font-bold mb-3 text-[--gold-default]">Do unused model generations roll over?</h3>
              <p className="text-gray-300">
                Free and Maker plan model generations do not roll over each month.
                Artisan plan includes unlimited generations, so rollover isn't applicable.
              </p>
            </div>

            <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30">
              <h3 className="font-cinzel text-xl font-bold mb-3 text-[--gold-default]">What is expert model refinement?</h3>
              <p className="text-gray-300">
                With expert model refinement, our team of 3D professionals will manually optimize and enhance
                your AI-generated models for better printability, aesthetics, and functionality.
              </p>
            </div>

            <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30">
              <h3 className="font-cinzel text-xl font-bold mb-3 text-[--gold-default]">Do you offer a free trial?</h3>
              <p className="text-gray-300">
                Yes! Our Free plan is always available with no time limitation.
                Additionally, we offer a 14-day trial of the Maker plan for new users.
              </p>
            </div>

            <div className="bg-[--navy-default] p-6 rounded-lg border border-[--royal-default]/30">
              <h3 className="font-cinzel text-xl font-bold mb-3 text-[--gold-default]">How do I cancel my subscription?</h3>
              <p className="text-gray-300">
                You can cancel your subscription anytime from your account settings page.
                Your plan benefits will remain active until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;