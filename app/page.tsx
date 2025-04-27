/**
 * Main page component as an async server component.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-center text-gray-600">
            This is a Next.js application with the structure in place.
          </p>
        </div>
      </div>
    </main>
  );
}
