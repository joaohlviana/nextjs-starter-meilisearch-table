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
  const [searchResults, setSearchResults] = useState<Array<Organization>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const table = useReactTable({
    data: searchResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const index = meilisearchClient.getIndex("organizations");

  async function verifyConnection() {
    try {
      await meilisearchClient.health();
      setIsConnected(true);
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = 'Unable to connect to Meilisearch server. Please ensure it is running at ' + 
        process.env.NEXT_PUBLIC_MEILISEARCH_URL;
      setError(errorMessage);
      setIsConnected(false);
      return false;
    }
  }

  async function search(query = "") {
    try {
      if (!isConnected && !(await verifyConnection())) {
        return [];
      }

      setError(null);
      const results = await index.search(truncate(query, 50));
      console.log("Search results:", results);
      return results.hits;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? `Search error: ${err.message}` 
        : 'Failed to fetch search results. Please check your Meilisearch configuration.';
      console.error("Search error:", err);
      setError(errorMessage);
      return [];
    }
  }

  useEffect(() => {
    (async () => {
      try {
        if (await verifyConnection()) {
          const results = await search();
          setSearchResults(results);
        }
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
          disabled={!isConnected}
        />
      </div>
      {error && (
        <div className="text-red-500 mb-4 p-4 border border-red-200 rounded-md bg-red-50">
          {error}
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
          disabled={!table.getCanPreviousPage() || !isConnected}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || !isConnected}
        >
          Next
        </Button>
      </div>
    </div>
  )
}