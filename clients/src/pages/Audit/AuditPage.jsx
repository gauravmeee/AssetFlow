import FeaturePage from '../Modules/FeaturePage'

const stats = [
  { label: 'Audit cycles', value: '6', detail: 'Next due in 8 days' },
  { label: 'Discrepancies', value: '4', detail: '2 unresolved' },
  { label: 'Reviewed assets', value: '182', detail: '73% of inventory' },
  { label: 'Compliance score', value: '94%', detail: 'Above target' },
]

const sections = [
  {
    title: 'Open findings',
    description: 'Inventory mismatches and review exceptions.',
    items: [
      { label: 'Missing serial tag', meta: 'Asset AF-0012', status: 'critical' },
      { label: 'Location mismatch', meta: 'Room 4B', status: 'pending' },
      { label: 'Transfer not logged', meta: 'Asset AF-0098', status: 'active' },
    ],
  },
  {
    title: 'Audit schedule',
    description: 'Upcoming review checkpoints and owners.',
    items: [
      { label: 'Department review', value: 'Today' },
      { label: 'Finance audit', value: 'Tomorrow' },
      { label: 'Quarterly report', value: 'Next week' },
    ],
  },
]

export default function AuditPage() {
  return (
    <FeaturePage
      title="Audit & discrepancy handling"
      subtitle="Track audit cycles, log discrepancies, and keep review actions moving with clear ownership."
      stats={stats}
      sections={sections}
      actionLabel="Start audit"
    />
  )
}
