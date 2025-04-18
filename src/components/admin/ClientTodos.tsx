
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { todoStorage, userStorage, User, Todo } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';
import { useSearchParams } from 'react-router-dom';

const ClientTodos: React.FC = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [clients, setClients] = useState<User[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    loadClients();
    const clientIdParam = searchParams.get('clientId');
    if (clientIdParam) {
      setSelectedClientId(clientIdParam);
    }
  }, [searchParams]);
  
  useEffect(() => {
    if (selectedClientId) {
      loadTodos(selectedClientId);
    }
  }, [selectedClientId]);
  
  const loadClients = () => {
    const clientUsers = userStorage.getClients();
    setClients(clientUsers);
  };
  
  const loadTodos = (clientId: string) => {
    const clientTodos = todoStorage.getTodosByUserId(clientId);
    setTodos(clientTodos);
    setCurrentPage(1);
  };
  
  const handleClientChange = (value: string) => {
    setSelectedClientId(value);
  };
  
  const handleToggleComplete = (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    todoStorage.updateTodo(updatedTodo);
    
    toast({
      title: updatedTodo.completed ? "Todo completed" : "Todo marked incomplete",
      description: updatedTodo.title,
    });
    
    loadTodos(selectedClientId);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(todos.length / itemsPerPage);
  const paginatedTodos = todos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };
  
  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };
  
  const getClientNameById = (id: string): string => {
    const client = clients.find((c) => c.id === id);
    return client ? client.name : "Unknown Client";
  };

  return (
    <Card className="glass animate-fade-in">
      <CardHeader>
        <CardTitle>Client Todos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <label className="text-sm font-medium block mb-2">
            Select Client
          </label>
          <Select value={selectedClientId} onValueChange={handleClientChange}>
            <SelectTrigger className="border-white/20">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedClientId ? (
          <>
            {todos.length > 0 ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  {paginatedTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="p-3 rounded-md hover:bg-accent/10 transition-colors border border-white/10 flex items-center justify-between"
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
                      <div className="text-xs text-muted-foreground">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="animated-btn"
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="animated-btn"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                {getClientNameById(selectedClientId)} doesn't have any todos yet.
              </p>
            )}
          </>
        ) : (
          <p className="text-center py-6 text-muted-foreground">
            Please select a client to view their todos.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientTodos;
