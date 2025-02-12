import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { firstName, lastName, dateOfBirth, clientId, checkId } = await req.json()

  try {
    // Fetch the check result from ComplyCube
    const checkResult = await fetchCheckResult(checkId)

    // Perform identity check
    const identityCheckResult = await performIdentityCheck(firstName, lastName, dateOfBirth, checkResult)

    return NextResponse.json({ status: identityCheckResult })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ status: "Verification failed" }, { status: 500 })
  }
}

async function fetchCheckResult(checkId: string) {
  const response = await fetch(`https://api.complycube.com/v1/checks/${checkId}`, {
    headers: {
      Authorization: `Bearer ${process.env.COMPLYCUBE_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch check result from ComplyCube")
  }

  return response.json()
}

async function performIdentityCheck(firstName: string, lastName: string, dateOfBirth: string, checkResult: any) {
  // Check if the document is authentic
  if (checkResult.document.authenticity.status !== "clear") {
    return "Document authenticity check failed"
  }

  // Check if the document is valid
  if (checkResult.document.validity.status !== "clear") {
    return "Document validity check failed"
  }

  // Compare provided details with document details
  const documentFirstName = checkResult.document.firstName.value
  const documentLastName = checkResult.document.lastName.value
  const documentDob = checkResult.document.dateOfBirth.value

  if (
    documentFirstName.toLowerCase() !== firstName.toLowerCase() ||
    documentLastName.toLowerCase() !== lastName.toLowerCase() ||
    documentDob !== dateOfBirth
  ) {
    return "Identity verification failed: Provided details do not match document"
  }

  // Check for any alerts
  if (checkResult.alerts && checkResult.alerts.length > 0) {
    return "Identity verification failed: Alerts detected"
  }

  return "Identity verified successfully"
}

