"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import React from "react";

const FormSchema = z.object({
  gender: z
    .string({
      required_error: "Mohon pilih salah satu jenis kelamin.",
    }),
  origin: z
    .string({
      required_error: "Mohon pilih salah satu negara asal.",
    }),
})

export type Name = {
  name: string,
  gender: 'M' | 'F',
  meaning: string,
  origin: string,
  likes: number,
}

const names: Name[] = [
  {
    name: "Adam",
    gender: "M",
    meaning: "Nama pria pertama / manusia pertama",
    origin: "Africa",
    likes: 456,
  },
  {
    name: "Eve",
    gender: "F",
    meaning: "Nama wanita pertama / manusia pertama",
    origin: "Africa",
    likes: 423,
  },
  {
    name: "Adam",
    gender: "M",
    meaning: "Nama pria pertama / manusia pertama",
    origin: "Africa",
    likes: 456,
  },
  {
    name: "Eve",
    gender: "F",
    meaning: "Nama wanita pertama / manusia pertama",
    origin: "Africa",
    likes: 423,
  },
  {
    name: "Adam",
    gender: "M",
    meaning: "Nama pria pertama / manusia pertama",
    origin: "Africa",
    likes: 456,
  },
  {
    name: "Eve",
    gender: "F",
    meaning: "Nama wanita pertama / manusia pertama",
    origin: "Africa",
    likes: 423,
  },
];

export default function Home() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const cards = names.map((name) => (
    <Card key={name.name} className="w-64 bg-opacity-10 bg-white text-white">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex justify-center items-center">
          <span className={`${name.gender == 'M' ? 'bg-blue-400' : 'bg-pink-400'} w-8 h-8 rounded-full p-2 me-2 flex items-center justify-center`}>
            {name.gender == 'M' ? '👦' : '👧'}
          </span>
          <span>{name.name}</span>
        </CardTitle>
        <Button variant={"link"} size={"icon"}><Heart color="#fff" /></Button>
      </CardHeader>
      <CardContent>
        <p>{name.meaning}</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm font-light">- {name.origin}</p>
      </CardFooter>
    </Card>
  ));

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Request data
    console.log(data)
  }

  return (
    <AuroraBackground>
      <motion.div initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }} className="flex flex-col items-center px-12 xl:px-24 pt-24">
        <div className="flex items-center justify-center pb-8 mt-16">
          <Badge className="me-2 bg-rose-600">Terbaru&nbsp;✨</Badge>
          <h5 className="text-white">Nama-nama bayi terbaik 2025</h5>
        </div>
        <div className="w-full xl:w-3/5 mb-4">
          <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-white inline-block text-transparent bg-clip-text p-2">Dapatkan nama terbaik untuk buah hati Anda sekarang juga</h1>
        </div>
        <h2 className="text-base font-light mb-24 text-white">Kami memiliki lebih dari 80 ribu nama yang bisa Anda pilih</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mb-24 sm:flex sm:items-center sm:justify-center sm:space-x-4 sm:space-y-0">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Jenis Kelamin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="M">Laki-laki</SelectItem>
                      <SelectItem value="F">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Asal Nama" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="African">Afrika</SelectItem>
                      <SelectItem value="Anglo">Anglo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit" className="px-4 py-2 rounded-md bg-pink-950 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
              Cari Nama
            </button>
          </form>
        </Form>
        <h5 className="mb-6 text-white">Berikut beberapa nama yang sesuai untuk buah hati Anda</h5>
        <div className="w-full">
          <Carousel items={cards} />
        </div>
        <h2 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-fuchsia-400 to-white inline-block text-transparent bg-clip-text p-2">Nama-nama bayi terpopuler</h2>
        <Table className="mb-16">
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Arti</TableHead>
              <TableHead >Asal</TableHead>
              <TableHead>Jumlah Like</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {names.map((name) => (
              <TableRow key={name.name}>
                <TableCell className="font-medium">{name.name}</TableCell>
                <TableCell className="font-medium">{name.gender}</TableCell>
                <TableCell>{name.meaning}</TableCell>
                <TableCell>{name.origin}</TableCell>
                <TableCell>{name.likes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </AuroraBackground>
  );

}
