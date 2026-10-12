const FeatureCard = ({ icon: Icon, title, subtitle }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-3 flex-1">
    <div className="p-2 rounded-lg bg-[#f0fdf4]">
      <Icon size={20} color="#10AD69" />
    </div>
    <div>
      <p className="text-sm font-bold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
    </div>
  </div>
)

export default FeatureCard
