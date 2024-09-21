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
import React, { useEffect, useState } from "react";
// import React from "react";

import OriginSelect from "@/components/ui/OriginSelect";
import { BabyDataTable } from "./components/LikeTable";

const FormSchema = z.object({
  gender: z
    .string({
      required_error: "Mohon pilih salah satu jenis kelamin.",
    }),
  origin: z
    .string({
      required_error: "Mohon pilih salah satu asal nama.",
    }),
})

export type Name = {
  uuid: string,
  name: string,
  gender: 'M' | 'F',
  meaning: string,
  origin: string,
  like: number,
}

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const [popularNames, setPopularNames] = useState<Name[]>([]);
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedNames, setLikedNames] = useState<{ [uuid: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchNames = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://namabuahhati.com/service/api/baby/data-by-like/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "api-key": `ubaya-baby-backend`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch names");
        }

        const responseData = await response.json();
        console.log(responseData)

        // Extract the 'data' array from the response
        if (Array.isArray(responseData.data)) {
          setPopularNames(responseData.data); // Set the names state with the data array
        } else {
          throw new Error("Response data is not an array");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNames();
  }, []);

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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      // setLoading(false);
    }
  };

  const cards = names.map((name) => (
    <Card key={name.name} className="w-64 bg-opacity-10 bg-white text-white text-left h-56 flex flex-col justify-between">
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
          onClick={() => handleLike(name.uuid)}
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
    console.log(data)
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
      if (err instanceof Error) {
        // If the error is an instance of Error, access its message
        setError(err.message);
      } else {
        // Handle any other types of errors (rare case)
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);  // Stop loading
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
        }} className="flex flex-col items-center px-12 xl:px-24 pt-24">
        <div className="flex items-center justify-center pb-8 lg:pb-0 mt-16">
          <Badge className="me-2 bg-gradient-to-r from-rose-600 to-fuchsia-600">Terbaru&nbsp;✨</Badge>
          <h5 className="text-white">Nama-nama bayi terbaik 2025</h5>
        </div>
        <div className="w-full flex flex-col lg:flex-row justify-center items-center">
          <div className="lg:w-3/5">
            <div className="w-full mb-4">
              <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-white inline-block text-transparent bg-clip-text lg:text-left pb-2 pe-8">Dapatkan nama terbaik untuk buah hati Anda sekarang juga</h1>
            </div>
            <h2 className="text-base font-light mb-0 text-white text-center lg:text-left">Kami memiliki lebih dari 80 ribu nama yang bisa Anda pilih</h2>
          </div>
          <div className="lg:w-2/5">
            <Image
              src="/babies.png"
              width={500}
              height={500}
              alt="Picture of the author"
            />
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mb-24 flex flex-col sm:flex sm:flex-row sm:items-center sm:justify-center sm:space-x-4 sm:space-y-0">
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
                <OriginSelect field={field} />
              )}
            />
            
            <button type="submit" className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
              {loading ? "Mencari..." : "Cari Nama"}
            </button>
          </form>
        </Form>
        {names.length > 0 ? (
          <div className="text-center w-full mb-5">
            <h5 className="mb-6 text-white">Berikut beberapa nama yang sesuai untuk buah hati Anda</h5>
            <div className="w-full">
              <Carousel items={cards} />
            </div>
          </div>
        ) : (null)}
       
        <h2 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-fuchsia-400 to-white inline-block text-transparent bg-clip-text text-center p-2">Nama-nama bayi terpopuler</h2>
        <Card className="w-full p-5 mb-16">
          <div className="w-full">
            <BabyDataTable />
          </div>
        </Card>
        {/* <Table className="mb-16">
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
            {popularNames.map((name) => (
              <TableRow key={name.name}>
                <TableCell className="font-medium">{name.name}</TableCell>
                <TableCell className="font-medium">{name.gender}</TableCell>
                <TableCell>{name.meaning}</TableCell>
                <TableCell>{name.origin}</TableCell>
                <TableCell>{name.like}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
    
      </motion.div>
    </AuroraBackground>
  );

}
