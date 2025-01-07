import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // In a real application, you would fetch this data from a database
  const venues = [
    {
      id: 1,
      name: "Grand Conference Center",
      location: "Downtown, City",
      image: "/001.jpg",
    },
    {
      id: 2,
      name: "Seaside Convention Hall",
      location: "Beachfront, Resort Town",
      image: "/002.jpg",
    },
    {
      id: 3,
      name: "Mountain View Lodge",
      location: "Alpine Heights",
      image: "/003.jpg",
    },
  ];

  return NextResponse.json(venues);
}
