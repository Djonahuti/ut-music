"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface EditUserFormProps {
  user: { id: string; full_name: string };
  onUpdated: () => void;
}

export function EditUserForm({ user, onUpdated }: EditUserFormProps) {
  const [name, setName] = useState(user.full_name)

  async function updateUser() {
    await supabase.from("users").update({ full_name: name }).eq("id", user.id)
    onUpdated()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Edit User</h2>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={updateUser}>Save</Button>
    </div>
  )
}
