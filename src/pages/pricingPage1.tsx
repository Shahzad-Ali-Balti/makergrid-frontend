import React, { useState } from 'react';
import { Link } from 'wouter';
import ShieldButton from '@/components/ShieldButton';
import { desc } from 'motion/dist/react-client';

import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from '@/hooks/use-auth';
import axiosInstance from '@/lib/axiosInstance';
import { Loader2 } from "lucide-react"
import { useSubscription } from "@/hooks/subscription-user"

type User = {
  id: string
  email: string
  username?: string
  tokens?: number
  subscription_type?: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  loading: boolean
  credits: string
  isAuthenticated: boolean;
  creditsCount: () => Promise<void>
  refreshAccessToken: () => Promise<string | null>
  refreshUser:() => void
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);
const PricingPage1: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
      const [loading, setLoading] = useState(false);
      const { user } = useAuth();

        const handleSubscribe = async (planType:any) => {
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
      

    const plans = [
        {
            name: 'Free',
            price: 'Free',
            features: [
                '5 Model Generations per month',
                'Basic editing tools',
                'Standard resolution exports',
                'Community forum access',
                'Limited badge achievements',
                'Model selling commission (15%)',
            ],
            disabledFeatures: [
                'Advanced AI generation options',
                'G-code generation',
                'Unlimited cloud storage',
                'Custom brushes marketplace access',
                'Expert model refinement',
                'Priority support',
            ],
            highlight: false,
            description: "Perfect for hobbyists and beginners exploring the world of 3D creation.",
            planType: 'free',
            buttonText: 'Get Started Free',
            recommended: false,
        },
        {
            name: 'Maker',
            price: billingCycle === 'monthly' ? '$19.99' : '$191.90',
            features: [
                '25 Model Generations per month',
                'Advanced editing tools',
                'High resolution exports',
                'Community forum access',
                'Full badge achievements',
                'Advanced AI generation options',
                'G-code generation',
                'Custom brushes marketplace access',
                'Model selling commission (10%)',
                
            ],
            disabledFeatures: [
                'Unlimited cloud storage',
                'Expert model refinement',
                'Priority support',
            ],
            highlight: true,
            description: "Designed for active creators who want more capabilities and customization.",
            planType: 'maker',
            buttonText: 'Subscribe Now',
            recommended: true,
        },
        {
            name: 'Artisan',
            price: billingCycle === 'monthly' ? '$49.99' : '$479.90',
            features: [
                'Unlimited Model Generations',
                'Professional editing tools',
                'Maximum resolution exports',
                'Community forum access',
                'Full badge achievements',
                'Advanced AI generation options',
                'G-code generation',
                'Unlimited cloud storage',
                'Custom brushes marketplace access',
                'Expert model refinement',
                'Priority support',
                'Model selling commission (5%)',
            ],
            disabledFeatures: [],
            highlight: false,
            description: "For professional 3D artists and studios requiring unlimited access and priority features.",
            planType: 'artisan',
            buttonText: 'Subscribe Now',
            recommended: false,
        },
    ];
    // const isCurrentPlan = user?.subscription_type?.toLowerCase() === planType.toLowerCase();
    const hasSubscribedPlan = Boolean(user?.subscription_type && user.subscription_type !== 'free');

    return (
        <div className="bg-[--navy-dark] min-h-screen text-white py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-center text-4xl font-cinzel-decorative font-bold mb-4">
                    Choose Your <span className="text-[--gold-default]">Craftsman's Path</span>
                </h1>
                <p className="text-center max-w-2xl mx-auto text-gray-300 mb-8">
                    Select the plan that best fits your creative journey. Upgrade or downgrade anytime as your needs evolve.
                </p>

                {/* Billing Cycle Toggle */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex p-1 bg-[--navy-default] rounded-full border border-[--royal-default]/50">
                        <button
                            type="button"
                            className={`px-6 py-2 rounded-full font-cinzel text-sm ${billingCycle === 'monthly'
                                    ? 'bg-[--royal-default] text-[--gold-default]'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                            onClick={() => setBillingCycle('monthly')}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            className={`px-6 py-2 rounded-full font-cinzel text-sm ${billingCycle === 'annually'
                                    ? 'bg-[--royal-default] text-[--gold-default]'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                            onClick={() => setBillingCycle('annually')}
                        >
                            Annually <span className="text-[--gold-default]">Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative bg-[--navy-default] rounded-lg border ${plan.highlight
                                    ? 'border-2 border-[--gold-default]'
                                    : 'border border-[--royal-default]/30'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-0 w-full bg-[--gold-default] text-[--navy-dark] text-center py-1 font-cinzel text-sm font-bold">
                                    Most Popular
                                </div>
                            )}

                            <div className="p-6 pt-10">
                                <h3 className="font-cinzel text-2xl font-bold mb-2 text-[--gold-default]">
                                    {plan.name}
                                </h3>
                                <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
                                {plan.name !== 'Free' && (
                                    <div className="text-gray-400 text-sm mb-4">
                                        {billingCycle === 'monthly' ? '/month' : '/year'}
                                    </div>
                                )}
                                <p className="text-gray-300 mb-6">{plan.description}</p>

                              
                                    {(user?.subscription_type?.toLowerCase() === plan.planType.toLowerCase()) ? (
                                        <ShieldButton variant="secondary" fullWidth size="lg" disabled>
                                            Your Current Plan
                                        </ShieldButton>
                                    ) : plan.planType === 'free' ? (
                                        <ShieldButton
                                            variant="secondary"
                                            fullWidth
                                            size="lg"
                                            disabled={hasSubscribedPlan}
                                        >
                                            {plan.buttonText}
                                        </ShieldButton>
                                    ) : (
                                        <ShieldButton
                                            variant={plan.recommended ? 'default' : 'secondary'}
                                            fullWidth
                                            size="lg"
                                            onClick={()=>handleSubscribe(plan.planType)}
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : plan.buttonText}
                                        </ShieldButton>
                                    )}
                             

                                <div className="pt-6 border-t border-[--royal-default]/30 mt-6">
                                    <h4 className="font-cinzel font-bold mb-4 text-white text-sm">What's included:</h4>
                                    <ul className="space-y-2 text-sm">
                                        {plan.features.map((feat, i) => (
                                            <li key={i} className="text-gray-200 flex items-start">
                                                <i className="ri-checkbox-circle-fill text-[--gold-default] mr-2 mt-0.5"></i>
                                                {feat}
                                            </li>
                                        ))}
                                        {plan.disabledFeatures.map((feat, i) => (
                                            <li key={i} className="text-gray-500 flex items-start">
                                                <i className="ri-close-circle-line text-gray-500 mr-2 mt-0.5"></i>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default PricingPage1;
