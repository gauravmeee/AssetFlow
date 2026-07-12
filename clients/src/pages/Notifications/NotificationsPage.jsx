import FeaturePage from '../Modules/FeaturePage'

const stats = [
  { label: 'Unread alerts', value: '9', detail: '3 urgent' },
  { label: 'Activity today', value: '24', detail: 'Across teams' },
  { label: 'Approvals pending', value: '6', detail: 'Needs attention' },
  { label: 'System health', value: 'Excellent', detail: 'No incidents' },
]

const sections = [
  {
    title: 'Recent activity',
    description: 'Recent system events and team actions.',
    items: [
      { label: 'Asset transferred', meta: 'Ops → Finance', status: 'active' },
      { label: 'Booking approved', meta: 'Training room', status: 'active' },
      { label: 'Maintenance request logged', meta: 'Printer repair', status: 'pending' },
    ],
  },
  {
    title: 'Alert center',
    description: 'Critical updates and notifications.',
    items: [
      { label: 'Overlapping booking', meta: 'Lab 2', status: 'critical' },
      { label: 'Audit discrepancy', meta: '2 items flagged', status: 'pending' },
      { label: 'Maintenance approval due', meta: 'Review required', status: 'pending' },
    ],
  },
]

export default function NotificationsPage() {
  return (
    <FeaturePage
      title="Notifications & activity"
      subtitle="Keep teams informed with alerts, workflow updates, and a clear activity log of important events."
      stats={stats}
      sections={sections}
      actionLabel="View all"
    />
  )
}
