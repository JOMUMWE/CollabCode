const stats = [
  { id: 1, name: "Active Rooms", value: "1,200+" },
  { id: 2, name: "Collaborators Online", value: "8,500+" },
  { id: 3, name: "Projects Created", value: "25,000+" },
  { id: 4, name: "Supported File Formats", value: "15+" },
  { id: 5, name: "GitHub Integrations", value: "10,000+" },
  { id: 6, name: "Real-Time Edits Per Day", value: "2.5 million+" },
];

export default function Stats() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
          CodeCollab by the Numbers
        </h2>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
            >
              <dt className="text-sm font-medium text-gray-600">
                {stat.name}
              </dt>
              <dd className="order-first text-xs font-bold tracking-tight text-indigo-600 sm:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
