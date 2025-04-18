
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { todoStorage, authStorage, Todo } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

const TodoList: React.FC = () => {
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  
  useEffect(() => {
    loadTodos();
  }, []);
  
  const loadTodos = () => {
    const currentUser = authStorage.getCurrentUser();
    if (currentUser) {
      const userTodos = todoStorage.getTodosByUserId(currentUser.id);
      setTodos(userTodos);
    }
  };
  
  const handleToggleComplete = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    todoStorage.updateTodo(updatedTodo);
    
    toast({
      title: updatedTodo.completed ? "Todo completed" : "Todo marked incomplete",
      description: updatedTodo.title,
    });
    
    loadTodos();
  };
  
  const handleDelete = (id: string) => {
    todoStorage.deleteTodo(id);
    
    toast({
      title: "Todo deleted",
      description: "Your todo has been deleted successfully",
    });
    
    loadTodos();
  };
  
  if (todos.length === 0) {
    return (
      <Card className="glass animate-fade-in">
        <CardHeader>
          <CardTitle>My Todos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">
            You don't have any todos yet. Create one to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass animate-fade-in">
      <CardHeader>
        <CardTitle>My Todos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li 
              key={todo.id} 
              className="flex items-center justify-between p-3 rounded-md hover:bg-accent/10 transition-colors border border-white/10"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleComplete(todo)}
                  className="animated-btn"
                />
                <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.title}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(todo.id)}
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 animated-btn"
              >
                <Trash2 size={16} />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TodoList;
