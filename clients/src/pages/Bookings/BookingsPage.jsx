import FeaturePage from '../Modules/FeaturePage'

const stats = [
  { label: 'Today bookings', value: '31', detail: '12 overlapping windows' },
  { label: 'Available rooms', value: '4', detail: '2 with AV support' },
  { label: 'Pending approvals', value: '6', detail: 'Review before noon' },
  { label: 'No-show rate', value: '8%', detail: 'Improving weekly' },
]

const sections = [
  {
    title: 'Upcoming reservations',
    description: 'Shared resources reserved for the next few days.',
    items: [
      { label: 'Boardroom A', value: '09:00–11:00' },
      { label: 'Projector kit', value: '14:00–16:00' },
      { label: 'Workstation pod', value: '16:30–18:30' },
    ],
  },
  {
    title: 'Conflict alerts',
    description: 'Resources that need attention before booking approval.',
    items: [
      { label: 'Lab 2', meta: 'Two overlapping requests', status: 'critical' },
      { label: 'Camera kit', meta: 'Return window conflict', status: 'pending' },
      { label: 'Training room', meta: 'No overlap; ready to approve', status: 'active' },
    ],
  },
]

export default function BookingsPage() {
  return (
    <FeaturePage
      title="Resource booking"
      subtitle="Handle shared resource reservations, approve requests, and block overlapping schedules automatically."
      stats={stats}
      sections={sections}
      actionLabel="New booking"
    />
  )
}
