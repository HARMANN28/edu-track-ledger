import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Students',
    value: '1,247',
    description: 'Active students',
    icon: Users,
    trend: '+2.5%',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Total Revenue',
    value: '₹8,45,230',
    description: 'This month',
    icon: DollarSign,
    trend: '+12.3%',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Pending Payments',
    value: '₹1,23,450',
    description: 'Outstanding dues',
    icon: Clock,
    trend: '-8.1%',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    title: 'Collections Today',
    value: '₹25,680',
    description: '45 transactions',
    icon: CreditCard,
    trend: '+5.2%',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

const recentPayments = [
  { id: '1', student: 'Rajesh Kumar', class: '10-A', amount: '₹5,000', status: 'paid', time: '2 hours ago' },
  { id: '2', student: 'Priya Sharma', class: '9-B', amount: '₹4,500', status: 'pending', time: '3 hours ago' },
  { id: '3', student: 'Amit Singh', class: '11-C', amount: '₹5,500', status: 'paid', time: '5 hours ago' },
  { id: '4', student: 'Sneha Patel', class: '8-A', amount: '₹4,000', status: 'overdue', time: '1 day ago' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-success/10 text-success border-success/20">Paid</Badge>;
    case 'pending':
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    case 'overdue':
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Overdue</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your fees management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">{stat.description}</span>
                <span className={`flex items-center gap-1 ${stat.trend.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Payments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recent Payments
            </CardTitle>
            <CardDescription>Latest fee transactions and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{payment.student}</p>
                    <p className="text-sm text-muted-foreground">Class {payment.class}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-medium text-foreground">{payment.amount}</p>
                    <p className="text-xs text-muted-foreground">{payment.time}</p>
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                View All Payments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Add New Student
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              View Defaulters
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};