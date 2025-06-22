import {
  ShoppingCart,
  Car,
  Gamepad2,
  Home,
  Heart,
  ShoppingBag,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Coffee,
  Plane,
  Calendar,
  Film,
  Music,
  BookOpen,
  Dumbbell,
  BriefcaseMedical,
  LucideIcon,
} from "lucide-react";

export interface CategoryConfig {
  name: string;
  icon: LucideIcon;
  color: string;
}

export const defaultExpenseCategories: CategoryConfig[] = [
  { name: "Alimentari", icon: ShoppingCart, color: "bg-orange-500" },
  { name: "Trasporti", icon: Car, color: "bg-blue-500" },
  { name: "Svago", icon: Gamepad2, color: "bg-purple-500" },
  { name: "Casa", icon: Home, color: "bg-green-500" },
  { name: "Salute", icon: Heart, color: "bg-red-500" },
  { name: "Shopping", icon: ShoppingBag, color: "bg-pink-500" },
  { name: "Altro", icon: MoreHorizontal, color: "bg-gray-500" },
];

export const defaultIncomeCategories: CategoryConfig[] = [
  { name: "Stipendio", icon: Briefcase, color: "bg-green-600" },
  { name: "Freelance", icon: Laptop, color: "bg-blue-600" },
  { name: "Investimenti", icon: TrendingUp, color: "bg-emerald-600" },
  { name: "Bonus", icon: Gift, color: "bg-yellow-600" },
  { name: "Altro", icon: MoreHorizontal, color: "bg-gray-600" },
];

export const availableIcons: { name: string; icon: LucideIcon }[] = [
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Car", icon: Car },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "Home", icon: Home },
  { name: "Heart", icon: Heart },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Briefcase", icon: Briefcase },
  { name: "Laptop", icon: Laptop },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Gift", icon: Gift },
  { name: "Coffee", icon: Coffee },
  { name: "Plane", icon: Plane },
  { name: "Calendar", icon: Calendar },
  { name: "Film", icon: Film },
  { name: "Music", icon: Music },
  { name: "BookOpen", icon: BookOpen },
  { name: "Dumbbell", icon: Dumbbell },
  { name: "BriefcaseMedical", icon: BriefcaseMedical },
  { name: "MoreHorizontal", icon: MoreHorizontal },
];
