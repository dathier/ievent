import { AboutContent } from "@/components/website/about/AboutContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: 'About Us | iEvents',
  description: 'Learn more about iEvents and our mission',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">About Us</CardTitle>
        </CardHeader>
        <CardContent>
          <AboutContent />
        </CardContent>
      </Card>
    </div>
  );
}

