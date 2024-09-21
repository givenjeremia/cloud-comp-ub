"use client"

import * as React from "react"
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Baby = {
  id: string
  uuid: string
  name: string
  gender: string
  like: number
  meaning: string; // Add meaning here if it's in the response
}

export const columns: ColumnDef<Baby>[] = [
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

export function BabyDataTable() {
  const [data, setData] = React.useState<Baby[]>([])
  const [loading, setLoading] = React.useState(true)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0); 
  const [filter, setFilter] = React.useState(""); // Add a filter state
  
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Fetch data from API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://namabuahhati.com/service/api/baby/data-by-like/?page=${page}&pageSize=${pageSize}&query=${filter}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "api-key": `ubaya-baby-backend`,
            },
          });
        
        const jsonData = await response.json()
        setData(jsonData.data.data)
        setTotalCount(jsonData.data.pagination.totalCount);
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [page, pageSize, filter]) // Add filter to dependency array

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Silahkan Mencari..."
          value={filter} // Use filter state directly
          onChange={(event) => setFilter(event.target.value)} // Update filter state
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-gray-800">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-gray-800">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalCount)} of {totalCount} Data.
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
          >
            Sebelumnya
          </Button>
          <Button
            onClick={() => setPage((old) => old + 1)}
            disabled={data.length < pageSize}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  )
}
