"use client";

import { TodoHeader } from "@/components/TodoHeader";
import { AddTodoForm } from "@/components/AddTodoForm";
import { TodoList } from "@/components/TodoList";
import { TodoFooter } from "@/components/TodoFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-6">
        <TodoHeader />
        <AddTodoForm />
        <TodoList />
        <TodoFooter />
      </div>
    </main>
  );
}
