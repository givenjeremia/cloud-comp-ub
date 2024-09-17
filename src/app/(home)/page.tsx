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

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const names = [
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
  ]
   

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Request data
    console.log(data)
  }

  return (
    <main className="flex flex-col items-center px-12 xl:px-24">
      <div className="flex items-center justify-center pb-8 mt-16">
        <Badge className="me-2">Terbaru&nbsp;✨</Badge>
        <h5>Nama-nama bayi terbaik 2025</h5>
      </div>
      <div className="w-full xl:w-3/5 mb-4">
        <h1 className="text-5xl font-extrabold text-center">Dapatkan nama terbaik untuk buah hati Anda sekarang juga</h1>
      </div>
      <h2 className="text-base font-light mb-24">Kami memiliki lebih dari 80 ribu nama yang bisa Anda pilih</h2>
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
          <Button type="submit">Cari Nama</Button>
        </form>
      </Form>
      <h5 className="mb-12">Berikut beberapa nama yang sesuai untuk buah hati Anda</h5>
      <div className="flex justify-center space-x-6 mb-24">
        <Card className="w-64">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex justify-center items-center">
              <span className="w-8 h-8 rounded-full bg-blue-400 p-2 me-2 flex items-center justify-center">
                👦
              </span>
              <span>Adam</span>
            </CardTitle>
            <Button variant={"link"} size={"icon"}><Heart fill="#000" /></Button>
          </CardHeader>
          <CardContent>
            <p>Nama pria pertama / manusia pertama</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm font-light">- Afghanistan</p>
          </CardFooter>
        </Card>
        <Card className="w-64">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex justify-center items-center">
              <span className="w-8 h-8 rounded-full bg-pink-400 p-2 me-2 flex items-center justify-center">
                👧
              </span>
              <span>Eve</span>
            </CardTitle>
            <Button variant={"link"} size={"icon"}><Heart /></Button>
          </CardHeader>
          <CardContent>
            <p>Nama wanita pertama / manusia pertama</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm font-light">- Afghanistan</p>
          </CardFooter>
        </Card>
      </div>
      <h2 className="text-4xl font-extrabold mb-8">Nama-nama bayi terpopuler</h2>
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
    </main>
  );

}
