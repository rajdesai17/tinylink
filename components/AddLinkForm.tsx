"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Link as LinkIcon, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL (e.g., https://example.com)"),
  code: z
    .string()
    .min(6, "Code must be at least 6 characters")
    .max(8, "Code must be at most 8 characters")
    .regex(/^[a-zA-Z0-9]*$/, "Only alphanumeric characters are allowed")
    .optional()
    .or(z.literal("")),
});

interface AddLinkFormProps {
  onLinkAdded: () => void;
}

export default function AddLinkForm({ onLinkAdded }: AddLinkFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload = {
        url: values.url,
        code: values.code || undefined,
      };

      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          form.setError("code", { 
            type: "manual", 
            message: "This code is already taken. Please try another one." 
          });
          return;
        }
        throw new Error(data.error || "Failed to create link");
      }

      toast.success("Link created successfully!", {
        description: `Short link: ${window.location.host}/${data.code}`,
      });
      
      form.reset();
      onLinkAdded();
    } catch (error) {
      toast.error("Error creating link", {
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-none sm:border sm:shadow-sm">
      <CardHeader className="px-0 sm:px-6">
        <CardTitle>Create New Link</CardTitle>
        <CardDescription>
          Enter a long URL to generate a short link. You can optionally provide a custom code.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="https://example.com/very/long/url" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Code (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Wand2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="custom-code" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Leave empty to auto-generate a random 6-character code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Short Link"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
