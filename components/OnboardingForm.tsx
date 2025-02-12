"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import Select from "react-select"
import countryList from "react-select-country-list"
import { useMemo } from "react"

export default function OnboardingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    nationality: "",
  })

  const countryOptions = useMemo(() => countryList().getData(), [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, mobile: value })
  }

  const handleNationalityChange = (selectedOption) => {
    setFormData({ ...formData, nationality: selectedOption.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="mobile">Mobile</Label>
        <PhoneInput
          country={"us"}
          value={formData.mobile}
          onChange={handlePhoneChange}
          inputProps={{
            name: "mobile",
            required: true,
            autoFocus: true,
          }}
        />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="nationality">Nationality</Label>
        <Select
          options={countryOptions}
          value={countryOptions.find((option) => option.value === formData.nationality)}
          onChange={handleNationalityChange}
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
      <Button type="submit">Next</Button>
    </form>
  )
}

