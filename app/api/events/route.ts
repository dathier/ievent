import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // In a real application, you would fetch this data from a database
  const events = [
    {
      id: 1,
      title: "Tech Conference 2023",
      date: "2023-09-15",
      location: "San Francisco",
    },
    {
      id: 2,
      title: "Music Festival",
      date: "2023-10-01",
      location: "New York",
    },
    { id: 3, title: "Food Expo", date: "2023-11-05", location: "Chicago" },
  ];

  return NextResponse.json(events);
}
