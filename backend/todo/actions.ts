'use server';

import { Todo } from '@/lib/types/todo';
import { randomUUID } from 'crypto';

let todos: Todo[] = []; // In-memory storage

export async function getTodos(): Promise<Todo[]> {
  return todos;
}

export async function addTodo(text: string): Promise<Todo> {
  const newTodo: Todo = {
    id: randomUUID(),
    text,
    completed: false,
  };
  todos.push(newTodo);
  return newTodo;
}

export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo | null> {
  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex === -1) {
    return null;
  }
  todos[todoIndex] = { ...todos[todoIndex], ...updates };
  return todos[todoIndex];
}

export async function deleteTodo(id: string): Promise<string | null> {
  const initialLength = todos.length;
  todos = todos.filter(todo => todo.id !== id);
  if (todos.length < initialLength) {
    return id;
  }
  return null;
}

export async function clearCompletedTodos(): Promise<number> {
  const initialLength = todos.length;
  todos = todos.filter(todo => !todo.completed);
  return initialLength - todos.length;
}