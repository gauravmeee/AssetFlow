import FeaturePage from '../Modules/FeaturePage'

const stats = [
  { label: 'Reports generated', value: '38', detail: 'This quarter' },
  { label: 'Active dashboards', value: '5', detail: 'Custom views' },
  { label: 'Avg. response time', value: '2.4s', detail: 'Fast analytics' },
  { label: 'Exported files', value: '17', detail: 'Last 7 days' },
]

const sections = [
  {
    title: 'Executive insights',
    description: 'Snapshot metrics for leadership and operations.',
    items: [
      { label: 'Asset utilization', value: '74.8%' },
      { label: 'Maintenance backlog', value: '14 tickets' },
      { label: 'Bookings growth', value: '+11%' },
    ],
  },
  {
    title: 'Recent exports',
    description: 'Latest report deliveries and download history.',
    items: [
      { label: 'Inventory summary', meta: 'Exported 2h ago', status: 'active' },
      { label: 'Transfer report', meta: 'Shared with finance', status: 'pending' },
      { label: 'Audit findings', meta: 'Generated for compliance', status: 'active' },
    ],
  },
]

export default function ReportsPage() {
  return (
    <FeaturePage
      title="Dashboard & reporting"
      subtitle="View operating metrics, export reports, and guide decisions from a centralized dashboard experience."
      stats={stats}
      sections={sections}
      actionLabel="Generate report"
    />
  )
}
