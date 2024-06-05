import { cn } from "@/lib/utils";
import { GiCheckMark } from "react-icons/gi";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardProps extends React.ComponentProps<typeof Card> {
  planType: "Free" | "Premium" | "Tailored";
}

export function PriceCard({ className, planType, ...props }: CardProps) {
  const freeDescription =
    "Perfect to try out Viternity before making a purchase, Downloadable Qr Code included";
  const premiumDescription = "lol";
  const freePlan = ["1 Photo/Video", "255 Characters Limit"];
  const premiumPlan = [
    "10 Photos/Videos",
    "No Character Limit",
    "2 Voice Messages",
    "Private Page Option with Password",
    "Plastic Qr Code With Frame",
    "Two Languages Support",
  ];
  const tailoredPlan = [
    "20 Photos/Videos",
    "No Character Limit",
    "Customizable Vault Themes / Colors",
    "5 Voice Messages",
    "Private Page Option with Password",
    "Ceramic Qr Code With Color Options",
    "Multiple Languages Support",
    "24/7 Customer Support",
    "Automatic Build Option",
    "Custom URL (ex: viternity.com/andrea)",
  ];

  const prices =
    planType === "Free" ? "€0" : planType === "Premium" ? "€49.99" : "€99.99";

  const cardFeatures =
    planType === "Free"
      ? freePlan
      : planType === "Premium"
      ? premiumPlan
      : tailoredPlan;
  return (
    <Card
      className={cn(
        `w-[380px] p-5 shadow-lg border-[4px] border-muted shadow-muted/20 ${
          planType === "Premium"
            ? "border-primary"
            : planType == "Tailored"
            ? ""
            : ""
        }`,
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>
          <p className="text-center">{planType} Plan</p>
        </CardTitle>
        <CardDescription className="text-center py-5 text-4xl font-bold text-accent-foreground">
          {prices}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 px-10 pb-5">
        {cardFeatures.map((featureName, index) => (
          <div key={index} className="flex flex-row gap-5">
            <GiCheckMark className="text-primary" />
            <div className="grow">{featureName}</div>
          </div>
        ))}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
