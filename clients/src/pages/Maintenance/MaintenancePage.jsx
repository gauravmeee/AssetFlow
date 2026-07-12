import FeaturePage from '../Modules/FeaturePage'

const stats = [
  { label: 'Open tickets', value: '14', detail: '6 require approval' },
  { label: 'In progress', value: '8', detail: '2 assigned today' },
  { label: 'Resolved', value: '23', detail: '91% SLA met' },
  { label: 'Escalations', value: '3', detail: '1 critical outage' },
]

const sections = [
  {
    title: 'Approval queue',
    description: 'Maintenance requests waiting for manager review.',
    items: [
      { label: 'Printer repair', meta: 'Ops floor printer', status: 'pending' },
      { label: 'Laptop battery swap', meta: 'Engineering team', status: 'pending' },
      { label: 'Monitor replacement', meta: 'Finance desk', status: 'active' },
    ],
  },
  {
    title: 'Service status',
    description: 'Current state of critical equipment.',
    items: [
      { label: 'Server rack', value: 'Stable' },
      { label: 'Conference system', value: 'Under review' },
      { label: 'Access control', value: 'Needs vendor' },
    ],
  },
]

export default function MaintenancePage() {
  return (
    <FeaturePage
      title="Maintenance approvals"
      subtitle="Coordinate maintenance requests, approval states, and vendor follow-up in one control center."
      stats={stats}
      sections={sections}
      actionLabel="New request"
    />
  )
}
