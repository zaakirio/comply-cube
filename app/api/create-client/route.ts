import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { firstName, lastName, email, mobile, dateOfBirth, nationality } = await req.json()

  try {
    const response = await fetch("https://api.complycube.com/v1/clients", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COMPLYCUBE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "person",
        email: email,
        mobile: mobile,
        telephone: mobile,
        joinedDate: new Date().toISOString().split("T")[0],
        personDetails: {
          firstName: firstName,
          lastName: lastName,
          dob: dateOfBirth,
          nationality: nationality,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create client")
    }

    const data = await response.json()
    return NextResponse.json({ clientId: data.id })
  } catch (error) {
    console.error("Client creation error:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  }
}

