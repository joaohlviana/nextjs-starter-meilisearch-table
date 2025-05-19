"use client"

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { meilisearchClient } from "@/lib/meilisearch"
import { useEffect, useState } from "react";
import { Organization, columns } from "./columns"

function truncate(text: string, length: number) {
  if (text.length <= length) {
    return text;
  }

  return text.substr(0, length) + "\u2026";
}

export function DataTable() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<Organization> | any>();
  const [error, setError] = useState<string | null>(null);

  const index = meilisearchClient.getIndex("organizations");

  async function search(query = "") {
    try {
      setError(null);
      const results = await index.search(truncate(query, 50));
      console.log("Search results:", results);
      return results.hits;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch search results';
      console.error("Search error:", err);
      setError(errorMessage);
      return [];
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const results = await search();
        setSearchResults(results);
      } catch (err) {
        console.error("Initial search error:", err);
      }
    })();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Input
          placeholder="Search companies..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            search(event.target.value).then((results) => {
              setSearchResults(results);
            })
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {error ? 'Error loading results' : 'No results.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}