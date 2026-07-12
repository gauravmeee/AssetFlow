import FeaturePage from '../Modules/FeaturePage'

const stats = [
  { label: 'Active allocations', value: '124', detail: 'Across 8 departments' },
  { label: 'Pending transfers', value: '7', detail: '2 high priority' },
  { label: 'Return requests', value: '11', detail: 'Due in 3 days' },
  { label: 'Shared resources', value: '18', detail: 'Bookable by teams' },
]

const sections = [
  {
    title: 'Current allocations',
    description: 'Assets currently assigned to teams and employees.',
    items: [
      { label: 'Project laptop pool', value: '24 assigned' },
      { label: 'Conference room kit', value: '6 active' },
      { label: 'Mobile devices', value: '14 checked out' },
    ],
  },
  {
    title: 'Transfer queue',
    description: 'Pending handoffs and movement approvals.',
    items: [
      { label: 'Finance → HR', meta: 'Monitor #M-221', status: 'pending' },
      { label: 'Engineering → Support', meta: 'Docking station #D-11', status: 'active' },
      { label: 'Ops → Logistics', meta: 'Barcode scanner #BS-4', status: 'critical' },
    ],
  },
]

export default function AllocationsPage() {
  return (
    <FeaturePage
      title="Allocation & transfer"
      subtitle="Keep asset movement transparent with allocation history, handoff workflow, and transfer requests."
      stats={stats}
      sections={sections}
      actionLabel="New transfer"
    />
  )
}
