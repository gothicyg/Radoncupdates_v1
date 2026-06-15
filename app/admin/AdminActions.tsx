'use client'

export default function AdminActions({
  id,
}: {
  id: string
}) {
  async function approve() {
    await fetch(`/api/approve/${id}`, {
      method: 'POST',
    })

    window.location.reload()
  }

  async function reject() {
    await fetch(`/api/reject/${id}`, {
      method: 'POST',
    })

    window.location.reload()
  }

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={approve}
        className="border px-3 py-1 rounded"
      >
        Approve
      </button>

      <button
        onClick={reject}
        className="border px-3 py-1 rounded"
      >
        Reject
      </button>
    </div>
  )
}