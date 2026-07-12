import FeaturePage from '../Modules/FeaturePage'

const stats = [
  { label: 'Total assets', value: '248', detail: '+12 this month' },
  { label: 'Assigned', value: '186', detail: '74.8% utilization' },
  { label: 'Maintenance', value: '9', detail: '2 critical' },
  { label: 'Available', value: '53', detail: 'Ready for issue' },
]

const sections = [
  {
    title: 'Asset inventory',
    description: 'Track equipment, laptops, and shared resources in one place.',
    items: [
      { label: 'Laptops', value: '82' },
      { label: 'Mobiles', value: '41' },
      { label: 'Furniture', value: '67' },
    ],
  },
  {
    title: 'Recent actions',
    description: 'Latest movement and status updates.',
    items: [
      { label: 'New asset added', meta: 'Dell Latitude 7420', status: 'active' },
      { label: 'Transfer requested', meta: 'Finance → Ops', status: 'pending' },
      { label: 'Maintenance due', meta: 'Printer #P-104', status: 'critical' },
    ],
  },
]

export default function AssetsPage() {
  return (
    <FeaturePage
      title="Asset management"
      subtitle="Monitor the full asset lifecycle, from acquisition to assignment, transfer, and maintenance tracking."
      stats={stats}
      sections={sections}
      actionLabel="Create asset"
    />
  )
}
