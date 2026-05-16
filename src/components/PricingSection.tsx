import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    desc: "Perfect for quick conversions",
    features: [
      "Up to 10MB file size",
      "5 conversions per day",
      "Standard processing speed",
      "Basic PDF tools",
      "Community support",
    ],
    icon: Zap,
    color: "primary",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    desc: "For power users & freelancers",
    features: [
      "Up to 500MB file size",
      "Unlimited conversions",
      "Priority processing speed",
      "Advanced OCR & AI tools",
      "Direct email support",
    ],
    icon: Crown,
    color: "accent",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Scale with confidence",
    features: [
      "Unlimited file size",
      "Full API access",
      "Custom integration",
      "Dedicated account manager",
      "SLA & priority uptime",
    ],
    icon: Shield,
    color: "foreground",
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="relative overflow-hidden py-24">
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Choose the plan that fits your workflow. No hidden fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass relative flex flex-col rounded-3xl p-8 ${
                plan.popular ? "border-primary/50 shadow-2xl shadow-primary/10" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary`}>
                  <plan.icon className={`h-6 w-6 text-${plan.color === 'foreground' ? 'foreground' : plan.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                variant={plan.popular ? "default" : "outline"}
                className={`w-full rounded-xl font-bold ${
                  plan.popular ? "gradient-primary border-0 text-primary-foreground" : ""
                }`}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
