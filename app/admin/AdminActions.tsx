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
    <div className="flex gap-3 mt-5">
      <button
        onClick={approve}
        className="
          px-4 py-2
          bg-green-600
          text-white
          rounded-lg
          font-medium
          hover:bg-green-700
          transition
          cursor-pointer
        "
      >
        ✓ Approve
      </button>

      <button
        onClick={reject}
        className="
          px-4 py-2
          bg-red-600
          text-white
          rounded-lg
          font-medium
          hover:bg-red-700
          transition
          cursor-pointer
        "
      >
        ✕ Reject
      </button>
    </div>
  )
}