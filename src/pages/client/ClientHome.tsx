
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, CheckCircle2, Clock } from "lucide-react";
import { todoStorage, authStorage } from "@/utils/storage";

const ClientHome = () => {
  const currentUser = authStorage.getCurrentUser();
  const userTodos = todoStorage.getAllTodos().filter(todo => todo.userId === currentUser?.id);
  const completedTodos = userTodos.filter(todo => todo.completed);
  const pendingTodos = userTodos.filter(todo => !todo.completed);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Welcome, {currentUser?.name}!
      </h2>
      <p className="text-muted-foreground">Here's your todo overview</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userTodos.length}</div>
            <p className="text-xs text-muted-foreground">All your created tasks</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTodos.length}</div>
            <p className="text-xs text-muted-foreground">Tasks you've completed</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTodos.length}</div>
            <p className="text-xs text-muted-foreground">Tasks still pending</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientHome;
