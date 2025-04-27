'use client';

   import { useTodoStore } from '@/lib/store/todo-store';

   export function TodoHeader() {
     const { todos } = useTodoStore();

     const pendingCount = todos.filter(todo => !todo.completed).length;
     const completedCount = todos.filter(todo => todo.completed).length;

     return (
       <header className="flex flex-col items-center justify-center py-8">
         <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Todo App</h1>
         <div className="mt-4 text-gray-600 dark:text-gray-300">
           <span>Pending: {pendingCount}</span>
           <span className="ml-4">Completed: {completedCount}</span>
         </div>
       </header>
     );
   }