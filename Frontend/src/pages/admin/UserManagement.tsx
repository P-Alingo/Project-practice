import DashboardLayout from '@/components/layout/DashboardLayout';
import { Settings, Users, Cog, FileText, Activity, Search, Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserManagement = () => {
  const sidebarItems = [
    { icon: Settings, label: 'Dashboard', path: '/admin/dashboard', active: false },
    { icon: Users, label: 'User Management', path: '/admin/users', active: true },
    { icon: Cog, label: 'System Settings', path: '/admin/settings', active: false },
    { icon: FileText, label: 'Reports', path: '/admin/reports', active: false },
    { icon: Activity, label: 'Activity Logs', path: '/admin/activity-logs', active: false },
  ];

  const users = [
    {
      id: 'USR001',
      name: 'Dr. John Smith',
      email: 'john.smith@hospital.co.ke',
      role: 'doctor',
      status: 'active',
      lastLogin: '2024-01-15 09:30',
      registrationDate: '2023-08-12',
      licenseNumber: 'DOC123456',
      facility: 'Nairobi General Hospital'
    },
    {
      id: 'USR002',
      name: 'Sarah Johnson',
      email: 'sarah.j@gmail.com',
      role: 'patient',
      status: 'active',
      lastLogin: '2024-01-15 14:22',
      registrationDate: '2023-11-05',
      licenseNumber: 'N/A',
      facility: 'N/A'
    },
    {
      id: 'USR003',
      name: 'Mike Pharmacist',
      email: 'mike@pharmacy.co.ke',
      role: 'pharmacist',
      status: 'active',
      lastLogin: '2024-01-15 11:45',
      registrationDate: '2023-06-20',
      licenseNumber: 'PHA789012',
      facility: 'City Pharmacy'
    },
    {
      id: 'USR004',
      name: 'Jane Manufacturer',
      email: 'jane@pharmatech.co.ke',
      role: 'manufacturer',
      status: 'pending',
      lastLogin: 'Never',
      registrationDate: '2024-01-14',
      licenseNumber: 'MFG345678',
      facility: 'PharmaTech Industries'
    },
    {
      id: 'USR005',
      name: 'Peter Distributor',
      email: 'peter@logistics.co.ke',
      role: 'distributor',
      status: 'suspended',
      lastLogin: '2024-01-10 16:30',
      registrationDate: '2023-09-15',
      licenseNumber: 'DST901234',
      facility: 'Kenya Logistics Ltd'
    }
  ];

  const getRoleColor = (role: string) => {
    const colors = {
      doctor: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      patient: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', 
      pharmacist: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      manufacturer: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      distributor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
      regulator: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="admin" userName="System Admin" userEmail="admin@eprescribe.go.ke">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-muted-foreground">Manage system users, roles, and permissions</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">13,860</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">890</p>
              <p className="text-sm text-muted-foreground">Doctors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">12,450</p>
              <p className="text-sm text-muted-foreground">Patients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">340</p>
              <p className="text-sm text-muted-foreground">Pharmacists</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">65</p>
              <p className="text-sm text-muted-foreground">Manufacturers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-cyan-600">115</p>
              <p className="text-sm text-muted-foreground">Others</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>Search and filter registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users by name, email, or license number..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            {/* Users Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>License/Facility</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">{user.licenseNumber}</p>
                        <p className="text-xs text-muted-foreground">{user.facility}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{user.lastLogin}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{user.registrationDate}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;