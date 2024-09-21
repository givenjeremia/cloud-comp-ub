import React, { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { FieldValues, ControllerRenderProps } from "react-hook-form";

interface OriginSelectProps {
  field: ControllerRenderProps<{
    gender: string;
    origin: string;
}, 'origin'>;
}

function OriginSelect({ field }: OriginSelectProps) {
  const [origins, setOrigins] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrigins = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://namabuahhati.com/service/api/baby/data-origin/", {
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
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrigins();
  }, []);

  return (
    <FormItem>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Asal Nama" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {loading && <SelectItem value="loading" disabled>Loading...</SelectItem>}
          {error && <SelectItem value="error" disabled>Error loading origins</SelectItem>}
          {!loading && !error && origins.map((origin, index) => (
            <SelectItem key={index} value={origin}>{origin}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

export default OriginSelect;
