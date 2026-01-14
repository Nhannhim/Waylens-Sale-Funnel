"use client"

import { Phone, Mail, Calendar, MessageSquare, User, Building2 } from "lucide-react"

interface OutreachPageProps {
  ticker: string
}

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

export function OutreachPage({ ticker }: OutreachPageProps) {
  return (
    <div className="space-y-4">
      {/* Outreach Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-black">Wayland's Outreach Dashboard</h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Client relationship management and outreach tracking for key accounts and prospects.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
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
      </div>

      {/* Contact List */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Key Contacts</h3>
        
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
                  <Phone className="w-4 h-4 text-blue-600" />
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-black">Upcoming Meetings</h3>
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
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
