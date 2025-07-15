import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSupabase } from '@/hooks/useSupabase';
import type { Student } from '@/types';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student | null;
  onSuccess: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  isOpen,
  onClose,
  student,
  onSuccess,
}) => {
  const { createStudent, updateStudent, loading } = useSupabase();
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [dateOfAdmission, setDateOfAdmission] = useState<Date>();

  const [formData, setFormData] = useState({
    admission_number: student?.admissionNumber || '',
    first_name: student?.firstName || '',
    middle_name: student?.middleName || '',
    last_name: student?.lastName || '',
    date_of_birth: student?.dateOfBirth || '',
    gender: student?.gender || 'male',
    class: student?.class || '',
    section: student?.section || '',
    roll_number: student?.rollNumber || '',
    date_of_admission: student?.dateOfAdmission || '',
    academic_year: student?.academicYear || '2024-25',
    father_name: student?.fatherName || '',
    father_occupation: student?.fatherOccupation || '',
    father_contact: student?.fatherContact || '',
    father_email: student?.fatherEmail || '',
    mother_name: student?.motherName || '',
    mother_occupation: student?.motherOccupation || '',
    mother_contact: student?.motherContact || '',
    mother_email: student?.motherEmail || '',
    guardian_name: student?.guardianName || '',
    guardian_relationship: student?.guardianRelationship || '',
    guardian_contact: student?.guardianContact || '',
    permanent_address: student?.permanentAddress || '',
    current_address: student?.currentAddress || '',
    city: student?.city || '',
    state: student?.state || '',
    pin_code: student?.pinCode || '',
    country: student?.country || 'India',
    discount_type: student?.discountType || null,
    discount_percentage: student?.discountPercentage || null,
    discount_validity_period: student?.discountValidityPeriod || '',
    status: student?.status || 'active',
  });

  React.useEffect(() => {
    if (student) {
      setDateOfBirth(student.dateOfBirth ? new Date(student.dateOfBirth) : undefined);
      setDateOfAdmission(student.dateOfAdmission ? new Date(student.dateOfAdmission) : undefined);
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (student) {
        await updateStudent(student.id, formData);
      } else {
        await createStudent(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      admission_number: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      date_of_birth: '',
      gender: 'male',
      class: '',
      section: '',
      roll_number: '',
      date_of_admission: '',
      academic_year: '2024-25',
      father_name: '',
      father_occupation: '',
      father_contact: '',
      father_email: '',
      mother_name: '',
      mother_occupation: '',
      mother_contact: '',
      mother_email: '',
      guardian_name: '',
      guardian_relationship: '',
      guardian_contact: '',
      permanent_address: '',
      current_address: '',
      city: '',
      state: '',
      pin_code: '',
      country: 'India',
      discount_type: null,
      discount_percentage: null,
      discount_validity_period: '',
      status: 'active',
    });
    setDateOfBirth(undefined);
    setDateOfAdmission(undefined);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {student ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
          <DialogDescription>
            {student ? 'Update student information' : 'Add a new student to the system'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admission_number">Admission Number</Label>
                <Input
                  id="admission_number"
                  value={formData.admission_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, admission_number: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academic_year">Academic Year</Label>
                <Input
                  id="academic_year"
                  value={formData.academic_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, academic_year: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  value={formData.middle_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, middle_name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={(date) => {
                        setDateOfBirth(date);
                        setFormData(prev => ({ 
                          ...prev, 
                          date_of_birth: date ? format(date, "yyyy-MM-dd") : '' 
                        }));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Class {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {['A', 'B', 'C', 'D'].map((section) => (
                      <SelectItem key={section} value={section}>
                        Section {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roll_number">Roll Number</Label>
                <Input
                  id="roll_number"
                  value={formData.roll_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, roll_number: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Admission</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfAdmission && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfAdmission ? format(dateOfAdmission, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateOfAdmission}
                      onSelect={(date) => {
                        setDateOfAdmission(date);
                        setFormData(prev => ({ 
                          ...prev, 
                          date_of_admission: date ? format(date, "yyyy-MM-dd") : '' 
                        }));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Father's Details</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="father_name">Name</Label>
                    <Input
                      id="father_name"
                      value={formData.father_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, father_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="father_occupation">Occupation</Label>
                    <Input
                      id="father_occupation"
                      value={formData.father_occupation}
                      onChange={(e) => setFormData(prev => ({ ...prev, father_occupation: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="father_contact">Contact</Label>
                    <Input
                      id="father_contact"
                      value={formData.father_contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, father_contact: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="father_email">Email</Label>
                    <Input
                      id="father_email"
                      type="email"
                      value={formData.father_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, father_email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Mother's Details</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="mother_name">Name</Label>
                    <Input
                      id="mother_name"
                      value={formData.mother_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, mother_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mother_occupation">Occupation</Label>
                    <Input
                      id="mother_occupation"
                      value={formData.mother_occupation}
                      onChange={(e) => setFormData(prev => ({ ...prev, mother_occupation: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mother_contact">Contact</Label>
                    <Input
                      id="mother_contact"
                      value={formData.mother_contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, mother_contact: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mother_email">Email</Label>
                    <Input
                      id="mother_email"
                      type="email"
                      value={formData.mother_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, mother_email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="mt-4">
              <h4 className="font-medium mb-3">Guardian Details (Optional)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guardian_name">Name</Label>
                  <Input
                    id="guardian_name"
                    value={formData.guardian_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, guardian_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardian_relationship">Relationship</Label>
                  <Input
                    id="guardian_relationship"
                    value={formData.guardian_relationship}
                    onChange={(e) => setFormData(prev => ({ ...prev, guardian_relationship: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardian_contact">Contact</Label>
                  <Input
                    id="guardian_contact"
                    value={formData.guardian_contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, guardian_contact: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Address Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="permanent_address">Permanent Address</Label>
                <Textarea
                  id="permanent_address"
                  value={formData.permanent_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, permanent_address: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_address">Current Address</Label>
                <Textarea
                  id="current_address"
                  value={formData.current_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_address: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pin_code">PIN Code</Label>
                  <Input
                    id="pin_code"
                    value={formData.pin_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, pin_code: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Discount Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Discount Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount_type">Discount Type</Label>
                <Select
                  value={formData.discount_type || 'no-discount'}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    discount_type: value === 'no-discount' ? null : value,
                    // Reset discount percentage when changing type
                    discount_percentage: value === 'no-discount' ? null : prev.discount_percentage
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-discount">No Discount</SelectItem>
                    <SelectItem value="RTE">RTE</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ED">ED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_percentage">Discount Percentage</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  value={formData.discount_percentage || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: e.target.value ? Number(e.target.value) : null }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_validity_period">Validity Period</Label>
                <Input
                  id="discount_validity_period"
                  value={formData.discount_validity_period}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_validity_period: e.target.value }))}
                  placeholder="e.g., 2024-25"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (student ? 'Update Student' : 'Add Student')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};