import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Filter, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Student } from '@/types';

// Mock data for demonstration
const mockStudents: Student[] = [
  {
    id: '1',
    admissionNumber: 'ADM001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    dateOfBirth: '2008-05-15',
    gender: 'male',
    class: '10',
    section: 'A',
    rollNumber: '15',
    dateOfAdmission: '2020-04-01',
    academicYear: '2024-25',
    fatherName: 'Ram Kumar',
    fatherOccupation: 'Engineer',
    fatherContact: '+91-9876543210',
    fatherEmail: 'ram.kumar@email.com',
    motherName: 'Sita Kumar',
    motherOccupation: 'Teacher',
    motherContact: '+91-9876543211',
    motherEmail: 'sita.kumar@email.com',
    permanentAddress: '123 Main Street',
    currentAddress: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400001',
    country: 'India',
    status: 'active',
  },
  {
    id: '2',
    admissionNumber: 'ADM002',
    firstName: 'Priya',
    lastName: 'Sharma',
    dateOfBirth: '2009-03-22',
    gender: 'female',
    class: '9',
    section: 'B',
    rollNumber: '23',
    dateOfAdmission: '2021-04-01',
    academicYear: '2024-25',
    fatherName: 'Suresh Sharma',
    fatherOccupation: 'Doctor',
    fatherContact: '+91-9876543212',
    fatherEmail: 'suresh.sharma@email.com',
    motherName: 'Meera Sharma',
    motherOccupation: 'Nurse',
    motherContact: '+91-9876543213',
    motherEmail: 'meera.sharma@email.com',
    permanentAddress: '456 Park Avenue',
    currentAddress: '456 Park Avenue',
    city: 'Delhi',
    state: 'Delhi',
    pinCode: '110001',
    country: 'India',
    discountType: 'SC',
    discountPercentage: 25,
    status: 'active',
  },
  {
    id: '3',
    admissionNumber: 'ADM003',
    firstName: 'Amit',
    lastName: 'Singh',
    dateOfBirth: '2007-08-10',
    gender: 'male',
    class: '11',
    section: 'C',
    rollNumber: '08',
    dateOfAdmission: '2019-04-01',
    academicYear: '2024-25',
    fatherName: 'Vijay Singh',
    fatherOccupation: 'Business',
    fatherContact: '+91-9876543214',
    fatherEmail: 'vijay.singh@email.com',
    motherName: 'Sunita Singh',
    motherOccupation: 'Homemaker',
    motherContact: '+91-9876543215',
    motherEmail: 'sunita.singh@email.com',
    permanentAddress: '789 Green Lane',
    currentAddress: '789 Green Lane',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560001',
    country: 'India',
    discountType: 'RTE',
    discountPercentage: 100,
    status: 'active',
  },
];

const getStatusBadge = (status: Student['status']) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
    case 'inactive':
      return <Badge variant="secondary">Inactive</Badge>;
    case 'transferred':
      return <Badge className="bg-warning/10 text-warning border-warning/20">Transferred</Badge>;
    case 'withdrawn':
      return <Badge variant="destructive">Withdrawn</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getDiscountBadge = (type?: string, percentage?: number) => {
  if (!type) return null;
  
  const colors = {
    RTE: 'bg-primary/10 text-primary border-primary/20',
    SC: 'bg-secondary/10 text-secondary border-secondary/20',
    ED: 'bg-warning/10 text-warning border-warning/20',
  };
  
  return (
    <Badge className={colors[type as keyof typeof colors]}>
      {type} ({percentage}%)
    </Badge>
  );
};

export const StudentList: React.FC = () => {
  const [students] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = classFilter === 'all' || !classFilter || student.class === classFilter;
    const matchesStatus = statusFilter === 'all' || !statusFilter || student.status === statusFilter;
    
    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage student records and information</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
          <CardDescription>
            View and manage all student information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="8">Class 8</SelectItem>
                <SelectItem value="9">Class 9</SelectItem>
                <SelectItem value="10">Class 10</SelectItem>
                <SelectItem value="11">Class 11</SelectItem>
                <SelectItem value="12">Class 12</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="transferred">Transferred</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Students Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent Contact</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.admissionNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Roll No: {student.rollNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {student.class}-{student.section}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{student.fatherContact}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.fatherEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getDiscountBadge(student.discountType, student.discountPercentage)}
                    </TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};