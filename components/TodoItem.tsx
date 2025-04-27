'use client';

 import type { Todo } from '@/lib/types/todo';
 import { useTodoStore } from '@/lib/store/todo-store';
 import { Checkbox } from '@/components/ui/checkbox';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import { Pencil, Trash2 } from 'lucide-react';
 import { useState } from 'react';

 interface TodoItemProps {
  todo: Todo;
 }

 export default function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, updateTodoText, deleteTodo } = useTodoStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleToggle = () => {
   toggleTodo(todo.id);
  };

  const handleDelete = () => {
   deleteTodo(todo.id);
  };

  const handleEdit = () => {
   setIsEditing(true);
  };

  const handleSave = () => {
   updateTodoText(todo.id, editedText);
   setIsEditing(false);
  };

  const handleCancel = () => {
   setEditedText(todo.text);
   setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   setEditedText(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
   if (e.key === 'Enter') {
    handleSave();
   } else if (e.key === 'Escape') {
    handleCancel();
   }
  };

  return (
   <div className="flex items-center space-x-2 p-2 border-b">
    <Checkbox checked={todo.completed} onCheckedChange={handleToggle} />
    {isEditing ? (
     <Input
      value={editedText}
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      onBlur={handleSave}
      autoFocus
      className="flex-grow"
     />
    ) : (
     <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}>
      {todo.text}
     </span>
    )}
    <div className="flex space-x-1">
     {isEditing ? (
      <>
       <Button variant="ghost" size="sm" onClick={handleSave}>Save</Button>
       <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
      </>
     ) : (
      <Button variant="ghost" size="icon" onClick={handleEdit}>
       <Pencil className="h-4 w-4" />
      </Button>
     )}
     <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="h-4 w-4" />
     </Button>
    </div>
   </div>
  );
 }