"use client";

export default function ConfirmDialog({ open, title = "Confirm", description = "Are you sure?", onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

            <div className="relative bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm text-zinc-400 mt-2">{description}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
