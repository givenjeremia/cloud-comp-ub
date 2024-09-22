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

const FormSchema = z.object({
  gender: z
    .string({
      required_error: "Mohon pilih salah satu jenis kelamin.",
    }),
  origin: z
    .string({
      required_error: "Mohon pilih salah satu asal nama.",
    }),
  firstLetter: z
    .string({
      required_error: "Mohon pilih salah satu huruf depan.",
    }),
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

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [likedNames, setLikedNames] = useState<{ [uuid: string]: boolean }>({});

  const handleLike = async (uuid: string) => {
    try {
      const response = await fetch(`https://namabuahhati.com/service/api/baby/like-baby-name/${uuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "api-key": `ubaya-baby-backend`,
        },
      });

      setLikedNames((prevState) => ({
        ...prevState,
        [uuid]: true, // Set the liked state to true
      }));

      if (!response.ok) {
        throw new Error("Failed to like");
      }
    } catch (err) {
      console.log(err);
    } finally {
      // setLoading(false);
    }
  };

  const cards = names.map((name) => (
    <Card key={name.name} className="w-96 bg-opacity-10 bg-white text-white text-left h-72 flex flex-col justify-between">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="flex justify-center items-center">
          <span className={`${name.gender == 'M' ? 'bg-blue-400' : 'bg-pink-400'} w-8 h-8 rounded-full p-2 me-2 flex items-center justify-center`}>
            {name.gender == 'M' ? '👦' : '👧'}
          </span>
          <span>{name.name}</span>
        </CardTitle>
        <Button
          variant={"link"}
          size={"icon"}
          onClick={likedNames[name.uuid] ? () => handleLike(name.uuid) : undefined}
        >
          <Heart color="#fff" fill={likedNames[name.uuid] ? '#fff' : 'none'} />
        </Button>
      </CardHeader>
      <CardContent>
        <p>{name.meaning}</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm font-light">- {name.origin}</p>
      </CardFooter>
    </Card>
  ));

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // Request data
    setLoading(true);  // Start loading
    console.log(JSON.stringify(data));
    try {
      const response = await fetch("https://namabuahhati.com/service/api/baby/random-baby-name/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": `ubaya-baby-backend`,
        },
        body: JSON.stringify(data),  // Send form data to API
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
        }} className="flex flex-col items-center px-12 xl:px-24 lg:pt-12">
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-24 w-full flex flex-col items-center justify-center">
            <div className="w-2/3 md:w-full space-y-4 flex flex-col md:flex md:flex-row md:items-start md:justify-center md:space-x-4 md:space-y-0 mb-10 md:mb-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Jenis Kelamin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
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
                  <OriginSelect field={field} />
                )}
              />
              <FormField
                control={form.control}
                name="firstLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Huruf Depan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih huruf depan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
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
              <FormField
                control={form.control}
                name="meaning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Arti Nama</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ketik arti nama" value={field.value ?? ''} onChange={field.onChange} className="text-white placeholder:text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-2/3 md:w-full flex flex-col md:flex md:flex-row md:items-start md:justify-center">
              <button type="submit" disabled={loading} className={`${loading ? "cursor-not-allowed bg-slate-500" : "bg-gradient-to-r from-indigo-600 to-purple-600"}  px-8 rounded-md  text-white focus:ring-2 hover:shadow-xl transition duration-200 h-10`}>
                {loading ? "Mencari..." : "Cari Nama"}
              </button>
            </div>
          </form>
        </Form>
        {names.length > 0 && loaded ? (
          <div className="text-center w-full mb-16">
            <h5 className="mb-6 text-white">Berikut beberapa nama yang sesuai untuk buah hati Anda</h5>
            <Carousel items={cards} />
          </div>
        ) : (names.length <= 0 && loaded ? (
          <div className="text-center w-full mb-16">
            <h5 className="mb-6 text-white">Yahh belum ada nama yang sesuai kriteria Anda</h5>
          </div>
        ) : null)}

        <h2 id="popular" className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-purple-400 to-white inline-block text-transparent bg-clip-text text-center pb-2">Nama-nama bayi terpopuler</h2>

        <BabyDataTable />

        <h2 id="tips" className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-fuchsia-400 to-white inline-block text-transparent bg-clip-text text-center pb-2">Tips-tips memilih nama bayi</h2>
        <HoverEffect items={tips} className="mb-16" />

        <Separator className="mb-8" />

        <div className="w-full flex flex-col lg:flex-row justify-between gap-4 lg:gap-12 mb-16">
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
        </div>
      </motion.div>
    </AuroraBackground>
  );

}
