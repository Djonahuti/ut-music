"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { Ban, Pencil, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { EditUserForm } from "./edit-user-form"

type User = {
  id: string
  email: string
  fullName: string
  banned: boolean
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    const { data, error } = await supabase.from("users").select("*")
    if (!error && data) setUsers(data)
    setLoading(false)
  }

  async function toggleBan(id: string, banned: boolean) {
    await supabase.from("users").update({ banned: !banned }).eq("id", id)
    fetchUsers()
  }

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

    {loading ? (
      <div className="text-center text-muted-foreground">Loading...</div>
    ):(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.banned ? (
                  <span className="text-red-500">Banned</span>
                ) : (
                  <span className="text-green-500">Active</span>
                )}
              </TableCell>
              <TableCell className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <EditUserForm user={user} onUpdated={fetchUsers} />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => toggleBan(user.id, user.banned)}
                >
                  {user.banned ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
    </div>
  )
}