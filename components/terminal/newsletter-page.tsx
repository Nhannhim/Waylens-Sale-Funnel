"use client"

import { useState } from "react"
import { Upload, FileText, Mail, Send, Clock, Zap, TrendingUp, Users, Eye, MousePointer, User, Building2, Phone as PhoneIcon, MessageSquare, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewsletterPageProps {
  ticker?: string
}

const uploadedMaterials = [
  { name: "Q4_2025_Product_Update.pdf", type: "Marketing", size: "2.4 MB", date: "Jan 10, 2026" },
  { name: "Fleet_Management_Case_Study.pdf", type: "Sales", size: "1.8 MB", date: "Jan 8, 2026" },
  { name: "ROI_Calculator_Template.xlsx", type: "Sales Tool", size: "856 KB", date: "Jan 5, 2026" },
]

const outreachContacts = [
  {
    name: "Sarah Mitchell",
    title: "VP of Fleet Operations",
    company: "DHL Supply Chain",
    email: "s.mitchell@dhl.com",
    phone: "+1 (555) 123-4567",
    lastContact: "Jan 10, 2026",
    status: "Active",
    notes: "Interested in expanding Video Intelligence features",
  },
  {
    name: "Michael Chen",
    title: "Director of Operations",
    company: "Sysco Corporation",
    email: "m.chen@sysco.com",
    phone: "+1 (555) 234-5678",
    lastContact: "Jan 8, 2026",
    status: "Follow-up",
    notes: "Evaluating construction equipment tracking",
  },
  {
    name: "Jennifer Rodriguez",
    title: "Fleet Manager",
    company: "Crown Castle",
    email: "j.rodriguez@crowncastle.com",
    phone: "+1 (555) 345-6789",
    lastContact: "Jan 5, 2026",
    status: "Active",
    notes: "Planning Q2 expansion to additional sites",
  },
  {
    name: "David Thompson",
    title: "COO",
    company: "Republic Services",
    email: "d.thompson@republicservices.com",
    phone: "+1 (555) 456-7890",
    lastContact: "Dec 28, 2025",
    status: "Pending",
    notes: "Requested demo for waste management fleet",
  },
]

const upcomingMeetings = [
  { date: "Jan 15, 2026", time: "10:00 AM", contact: "Sarah Mitchell", company: "DHL", topic: "Q1 Review & Expansion" },
  { date: "Jan 16, 2026", time: "2:00 PM", contact: "Michael Chen", company: "Sysco", topic: "Construction Module Demo" },
  { date: "Jan 18, 2026", time: "11:00 AM", contact: "Jennifer Rodriguez", company: "Crown Castle", topic: "Contract Renewal" },
  { date: "Jan 20, 2026", time: "3:30 PM", contact: "David Thompson", company: "Republic Services", topic: "Platform Demo" },
]

const automationStats = {
  campaignsSent: "24",
  openRate: "42%",
  clickRate: "18%",
  conversions: "156",
}

const recentCampaigns = [
  { name: "Winter Product Launch", sent: "2,450", opened: "1,029", clicked: "441", status: "Completed" },
  { name: "Fleet Safety Webinar", sent: "1,820", opened: "801", clicked: "364", status: "Completed" },
  { name: "Q1 Industry Report", sent: "3,200", opened: "1,408", clicked: "512", status: "In Progress" },
]

export function NewsletterPage({ ticker }: NewsletterPageProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-black">Newsletter & Marketing Automation</h2>
        </div>
        
        <p className="text-sm text-gray-600">
          Upload marketing and sales materials to automatically distribute to your target audience. 
          AI-powered automation handles scheduling, personalization, and follow-ups.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Upload Marketing Materials</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            // Handle file upload here
          }}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-base font-semibold text-gray-900 mb-2">
            Drag and drop your files here
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            or click to browse from your computer
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            Supported formats: PDF, DOCX, PPTX, XLSX, PNG, JPG (Max 10MB)
          </p>
        </div>

        {/* Uploaded Files */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Recently Uploaded</h4>
          <div className="space-y-2">
            {uploadedMaterials.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                    <div className="text-xs text-gray-600">
                      {file.type} • {file.size} • {file.date}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Use in Campaign
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Automation Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-black">Automation Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auto-Send Configuration */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-4">Auto-Send Configuration</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Schedule</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Weekly - Every Monday 9:00 AM</option>
                  <option>Bi-weekly - 1st & 15th</option>
                  <option>Monthly - 1st of month</option>
                  <option>Custom schedule</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Target Audience</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>All Contacts (8,450)</option>
                  <option>Enterprise Clients (2,400)</option>
                  <option>Prospects (3,200)</option>
                  <option>Partners (850)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded border border-gray-200">
                <input type="checkbox" id="auto-personalize" className="w-4 h-4 text-blue-600" />
                <label htmlFor="auto-personalize" className="text-sm text-gray-700">
                  Auto-personalize with recipient data
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded border border-gray-200">
                <input type="checkbox" id="auto-followup" className="w-4 h-4 text-blue-600" defaultChecked />
                <label htmlFor="auto-followup" className="text-sm text-gray-700">
                  Auto-follow up after 3 days if unopened
                </label>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Zap className="w-4 h-4 mr-2" />
                Enable Automation
              </Button>
            </div>
          </div>

          {/* AI-Powered Features */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h4 className="font-semibold text-gray-900 mb-4">AI-Powered Features</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Smart Send Time</div>
                  <p className="text-xs text-gray-600">AI determines optimal send time for each recipient</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Audience Segmentation</div>
                  <p className="text-xs text-gray-600">Auto-segment contacts based on behavior and engagement</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Content Optimization</div>
                  <p className="text-xs text-gray-600">AI suggests subject lines and content improvements</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">Auto-Drip Campaigns</div>
                  <p className="text-xs text-gray-600">Automated multi-touch sequences for lead nurturing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns with Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Automated Campaigns & Performance</h3>
        
        {/* Performance Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Send className="w-4 h-4 text-blue-700" />
              <div className="text-xs font-semibold text-gray-700">Campaigns Sent</div>
            </div>
            <div className="text-3xl font-bold text-blue-900">{automationStats.campaignsSent}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-blue-700" />
              <div className="text-xs font-semibold text-gray-700">Avg Open Rate</div>
            </div>
            <div className="text-3xl font-bold text-blue-900">{automationStats.openRate}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MousePointer className="w-4 h-4 text-blue-700" />
              <div className="text-xs font-semibold text-gray-700">Avg Click Rate</div>
            </div>
            <div className="text-3xl font-bold text-blue-900">{automationStats.clickRate}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-700" />
              <div className="text-xs font-semibold text-gray-700">Total Conversions</div>
            </div>
            <div className="text-3xl font-bold text-blue-900">{automationStats.conversions}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-blue-50">
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">Campaign Name</th>
                <th className="text-right py-3 px-4 text-gray-900 font-semibold">Sent</th>
                <th className="text-right py-3 px-4 text-gray-900 font-semibold">Opened</th>
                <th className="text-right py-3 px-4 text-gray-900 font-semibold">Clicked</th>
                <th className="text-center py-3 px-4 text-gray-900 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.map((campaign, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{campaign.name}</td>
                  <td className="text-right py-3 px-4 text-gray-900">{campaign.sent}</td>
                  <td className="text-right py-3 px-4 text-gray-900">{campaign.opened}</td>
                  <td className="text-right py-3 px-4 text-gray-900">{campaign.clicked}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded ${
                      campaign.status === 'Completed' 
                        ? 'bg-green-100 text-green-900 border border-green-300' 
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outreach Dashboard Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <PhoneIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-black">Outreach Dashboard</h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Client relationship management and outreach tracking for key accounts and prospects.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Active Contacts</div>
            <div className="text-2xl font-bold text-blue-900">147</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">This Month</div>
            <div className="text-2xl font-bold text-blue-900">28</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Follow-ups</div>
            <div className="text-2xl font-bold text-blue-900">12</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Success Rate</div>
            <div className="text-2xl font-bold text-blue-900">68%</div>
          </div>
        </div>

        {/* Contact List */}
        <div className="mb-6">
          <h4 className="text-base font-semibold text-black mb-4">Key Contacts</h4>
          <div className="space-y-4">
            {outreachContacts.map((contact, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-base text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.title}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                        <Building2 className="w-3 h-3" />
                        <span>{contact.company}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded ${
                      contact.status === 'Active' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      contact.status === 'Follow-up' ? 'bg-yellow-100 text-yellow-900 border border-yellow-300' :
                      'bg-gray-100 text-gray-900 border border-gray-300'
                    }`}>
                      {contact.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <PhoneIcon className="w-4 h-4 text-blue-600" />
                    <span>{contact.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs">
                  <MessageSquare className="w-3 h-3 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-gray-600">Last contact: </span>
                    <span className="font-medium text-gray-900">{contact.lastContact}</span>
                    <span className="text-gray-600"> - </span>
                    <span className="text-gray-700">{contact.notes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h4 className="text-base font-semibold text-black">Upcoming Meetings</h4>
          </div>
          
          <div className="space-y-3">
            {upcomingMeetings.map((meeting, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-900">{meeting.date.split(' ')[1].replace(',', '')}</div>
                    <div className="text-xs text-gray-600">{meeting.date.split(' ')[0]}</div>
                  </div>
                  <div className="h-12 w-px bg-blue-200"></div>
                  <div>
                    <div className="font-semibold text-gray-900">{meeting.contact}</div>
                    <div className="text-sm text-gray-600">{meeting.company} • {meeting.time}</div>
                    <div className="text-xs text-blue-700 mt-1">{meeting.topic}</div>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Join
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
