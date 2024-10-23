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
import { Facebook, Heart, Mail } from "lucide-react"
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { Carousel } from "@/components/ui/apple-cards-carousel";
import React, { ReactNode, useEffect, useState } from "react";
// import React from "react";

import OriginSelect from "@/components/ui/OriginSelect";
import { BabyDataTable } from "./components/LikeTable";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Navbar } from "./components/Navbar";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { IconBrandFacebook, IconBrandGmail, IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FormSchema = z.object({
  gender: z
    .string().optional(),
  origin: z
    .string().optional(),
  firstLetter: z
    .string().optional(),
  meaning: z.string().optional(),
})

export type Name = {
  uuid: string,
  name: string,
  gender: 'M' | 'F',
  meaning: string,
  origin: string,
  like: number,
}

const tips: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: "Pertimbangkan Arti Nama",
    description:
      "Pilih nama yang memiliki arti positif atau sesuai dengan harapan orang tua",
    icon: <span>📜</span>,
  },
  {
    title: "Perhatikan Pelafalan dan Penulisan",
    description:
      "Pastikan nama mudah diucapkan dan ditulis, terutama agar anak tidak kesulitan di masa depan",
    icon: <span>🖋️</span>,
  },
  {
    title: "Pertimbangkan Keterkaitan Budaya",
    description:
      "Pilih nama yang sesuai dengan latar belakang budaya atau agama keluarga, jika penting bagi Anda",
    icon: <span>🌏</span>,
  },
  {
    title: "Cek Kesamaan Nama dengan Kerabat",
    description:
      "Hindari nama yang terlalu mirip dengan anggota keluarga lain untuk menghindari kebingungan",
    icon: <span>👨‍👩‍👧‍👦</span>,
  },
  {
    title: "Tes Kombinasi Nama Lengkap",
    description:
      "Uji bagaimana nama depan, tengah, dan belakang terdengar jika digabungkan, untuk memastikan harmonis",
    icon: <span>🎶</span>,
  },
  {
    title: "Pikirkan Nama Panggilan",
    description:
      "Pertimbangkan nama panggilan yang mungkin muncul dari nama lengkap, dan pastikan Anda menyukainya.",
    icon: <span>📞</span>,
  },
];

