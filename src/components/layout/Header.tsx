interface HeaderProps {
  title: string;
  description: string;
  actionButtons?: React.ReactNode; // ← rinominato e supporta più pulsanti
}

const Header = ({ title, description, actionButtons }: HeaderProps) => (
  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
    <div className="flex gap-2 flex-wrap">{actionButtons}</div>
  </div>
);

export default Header;
