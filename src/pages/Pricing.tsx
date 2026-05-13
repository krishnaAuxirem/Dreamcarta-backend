import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { subscribePlanApi, getPlansApi, type PlanItem } from '@/lib/api/adminApi';
import { PRICING_PLANS } from '@/constants';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import getApiErrorMessage from '@/lib/api/getApiErrorMessage';

export default function PricingPage() {
  const { user } = useAuth();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      setLoadingPlans(true);
      try {
        const data = await getPlansApi();
        setPlans(data.length > 0 ? data : PRICING_PLANS);
      } catch {
        setPlans(PRICING_PLANS);
      } finally {
        setLoadingPlans(false);
      }
    };
    void loadPlans();
  }, []);

  const handleSubscribe = async (plan: typeof PRICING_PLANS[0]) => {
    if (!user) {
      toast.info('Please login to subscribe');
      return;
    }

    setSubscribingPlanId(plan.id);
    try {
      await subscribePlanApi(plan.id);
      toast.success(`Subscribed to ${plan.name}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Subscription failed'));
    } finally {
      setSubscribingPlanId(null);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="pt-28 pb-12 px-4 gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Pricing</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mt-2 mb-4">
              Invest in Your <span className="text-gradient-gold">Dreams</span>
            </h1>
            <p className="text-white/70 text-xl">Start free, upgrade when ready. Cancel anytime.</p>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loadingPlans ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="h-72 rounded-2xl bg-muted animate-pulse" />
              <div className="h-72 rounded-2xl bg-muted animate-pulse" />
              <div className="h-72 rounded-2xl bg-muted animate-pulse" />
              <div className="h-72 rounded-2xl bg-muted animate-pulse" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border p-6 ${plan.highlighted ? 'bg-primary text-white border-primary shadow-glow scale-105 z-10' : 'bg-card border-border'}`}
              >
                {plan.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${plan.highlighted ? 'bg-amber-400 text-amber-900' : 'bg-primary text-white'}`}>
                    {plan.badge}
                  </span>
                )}
                <h3 className={`font-bold text-xl mb-1 ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  {plan.price === 0 ? (
                    <span className={`text-4xl font-display font-bold ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>Free</span>
                  ) : (
                    <>
                      <span className={`text-xl ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>₹</span>
                      <span className={`text-4xl font-display font-bold ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>{plan.price}</span>
                      <span className={`${plan.highlighted ? 'text-white/70' : 'text-muted-foreground'} text-sm`}>/{plan.period}</span>
                    </>
                  )}
                </div>
                <p className={`text-sm mb-5 ${plan.highlighted ? 'text-white/70' : 'text-muted-foreground'}`}>{plan.description}</p>
                {user ? (
                  <button
                    type="button"
                    disabled={subscribingPlanId === plan.id}
                    onClick={() => void handleSubscribe(plan)}
                    className={`w-full text-center py-3 rounded-xl font-semibold mb-6 transition-all disabled:opacity-60 ${plan.highlighted ? 'bg-white text-primary hover:bg-white/90 shadow-lg' : 'bg-primary text-white hover:bg-primary/90'}`}
                  >
                    {subscribingPlanId === plan.id
                      ? 'Processing...'
                      : plan.price === 0
                        ? 'Activate Free'
                        : `Subscribe ${plan.name}`}{' '}
                    <ArrowRight className="inline w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <Link
                    to="/register"
                    className={`block text-center py-3 rounded-xl font-semibold mb-6 transition-all ${plan.highlighted ? 'bg-white text-primary hover:bg-white/90 shadow-lg' : 'bg-primary text-white hover:bg-primary/90'}`}
                  >
                    {plan.price === 0 ? 'Start Free' : `Get ${plan.name}`} <ArrowRight className="inline w-4 h-4 ml-1" />
                  </Link>
                )}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className={`flex items-start gap-2 text-sm ${plan.highlighted ? 'text-white/90' : 'text-muted-foreground'}`}>
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlighted ? 'text-white' : 'text-green-500'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
            </div>
          )}

          {/* Comparison table */}
          <div className="mt-16">
            <h2 className="font-display text-3xl font-bold text-center mb-8">Full Feature Comparison</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Feature</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className={`p-4 text-center font-semibold ${plan.highlighted ? 'text-primary' : 'text-foreground'}`}>{plan.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Vision Boards', values: ['3', 'Unlimited', 'Unlimited', 'Unlimited'] },
                      { feature: 'Active Goals', values: ['5', 'Unlimited', 'Unlimited', 'Unlimited'] },
                      { feature: 'Habit Trackers', values: ['3', 'Unlimited', 'Unlimited', 'Unlimited'] },
                      { feature: 'AI Coach Chats', values: ['No', '20/month', 'Unlimited', 'Unlimited'] },
                      { feature: 'Community Access', values: ['Yes', 'Yes', 'Yes', 'Yes'] },
                      { feature: 'Blog Publishing', values: ['No', 'Yes', 'Yes', 'Yes'] },
                      { feature: '1-on-1 Coaching', values: ['No', 'No', 'No', 'Yes'] },
                      { feature: 'AR Vision Boards', values: ['No', 'No', 'Beta', 'Yes'] },
                      { feature: 'Voice Journaling', values: ['No', 'No', 'No', 'Yes'] },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-border ${i % 2 === 0 ? 'bg-muted/20' : ''}`}>
                        <td className="p-4 text-sm text-muted-foreground">{row.feature}</td>
                        {row.values.map((val, j) => (
                          <td key={j} className={`p-4 text-center text-sm ${plans[j]?.highlighted ? 'font-semibold text-primary' : ''}`}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold mb-4">Any Questions?</h2>
            <p className="text-muted-foreground mb-6">We are here to help. Contact our team for any pricing questions.</p>
            <div className="flex justify-center gap-4">
              <Link to="/contact" className="btn-primary">Contact Us</Link>
              <Link to="/help" className="btn-outline">Help Center</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
