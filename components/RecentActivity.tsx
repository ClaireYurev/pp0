interface Activity {
  id: number
  description: string
  createdAt: Date
}

export default function RecentActivity({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
        <div className="mt-5 space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500">{activity.id}</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-sm text-gray-400">{new Date(activity.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

