import hennaPattern from "@/assets/henna-pattern.png";

const HennaDivider = () => (
  <div className="flex items-center justify-center py-6">
    <div className="gold-line flex-1" />
    <img src={hennaPattern} alt="" className="w-10 h-10 opacity-10 mx-6" />
    <div className="gold-line flex-1" />
  </div>
);

export default HennaDivider;
