'use client';

   import { useEffect } from 'react';
   import { useTodoStore } from '@/lib/store/todo-store';
import TodoItem from '@/components/TodoItem';

   export function TodoList() {
     const { todos, loading, error, fetchTodos } = useTodoStore();

     useEffect(() => {
       fetchTodos();
     }, [fetchTodos]);

     if (loading) {
       return <div>Loading todos...</div>;
     }

     if (error) {
       return <div className="text-red-500">Error: {error}</div>;
     }

     if (todos.length === 0) {
       return <div>No todos yet. Add one above!</div>;
     }

     return (
       <div className="space-y-2">
         {todos.map((todo) => (
           <TodoItem key={todo.id} todo={todo} />
         ))}
       </div>
     );
   }