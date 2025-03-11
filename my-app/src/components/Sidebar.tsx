type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNext: () => void; // Function to move to next tab
  onPrevious: () => void; // Function to move to previous tab
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onNext, onPrevious }) => {
  const tabs = [
    "Personal Details",
    "Skills",
    "Education",
    "Projects",
    "Work Experience",
    "References/Contact",
  ];

  return (
    <nav className="w-80 h-full bg-gray-900 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`p-3 rounded-lg transition duration-300 cursor-pointer ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            <p className="text-sm font-medium">{tab}</p>
          </div>
        ))}
      </div>

    </nav>
  );
};

export default Sidebar;
