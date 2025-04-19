
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ListTodo, CheckCircle2 } from "lucide-react";
import { userStorage, todoStorage } from "@/utils/storage";

const AdminHome = () => {
  const totalClients = userStorage.getAllUsers().filter(user => user.role === 1).length;
  const totalTodos = todoStorage.getAllTodos().length;
  const completedTodos = todoStorage.getAllTodos().filter(todo => todo.completed).length;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold tracking-tight">Welcome, Admin!</h2>
      <p className="text-muted-foreground">Here's an overview of your system</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">Active users in the system</p>
          </div>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Todos</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTodos}</div>
            <p className="text-xs text-muted-foreground">Tasks created by clients</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTodos}</div>
            <p className="text-xs text-muted-foreground">Successfully completed todos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
