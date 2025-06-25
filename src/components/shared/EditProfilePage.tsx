"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useAuth } from "@/lib/AuthContext"
import { supabase } from "@/lib/supabase"

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  avatar_url: z.string().url("Must be a valid image URL").optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function EditProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      avatar_url: "",
    },
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)  
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      const { data, error } = await supabase
        .from("users")
        .select("fullName, avatar_url")
        .eq("id", user.id)
        .single()

      if (data) {
        form.reset({
          fullName: data.fullName || "",
          avatar_url: data.avatar_url || "",
        })
      }

      setLoading(false)
    }

    if (user) fetchProfile()
  }, [user, form])

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    setAvatarFile(file)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("media")
      .upload(`avatars/${Date.now()}-${file.name}`, file)
    if (error) {
      toast.error("Avatar upload failed")
      setAvatarUploading(false)
      return
    }
    const { data: publicData } = supabase.storage.from("media").getPublicUrl(data.path)
    if (publicData?.publicUrl) {
      form.setValue("avatar_url", publicData.publicUrl)
      toast.success("Avatar uploaded!")
    }
    setAvatarUploading(false)
  }  

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return

    const { error } = await supabase
      .from("users")
      .update({
        fullName: values.fullName,
        avatar_url: values.avatar_url,
      })
      .eq("id", user.id)

    if (error) {
      toast.error("Failed to update profile")
    } else {
      toast.success("Profile updated successfully")
    }
  }

  if (authLoading || loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Avatar className="mx-auto h-20 w-20">
          <AvatarImage src={form.watch("avatar_url") || ""} />
          <AvatarFallback>{form.watch("fullName")?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">Edit Profile</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL</FormLabel>
                <FormControl>
                  <div>
                    <Input
                      placeholder="https://example.com/avatar.png"
                      {...field}
                      value={field.value || ""}
                      onChange={e => form.setValue("avatar_url", e.target.value)}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-2"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={avatarUploading || loading}>
            {avatarUploading ? "Uploading Avatar..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
