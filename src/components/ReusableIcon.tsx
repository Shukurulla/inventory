type IconLabelProps = {
    icon: React.ComponentType<{ color: string; className?: string }>;
    color: string;
    label: string;
  className?: string;
  classIcon?: string;
  };
  
  const IconLabel = ({ icon: Icon, color, label, className, classIcon }: IconLabelProps) => (
    <div className={`flex items-center space-x-5 ${className}`}>
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${classIcon ? classIcon : 'bg-[#FFF5E6] dark:bg-amber-300/10'}`}>
        <Icon color={color} className="w-7 h-7" />
      </div>
      <p className="text-xl text-accent-foreground">{label}</p>
    </div>
  );

  export default IconLabel;