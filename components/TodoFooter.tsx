'use client';

 import { useTodoStore } from '@/lib/store/todo-store';
 import { Button } from '@/components/ui/button';

 export function TodoFooter() {
  const { todos, clearCompletedTodos } = useTodoStore();

  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const hasCompletedTodos = completedTodosCount > 0;

  const handleClearCompleted = () => {
    clearCompletedTodos();
  };

  return (
    <div className="flex justify-end mt-4">
      <Button
        variant="outline"
        onClick={handleClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear Completed ({completedTodosCount})
      </Button>
    </div>
  );
 }