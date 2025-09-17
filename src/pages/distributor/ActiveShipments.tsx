import DashboardLayout from '@/components/layout/DashboardLayout';
import { Truck, Package, RotateCcw, FileText, Activity, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const ActiveShipments = () => {
  const sidebarItems = [
    { icon: Truck, label: 'Dashboard', path: '/distributor/dashboard', active: false },
    { icon: Package, label: 'Active Shipments', path: '/distributor/active-shipments', active: true },
    { icon: RotateCcw, label: 'Update Shipment', path: '/distributor/update-shipment', active: false },
    { icon: FileText, label: 'Shipment Logs', path: '/distributor/shipment-logs', active: false },
    { icon: Activity, label: 'Activity Logs', path: '/distributor/activity-logs', active: false },
  ];

  const activeShipments = [
    {
      id: 'SHP001',
      origin: 'Nairobi Warehouse',
      destination: 'Mombasa Central Pharmacy',
      product: 'Paracetamol Batch BTH2024001',
      quantity: '5,000 units',
      driver: 'John Kamau',
      vehicle: 'KCA 123A',
      status: 'in-transit',
      progress: 65,
      eta: '3 hours',
      temperature: '20°C',
      lastUpdate: '30 mins ago'
    },
    {
      id: 'SHP002',
      origin: 'Nairobi Warehouse',
      destination: 'Kisumu Medical Store',
      product: 'Amoxicillin Batch BTH2024002',
      quantity: '2,500 units',
      driver: 'Mary Wanjiku',
      vehicle: 'KBZ 456B',
      status: 'departed',
      progress: 25,
      eta: '8 hours',
      temperature: '18°C',
      lastUpdate: '1 hour ago'
    },
    {
      id: 'SHP003',
      origin: 'Mombasa Warehouse',
      destination: 'Malindi Health Center',
      product: 'Ibuprofen Batch BTH2024003',
      quantity: '1,200 units',
      driver: 'Peter Otieno',
      vehicle: 'KBA 789C',
      status: 'loading',
      progress: 5,
      eta: '12 hours',
      temperature: '22°C',
      lastUpdate: '45 mins ago'
    },
    {
      id: 'SHP004',
      origin: 'Eldoret Warehouse',
      destination: 'Nakuru General Hospital',
      product: 'Ciprofloxacin Batch BTH2024004',
      quantity: '800 units',
      driver: 'Grace Cherop',
      vehicle: 'KCB 321D',
      status: 'delayed',
      progress: 45,
      eta: '5 hours',
      temperature: '19°C',
      lastUpdate: '2 hours ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-transit': return 'default';
      case 'departed': return 'secondary';
      case 'loading': return 'outline';
      case 'delayed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userRole="distributor" userName="Mike Distributor" userEmail="mike@logistics.co.ke">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Active Shipments
          </h1>
          <p className="text-muted-foreground">Monitor real-time shipment status, track vehicles, and manage deliveries</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Loading</p>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                </div>
                <Package className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delayed</p>
                  <p className="text-2xl font-bold text-red-600">2</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">On Time</p>
                  <p className="text-2xl font-bold text-green-600">96%</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Shipments</CardTitle>
            <CardDescription>Real-time tracking of all active pharmaceutical shipments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Driver & Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{shipment.origin}</p>
                        <p className="text-xs text-muted-foreground">→ {shipment.destination}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{shipment.product}</p>
                        <p className="text-xs text-muted-foreground">{shipment.quantity}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{shipment.driver}</p>
                        <p className="text-xs text-muted-foreground">{shipment.vehicle}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(shipment.status)}>
                        {shipment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Progress value={shipment.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {shipment.progress}% • ETA: {shipment.eta}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{shipment.temperature}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Map View Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Tracking Map
            </CardTitle>
            <CardDescription>Real-time location tracking of all vehicles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
              <div className="text-center space-y-2">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-lg font-medium">Interactive Map View</p>
                <p className="text-sm text-muted-foreground">Live GPS tracking of all active shipments would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ActiveShipments;