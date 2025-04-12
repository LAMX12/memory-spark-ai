
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    period: "forever",
    features: [
      "Save & summarize up to 10 items/month",
      "Basic search functionality",
      "1 project board",
      "Mobile & desktop access"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
    link: "/onboarding"
  },
  {
    name: "Pro",
    description: "For individual power users",
    price: "$12",
    period: "per month",
    features: [
      "Unlimited saves & summaries",
      "Advanced semantic search",
      "Daily memory refreshes",
      "Unlimited project boards",
      "Priority support"
    ],
    buttonText: "Start 7-Day Free Trial",
    buttonVariant: "default" as const,
    popular: true,
    link: "/onboarding?plan=pro"
  },
  {
    name: "Team",
    description: "For teams and companies",
    price: "$49",
    period: "per month",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Shared knowledge base",
      "Collaborative project boards",
      "Team insights & analytics",
      "Admin controls"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false,
    link: "/contact"
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="content-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include core features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index}
              className={`glass-card animate-scale-in relative overflow-hidden border ${plan.popular ? 'border-primary shadow-glow' : 'border-border'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 transform rotate-0 origin-top-right">
                    MOST POPULAR
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant={plan.buttonVariant} className="w-full">
                  <Link to={plan.link}>{plan.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
