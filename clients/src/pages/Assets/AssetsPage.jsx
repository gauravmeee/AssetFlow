import { useEffect, useState } from 'react'

import axiosInstance from '@/api/axiosInstance'

import AssetFormModal from './AssetFormModal'

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: '18px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 },
  subtitle: { fontSize: '14px', color: '#6b7280', margin: '4px 0 0' },
  button: { border: 'none', background: '#534AB7', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 8px', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '12px 8px', fontSize: '14px', color: '#374151', borderBottom: '1px solid #f3f4f6' },
}

export default function AssetsPage() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const loadAssets = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/assets')
      setAssets(data?.data || [])
    } catch {
      setAssets([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssets()
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Asset management</h1>
          <p style={styles.subtitle}>Create and track the assets in your organization.</p>
        </div>
        <button style={styles.button} onClick={() => setModalOpen(true)}>Create asset</button>
      </div>

      <div style={styles.card}>
        {loading ? (
          <div style={{ color: '#6b7280' }}>Loading assets...</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Asset tag</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset._id}>
                  <td style={styles.td}>{asset.assetTag}</td>
                  <td style={styles.td}>{asset.name}</td>
                  <td style={styles.td}>{asset.department?.name || asset.department || '-'}</td>
                  <td style={styles.td}>{asset.location}</td>
                  <td style={styles.td}>{asset.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AssetFormModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={loadAssets} />
    </div>
  )
}
