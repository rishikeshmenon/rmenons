'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Users, 
  Home, 
  DollarSign,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function ConsultationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    
    // Home Information
    homeType: '',
    squareFootage: '',
    rooms: [] as string[],
    budget: '',
    
    // Preferences
    ecosystems: [] as string[],
    privacyLevel: '',
    hasPets: false,
    networkType: '',
    
    // Goals
    goals: [] as string[],
    timeline: '',
    additionalNotes: ''
  })

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Basic contact information' },
    { id: 2, title: 'Home Details', description: 'Your home and requirements' },
    { id: 3, title: 'Preferences', description: 'Ecosystem and privacy preferences' },
    { id: 4, title: 'Goals', description: 'What you want to achieve' },
    { id: 5, title: 'Booking', description: 'Schedule your consultation' }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeType">Home Type *</Label>
                <Select value={formData.homeType} onValueChange={(value) => handleInputChange('homeType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select home type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">Single Family House</SelectItem>
                    <SelectItem value="condo">Condo/Apartment</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="squareFootage">Square Footage *</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                  placeholder="e.g., 2000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Rooms to Automate *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Garage', 'Basement', 'Office', 'Outdoor'].map((room) => (
                  <div key={room} className="flex items-center space-x-2">
                    <Checkbox
                      id={room}
                      checked={formData.rooms.includes(room)}
                      onCheckedChange={(checked) => handleArrayChange('rooms', room, checked as boolean)}
                    />
                    <Label htmlFor={room} className="text-sm">{room}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range *</Label>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1000">Under $1,000</SelectItem>
                  <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                  <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                  <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="over-10000">Over $10,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Preferred Ecosystems *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'google', label: 'Google Home', description: 'Voice control with Google Assistant' },
                  { value: 'alexa', label: 'Alexa', description: 'Amazon Echo and Alexa devices' },
                  { value: 'home-assistant', label: 'Home Assistant', description: 'Open-source automation platform' },
                  { value: 'matter', label: 'Matter', description: 'Universal smart home standard' }
                ].map((ecosystem) => (
                  <div key={ecosystem.value} className="flex items-start space-x-2">
                    <Checkbox
                      id={ecosystem.value}
                      checked={formData.ecosystems.includes(ecosystem.value)}
                      onCheckedChange={(checked) => handleArrayChange('ecosystems', ecosystem.value, checked as boolean)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor={ecosystem.value} className="text-sm font-medium">
                        {ecosystem.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{ecosystem.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Privacy Level *</Label>
              <RadioGroup value={formData.privacyLevel} onValueChange={(value) => handleInputChange('privacyLevel', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimal" id="minimal" />
                  <Label htmlFor="minimal">Minimal - Cloud processing is fine</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate">Moderate - Prefer local processing when possible</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High - Local processing preferred, avoid cloud cameras</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Do you have pets? *</Label>
              <RadioGroup value={formData.hasPets.toString()} onValueChange={(value) => handleInputChange('hasPets', value === 'true')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="pets-yes" />
                  <Label htmlFor="pets-yes">Yes - This affects motion sensor placement</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="pets-no" />
                  <Label htmlFor="pets-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="networkType">Network Type *</Label>
              <Select value={formData.networkType} onValueChange={(value) => handleInputChange('networkType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your network setup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic router (single access point)</SelectItem>
                  <SelectItem value="mesh">Mesh network (multiple access points)</SelectItem>
                  <SelectItem value="enterprise">Enterprise-grade network</SelectItem>
                  <SelectItem value="unknown">Not sure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>What do you want to automate? *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Lighting control',
                  'Climate control (HVAC)',
                  'Security & monitoring',
                  'Entertainment systems',
                  'Door locks & access',
                  'Window treatments',
                  'Energy monitoring',
                  'Voice control',
                  'Motion detection',
                  'Water leak detection',
                  'Smoke/CO detection',
                  'Garage door control'
                ].map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={formData.goals.includes(goal)}
                      onCheckedChange={(checked) => handleArrayChange('goals', goal, checked as boolean)}
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline *</Label>
              <Select value={formData.timeline} onValueChange={(value) => handleInputChange('timeline', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="When do you want to complete this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP (within 2 weeks)</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="3-months">Within 3 months</SelectItem>
                  <SelectItem value="6-months">Within 6 months</SelectItem>
                  <SelectItem value="flexible">Flexible timeline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Any specific requirements, concerns, or questions..."
                rows={4}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Ready to Book Your Consultation?</h3>
              <p className="text-muted-foreground mb-6">
                We'll review your requirements and schedule a 60-minute consultation call.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Consultation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    60 minutes
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    Video call with expert
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    $50 deposit (applied to purchase)
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    What You'll Get
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">• Personalized product recommendations</div>
                  <div className="text-sm">• Custom Home Assistant blueprints</div>
                  <div className="text-sm">• Detailed proposal with pricing</div>
                  <div className="text-sm">• One-click add to cart</div>
                  <div className="text-sm">• 30-day follow-up support</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button size="lg" onClick={handleSubmit}>
                Book Consultation
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book a Consultation</h1>
        <p className="text-muted-foreground">
          Get personalized recommendations and custom Home Assistant blueprints for your smart home.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                onClick={currentStep === steps.length ? handleSubmit : nextStep}
                disabled={currentStep === steps.length}
              >
                {currentStep === steps.length ? 'Submit' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
