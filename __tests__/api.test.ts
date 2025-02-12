import { NextRequest } from "next/server"
import { POST as verifyPOST } from "../app/api/verify/route"
import { POST as createClientPOST } from "../app/api/create-client/route"
import { jest, describe, it, expect } from "@jest/globals"

// Mock the fetch function
global.fetch = jest.fn()

describe("POST /api/create-client", () => {
  it("should create a client successfully", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: "test-client-id" }),
    })

    const req = new NextRequest("http://localhost:3000/api/create-client", {
      method: "POST",
      body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        mobile: "+12345678910",
        dateOfBirth: "1990-01-01",
        nationality: "GB",
      }),
    })

    const response = await createClientPOST(req)
    const data = await response.json()

    expect(data.clientId).toBe("test-client-id")
  })
})

describe("POST /api/verify", () => {
  it("should return success status when verification is successful", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          document: {
            firstName: "John",
            lastName: "Doe",
            dateOfBirth: "1990-01-01",
          },
        }),
    })

    const req = new NextRequest("http://localhost:3000/api/verify", {
      method: "POST",
      body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        clientId: "test-client-id",
        checkId: "test-check-id",
      }),
    })

    const response = await verifyPOST(req)
    const data = await response.json()

    expect(data.status).toBe("Identity verified successfully")
  })

  it("should return failure status when verification fails", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          document: {
            firstName: "Jane",
            lastName: "Doe",
            dateOfBirth: "1995-01-01",
          },
        }),
    })

    const req = new NextRequest("http://localhost:3000/api/verify", {
      method: "POST",
      body: JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1990-01-01",
        clientId: "test-client-id",
        checkId: "test-check-id",
      }),
    })

    const response = await verifyPOST(req)
    const data = await response.json()

    expect(data.status).toBe("Identity verification failed")
  })
})

