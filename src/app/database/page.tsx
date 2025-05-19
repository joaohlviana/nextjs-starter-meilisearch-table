import { DatabaseItems } from "./database-items"

export default function DatabasePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Database Items</h1>
      <DatabaseItems />
    </div>
  )
}