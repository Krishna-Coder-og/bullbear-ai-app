'use client';

import { useState } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@supabase/supabase-js';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const formSchema = z.object({
  symbol: z.string().min(1, "Symbol is required.").max(5, "Symbol must be 5 characters or less.").toUpperCase(),
  type: z.enum(["BUY", "SELL"]),
  quantity: z.coerce.number().positive("Quantity must be positive."),
  price: z.coerce.number().positive("Price must be positive."),
});

export const AddTransactionDialog = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      type: "BUY",
      quantity: '' as any,
      price: '' as any,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to add a transaction.");
      return;
    }
    const supabaseAccessToken = await getToken({ template: 'supabase' });
    if (!supabaseAccessToken) {
      toast.error("Authentication error. Could not get Supabase token.");
      return;
    }
    const authenticatedSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } } }
    );
    const { error } = await authenticatedSupabase
      .from('portfolio_transactions')
      .insert([{ 
          user_id: user.id,
          symbol: values.symbol,
          type: values.type,
          quantity: values.quantity,
          price: values.price,
        }]);
    
    if (error) {
      toast.error("Database Error", { description: error.message });
    } else {
      toast.success("Transaction added successfully!");
      setIsOpen(false);
      // =============================================
      //          THE FIX IS HERE
      // =============================================
      form.reset({
        symbol: "",
        type: "BUY",
        quantity: '' as any,
        price: '' as any,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
          <Plus /> Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Add a New Transaction</DialogTitle>
          <DialogDescription>Enter the details of your stock transaction. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="symbol" render={({ field }) => (<FormItem><FormLabel>Symbol</FormLabel><FormControl><Input placeholder="e.g., AAPL" {...field} className="bg-gray-800 border-gray-700"/></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue /></SelectTrigger></FormControl><SelectContent className="bg-gray-900 border-gray-800 text-white"><SelectItem value="BUY">BUY</SelectItem><SelectItem value="SELL">SELL</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="quantity" render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" step="any" {...field} className="bg-gray-800 border-gray-700"/></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price per Share</FormLabel><FormControl><Input type="number" step="any" {...field} className="bg-gray-800 border-gray-700"/></FormControl><FormMessage /></FormItem>)} />
            <DialogFooter>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">Save Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};