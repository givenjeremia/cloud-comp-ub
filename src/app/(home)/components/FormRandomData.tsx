// import React from 'react';
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";// Replace with your actual import
// import OriginSelect from "@/components/ui/OriginSelect";
// import { Carousel } from "@/components/ui/apple-cards-carousel";

// const NameSearchForm = ({ form, onSubmit, loading, names, cards }) => {
//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="w-2/3 space-y-6 mb-24 flex flex-col sm:flex sm:flex-row sm:items-center sm:justify-center sm:space-x-4 sm:space-y-0"
//       >
//         <FormField
//           control={form.control}
//           name="gender"
//           render={({ field }) => (
//             <FormItem>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Jenis Kelamin" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="M">Laki-laki</SelectItem>
//                   <SelectItem value="F">Perempuan</SelectItem>
//                   <SelectItem value="">Unisex</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
        
//         <FormField
//           control={form.control}
//           name="origin"
//           render={({ field }) => <OriginSelect field={field} />}
//         />

//         <button
//           type="submit"
//           className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
//         >
//           {loading ? "Mencari..." : "Cari Nama"}
//         </button>
//       </form>

//       {names.length > 0 && (
//         <div className="text-center w-full mb-5">
//           <h5 className="mb-6 text-white">Berikut beberapa nama yang sesuai untuk buah hati Anda</h5>
//           <div className="w-full">
//             <Carousel items={cards} />
//           </div>
//         </div>
//       )}
//     </Form>
//   );
// };

// export default NameSearchForm;
