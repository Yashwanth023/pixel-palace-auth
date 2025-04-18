
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userStorage, User } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';
import { Phone, Mail, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientList: React.FC = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    loadClients();
  }, []);
  
  const loadClients = () => {
    const clientUsers = userStorage.getClients();
    setClients(clientUsers);
  };
  
  // Calculate pagination
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const paginatedClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };
  
  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };
  
  if (clients.length === 0) {
    return (
      <Card className="glass animate-fade-in">
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-muted-foreground">
            No clients registered yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass animate-fade-in">
      <CardHeader>
        <CardTitle>Client List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paginatedClients.map((client) => (
            <div 
              key={client.id} 
              className="p-4 rounded-md hover:bg-accent/10 transition-colors border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium">{client.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Mail size={12} />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={12} />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link to={`/admin/todos?clientId=${client.id}`}>
                  <Button variant="outline" size="sm" className="animated-btn">
                    View Todos
                  </Button>
                </Link>
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
      </CardContent>
    </Card>
  );
};

export default ClientList;
