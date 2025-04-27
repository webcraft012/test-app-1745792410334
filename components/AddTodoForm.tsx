'use client';

   import { useState } from 'react';
   import { useTodoStore } from '@/lib/store/todo-store';
   import { Input } from '@/components/ui/input';
   import { Button } from '@/components/ui/button';

   export function AddTodoForm() {
     const [newTodoText, setNewTodoText] = useState('');
     const { addTodo } = useTodoStore();

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       if (newTodoText.trim()) {
         await addTodo(newTodoText);
         setNewTodoText('');
       }
     };

     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setNewTodoText(e.target.value);
     };

const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
       if (e.key === 'Enter') {
         handleSubmit(e as any); // Cast to any to bypass type error for now
       }
     };

     return (
       <form onSubmit={handleSubmit} className="flex gap-2">
         <Input
           type="text"
           placeholder="Add a new todo"
           value={newTodoText}
           onChange={handleInputChange}
           onKeyDown={handleInputKeyDown}
           className="flex-grow"
         />
         <Button type="submit">Add</Button>
       </form>
     );
   }