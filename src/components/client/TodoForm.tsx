
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { todoStorage, authStorage } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';

const TodoForm: React.FC = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Todo title cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    const currentUser = authStorage.getCurrentUser();
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create a todo",
        variant: "destructive",
      });
      return;
    }
    
    const newTodo = {
      id: uuidv4(),
      userId: currentUser.id,
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    
    todoStorage.addTodo(newTodo);
    
    toast({
      title: "Todo created",
      description: "Your todo has been created successfully",
    });
    
    setTitle('');
  };

  return (
    <Card className="glass animate-fade-in">
      <CardHeader>
        <CardTitle>Create a New Todo</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Todo Title
              </label>
              <Input
                id="title"
                placeholder="Enter your todo here..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-white/20"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full animated-btn">
            Create Todo
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TodoForm;
