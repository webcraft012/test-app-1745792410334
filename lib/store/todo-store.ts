import { create } from 'zustand';
import type { Todo } from '@/lib/types/todo';
import {
  getTodos,
  addTodo as serverAddTodo,
  updateTodo as serverUpdateTodo,
  deleteTodo as serverDeleteTodo,
  clearCompletedTodos as serverClearCompletedTodos,
} from '@/backend/todo/actions';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  updateTodoText: (id: string, newText: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompletedTodos: () => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const todos = await getTodos();
      set({ todos, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addTodo: async (text: string) => {
    try {
      const newTodo = await serverAddTodo(text);
      set((state) => ({ todos: [...state.todos, newTodo] }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  toggleTodo: async (id: string) => {
    const state = get();
    const todoToToggle = state.todos.find((todo) => todo.id === id);
    if (!todoToToggle) return;

    const updatedTodo = await serverUpdateTodo(id, {
      completed: !todoToToggle.completed,
    });

    if (updatedTodo) {
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        ),
      }));
    } else {
      set({ error: 'Failed to toggle todo' });
    }
  },

  updateTodoText: async (id: string, newText: string) => {
    const updatedTodo = await serverUpdateTodo(id, { text: newText });
    if (updatedTodo) {
      set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? updatedTodo : todo
        ),
      }));
    } else {
      set({ error: 'Failed to update todo text' });
    }
  },

  deleteTodo: async (id: string) => {
    const deletedId = await serverDeleteTodo(id);
    if (deletedId) {
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== deletedId),
      }));
    } else {
      set({ error: 'Failed to delete todo' });
    }
  },

  clearCompletedTodos: async () => {
    const deletedCount = await serverClearCompletedTodos();
    if (deletedCount !== null) {
      set((state) => ({
        todos: state.todos.filter((todo) => !todo.completed),
      }));
    } else {
      set({ error: 'Failed to clear completed todos' });
    }
  },
}));