const columns: ColumnDef<Name>[] = [
  {
    accessorKey: "name",
    header: () => <div>Nama</div>,
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "gender",
    header: () => <div>Jenis Kelamin</div>,
    cell: ({ row }) => {
      const gender = row.getValue("gender");
      const displayGender = gender === "F" ? "Perempuan" : gender === "M" ? "Laki Laki" : "Unisex";
      return <div className="capitalize">{displayGender}</div>;
    },
  },
  {
    accessorKey: "meaning",
    header: () => <div>Arti</div>,
    cell: ({ row }) => <div>{row.getValue("meaning")}</div>,
  },
  {
    accessorKey: "origin",
    header: () => <div>Origin</div>,
    cell: ({ row }) => <div>{row.getValue("origin")}</div>,
  },
  {
    accessorKey: "like",
    header: () => <div>Like</div>,
    cell: ({ row }) => <div>{row.getValue("like")}</div>,
  },
]

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [criteria, setCriteria] = useState('');
  const [origins, setOrigins] = useState<string[]>([]);
  const [firstLetter, setFirstLetter] = useState('');
  const [meaning, setMeaning] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    const fetchOrigins = async () => {
      try {
        const response = await fetch("http://ubaya.xyz:7000/kel3_originlist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "api-key": `ubaya-baby-backend`,  // Use the correct API key
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch origins");
        }

        const responseData = await response.json();
        // Extract origins from responseData
        const fetchedOrigins = responseData.data.map((item: { origin: string }) => item.origin);
        setOrigins(fetchedOrigins);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrigins();
  }, []);


  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let url = "http://ubaya.xyz:7000/kel3_";
    // Request data
    setLoading(true);  // Start loading
    switch (criteria) {
      case 'firstLetter':
        url += `babyinit?firstLetter=${firstLetter}`;
        break;
      case 'meaning':
        url += `babymeaning?meaning=${meaning}`;
        break;
      case 'origin':
        url += `babyorigin?origin=${origin}`;
        break;
    }
    console.log(url)
    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Something went wrong with the API request");
      }

      const responseData = await response.json();  // Parse the response data
      if (Array.isArray(responseData.data)) {
        setNames(responseData.data); // Set the names state with the data array
      } else {
        throw new Error("Response data is not an array");
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);  // Stop loading
      setLoaded(true);
    }
  }

  return (
    <AuroraBackground>
      <motion.div initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }} className="flex flex-col items-center px-8 md:px-12 xl:px-24 lg:pt-12">
        <Navbar />
        <div className="flex items-center justify-center pb-8 lg:pb-0 mt-16">
          <Badge className="me-2 bg-gradient-to-r from-blue-600 to-indigo-600">Terbaru&nbsp;✨</Badge>
          <h5 className="text-white">Nama-nama bayi terbaik 2025</h5>
        </div>
        <div id="generator" className="w-full flex flex-col lg:flex-row justify-center items-center">
          <div className="lg:w-3/5">
            <div className="w-full mb-4">
              <TextGenerateEffect words="Dapatkan nama terbaik untuk Buah Hati Anda sekarang juga" />
            </div>
            <h2 className="text-base font-light mb-0 text-white text-center lg:text-left">Kami memiliki lebih dari <span className="font-extrabold">80.000</span> nama yang bisa Anda pilih</h2>
          </div>
          <div className="lg:w-2/5">
            <Image
              src="/babies.png"
              width={500}
              height={500}
              alt="babies"
            />
          </div>
        </div>
        <Select value={criteria} onValueChange={(value) => setCriteria(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih kriteria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="firstLetter">Inisial</SelectItem>
            <SelectItem value="meaning">Arti</SelectItem>
            <SelectItem value="origin">Asal</SelectItem>
          </SelectContent>
        </Select>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-24 w-full flex flex-col items-center justify-center">
            <div className="w-2/3 md:w-full space-y-4 flex flex-col md:flex md:flex-row md:items-start md:justify-center md:space-x-4 md:space-y-0 mb-10 md:mb-6">
              {criteria == 'firstLetter' ? (
                <FormField
                  control={form.control}
                  name="firstLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Huruf Depan</FormLabel>
                      <Select onValueChange={(value) => setFirstLetter(value)} value={firstLetter}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih huruf depan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from(Array(26)).map((_, i) => {
                            const letter = String.fromCharCode(65 + i);
                            return (
                              <SelectItem key={letter} value={letter}>
                                {letter}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : ('')}
              {criteria == 'origin' ? (
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel className="text-white">Asal Nama</FormLabel>
                      <Select onValueChange={(value) => setOrigin(value)} value={origin}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih asal nama" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          {origins.map((origin, index) => (
                            <SelectItem key={index} value={origin}>{origin}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>)}
                />
              ) : ('')}
              {criteria == 'meaning' ? (
                <FormField
                  control={form.control}
                  name="meaning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Arti Nama</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Ketik arti nama" onChange={(e) => setMeaning(e.target.value)} value={meaning} className="text-white placeholder:text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : ('')}
            </div>
            <div className="w-2/3 md:w-full flex flex-col md:flex md:flex-row md:items-start md:justify-center">
              <button type="submit" disabled={loading} className={`${loading ? "cursor-not-allowed bg-slate-500" : "bg-gradient-to-r from-indigo-600 to-purple-600"}  px-8 rounded-md  text-white focus:ring-2 hover:shadow-xl transition duration-200 h-10`}>
                {loading ? "Mencari..." : "Cari Nama"}
              </button>
            </div>
          </form>
        </Form>

        <section className="w-full flex flex-col items-center">
          <h2 id="popular" className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-purple-400 to-white inline-block text-transparent bg-clip-text text-center pb-2">Nama-nama bayi terpopuler</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Arti</TableHead>
                <TableHead>Asal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {names.map((name, idx) => (
                <TableRow key={idx}>
                  <TableCell>{name.name}</TableCell>
                  <TableCell>{name.gender}</TableCell>
                  <TableCell>{name.meaning}</TableCell>
                  <TableCell>{name.origin}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </section>


        <Separator className="mb-8" />

        <footer className="w-full flex flex-col lg:flex-row justify-between gap-4 lg:gap-12 mb-16">
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 to-white inline-block text-transparent bg-clip-text text-center pb-2">Nama Buah Hati</h2>
            <p className="text-sm text-neutral-300 font-light">Nama Buah Hati adalah sebuah website yang dirancang untuk membantu Anda dalam menemukan nama yang sempurna bagi buah hati mereka. Dengan berbagai fitur untuk menghasilkan nama bayi berdasarkan kategori seperti jenis kelamin, asal bahasa, dan huruf depan, Nama Buah Hati memberikan inspirasi untuk nama bayi Anda. Website ini juga memungkinkan Anda untuk menyukai dan membandingkan nama-nama yang paling populer, serta menawarkan rekomendasi tips untuk memilih nama bayi.</p>
          </div>
          <div className="lg:w-1/3">
            <h3 className="text-xl text-left font-extrabold mb-4 text-white pb-2">Kontak Kami</h3>
            <p className="flex text-neutral-100 gap-2 mb-2">
              <IconBrandGmail className="text-pink-300 h-6 w-6" />
              namabuahhati@gmail.com
            </p>
            <p className="flex text-neutral-100 gap-2 mb-2">
              <IconBrandFacebook className="text-pink-300 h-6 w-6" />
              namabuahhati
            </p>
            <p className="flex text-neutral-100 gap-2 mb-2">
              <IconBrandInstagram className="text-pink-300 h-6 w-6" />
              namabuahhati
            </p>
            <p className="flex text-neutral-100 gap-2 mb-2">
              <IconBrandWhatsapp className="text-pink-300 h-6 w-6" />
              +62 831 1234 5678
            </p>
          </div>
        </footer>
      </motion.div>
    </AuroraBackground>
  );

}
