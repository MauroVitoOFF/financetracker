interface HeaderProps {
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  description,
  actionButton,
}) => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
    {actionButton}
  </div>
);

export default Header;
