import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreHorizontal, Edit, Trash2, UserCheck, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'accountant' | 'principal';
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
  permissions: string[];
}

const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@school.edu',
    phone: '+91-9876543210',
    role: 'principal',
    department: 'Administration',
    joinDate: '2020-01-15',
    status: 'active',
    permissions: ['all'],
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@school.edu',
    phone: '+91-9876543211',
    role: 'admin',
    department: 'Administration',
    joinDate: '2021-03-20',
    status: 'active',
    permissions: ['students', 'fees', 'reports'],
  },
  {
    id: '3',
    name: 'Amit Singh',
    email: 'amit.singh@school.edu',
    phone: '+91-9876543212',
    role: 'accountant',
    department: 'Accounts',
    joinDate: '2021-07-10',
    status: 'active',
    permissions: ['fees', 'reports'],
  },
  {
    id: '4',
    name: 'Sneha Patel',
    email: 'sneha.patel@school.edu',
    phone: '+91-9876543213',
    role: 'staff',
    department: 'Front Office',
    joinDate: '2022-01-05',
    status: 'active',
    permissions: ['students', 'fees'],
  },
];

const getRoleBadge = (role: StaffMember['role']) => {
  const colors = {
    principal: 'bg-primary/10 text-primary border-primary/20',
    admin: 'bg-secondary/10 text-secondary border-secondary/20',
    accountant: 'bg-success/10 text-success border-success/20',
    staff: 'bg-warning/10 text-warning border-warning/20',
  };
  
  return (
    <Badge className={colors[role]}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  );
};

const getStatusBadge = (status: StaffMember['status']) => {
  return status === 'active' ? (
    <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
  ) : (
    <Badge variant="secondary">Inactive</Badge>
  );
};

export const Staff: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  if (user?.role === 'staff') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground">Staff members and their permissions</p>
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access staff management. This feature is only available for administrators.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const [formData, setFormData] = useState<Partial<StaffMember>>({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    department: '',
    joinDate: '',
    status: 'active',
    permissions: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStaff) {
      setStaff(prev => 
        prev.map(member => 
          member.id === editingStaff.id 
            ? { ...member, ...formData }
            : member
        )
      );
      toast({
        title: "Staff member updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newStaff: StaffMember = {
        id: Date.now().toString(),
        ...formData as StaffMember,
      };
      setStaff(prev => [...prev, newStaff]);
      toast({
        title: "Staff member added",
        description: `${formData.name} has been added successfully.`,
      });
    }

    setIsDialogOpen(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'staff',
      department: '',
      joinDate: '',
      status: 'active',
      permissions: [],
    });
  };

  const handleEdit = (member: StaffMember) => {
    setEditingStaff(member);
    setFormData(member);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setStaff(prev => prev.filter(member => member.id !== id));
    toast({
      title: "Staff member removed",
      description: "Staff member has been removed successfully.",
      variant: "destructive",
    });
  };

  const filteredStaff = staff.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground">Manage staff members and their permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </DialogTitle>
              <DialogDescription>
                Add or edit staff member details and permissions.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as StaffMember['role'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as StaffMember['status'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['students', 'fees', 'reports', 'staff', 'settings'].map((permission) => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions?.includes(permission)}
                        onChange={(e) => {
                          const permissions = formData.permissions || [];
                          if (e.target.checked) {
                            setFormData(prev => ({ 
                              ...prev, 
                              permissions: [...permissions, permission] 
                            }));
                          } else {
                            setFormData(prev => ({ 
                              ...prev, 
                              permissions: permissions.filter(p => p !== permission) 
                            }));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm capitalize">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStaff ? 'Update' : 'Add'} Staff Member
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Staff Members
          </CardTitle>
          <CardDescription>
            Manage staff members and their access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Staff Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.permissions.join(', ')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(member.role)}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      {new Date(member.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(member)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(member.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No staff members found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};