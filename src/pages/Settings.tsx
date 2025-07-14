import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  School, 
  Bell, 
  Shield, 
  Database, 
  Mail,
  Smartphone,
  CreditCard,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  if (user?.role === 'staff') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Application settings and preferences</p>
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access settings. This feature is only available for administrators.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Bright Future School',
    address: '123 Education Street, Knowledge City',
    phone: '+91-9876543210',
    email: 'info@brightfuture.edu',
    website: 'www.brightfuture.edu',
    academicYear: '2024-25',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    paymentReminders: true,
    overdueNotices: true,
    receiptGeneration: true,
    reportGeneration: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginAttempts: '5',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    lateFeePercentage: '5',
    gracePeriod: '7',
    paymentMethods: {
      cash: true,
      cheque: true,
      online: true,
      card: true,
    },
    autoReceiptGeneration: true,
  });

  const handleSave = (section: string) => {
    toast({
      title: "Settings saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences</p>
      </div>

      <Tabs defaultValue="school" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="school" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            School
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                School Information
              </CardTitle>
              <CardDescription>
                Basic information about your educational institution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={schoolSettings.name}
                    onChange={(e) => setSchoolSettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={schoolSettings.academicYear}
                    onChange={(e) => setSchoolSettings(prev => ({ ...prev, academicYear: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={schoolSettings.address}
                  onChange={(e) => setSchoolSettings(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={schoolSettings.phone}
                    onChange={(e) => setSchoolSettings(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={schoolSettings.email}
                    onChange={(e) => setSchoolSettings(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={schoolSettings.website}
                    onChange={(e) => setSchoolSettings(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={schoolSettings.currency}
                    onValueChange={(value) => setSchoolSettings(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={schoolSettings.timezone}
                    onValueChange={(value) => setSchoolSettings(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleSave('School')}>
                Save School Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label>Email Notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <Label>SMS Notifications</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminders for upcoming payments
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentReminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, paymentReminders: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Overdue Notices</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notices for overdue payments
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.overdueNotices}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, overdueNotices: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Receipt Generation</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when receipts are generated
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.receiptGeneration}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, receiptGeneration: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Report Generation</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when reports are ready
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.reportGeneration}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, reportGeneration: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('Notification')}>
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    value={securitySettings.loginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave('Security')}>
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Configure payment methods and fee collection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lateFeePercentage">Late Fee Percentage (%)</Label>
                  <Input
                    id="lateFeePercentage"
                    type="number"
                    value={paymentSettings.lateFeePercentage}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, lateFeePercentage: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gracePeriod">Grace Period (days)</Label>
                  <Input
                    id="gracePeriod"
                    type="number"
                    value={paymentSettings.gracePeriod}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, gracePeriod: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Accepted Payment Methods</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(paymentSettings.paymentMethods).map(([method, enabled]) => (
                    <div key={method} className="flex items-center justify-between">
                      <Label className="capitalize">{method}</Label>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          setPaymentSettings(prev => ({ 
                            ...prev, 
                            paymentMethods: { ...prev.paymentMethods, [method]: checked }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Receipt Generation</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate receipts for payments
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.autoReceiptGeneration}
                  onCheckedChange={(checked) => 
                    setPaymentSettings(prev => ({ ...prev, autoReceiptGeneration: checked }))
                  }
                />
              </div>

              <Button onClick={() => handleSave('Payment')}>
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup & Data Management
              </CardTitle>
              <CardDescription>
                Manage your data backups and exports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Database Backup</CardTitle>
                    <CardDescription>
                      Create a backup of all your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Database className="mr-2 h-4 w-4" />
                      Create Backup
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export Data</CardTitle>
                    <CardDescription>
                      Export data in various formats
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Export to Excel
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Export to PDF
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Label>Automatic Backup Schedule</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => handleSave('Backup')}>
                Save Backup Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};