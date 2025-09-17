import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const userRoles = [
    { value: 'doctor', label: 'Doctor', description: 'Licensed medical practitioner' },
    { value: 'patient', label: 'Patient', description: 'Healthcare service recipient' },
    { value: 'pharmacist', label: 'Pharmacist', description: 'Licensed pharmacy professional' },
    { value: 'manufacturer', label: 'Manufacturer', description: 'Pharmaceutical manufacturer' },
    { value: 'distributor', label: 'Distributor', description: 'Pharmaceutical distributor' },
    { value: 'regulator', label: 'Regulator', description: 'Healthcare regulatory body' }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-5"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">ePrescribe Kenya</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join Kenya's secure prescription network</p>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <p className="text-sm text-muted-foreground">
              All fields are required. Your application will be reviewed by our admin team.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="Enter your first name"
                  className="focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Enter your last name"
                  className="focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your.email@example.com"
                className="focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="+254 700 000 000"
                className="focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="focus:ring-primary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select onValueChange={setSelectedRole}>
                <SelectTrigger className="focus:ring-primary">
                  <SelectValue placeholder="Select your professional role" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      <div>
                        <div className="font-medium">{role.label}</div>
                        <div className="text-xs text-muted-foreground">{role.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRole && selectedRole !== 'patient' && (
              <div className="space-y-2">
                <Label htmlFor="credentials">Professional Credentials</Label>
                <Textarea 
                  id="credentials"
                  placeholder={`Please provide your ${selectedRole} license number, institution affiliation, or other relevant credentials...`}
                  className="focus:ring-primary min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  This information will be verified by our admin team before account approval.
                </p>
              </div>
            )}

            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <div className="text-sm">
                  <Label htmlFor="terms" className="cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Your data will be securely stored and used only for authentication and system access purposes.
                </p>
              </div>
            </div>

            <Button 
              disabled={!selectedRole || !agreeToTerms}
              className="w-full btn-gradient-primary text-lg py-6"
            >
              Submit Application
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;